# Icon

Tek renkle çizilen, kare bir ikon. Rengini çoğunlukla kendisi bulur: durduğu yerin içerik rengini alır, bir düğmenin içinde düğmenin etiketiyle aynı renkte çizilir.

İkon bir resim değildir: kaynağının kendi renkleri kullanılmaz, hepsi tek renge boyanır. Kendi renkleriyle çizilecek bir fotoğraf, bir çizim ya da bir logo `PantrixImage`'dır.

- `PantrixIcon` (`com.pantrixui.components.elements.icon`, `com.pantrixui:components`): Tek renkli bir ikon: boyanmadıkça durduğu yerin içerik rengindedir ve ekran okuyucunun ne duyacağı açıkça seçilir. Anahtar sözcükler: ikon, simge, sembol, vektör, piktogram.

## Özellikler

- **Üç kaynak.** Bir vektör (`imageVector`), bir bitmap (`bitmap`) ya da herhangi bir `painter`: üçü de aynı boyutta ve tek renkle çizilir.
- **Boyut.** `size` ikonun genişliği ve yüksekliğidir; verilmezse temanın `IconStyle`'ındaki boyut, her platformda 24dp. Kaynağın kendi boyutu ne olursa olsun ikon bu boyutta çizilir.
- **Renk.** `tint` verilmeyen ikon durduğu yerin içerik rengini alır: bir düğmenin etiketinin rengini, devre dışı bir kontrolün soluk rengini. Hiçbir şeyin renk vermediği yerde temanın `onSurface` rengiyle çizilir.
- **Ekran okuyucu.** `contentDescription` her ikonda verilen bir karardır: bir söz verilirse okuyucu onu okur; yanındaki etiket ne olduğunu zaten söylüyorsa null verilir ve ikon okuyucudan gizlenir.
- **Kütüphanenin ikonları.** `PantrixIcons` bileşenlerin kendi ikonlarını ve bir uygulamanın ekranları için birkaçını taşır: 24 birimlik ızgarada, 2 birim kalınlığında, uçları ve köşeleri yuvarlak çizgiler.
- **Sağdan sola.** Geriyi ve ileriyi gösteren altı ikon sağdan sola düzende aynalanır: `ChevronBack`, `ChevronForward`, `FirstPage`, `LastPage`, `ArrowBack` ve `ArrowForward`. Ötekiler her dilde aynı çizilir.
- **Otomasyon.** `tagKey` verilen ikon `Icon_<tagKey>` etiketini taşır. Anahtar verilmeyen ikon etiketlenmez.

## Kullanım

### Decorative, beside a label that already says it

```kotlin
PantrixIcon(imageVector = PantrixIcons.Check, contentDescription = null)
```

### Meaningful on its own

```kotlin
PantrixIcon(
    imageVector = PantrixIcons.Close,
    contentDescription = PantrixTheme.strings.close,
    tint = PantrixTheme.colors.danger.color
)
```

## Örnekler

### Süs olan ve adı olan ikon

En az yazılan hâli: bir vektör ve `contentDescription`. Açıklamanın varsayılanı yoktur, her ikonda yazılır.

İlk satırda ikonun yanında ne olduğunu söyleyen bir etiket var. İkon süstür: `contentDescription = null` verildi ve ekran okuyucudan gizlendi, okuyucu yalnızca "Kaydedildi" der. İkinci satırdaki ikon tek başına durur ve anlamı kendisi taşır: açıklaması "Uyarı"dır, okuyucu onu okur. Açıklama ikonun neye benzediğini değil, ne dediğini söyler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIcon(imageVector = PantrixIcons.Check, contentDescription = null)
    PantrixText(text = "Kaydedildi")
}
PantrixIcon(imageVector = PantrixIcons.Warning, contentDescription = "Uyarı", tagKey = "alert")
```

### Boyutlar

`size` ikonun genişliği ve yüksekliğidir: 16, 20, 24, 32 ve 48 dp. Ortadaki ikona boyut verilmedi: temanın ikon stilindeki boyuttadır, her platformda 24dp.

İkon, kaynağının kendi boyutu ne olursa olsun bu boyutta çizilir. Çizgisi ızgarasına göredir, 24 birimde 2 birim: ikonla birlikte kalınlaşır ve incelir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 16.dp, tagKey = "size_16")
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 20.dp, tagKey = "size_20")
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, tagKey = "size_default")
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 32.dp, tagKey = "size_32")
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 48.dp, tagKey = "size_48")
}
```

### Renk ve durduğu yerin rengi

İlk satır: renk verilmeyen ikon sayfada temanın `onSurface` rengiyle çizilir; `tint` ona bir rolün rengini verir.

İkinci satırdaki ikonların hiçbirine `tint` verilmedi. Her biri durduğu yerin içerik rengini aldı: `primary` ile doldurulmuş bir yüzeyde o dolgunun üstünde okunan rengi, bir düğmenin içinde etiketin rengini, devre dışı bir düğmede onun soluk rengini.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
val spacing = PantrixTheme.spacing
Row(horizontalArrangement = Arrangement.spacedBy(spacing.lg)) {
    PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null)
    PantrixIcon(imageVector = PantrixIcons.Info, contentDescription = null, tint = colors.info.color)
    PantrixIcon(imageVector = PantrixIcons.Success, contentDescription = null, tint = colors.success.color)
    PantrixIcon(imageVector = PantrixIcons.Warning, contentDescription = null, tint = colors.warning.color)
    PantrixIcon(imageVector = PantrixIcons.Error, contentDescription = null, tint = colors.danger.color)
}
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(spacing.md),
    verticalArrangement = Arrangement.spacedBy(spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixSurface(color = colors.primary.color) {
        PantrixIcon(
            imageVector = PantrixIcons.Inbox,
            contentDescription = null,
            modifier = Modifier.padding(spacing.sm),
            tagKey = "on_a_fill"
        )
    }
    PantrixButton(
        text = "Yenile",
        onClick = {},
        leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Refresh, contentDescription = null) },
        tagKey = "refresh"
    )
    PantrixButton(
        text = "Yenile",
        onClick = {},
        enabled = false,
        leadingIcon = { PantrixIcon(imageVector = PantrixIcons.Refresh, contentDescription = null) },
        tagKey = "refresh_disabled"
    )
}
```

### Üç kaynak: vektör, bitmap, painter

Üç kaynak, aynı boyutta ve aynı renkte: bir vektör, bir bitmap ve bir `painter`. Bitmap burada kodla çizildi; bir uygulamada bir kaynaktan ya da bir görsel yükleyiciden gelir.

Üçüncü ikonun kaynağı Compose Multiplatform'un çok renkli logosudur. `PantrixIcon` onu tek renge boyar ve kendi boyutuna getirir. Yanındaki, aynı kaynağın `PantrixImage` ile çizilmiş hâlidir: resim kendi renklerini korur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.PaintingStyle
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

val bitmap = remember { targetBitmap() }
val logo = painterResource(Res.drawable.compose_multiplatform)
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 32.dp, tagKey = "vector")
    PantrixIcon(bitmap = bitmap, contentDescription = null, size = 32.dp, tagKey = "bitmap")
    PantrixIcon(painter = logo, contentDescription = null, size = 32.dp, tagKey = "painter")
    PantrixImage(painter = logo, modifier = Modifier.size(32.dp), contentDescription = null)
}

private fun targetBitmap(): ImageBitmap {
    val bitmap = ImageBitmap(width = 96, height = 96)
    val canvas = Canvas(bitmap)
    val ring = Paint().apply {
        style = PaintingStyle.Stroke
        strokeWidth = 8f
    }
    canvas.drawCircle(center = Offset(48f, 48f), radius = 36f, paint = ring)
    canvas.drawCircle(center = Offset(48f, 48f), radius = 12f, paint = Paint())
    return bitmap
}
```

### Sağdan sola aynalanan ikonlar

Geriyi ve ileriyi gösteren ikonlar okuma yönünü izler: sağdan sola bir düzende aynalanırlar. Arama merceği ve oynatma üçgeni aynalanmaz: her dilde aynı çizilirler.

İki satırda da aynı altı ikon aynı sırayla yazıldı. İkinci satır sağdan sola düzendedir: ikonlar sağdan sola dizilir ve oklar ters yöne bakar; arama ve oynatma ikonları ise olduğu gibi çizilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

DirectionalIcons()
CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
    DirectionalIcons()
}

@Composable
private fun DirectionalIcons() {
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)) {
        PantrixIcon(imageVector = PantrixIcons.ArrowBack, contentDescription = "Geri")
        PantrixIcon(imageVector = PantrixIcons.ChevronBack, contentDescription = "Önceki")
        PantrixIcon(imageVector = PantrixIcons.ChevronForward, contentDescription = "Sonraki")
        PantrixIcon(imageVector = PantrixIcons.ArrowForward, contentDescription = "İleri")
        PantrixIcon(imageVector = PantrixIcons.Search, contentDescription = "Ara")
        PantrixIcon(imageVector = PantrixIcons.Play, contentDescription = "Oynat")
    }
}
```

### Bütün ikonlar

`PantrixIcons`'taki bütün ikonlar, adlarıyla. Ad kodda yazıldığı gibidir: `PantrixIcons.Check`. Altında "aynalanır" yazanlar sağdan sola düzende ters çevrilir; bu bilgi ikonun kendisinden, `autoMirror` alanından okunur.

Adları altlarında yazdığı için ikonlar süstür ve ekran okuyucudan gizlidir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.width
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    ALL_ICONS.forEach { icon ->
        Column(
            modifier = Modifier.width(104.dp),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            PantrixIcon(imageVector = icon, contentDescription = null, tagKey = icon.name)
            PantrixText(
                text = icon.name,
                style = PantrixTheme.typography.caption,
                textAlign = TextAlign.Center,
                maxLines = 1
            )
            if (icon.autoMirror) {
                PantrixText(
                    text = "aynalanır",
                    style = PantrixTheme.typography.caption,
                    color = PantrixTheme.colors.textSecondary
                )
            }
        }
    }
}

private val ALL_ICONS = listOf(
    PantrixIcons.Check,
    PantrixIcons.Close,
    PantrixIcons.ChevronDown,
    PantrixIcons.ChevronForward,
    PantrixIcons.ChevronBack,
    PantrixIcons.FirstPage,
    PantrixIcons.LastPage,
    PantrixIcons.ArrowBack,
    PantrixIcons.ArrowForward,
    PantrixIcons.Calendar,
    PantrixIcons.Refresh,
    PantrixIcons.ZoomOut,
    PantrixIcons.ZoomIn,
    PantrixIcons.MoreHorizontal,
    PantrixIcons.Minus,
    PantrixIcons.Menu,
    PantrixIcons.Plus,
    PantrixIcons.Info,
    PantrixIcons.Success,
    PantrixIcons.Warning,
    PantrixIcons.Error,
    PantrixIcons.Inbox,
    PantrixIcons.Star,
    PantrixIcons.Folder,
    PantrixIcons.Person,
    PantrixIcons.Search,
    PantrixIcons.Download,
    PantrixIcons.Upload,
    PantrixIcons.File,
    PantrixIcons.Copy,
    PantrixIcons.Eye,
    PantrixIcons.EyeOff,
    PantrixIcons.Pause,
    PantrixIcons.Play
)
```

### Stille varsayılan boyut

İkonun boyutu bir parametre değil, stilidir: `IconStyle` boyut verilmeyen ikonun boyutunu taşır. `ProvidePantrixStyles` onu ağacın bir bölümü için değiştirir; `PantrixTheme`'in `styles` parametresi uygulamanın tamamı için. Burada ilk ikon boyutunu stilden alır, ikincisine `size` verildi: parametre stilin üstündedir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.icon.IconStyle
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.style.ProvidePantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles

val styles = remember { pantrixStyles(IconStyle.override(all = IconStyle(size = 32.dp))) }
ProvidePantrixStyles(styles = styles) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null)
        PantrixIcon(imageVector = PantrixIcons.Star, contentDescription = null, size = 16.dp)
    }
}
```

## API

### PantrixIcon

`import com.pantrixui.components.elements.icon.PantrixIcon`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixIcon(
    imageVector: ImageVector,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    size: Dp = PantrixTheme.style(key = IconStyle).size,
    tint: Color = Color.Unspecified,
    tagKey: String? = null
)
```

Bir ikon: kenarı `size` olan bir karedir ve tek renkle çizilir. Bu renk `tint`'tir, o verilmezse ikonun durduğu yerin içerik rengidir, örneğin bir düğmenin etiket rengi. `contentDescription` ekran okuyucu için ikonun adıdır. Yanındaki bir etiket ne anlama geldiğini zaten söylüyorsa null verilir ve ikon ekran okuyucudan gizlenir.

Parametreler:

- `imageVector: ImageVector`: ikonun resmi: `PantrixIcons`'tan biri ya da uygulamanın bir vektörü.
- `contentDescription: String?`
- `modifier: Modifier`: ikonun modifier'ı.
- `size: Dp`
- `tint: Color`
- `tagKey: String?`: ikonun otomasyon anahtarı: ikon `Icon_<tagKey>`'dır. Anahtar yoksa etiketi olmaz.

### PantrixIcon

`import com.pantrixui.components.elements.icon.PantrixIcon`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixIcon(
    bitmap: ImageBitmap,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    size: Dp = PantrixTheme.style(key = IconStyle).size,
    tint: Color = Color.Unspecified,
    tagKey: String? = null
)
```

Bir bitmap'ten `PantrixIcon`: vektör alan biçim gibi `size` boyutunda ve tek renkle çizilir.

Parametreler:

- `bitmap: ImageBitmap`: ikonun resmi, bir bitmap: bütünüyle boyandığı için saydam bir zemin üstünde tek renkli bir şekil olmalı.
- `contentDescription: String?`: ekran okuyucunun ikona verdiği ad, ya da yanındaki bir etiket ne anlama geldiğini zaten söylüyorsa null; o zaman ikon ekran okuyuculardan gizlenir.
- `modifier: Modifier`: ikonun modifier'ı.
- `size: Dp`
- `tint: Color`: ikonun rengi, yoksa durduğu yerin içerik rengi.
- `tagKey: String?`: ikonun otomasyon anahtarı: ikon `Icon_<tagKey>`'dır. Anahtar yoksa etiketi olmaz.

### PantrixIcon

`import com.pantrixui.components.elements.icon.PantrixIcon`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixIcon(
    painter: Painter,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    size: Dp = PantrixTheme.style(key = IconStyle).size,
    tint: Color = Color.Unspecified,
    tagKey: String? = null
)
```

Herhangi bir painter'dan `PantrixIcon`: painter'ın kendi boyutu ne olursa olsun `size` boyutunda ve tek renkle çizilir.

Parametreler:

- `painter: Painter`: ikonun resmi, herhangi bir painter'dan: bütünüyle boyanır.
- `contentDescription: String?`: ekran okuyucunun ikona verdiği ad, ya da yanındaki bir etiket ne anlama geldiğini zaten söylüyorsa null; o zaman ikon ekran okuyuculardan gizlenir.
- `modifier: Modifier`: ikonun modifier'ı.
- `size: Dp`
- `tint: Color`: ikonun rengi, yoksa durduğu yerin içerik rengi.
- `tagKey: String?`: ikonun otomasyon anahtarı: ikon `Icon_<tagKey>`'dır. Anahtar yoksa etiketi olmaz.

### PantrixIcons

`import com.pantrixui.foundation.icons.PantrixIcons`, `com.pantrixui:foundation` içinden

```kotlin
object PantrixIcons
```

Bir bileşen kütüphanesinin onlarsız yapamayacağı ikonlar, `ImageVector` olarak: bir select'in oku, bir dialog'un kapatma ikonu, bir alert'in durum işaretleri. Onlar olmadan bu bileşenler stilsiz değil bozuktur, tonunu yalnızca rengi söyleyen bir alert de rengi göremeyene hiçbir şey söylemez (WCAG 1.4.1). Birkaçı da bir uygulamanın kendi ekranları içindir: `Inbox`, `Star`, `Folder`, `Person`, `Search` ve `Copy`. `Eye` ve `EyeOff` güvenli metin alanınındır: yazılanı gösteren ve yeniden gizleyen düğme. `Pause` ve `Play` carousel'indir: kendiliğinden ilerleyeni durduran ve yeniden ilerleten düğme. `Download` grafiğindir: onu uygulamadan dosya olarak çıkaran düğme. `Upload` ve `File` bırakma bölgesinindir: uygulamaya dosya alan bölge ve aldığı bir dosya. `Calendar` ve `Clock` bir tarihin ve bir saatindir: bir takvimi ve bir saat seçiciyi açan alanlar ve düğmeler.

24 birimlik ızgarada, 2 birimlik, uçları ve köşeleri yuvarlak bir çizgiyle çizilir. Çoğu ikon setinin kullandığı geometri budur: bir uygulamanın kendi ikonları bunların yanında farklı bir ağırlıkta görünmeden durur. Her yol siyahtır: `PantrixIcon` ikonun tamamını bulduğu renge boyar. Bu renk, ikona renk verilmedikçe durduğu yerin içerik rengidir.

Geriyi ya da ileriyi gösteren altı ikon `ImageVector.autoMirror`'ı açar ve sağdan sola düzende aynalanır: `ChevronForward`, `ChevronBack`, `FirstPage`, `LastPage`, `ArrowBack` ve `ArrowForward`. Ötekiler hiç aynalanmaz: bir onay işareti, bir mercek ya da sağa doğru bir dönüş her dilde aynı okunur. `Play` de öyledir: bir oynatıcının düğmesi her yerde nasıl çiziliyorsa öyle çizilir.

Üyeleri:

- `Check: ImageVector`: Onay. Anlamı simetriktir, bu yüzden hiç aynalanmaz.
- `Close: ImageVector`: Kapatmak ya da kaldırmak: bir dialog'u, bir sheet'i, bir chip'i.
- `ChevronDown: ImageVector`: Aşağıya açılan: bir select'in ya da bir accordion'ın oku. Hiç aynalanmaz.
- `ChevronForward: ImageVector`: Okuma yönüne bakar, bu yüzden sağdan sola düzende aynalanır.
- `ChevronBack: ImageVector`: Okuma yönünün tersine bakar, bu yüzden sağdan sola düzende aynalanır: bir sayfalamanın önceki sayfası.
- `FirstPage: ImageVector`: Bir sayfa satırının başladığı yere geri: bir çizgiye dayanmış `ChevronBack`, bir sayfalamanın ilk sayfası. Sağdan sola düzende aynalanır.
- `LastPage: ImageVector`: Bir sayfa satırının bittiği yere ileri: bir çizgiye dayanmış `ChevronForward`, bir sayfalamanın son sayfası. Sağdan sola düzende aynalanır.
- `ArrowBack: ImageVector`: Önceki ekrana dönüş, Android'in ve web'in çizdiği gibi. Sağdan sola düzende aynalanır.
- `ArrowForward: ImageVector`: `ArrowBack` nasıl geri dönüyorsa bu da sıradakine ilerler: bir aralığın iki ucu arasındaki ok. Sağdan sola düzende aynalanır.
- `Calendar: ImageVector`: Bir takvim yaprağı: bir tarih seçicinin alanı. Hiç aynalanmaz.
- `Clock: ImageVector`: Bir saatin kadranı, akrebi saatte, yelkovanı biraz ötesinde: bir saat seçicinin alanı. Saat her dilde aynı yöne döner, bu yüzden hiç aynalanmaz.
- `Refresh: ImageVector`: Yeniden yapmak: dörtte üçlük bir dönüş, sağdan başlayıp saat yönünde döner ve sağ üstteki ok ucuna varır. Sağa doğru bir dönüş her dilde aynı okunur, bu yüzden hiç aynalanmaz.
- `ZoomOut: ImageVector`: Daha fazlasını göstermek: içinde eksi olan bir mercek, bir aralığı genişletir. Mercek her dilde aynı şekilde tutulur, bu yüzden hiç aynalanmaz.
- `ZoomIn: ImageVector`: Daha azını göstermek: `ZoomOut`'un merceği, içinde artıyla. Aralığı daraltır. Hiç aynalanmaz.
- `MoreHorizontal: ImageVector`: Katlanıp gizlenen bir şey: bir breadcrumb izinin ya da bir sayfalamanın göstermediği sayfalar. Hiç aynalanmaz.
- `Minus: ImageVector`: Belirsiz ya da kısmen seçili.
- `Menu: ImageVector`: Bir çekmecenin açtığı menü: üç çizgi, her platformun bunun için kullandığı işaret.
- `Plus: ImageVector`: Ekle. `Minus` çizgisi ve onda eksik olan dikey çizgi.
- `Info: ImageVector`: Bilgi: daire içinde bir "i", noktası üstte. `Error` bu işareti baş aşağı çevirir.
- `Success: ImageVector`: Başarı: daire içinde bir onay işareti.
- `Warning: ImageVector`: Uyarı: üçgen içinde bir ünlem işareti. Dış çizgisi farklı olan tek durum ikonudur.
- `Error: ImageVector`: Hata: daire içinde bir ünlem işareti, noktası altta.
- `Inbox: ImageVector`: Kenarında çentik olan bir tepsi: gelen kutusu.
- `Star: ImageVector`: Beş köşeli bir yıldız: favori olarak işaretlenmiş bir şey.
- `Folder: ImageVector`: Bir klasör.
- `Person: ImageVector`: Bir baş ve omuzlar: bir kişi, bir hesap.
- `Search: ImageVector`: Bir mercek ve sapı: arama. Mercek her dilde aynı şekilde tutulur, bu yüzden hiç aynalanmaz.
- `Download: ImageVector`: Bir çizginin üstüne inen bir ok: bir şeyi uygulamadan dosya olarak çıkarmak. Hiç aynalanmaz.
- `Upload: ImageVector`: Bir çizgiden yukarı çıkan bir ok: uygulamaya bir dosya almak. Hiç aynalanmaz.
- `File: ImageVector`: Üst köşesi kıvrık bir sayfa: bir dosya. Kıvrım, bir dosya yöneticisindeki sayfanınki gibi her dilde sağ üsttedir, bu yüzden hiç aynalanmaz.
- `Copy: ImageVector`: Arka arkaya iki sayfa: kopyalama, bir kod bloğunun ya da bir bağlantının. Arkadaki sayfa her dilde sol üstte görünür, bu yüzden hiç aynalanmaz.
- `Eye: ImageVector`: Bir göz: gizli olanı, bir güvenli metin alanının metnini göstermek. Her dilde aynı gözdür.
- `EyeOff: ImageVector`: Üstünden bir çizgi geçen `Eye`: metni yeniden gizlemek. Göz, çizginin iki yanında çizgiye varmadan biter. Böylece çizgi gözün bir parçası gibi değil, gözün üstüne çekilmiş bir çizgi gibi okunur.
- `Pause: ImageVector`: İki dikey çubuk: kendiliğinden hareket edeni bir süreliğine durdurmak.
- `Play: ImageVector`: Sağı gösteren bir üçgen: durdurulanı yeniden hareket ettirmek. Bir oynatıcının düğmesi her dilde aynı yönü gösterir, bu yüzden hiç aynalanmaz.

### IconStyle

`import com.pantrixui.components.elements.icon.IconStyle`, `com.pantrixui:components` içinden

```kotlin
class IconStyle(
    public val size: Dp = Dp.Unspecified
) : PantrixStyle<IconStyle>
```

`PantrixIcon`'ın geometrisi.

Parametreler:

- `size: Dp`: İkonun genişliği ve yüksekliği: bir marka ya da bir tema başka bir değer vermedikçe her platformda 24dp.
