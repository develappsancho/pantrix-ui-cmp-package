# Empty State

Bir yerin gösterecek bir şeyi yokken gösterdiği: ilk öğesinden önceki bir liste, hiçbir şey bulamayan bir arama, bir belge bekleyen bir bölme. Yerin ne için olduğunu ve orada ne yapılacağını söyler, yapmanın yolunu da verir.

- `PantrixEmptyState` (`com.pantrixui.components.container.emptystate`, `com.pantrixui:components`): Bir yerin gösterecek bir şeyi yokken gösterdiği: bir ikon, bir başlık, orada ne yapılacağını söyleyen bir satır ve bir eylem, yerinin ortasında. Anahtar sözcükler: boş hâl, sonuç yok, burada bir şey yok, boş sayfa, sıfır hâl, yer tutucu.

## Özellikler

- **Parçaları.** Temanın nötr dolgusunda bir dairede `icon`, `title`, altında callout yazısında `description` ve hepsinin altında `action`: uygulamanın kendi düğmesi, uygulamanın etiketlediği ve basışını duyduğu. Yalnızca başlık gerekir.
- **Yeri.** Verilen genişliği doldurur ve ortasında durur. Başlıkla açıklama geniş bir yerde stilin `maxTextWidth`'inden, 360dp'den, geniş akmaz: bütün bir pencere boyunca akan bir satır okunmaz.
- **Ekran okuyucu.** Başlıkla açıklama tek parça okunur, eylem onlardan sonra, düğme olarak. İkon okunmaz: ne gösterdiğini başlık söyler.
- **Platform.** Daire Android'de ve iOS'ta 64dp, ikon 32dp, iç boşluk 24dp; masaüstünde ve web'de 48dp, 24dp ve 16dp (`EmptyStateStyle`).
- **Kendi renkleri.** `EmptyStateColors` dairenin, ikonun, başlığın ve açıklamanın rengini verir; verilmeyen temada kalır.
- **Otomasyon.** `tagKey` ile boş hâl `EmptyState_<tagKey>` olur; eylemin düğmesi kendi etiketini taşır.

## Kullanım

### A list that has nothing yet

```kotlin
if (recent.isEmpty()) {
    PantrixEmptyState(
        title = stringResource(Res.string.nothing_opened_yet),
        description = stringResource(Res.string.paste_or_open_a_file),
        icon = PantrixIcons.Folder,
        tagKey = "recent"
    )
}
```

### A search that found nothing, with a way on

```kotlin
PantrixEmptyState(
    title = stringResource(Res.string.no_orders_match),
    description = stringResource(Res.string.try_another_word),
    icon = PantrixIcons.Search,
    action = {
        PantrixButton(
            text = stringResource(Res.string.clear_the_filter),
            onClick = { query = "" },
            variant = ButtonVariant.Outline,
            tagKey = "clear_filter"
        )
    },
    tagKey = "orders"
)
```

## Örnekler

### Henüz boş bir liste

Henüz bir şeyi olmayan bir liste: ikon listenin neyi tuttuğunu, başlık neyin olmadığını, açıklama oraya nasıl bir şey geleceğini söyler. Uzun bir açıklama 360dp'de alt satıra geçer ve ortalı kalır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.container.emptystate.PantrixEmptyState
import com.pantrixui.foundation.icons.PantrixIcons

PantrixEmptyState(
    title = "Henüz bir şey açılmadı",
    description = "Bir belge yapıştırın ya da bir dosya açın; burada, son açılan en üstte tutulur.",
    icon = PantrixIcons.Folder,
    tagKey = "recent"
)
```

### Hiçbir şey bulamayan bir arama

Hiçbir şey bulamayan bir arama: eylem okuru bulunacak bir şeye geri götürür. Düğme uygulamanındır; boş hâl onu açıklamanın altına koyar, etiketini ve basışını uygulama verir. Burada süzgeci temizlemek siparişleri geri getirir, "Yeniden ara" boş hâli yeniden gösterir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.emptystate.PantrixEmptyState
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons

var query by rememberSaveable { mutableStateOf("kırmızı") }
if (query.isEmpty()) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        listOf("Sipariş 4821", "Sipariş 4822", "Sipariş 4823").forEach { order -> PantrixText(order) }
        PantrixButton(
            text = "Yeniden ara",
            onClick = { query = "kırmızı" },
            variant = ButtonVariant.Text,
            tagKey = "search_again"
        )
    }
} else {
    PantrixEmptyState(
        title = "Eşleşen sipariş yok",
        description = "\"$query\" hiçbir siparişte geçmiyor. Başka bir sözcük deneyin ya da süzgeci temizleyin.",
        icon = PantrixIcons.Search,
        action = {
            PantrixButton(
                text = "Süzgeci temizle",
                onClick = { query = "" },
                variant = ButtonVariant.Outline,
                tagKey = "clear_filter"
            )
        },
        tagKey = "orders"
    )
}
```

### Bir kartın içinde, kendi stili ve renkleriyle

Bir kartın içinde, kartın kendi dolgusunda: daha küçük bir daire ve daha az boşluk (`EmptyStateStyle`), dairesi ve ikonu uygulamanın kendi renginde (`EmptyStateColors`). İkinci kartta yalnızca bir başlık var: daire de açıklama da gerekmez.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.emptystate.EmptyStateColors
import com.pantrixui.components.container.emptystate.EmptyStateStyle
import com.pantrixui.components.container.emptystate.PantrixEmptyState
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixEmptyState(
        title = "Bildirim yok",
        description = "Yeni bir şey olduğunda burada görünür.",
        icon = PantrixIcons.Inbox,
        style = EmptyStateStyle(iconContainerSize = 40.dp, iconSize = 20.dp, padding = 8.dp, iconGap = 8.dp),
        colors = EmptyStateColors(iconContainer = own.container, icon = own.onContainer),
        tagKey = "notifications"
    )
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixEmptyState(
        title = "Mesaj yok",
        colors = EmptyStateColors(title = PantrixTheme.colors.textSecondary),
        tagKey = "messages"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixEmptyState

`import com.pantrixui.components.container.emptystate.PantrixEmptyState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixEmptyState(
    title: String,
    modifier: Modifier = Modifier,
    description: String? = null,
    icon: ImageVector? = null,
    action: (@Composable () -> Unit)? = null,
    style: EmptyStateStyle? = null,
    colors: EmptyStateColors? = null,
    tagKey: String? = null
)
```

Bir yerin gösterecek bir şeyi yokken gösterdiği: ilk öğesinden önceki bir liste, hiçbir şey bulamayan bir arama, bir belge bekleyen bir bölme. Yerin ne için olduğunu ve orada ne yapılacağını söyler, yapmanın yolunu da verir.

- **Parçaları.** Temanın nötr dolgusunda bir dairede bir `icon`, bir `title`, altında callout'un yazısında bir `description` ve hepsinin altında bir `action`: uygulamanın kendi düğmesi, onu uygulama etiketler ve basışını uygulama duyar. Yalnızca başlık gerekir.

- **Yeri.** Verilen genişliği doldurur ve ortasında durur: başlık ve açıklama stilin `maxTextWidth`'inden geniş akmaz, ortalıdır. Yüksekliği tuttuğu kadardır: bir ekran onu daha yüksek bir yerde, içine koyduğu kutuyla ortalar.

- **Ekran okuyucuya** başlık ve açıklama tek bir şeydir, geldikleri gibi okunur; eylem onlardan sonra, olduğu düğme olarak okunur. İkon okunmaz: ne gösterdiğini başlık söyler.

```kotlin
if (recent.isEmpty()) {
    PantrixEmptyState(
        title = stringResource(Res.string.nothing_opened_yet),
        description = stringResource(Res.string.paste_or_open_a_file),
        icon = PantrixIcons.Folder,
        tagKey = "recent"
    )
}
```

Parametreler:

- `title: String`: yerin neyi olmadığı ya da neyi beklediği: `Henüz bir şey açılmadı`.
- `modifier: Modifier`: boş hâlin modifier'ı. Verilen genişliği doldurur.
- `description: String?`: orada ne yapılacağı, bir iki satırda; yalnızca başlık için null.
- `icon: ImageVector?`: yer boş değilken neyi tuttuğu, başlığın üstünde bir dairede çizilir; hiçbiri için null.
- `action: (@Composable () -> Unit)?`: bunun için ne yapılacağı, sözlerin altında: uygulamanın kendi düğmesi, `PantrixButton`; onu uygulama etiketler. Hiçbiri için null.
- `style: EmptyStateStyle?`: bu çağrının kendi stili: kapsayan her stilin üstünde, yoğunluğun altında. Yalnızca verdiği alanlar, her platformda, değişir.
- `colors: EmptyStateColors?`: bu boş hâlin, temanınkiler olmadığı yerdeki kendi renkleri: burada verilenler, gerisi temanınkiler.
- `tagKey: String?`: boş hâlin otomasyon anahtarı: boş hâl `EmptyState_<tagKey>` olur.

### EmptyStateStyle

`import com.pantrixui.components.container.emptystate.EmptyStateStyle`, `com.pantrixui:components` içinden

```kotlin
class EmptyStateStyle(
    public val iconSize: Dp = Dp.Unspecified,
    public val iconContainerSize: Dp = Dp.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val iconGap: Dp = Dp.Unspecified,
    public val textGap: Dp = Dp.Unspecified,
    public val actionGap: Dp = Dp.Unspecified,
    public val maxTextWidth: Dp = Dp.Unspecified
) : PantrixStyle<EmptyStateStyle>
```

`PantrixEmptyState`'in geometrisi: ikonunun durduğu daire, tuttuğunun çevresindeki ve parçalarının arasındaki boşluk ve sözlerinin ne kadar geniş aktığı.

Boşluk yoğunluğa uyar; daire, ikon ve sözlerin genişliği uymaz: onlar hava değildir.

Parametreler:

- `iconSize: Dp`: İkonun kendi boyu: Android'de ve iOS'ta 32dp, masaüstünde ve web'de 24dp.
- `iconContainerSize: Dp`: İkonun ortasında durduğu daire: Android'de ve iOS'ta 64dp, masaüstünde ve web'de 48dp.
- `padding: Dp`: Boş hâlin içinde durduğunun kenarıyla tuttuğu arasındaki boşluk: Android'de ve iOS'ta 24dp, masaüstünde ve web'de 16dp.
- `iconGap: Dp`: Daireyle başlık arasındaki boşluk: Android'de ve iOS'ta 16dp, masaüstünde ve web'de 12dp.
- `textGap: Dp`: Başlıkla açıklama arasındaki boşluk: 4dp.
- `actionGap: Dp`: Sözlerle altlarındaki eylem arasındaki boşluk: 16dp.
- `maxTextWidth: Dp`: Başlığın ve açıklamanın, geniş bir yerin ortasında, en çok ne kadar geniş aktığı: bütün bir pencere boyunca akan bir satır okunmaz. 360dp.

### EmptyStateColors

`import com.pantrixui.components.container.emptystate.EmptyStateColors`, `com.pantrixui:components` içinden

```kotlin
data class EmptyStateColors(
    public val icon: Color = Color.Unspecified,
    public val iconContainer: Color = Color.Unspecified,
    public val title: Color = Color.Unspecified,
    public val description: Color = Color.Unspecified
)
```

`PantrixEmptyState`'in, temanınki olmadığı yerde neyle boyandığı: verilen bir renk kullanılır, verilmeyen temanınki kalır.

```kotlin
PantrixEmptyState(
    title = stringResource(Res.string.no_results),
    icon = PantrixIcons.Search,
    colors = EmptyStateColors(iconContainer = brand.container, icon = brand.onContainer)
)
```

Parametreler:

- `icon: Color`: İkon: temanın nötr rolünün `onContainer`'ı.
- `iconContainer: Color`: İkonun arkasındaki daire: temanın nötr rolünün `container`'ı.
- `title: Color`: Başlık: temanın `textPrimary`'si.
- `description: Color`: Açıklama: temanın `textSecondary`'si.
