# Skeleton

Henüz gelmemiş içeriğin yerini tutan soluk bir blok: yüklenen bir paragrafın satırları, bir avatarın dairesi, bir resmin dikdörtgeni. Gelecek içeriğin şeklini ve yerini önceden gösterir; üstünden geçen açık bir bant, bir şeyin yüklendiğini söyler.

İki bileşendir: `PantrixSkeleton` tek bir blok, `PantrixSkeletonText` bir paragrafın satırları. Bir kartın tamamının yer tutucusu ayrı bir bileşendir: `PantrixCardSkeleton`.

- `PantrixSkeleton` (`com.pantrixui.components.elements.skeleton`, `com.pantrixui:components`): Yüklenen içeriğin biçiminde bir yer tutucu; parıltısı azaltılmış hareket ayarında durur. Anahtar sözcükler: iskelet, yer tutucu, parıltı, yükleme yer tutucusu, içerik yükleniyor.
- `PantrixSkeletonText` (`com.pantrixui.components.elements.skeleton`, `com.pantrixui:components`): Yüklenen bir yazı için yer tutucu satırlar; sonuncusu daha kısadır, böylece yazı gibi okunur. Anahtar sözcükler: yazı yer tutucusu, yükleniyor satırları, iskelet yazı, parıltılı yazı.

## Özellikler

- **Boyutu çağıran verir.** `PantrixSkeleton`'ın kendi boyutu yoktur: `modifier` ile, yerini tuttuğu içeriğin boyutunda verilir.
- **Şekil.** `shape` bloğun köşeleridir. Varsayılanı temanın en küçük yuvarlağıdır (`shapes.xs`); bir avatarın yerinde `shapes.full` bir daire çizer.
- **Satırlar.** `PantrixSkeletonText` `lines` kadar satır çizer. Son satır ötekilerden kısadır: blok bir paragraf gibi okunur. `lineHeight` satırların yüksekliğidir.
- **Bant.** Bloğun üstünden daha açık bir bant geçer, bir uçtan ötekine gidip gelir. Sistem hareketin azaltılmasını istediğinde bant durur ve blok yalnızca kendi rengindedir.
- **Renkler.** `SkeletonColors` iki renktir: bloğun kendi rengi (`base`) ve üstünden geçen bant (`highlight`). Verilmeyen renk temanın rolünde kalır: `disabledContent` ve `divider`.
- **Dolgunun üstünde.** İskelet çevresindeki içerik rengine bakmaz: temanın zemini olmayan bir dolguda renklerini çağıran verir.
- **Ekran okuyucu.** Her iskelet `contentDescription`'ını söyler; varsayılanı temanın dilindeki "Yükleniyor"dur. `PantrixSkeletonText` bütün satırları için bir kez söyler.
- **Bir kez duyurmak.** Birkaç iskeletten oluşan bir yer tutucuda parçalara `contentDescription = null` verilir ve yüklendiğini onları saran öğe bir kez söyler.

## Kullanım

### Avatar placeholder

```kotlin
PantrixSkeleton(modifier = Modifier.size(PantrixTheme.spacing.xxl), shape = PantrixTheme.shapes.full)
```

### A loading row, announced once

```kotlin
val loading = PantrixTheme.strings.loading
Row(Modifier.semantics(mergeDescendants = true) { contentDescription = loading }) {
    PantrixSkeleton(
        modifier = Modifier.size(PantrixTheme.spacing.xxl),
        shape = PantrixTheme.shapes.full,
        contentDescription = null
    )
    PantrixSkeletonText(lines = 2, modifier = Modifier.weight(1f), contentDescription = null)
}
```

### On a surface in a colour of its own

```kotlin
val info = PantrixTheme.colors.info
PantrixSurface(color = info.container) {
    PantrixSkeletonText(
        lines = 2,
        colors = SkeletonColors(base = info.onContainer.copy(alpha = 0.3f), highlight = info.container)
    )
}
```

### Paragraph placeholder

```kotlin
PantrixSkeletonText(lines = 3)
```

### Inside a larger placeholder that announces itself

```kotlin
PantrixSkeletonText(lines = 2, lineHeight = PantrixTheme.spacing.sm, contentDescription = null)
```

## Örnekler

### Bir paragrafın yerinde

En yalın hâli: yüklenen bir paragrafın yerini tutan üç satır. `lines` satır sayısıdır; son satır ötekilerden kısadır, böylece blok bir paragraf gibi okunur.

Üstünden geçen bant bir şeyin yüklendiğini söyler; sistem hareketi azalt dediğinde bant durur. Ekran okuyucu üç satır için bir kez "Yükleniyor" der.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText

PantrixSkeletonText(lines = 3, modifier = Modifier.fillMaxWidth())
```

### Kendi renginde

`colors` iskelete temanın değil, verilen renkleri verir. İki renk vardır: `base` bloğun kendi rengi, `highlight` üstünden geçen bant. Burada ikisi de uygulamanın kendi morunun soluk birer hâli: zemin ne olursa olsun görünür. Sistem hareketi azalt dediğinde bant durur ve yalnızca `base` görünür.

Yalnızca verilen renk değişir; verilmeyen temanın rolünde kalır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.components.elements.skeleton.SkeletonColors

val own = ownColors()
PantrixSkeletonText(
    lines = 3,
    modifier = Modifier.fillMaxWidth(),
    colors = SkeletonColors(base = own.color.copy(alpha = 0.35f), highlight = own.color.copy(alpha = 0.15f))
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Tek bir blok ve şekli

`PantrixSkeleton` tek bir bloktur ve kendi boyutu yoktur: boyutunu `modifier` verir, yerini tuttuğu içeriğinki kadar. `shape` bloğun köşeleridir.

Sırayla: bir avatarın dairesi (`shapes.full`), bir resmin dikdörtgeni (`shapes.md`), bir düğmenin hapı ve şekil verilmeyen bir satır. Varsayılan şekil temanın en küçük yuvarlağıdır: `shapes.xs`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.skeleton.PantrixSkeleton
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixSkeleton(modifier = Modifier.size(48.dp), shape = PantrixTheme.shapes.full)
    PantrixSkeleton(modifier = Modifier.size(width = 96.dp, height = 64.dp), shape = PantrixTheme.shapes.md)
    PantrixSkeleton(modifier = Modifier.size(width = 88.dp, height = 32.dp), shape = PantrixTheme.shapes.full)
    PantrixSkeleton(modifier = Modifier.size(width = 120.dp, height = 12.dp))
}
```

### Satır yüksekliği

`lineHeight` her satırın yüksekliğidir; varsayılanı `PantrixTheme.spacing.md`, 12dp. Yerini tuttuğu yazının boyuna göre seçilir: üstte küçük bir yazı için 8dp, ortada varsayılan, altta bir başlık için 20dp. Satırların arasındaki boşluk değişmez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixSkeletonText(lines = 2, modifier = Modifier.fillMaxWidth(), lineHeight = PantrixTheme.spacing.sm)
PantrixSkeletonText(lines = 2, modifier = Modifier.fillMaxWidth())
PantrixSkeletonText(lines = 2, modifier = Modifier.fillMaxWidth(), lineHeight = 20.dp)
```

### Bir kez duyurulan satır

Bir avatar ve iki satır: bir liste satırının iskeleti. İki parçanın ikisi de "Yükleniyor" deseydi ekran okuyucu aynı satır için iki kez söylerdi.

Parçalara `contentDescription = null` verildi. Yüklendiğini satırın tamamı bir kez söyler, temanın kendi metniyle: `PantrixTheme.strings.loading`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.skeleton.PantrixSkeleton
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.foundation.theme.PantrixTheme

val loading = PantrixTheme.strings.loading
Row(
    modifier = Modifier.fillMaxWidth().semantics(mergeDescendants = true) { contentDescription = loading },
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixSkeleton(modifier = Modifier.size(40.dp), shape = PantrixTheme.shapes.full, contentDescription = null)
    PantrixSkeletonText(lines = 2, modifier = Modifier.weight(1f), contentDescription = null)
}
```

### Bir dolgunun üstünde

İskelet çevresindeki içerik rengine bakmaz: temanın zemini olmayan bir dolguda renklerini çağıran verir. Buradaki yüzey `info` rolünün `container`'ında.

`base` o yüzeyde yazılan rengin (`onContainer`) soluk bir hâli, `highlight` yüzeyin kendi rengi: bant, satırların içinden geçen bir açıklık gibi görünür.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.components.elements.skeleton.SkeletonColors
import com.pantrixui.foundation.theme.PantrixTheme

val info = PantrixTheme.colors.info
PantrixSurface(modifier = Modifier.fillMaxWidth(), color = info.container) {
    PantrixSkeletonText(
        lines = 2,
        modifier = Modifier.fillMaxWidth().padding(PantrixTheme.spacing.lg),
        colors = SkeletonColors(base = info.onContainer.copy(alpha = 0.3f), highlight = info.container)
    )
}
```

### İçerik gelene kadar

İskelet, yerini tuttuğu içeriğe benzer: avatarın yerinde aynı boyda bir daire, iki satır yazının yerinde iki satır. Düğmeye bas: içerik gelir ve iskeletin yerini alır. İkisinden hangisinin çizileceğine çağıran karar verir.

Yüklenirken dairenin açıklaması yoktur; "Yükleniyor"u yanındaki satırlar bir kez söyler. Satırların etiketi (`tagKey`) bir testin beklediğidir: `SkeletonText_profile` gidince içerik gelmiştir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.skeleton.PantrixSkeleton
import com.pantrixui.components.elements.skeleton.PantrixSkeletonText
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var loading by rememberSaveable { mutableStateOf(true) }
Row(
    modifier = Modifier.fillMaxWidth(),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    if (loading) {
        PantrixSkeleton(
            modifier = Modifier.size(40.dp),
            shape = PantrixTheme.shapes.full,
            contentDescription = null
        )
        PantrixSkeletonText(lines = 2, modifier = Modifier.weight(1f), tagKey = "profile")
    } else {
        PantrixAvatar(contentDescription = null, initials = "AY", size = 40.dp)
        Column(modifier = Modifier.weight(1f)) {
            PantrixText(text = "Ayşe Yılmaz", tagKey = "profile_name")
            PantrixText(
                text = "Tasarım ekibi",
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}
PantrixButton(
    text = if (loading) "İçeriği getir" else "Yeniden yükle",
    onClick = { loading = !loading },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "toggle_profile"
)
```

## API

### PantrixSkeleton

`import com.pantrixui.components.elements.skeleton.PantrixSkeleton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSkeleton(
    modifier: Modifier = Modifier,
    shape: Shape = PantrixTheme.shapes.xs,
    colors: SkeletonColors? = null,
    contentDescription: String? = PantrixTheme.strings.loading,
    tagKey: String? = null
)
```

Yüklenmesi süren içeriğin yer tutucusu: `shape` şeklinde bir blok ve üstünden geçen açık bir bant. Sistem hareketin azaltılmasını istediğinde bant durur. Boyutu `modifier` ile verilir. `colors`, temanın renklerini almayan bloğun kendi renkleridir. Ekran okuyucu `contentDescription`'ı okur: varsayılanı temanın "yükleniyor" metnidir. Yüklendiğini onu saran bir öğe zaten duyuruyorsa null verilir. `tagKey` otomasyon anahtarıdır: blok `Skeleton_<tagKey>`'dır ve bir test içeriğin geldiğini onun gitmesinden anlar. Anahtar yoksa etiketi olmaz.

Parametreler:

- `modifier: Modifier`
- `shape: Shape`
- `colors: SkeletonColors?`
- `contentDescription: String?`
- `tagKey: String?`

### PantrixSkeletonText

`import com.pantrixui.components.elements.skeleton.PantrixSkeletonText`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSkeletonText(
    lines: Int,
    modifier: Modifier = Modifier,
    lineHeight: Dp = PantrixTheme.spacing.md,
    colors: SkeletonColors? = null,
    contentDescription: String? = PantrixTheme.strings.loading,
    tagKey: String? = null
)
```

Bir paragrafın yer tutucusu: her biri `lineHeight` yüksekliğinde, `lines` kadar iskelet satırı. Sonuncusu daha kısadır. Satırlar temanın renklerini almıyorsa her biri `colors` ile verilen renklerdedir. Sütun, hepsi için tek bir `contentDescription` taşır.

Parametreler:

- `lines: Int`
- `modifier: Modifier`: sütunun modifier'ı: her şeyden önce genişliği.
- `lineHeight: Dp`
- `colors: SkeletonColors?`
- `contentDescription: String?`
- `tagKey: String?`: sütunun otomasyon anahtarı: sütun `SkeletonText_<tagKey>`'dır, satırlarının kendi etiketleri yoktur. Anahtar yoksa etiketi olmaz.

### SkeletonColors

`import com.pantrixui.components.elements.skeleton.SkeletonColors`, `com.pantrixui:components` içinden

```kotlin
data class SkeletonColors(
    public val base: Color = Color.Unspecified,
    public val highlight: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir yer tutucuda `PantrixSkeleton` ve `PantrixSkeletonText`'in boyandığı renkler: verilen renk kullanılır, verilmeyen temanın rolünde kalır.

```kotlin
PantrixSkeletonText(lines = 3, colors = SkeletonColors(base = brand.container))
```

Parametreler:

- `base: Color`: Bloğun kendi rengi. Azaltılmış harekette bloğun tamamı bu renktedir. Verilmezse temanın `disabledContent` rengidir.
- `highlight: Color`: Bloğun üstünden geçen daha açık bant. Verilmezse temanın `divider` rengidir.
