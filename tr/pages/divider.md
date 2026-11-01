# Divider

İçeriği ayıran ince bir çizgi: bir listenin satırları arasında, bir kartın bölümleri arasında, bir araç çubuğunun grupları arasında. Yatay ya da dikey çizilir; yatay olanı üstünde bir etiket taşıyabilir, bir giriş ekranında iki yolun arasındaki "ya da" gibi.

Üç composable'dır: `PantrixHorizontalDivider`, `PantrixVerticalDivider` ve yönünü `orientation` ile alan `PantrixDivider`.

- `PantrixDivider` (`com.pantrixui.components.elements.divider`, `com.pantrixui:components`): İçeriği ayıran bir çizgi, kabının boyunca yatay ya da dikey; süstür, yalnızca yatay olanı ekran okuyucunun okuyacağı bir etiket taşıyabilir. Anahtar sözcükler: ayırıcı, çizgi, yatay çizgi, dikey ayırıcı, bölücü.

## Özellikler

- **Yatay ve dikey.** Yatay çizgi bulunduğu yerin genişliğini, dikey çizgi yüksekliğini kaplar.
- **Etiket.** `label` yatay çizginin üstüne bir yazı koyar. `align` yazının yerini söyler: başta, ortada ya da sonda. Başa ya da sona yaslanan etiketin o yanında kısa bir çizgi kalır.
- **Kalınlık.** `thickness` çizginin kalınlığıdır; varsayılanı 1dp.
- **Girinti.** `startIndent` yatay çizginin başında, dikey çizginin üstünde boşluk bırakır. Etiketli bir çizgide kullanılmaz.
- **Bulunduğu yerin rengi.** Renk verilmeyen çizgi temanın kendi zeminlerinde temanın `divider` rengindedir. Bir dolgunun üstünde, o rengin okunmayacağı yerde, orada yazılan rengin bir payıdır: bir rolün yüzeyinde, dolu bir kartta, kendi rengi olan bir menünün satırları arasında.
- **Kendi rengi.** `color` çizgiyi verilen renkte çizer. Etiketin rengini değiştirmez: etiket temanın zeminlerinde `textSecondary`, bir dolguda orada yazılan renktedir.
- **Ekran okuyucu.** Etiketsiz çizgi süstür ve ekran okuyucudan gizlenir. Etiketli çizginin etiketi okunur.
- **Sağdan sola.** `DividerAlign.Start` ve yatay çizginin `startIndent`'i satırın başladığı yana göredir: sağdan sola bir arayüzde sağdadır.

## Kullanım

### Between rows

```kotlin
Column {
    PantrixText(stringResource(Res.string.profile))
    PantrixDivider()
    PantrixText(stringResource(Res.string.security))
}
```

### A label between two ways in

```kotlin
PantrixDivider(label = stringResource(Res.string.or))
```

### Vertical, between toolbar groups

```kotlin
PantrixVerticalDivider(modifier = Modifier.height(PantrixTheme.spacing.xl))
```

## Örnekler

### Satırların arasında

En yalın hâli: parametresiz bir `PantrixDivider`. Yataydır, bulunduğu yerin genişliğini kaplar, 1dp kalınlığındadır ve temanın `divider` rengindedir. Süstür: ekran okuyucu yalnızca satırları okur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    PantrixText(text = "Profil")
    PantrixDivider()
    PantrixText(text = "Güvenlik")
    PantrixDivider()
    PantrixText(text = "Bildirimler")
}
```

### Etiketli

`label` çizginin üstüne bir yazı koyar: çizgi yazının iki yanında sürer. Bir giriş ekranında iki yolun arasındaki "ya da" böyle yazılır.

Etiket temanın `label` stilinde ve ikincil yazı rengindedir. Etiketli çizgi süs değildir: ekran okuyucu etiketi okur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.widthIn
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.foundation.theme.PantrixTheme

Column(
    modifier = Modifier.widthIn(max = 360.dp),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PantrixButton(text = "E-postayla giriş yap", onClick = {}, fullWidth = true, tagKey = "email")
    PantrixHorizontalDivider(label = "ya da")
    PantrixButton(text = "Telefonla giriş yap", onClick = {}, variant = ButtonVariant.Outline, fullWidth = true, tagKey = "phone")
}
```

### Etiketin yeri

`align` etiketin çizginin neresinde duracağını söyler; varsayılanı `Center`'dır. `Start` ve `End` etiketi bir yana yaslar ama kenara yapıştırmaz: o yanda kısa bir çizgi kalır.

```kotlin
import com.pantrixui.components.elements.divider.DividerAlign
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider

PantrixHorizontalDivider(label = "Başta", align = DividerAlign.Start)
PantrixHorizontalDivider(label = "Ortada", align = DividerAlign.Center)
PantrixHorizontalDivider(label = "Sonda", align = DividerAlign.End)
```

### Kalınlık

`thickness` çizginin kalınlığıdır: sırayla 1dp (varsayılan, `DefaultThickness`), iki katı ve dört katı. Etiketli çizgide yazının iki yanındaki çizgiler de o kalınlıktadır.

```kotlin
import com.pantrixui.components.elements.divider.DefaultThickness
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider

PantrixHorizontalDivider(thickness = DefaultThickness)
PantrixHorizontalDivider(thickness = DefaultThickness * 2)
PantrixHorizontalDivider(thickness = DefaultThickness * 4)
PantrixHorizontalDivider(label = "Etiketli", thickness = DefaultThickness * 2)
```

### Girinti

`startIndent` çizginin başında boşluk bırakır: çizgi ikonun altından değil, yazının hizasından başlar. Burada ikon 24dp, yazıyla arası 16dp; girinti ikisinin toplamıdır, 40dp.

Listenin sonundaki çizgi girintisizdir (`DefaultStartIndent`, 0dp): liste orada biter.

Etiketli bir çizgide `startIndent` kullanılmaz. Dikey çizgide boşluk çizginin üstünde kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.divider.DefaultStartIndent
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    DividerListRow(icon = PantrixIcons.Inbox, text = "Gelen kutusu")
    PantrixHorizontalDivider(startIndent = 40.dp)
    DividerListRow(icon = PantrixIcons.Star, text = "Yıldızlılar")
    PantrixHorizontalDivider(startIndent = 40.dp)
    DividerListRow(icon = PantrixIcons.Folder, text = "Arşiv")
    PantrixHorizontalDivider(startIndent = DefaultStartIndent)
}

@Composable
private fun DividerListRow(
    icon: ImageVector,
    text: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixIcon(imageVector = icon, contentDescription = null, size = 24.dp)
        PantrixText(text = text)
    }
}
```

### Dikey

`PantrixVerticalDivider` bulunduğu yerin yüksekliğini kaplar; bu yüzden yüksekliği belli bir yere konur. Üst satırda yüksekliği satır verir: `Modifier.height(IntrinsicSize.Min)` satırı içindeki yazının boyuna indirir, çizgi de o kadar olur. Alt satırda yükseklik çizginin kendisine verildi: `PantrixTheme.spacing.xl`, varsayılan yoğunlukta 24dp.

Dikey çizgi etiket taşımaz ve ekran okuyucudan gizlidir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.divider.PantrixVerticalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    modifier = Modifier.height(IntrinsicSize.Min),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    PantrixText(text = "12 gönderi")
    PantrixVerticalDivider()
    PantrixText(text = "340 takipçi")
    PantrixVerticalDivider()
    PantrixText(text = "28 takip")
}
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixButton(text = "Kalın", onClick = {}, variant = ButtonVariant.Text, size = ButtonSize.Small, tagKey = "bold")
    PantrixButton(text = "Eğik", onClick = {}, variant = ButtonVariant.Text, size = ButtonSize.Small, tagKey = "italic")
    PantrixVerticalDivider(modifier = Modifier.height(PantrixTheme.spacing.xl))
    PantrixButton(text = "Bağlantı", onClick = {}, variant = ButtonVariant.Text, size = ButtonSize.Small, tagKey = "link")
}
```

### Yönü parametreyle

`PantrixDivider` yönünü bir değer olarak alır: `DividerOrientation.Horizontal` bir `PantrixHorizontalDivider`, `DividerOrientation.Vertical` bir `PantrixVerticalDivider` çizer. Yön bir koşula bağlı olduğunda tek bir çağrı ikisini de karşılar.

Burada iki sütunun içindeki çizgiler yatay, sütunların arasındaki dikey. `label` ve `align` yalnızca yatay çizgide geçerlidir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.divider.DividerOrientation
import com.pantrixui.components.elements.divider.PantrixDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    modifier = Modifier.height(IntrinsicSize.Min),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg)
) {
    Column(
        modifier = Modifier.weight(1f),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixText(text = "Teslimat adresi")
        PantrixDivider(orientation = DividerOrientation.Horizontal)
        PantrixText(text = "Atatürk Cad. No: 12, İzmir", color = PantrixTheme.colors.textSecondary)
    }
    PantrixDivider(orientation = DividerOrientation.Vertical)
    Column(
        modifier = Modifier.weight(1f),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
    ) {
        PantrixText(text = "Fatura adresi")
        PantrixDivider(orientation = DividerOrientation.Horizontal)
        PantrixText(text = "Teslimat adresiyle aynı", color = PantrixTheme.colors.textSecondary)
    }
}
```

### Kendi renginde

`color` çizgiyi verilen renkte çizer: üstteki temanın hiçbir rolünde olmayan, uygulamanın kendi morunda; alttaki temanın `danger` rolünde.

`color` yalnızca çizgiyi boyar. Alttaki çizginin etiketi yine temanın ikincil yazı rengindedir.

```kotlin
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.foundation.theme.PantrixTheme

PantrixHorizontalDivider(color = ownColors().color, thickness = 2.dp)
PantrixHorizontalDivider(color = PantrixTheme.colors.danger.color, label = "Geri alınamayan işler")
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Bir dolgunun üstünde

Hiçbir çizgiye renk verilmedi. Temanın `divider` rengi temanın kendi zeminleri içindir; bir dolgunun üstünde çizgi, orada yazılan rengin bir payıdır (yüzde otuzu), etiket de o rengin kendisi.

Üstteki yüzey temanın `primary` renginde: çizgi rolün `onColor`'ından türer. Alttaki dolu bir kart (`CardVariant.Filled`): çizgi kartın içerik renginden türer.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSurface(modifier = Modifier.fillMaxWidth(), color = PantrixTheme.colors.primary.color) {
    Column(
        modifier = Modifier.padding(PantrixTheme.spacing.lg),
        verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
    ) {
        PantrixText(text = "Aylık plan")
        PantrixHorizontalDivider()
        PantrixText(text = "Yıllık plan")
        PantrixHorizontalDivider(label = "ya da")
        PantrixText(text = "Ömür boyu")
    }
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixText(text = "Sipariş özeti")
    PantrixHorizontalDivider()
    PantrixText(text = "Toplam: 240 TL")
}
```

### Sağdan sola

`DividerAlign.Start` ve `startIndent` satırın başladığı yana göredir, sola göre değil. Bu örnek yazı yönünü kendi içinde sağdan sola çevirir: etiket sağda durur, ikinci çizginin girintisi sağdan bırakılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.divider.DividerAlign
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.foundation.theme.PantrixTheme

CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
        PantrixHorizontalDivider(label = "Başta", align = DividerAlign.Start)
        PantrixHorizontalDivider(startIndent = 56.dp)
    }
}
```

## API

### PantrixDivider

`import com.pantrixui.components.elements.divider.PantrixDivider`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixDivider(
    modifier: Modifier = Modifier,
    orientation: DividerOrientation = DividerOrientation.Horizontal,
    color: Color = Color.Unspecified,
    label: String? = null,
    align: DividerAlign = DividerAlign.Center,
    thickness: Dp = DefaultThickness,
    startIndent: Dp = DefaultStartIndent
)
```

İçeriği ayıran bir çizgi: `orientation`'a göre bir `PantrixHorizontalDivider` ya da bir `PantrixVerticalDivider`.

`label` ve `align` yalnızca yatay çizgide geçerlidir.

`color` verilmeyen çizgi, temanın kendi zeminlerinde temanın `divider` rengindedir. Bir dolgunun üstünde, o çizginin okunmayacağı yerde, orada yazılan rengin bir payıdır: bir rolün yüzeyinde, dolu bir kartta ya da çağıranın kendi rengindeki bir menünün satırları arasında duran çizgiye rengini çevresi söyler, bir metne olduğu gibi. Etiket temanın zeminlerinde temanın `textSecondary` rengindedir, bir dolgunun üstünde ise orada yazılan renktedir.

Parametreler:

- `modifier: Modifier`: ayırıcının modifier'ı: yatay bir ayırıcı onun izin verdiği kadar geniş, dikey bir ayırıcı o kadar uzun olur.
- `orientation: DividerOrientation`
- `color: Color`
- `label: String?`
- `align: DividerAlign`
- `thickness: Dp`: çizginin ne kadar kalın olduğu: başka bir şey söylenmedikçe 1dp.
- `startIndent: Dp`: etiketsiz yatay bir çizginin önündeki ya da dikey bir çizginin üstündeki boşluk: başka bir şey söylenmedikçe yok.

### PantrixHorizontalDivider

`import com.pantrixui.components.elements.divider.PantrixHorizontalDivider`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixHorizontalDivider(
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    label: String? = null,
    align: DividerAlign = DividerAlign.Center,
    thickness: Dp = DefaultThickness,
    startIndent: Dp = DefaultStartIndent
)
```

Bulunduğu yer kadar geniş, `thickness` kadar yüksek yatay bir çizgi.

`label` verilmeyen çizgi süstür, ekran okuyucudan gizlenir ve `startIndent` başında bir boşluk bırakır. `label` verilince etiket çizginin üstünde, `align`'ın koyduğu yerde durur ve ekran okuyucu onu okur. O zaman `startIndent` kullanılmaz.

`color` verilmezse bir `PantrixDivider` gibi çizilir: temanın `divider` renginde, bir dolgunun üstünde ise orada yazılan rengin bir payıyla.

Parametreler:

- `modifier: Modifier`: çizginin modifier'ı.
- `color: Color`
- `label: String?`
- `align: DividerAlign`
- `thickness: Dp`
- `startIndent: Dp`

### PantrixVerticalDivider

`import com.pantrixui.components.elements.divider.PantrixVerticalDivider`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixVerticalDivider(
    modifier: Modifier = Modifier,
    color: Color = Color.Unspecified,
    thickness: Dp = DefaultThickness,
    startIndent: Dp = DefaultStartIndent
)
```

Bulunduğu yer kadar yüksek, `thickness` kadar geniş dikey bir çizgi. Ekran okuyucudan gizlenir. `startIndent` üstünde bir boşluk bırakır.

`color` verilmezse bir `PantrixDivider` gibi çizilir: temanın `divider` renginde, bir dolgunun üstünde ise orada yazılan rengin bir payıyla.

Parametreler:

- `modifier: Modifier`: çizginin modifier'ı.
- `color: Color`
- `thickness: Dp`
- `startIndent: Dp`

### DividerOrientation

`import com.pantrixui.components.elements.divider.DividerOrientation`, `com.pantrixui:components` içinden

```kotlin
enum class DividerOrientation
```

Bir `PantrixDivider`'ın hangi yönde uzandığı: bulunduğu yerde enine ya da boyuna.

Değerleri:

- `Horizontal`: Kapsayıcısı boyunca yatay: bir `PantrixHorizontalDivider`.
- `Vertical`: Kapsayıcısı boyunca dikey: bir `PantrixVerticalDivider`.

### DividerAlign

`import com.pantrixui.components.elements.divider.DividerAlign`, `com.pantrixui:components` içinden

```kotlin
enum class DividerAlign
```

Yatay bir çizginin etiketinin çizgi boyunca nerede durduğu. Başta ya da sonda duran etiketin o yanında kısa bir çizgi parçası kalır.

Değerleri:

- `Start`: Çizginin başına yakın: solda, sağdan okunan bir dilde sağda.
- `Center`: Çizginin ortasında: başka bir şey söylenmedikçe bir etiketin durduğu yer.
- `End`: Çizginin sonuna yakın.
