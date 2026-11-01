# Spinner

Bir işin sürdüğünü söyleyen, dönen bir yay: bir sayfa yüklenirken, bir kayıt sürerken. İşin ne kadarının bittiğini söylemez, bir ilerleme değeri almaz; yalnızca beklenmesi gerektiğini söyler.

- `PantrixSpinner` (`com.pantrixui.components.elements.spinner`, `com.pantrixui:components`): Süren bir iş için dönen bir yay; kibar bir canlı bölge olarak duyurulur, azaltılmış hareket ayarında durur. Anahtar sözcükler: yükleniyor, yükleme göstergesi, ilerleme göstergesi, meşgul, bekleme, dönen çember.

## Özellikler

- **Boyut.** `size` spinner'ın bir kenarıdır; spinner karedir. Verilmezse stilin boyutudur: her platformda 18dp.
- **Kalınlık boyutla büyür.** Yayın kalınlığı boyutun dokuzda biridir: bir düğmenin içindeki 16dp'lik spinner ile boş bir sayfadaki 48dp'lik aynı ağırlıkta okunur.
- **Renk.** `color` verilmezse spinner bulunduğu yerin içerik rengindedir, dolu bir düğmenin içinde olduğu gibi. İçerik rengi yoksa temanın `primary` rengindedir: temanın kendi zeminleri içerik rengi vermez; sayfada, bir surface'te ve bir kartta spinner markanın rengiyle döner.
- **Ekran okuyucu.** `contentDescription` araya girmeyen bir canlı bölge olarak duyurulur (`LiveRegionMode.Polite`). Varsayılanı temanın dilindeki "Yükleniyor"dur.
- **Zaten söyleniyorsa.** Yüklendiğini kendisi söyleyen bir şeyin içinde `contentDescription = null` verilir. `PantrixButton`'ın `loading`'i içine koyduğu spinner'a böyle yapar.
- **Hareketi azalt.** Sistem hareketin azaltılmasını istediğinde yay dönmez, yerinde durur.
- **Stil.** `SpinnerStyle` boyut verilmeyen spinner'ın boyutunu taşır. Bir marka `spinner.size` değeriyle, bir tema `styles` ile, ağacın bir bölümü `ProvidePantrixStyles` ile değiştirir. Uygulamanın yoğunluğu onu ölçeklemez.
- **Otomasyon.** `tagKey` test etiketini kurar: `tagKey = "orders_loading"` verilen spinner'ın etiketi `Spinner_orders_loading`'dir.

## Kullanım

### Loading a page

```kotlin
Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
    PantrixSpinner(size = PantrixTheme.spacing.xxl, tagKey = "orders_loading")
}
```

### Inside something that already says it is loading

```kotlin
PantrixSpinner(size = PantrixTheme.spacing.lg, contentDescription = null)
```

## Örnekler

### Tek başına

En yalın hâli: hiçbir parametre verilmedi. Spinner stilin boyutundadır (18dp) ve ekran okuyucuya "Yükleniyor" diye duyurulur.

Renk de verilmedi. Örnek temanın zemini üstünde duruyor ve zemin içerik rengi vermiyor: spinner kendi varsayılanında, markanın renginde döner.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.spinner.PantrixSpinner

PantrixSpinner()
```

### Boyutlar

`size` spinner'ın kenarıdır: burada 16, 24, 32 ve 48 dp. Yayın kalınlığı boyutla birlikte büyür, bu yüzden hepsi aynı ağırlıkta okunur.

İkincisinin boyutu bir sayı değil, temanın aralık ölçeğinden bir adım: `PantrixTheme.spacing.xl`, 24dp. Ölçekten alınan boyut uygulamanın yoğunluğuyla birlikte ölçeklenir, sayıyla verilen ölçeklenmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixSpinner(size = 16.dp)
    PantrixSpinner(size = PantrixTheme.spacing.xl)
    PantrixSpinner(size = 32.dp)
    PantrixSpinner(size = 48.dp)
}
```

### Renkler

`color` yayı verilen renkte çizer. Sırayla: temanın `success` ve `danger` rolleri, ikincil yazı rengi ve temanın hiçbir rolünde olmayan, uygulamanın kendi moru.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixSpinner(size = 24.dp, color = colors.success.color)
    PantrixSpinner(size = 24.dp, color = colors.danger.color)
    PantrixSpinner(size = 24.dp, color = colors.textSecondary)
    PantrixSpinner(size = 24.dp, color = ownColors().color)
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Bir dolgunun üstünde

Renk verilmeyen spinner bulunduğu yerin içerik rengini alır. İlk yüzey temanın `primary` renginde: spinner rolün `onColor`'ıyla döner. İkincisi `success` rolünün `container`'ında: spinner `onContainer`'dadır. Hiçbirine `color` verilmedi.

Düğmenin spinner'ı düğmenin kendisinindir: `loading = true` onu öndeki ikonun yerine, düğmenin içerik renginde koyar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.foundation.theme.PantrixTheme

val colors = PantrixTheme.colors
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    PantrixSurface(color = colors.primary.color) {
        PantrixSpinner(modifier = Modifier.padding(PantrixTheme.spacing.md), size = 24.dp)
    }
    PantrixSurface(color = colors.success.container) {
        PantrixSpinner(modifier = Modifier.padding(PantrixTheme.spacing.md), size = 24.dp)
    }
    PantrixButton(text = "Kaydediliyor", onClick = {}, loading = true, tagKey = "saving")
}
```

### Bir sayfa yüklenirken

İçerik gelene kadar onun yerinde, ortada duran büyük bir spinner: `size = PantrixTheme.spacing.xxl`, 32dp.

`contentDescription` neyin yüklendiğini söyler: ekran okuyucu "Yükleniyor" yerine "Siparişler yükleniyor" der. `tagKey` de verildi: otomasyon spinner'ı `Spinner_orders_loading` etiketiyle bulur. Düğmeye bas: içerik gelir, spinner kalkar.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var loading by rememberSaveable { mutableStateOf(true) }
PantrixSurface(
    modifier = Modifier.fillMaxWidth().height(160.dp),
    border = PantrixTheme.colors.divider
) {
    if (loading) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            PantrixSpinner(
                size = PantrixTheme.spacing.xxl,
                contentDescription = "Siparişler yükleniyor",
                tagKey = "orders_loading"
            )
        }
    } else {
        PantrixText(text = "Üç sipariş yolda.", modifier = Modifier.padding(PantrixTheme.spacing.lg))
    }
}
PantrixButton(
    text = if (loading) "Yüklemeyi bitir" else "Yeniden yükle",
    onClick = { loading = !loading },
    variant = ButtonVariant.Outline,
    size = ButtonSize.Small,
    tagKey = "toggle_orders"
)
```

### Yüklendiğini söyleyen bir yazının yanında

`contentDescription = null` verilen spinner ekran okuyucuya bir şey söylemez. Yanındaki yazı işin sürdüğünü zaten söylüyor: spinner'ın ayrıca söylemesi gerekmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixSpinner(size = 16.dp, contentDescription = null)
    PantrixText(text = "Değişiklikler kaydediliyor", color = PantrixTheme.colors.textSecondary)
}
```

### Stille varsayılan boyut

`SpinnerStyle` boyut verilmeyen spinner'ın boyutunu taşır. `ProvidePantrixStyles` onu ağacın bir bölümü için değiştirir; aynı değişiklik `PantrixTheme`'in `styles` parametresiyle uygulamanın tamamına verilir.

İlk spinner boyutunu stilden alır: burada 28dp. İkincisine `size` verildi: parametre stilin üstündedir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.spinner.PantrixSpinner
import com.pantrixui.components.elements.spinner.SpinnerStyle
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.style.ProvidePantrixStyles
import com.pantrixui.foundation.token.style.pantrixStyles

val styles = remember { pantrixStyles(SpinnerStyle.override(all = SpinnerStyle(size = 28.dp))) }
ProvidePantrixStyles(styles = styles) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixSpinner()
        PantrixSpinner(size = 16.dp)
    }
}
```

## API

### PantrixSpinner

`import com.pantrixui.components.elements.spinner.PantrixSpinner`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixSpinner(
    modifier: Modifier = Modifier,
    size: Dp = PantrixTheme.style(SpinnerStyle).size,
    color: Color = Color.Unspecified,
    contentDescription: String? = PantrixTheme.strings.loading,
    tagKey: String? = null
)
```

Bir işin sürdüğünü söyleyen, dönen bir yay. Karedir: bir kenarı `size` kadardır. Sistem hareketin azaltılmasını istediğinde yerinde durur. `color` ile verilen renkte çizilir. Renk verilmezse, dolu bir düğmede olduğu gibi, bulunduğu yerin içerik rengini alır. O da yoksa primary rengindedir: temanın kendi zeminleri içerik rengi vermez, bu yüzden sayfada, bir yüzeyde ve bir kartta markanın rengindedir. `contentDescription` ekran okuyuculara araya girmeyen bir canlı bölge olarak ulaşır. Yüklendiğini zaten söyleyen bir şeyin içinde null verilir.

Parametreler:

- `modifier: Modifier`: spinner'ın modifier'ı.
- `size: Dp`
- `color: Color`
- `contentDescription: String?`
- `tagKey: String?`: spinner'ın otomasyon anahtarı: spinner `Spinner_<tagKey>`'dır, anahtar yoksa çağrıldığı yerden bir anahtar alır. Görünen metin hiçbir zaman anahtar olmaz.

### SpinnerStyle

`import com.pantrixui.components.elements.spinner.SpinnerStyle`, `com.pantrixui:components` içinden

```kotlin
class SpinnerStyle(
    public val size: Dp = Dp.Unspecified
) : PantrixStyle<SpinnerStyle>
```

`PantrixSpinner`'ın geometrisi.

Parametreler:

- `size: Dp`: Spinner'ın eni ve boyu. Bir marka ya da bir tema başka bir değer vermedikçe her platformda 18dp'dir.
