# Card

Tek bir konuyu toplayan kapsayıcı: kendi yüzeyinde bir başlık, bir gövde ve eylemler, üstlerinde kenardan kenara duran bir görsel. Bir sipariş, bir makale, bir ayar grubu.

Kart en geniş parçası kadar geniştir. Genişlik verildiğinde, çoğunlukla `fillMaxWidth()` ile, görseli o genişliğe yayılır ve eylemleri kartın bitiş kenarına yaslanır.

- `PantrixCard` (`com.pantrixui.components.container.card`, `com.pantrixui:components`): Tek bir konu için bir kap: başlık, görsel ve alt bilgi yerleriyle; onClick'i olunca tek bir düğmedir. Anahtar sözcükler: kart, panel, kutucuk, kap, içerik kartı, tıklanabilir kart.
- `PantrixCardSkeleton` (`com.pantrixui.components.container.card`, `com.pantrixui:components`): İçeriği henüz gelmemiş bir kart: başlığının, gövdesinin ve eylemlerinin yerinde çubuklarla kartın kendi yüzeyi; bir kez duyurulur. Anahtar sözcükler: kart yer tutucusu, yüklenen kart, iskelet kart, parıltılı kart.

## Özellikler

- **Üç varyant.** `variant` kartın durduğu yerden nasıl ayrıldığını söyler: `Elevated` bir gölgeyle, `Filled` bir dolguyla, `Outlined` ince bir kenarla.
- **Yuvalar.** `header` gövdenin üstünde, `footer` altında durur; `media` hepsinin üstünde, kartın iç boşluğunu almadan kenardan kenara çizilir. Gövdedeki satırların arasında temanın küçük boşluğu (`spacing.sm`) vardır.
- **Yükseklik.** Yükseklik verilen kartın gövdesi onu doldurur: `footer` kartın dibinde durur ve gövdede `weight` alan bir çocuk aradaki yeri alır. Bir satırın kartları böylece aynı boyda olur.
- **Tek bir düğme.** `onClick` verilen kartın tamamı tek bir düğmedir: ekran okuyucu tek bir hedef duyar. `footer`'daki bir düğme kendi basışını korur.
- **Basılamayan kart.** `onClick`'i olan ve `enabled`'ı false olan kart, içindekilere temanın devre dışı rengini verir; kendi rengini veren bir çocuk onu korur.
- **İçerik rengi.** Temanın `surface`'ı üstünde, yani `Elevated` ve `Outlined` kartta, kart içindekilere renk vermez: her çocuk kendi varsayılanıyla çizilir. `Filled` kart ve bir rolün dolgusu verilen kart, o dolguda okunan rengi verir.
- **Kendi renkleri.** `CardColors` dolguyu, içeriğin rengini ve kenarı verir; verilmeyen varyantınki kalır.
- **Platform.** Köşeler ve gölge platforma göredir (`CardStyle`): Android'de orta köşe ve 2dp gölge, iOS'ta büyük köşe ve gölgesiz, masaüstünde ve web'de küçük köşe ve 1dp gölge.
- **İskelet.** `PantrixCardSkeleton` verisi gelmemiş bir kartın yerini tutar: kartın kendi yüzeyi, içinde başlığın, satırların ve düğmelerin yerinde çubuklar. Ekran okuyucuya bir kez, kartın tamamı için duyurulur.
- **Otomasyon.** `tagKey` karta `Card_<tagKey>` etiketini verir; bir basış, varyantıyla birlikte `Card` olayı olarak bildirilir.

## Kullanım

### Header, body and actions

```kotlin
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    header = {
        PantrixText(text = order.title, style = PantrixTheme.typography.title, role = TextRole.Heading(level = 3))
    },
    footer = {
        PantrixButton(
            text = stringResource(Res.string.cancel),
            onClick = onCancel,
            variant = ButtonVariant.Text,
            tagKey = "cancel"
        )
        PantrixButton(text = stringResource(Res.string.save), onClick = onSave, tagKey = "save")
    }
) {
    PantrixText(text = order.summary)
}
```

### The whole card as one target

```kotlin
PantrixCard(
    variant = CardVariant.Outlined,
    onClick = { openOrder(order.id) },
    contentDescription = stringResource(Res.string.open_order, order.number),
    tagKey = "order"
) {
    PantrixText(text = order.title, style = PantrixTheme.typography.title)
    PantrixText(text = order.status, color = PantrixTheme.colors.textSecondary)
}
```

### Media edge to edge

```kotlin
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    media = {
        PantrixImage(
            painter = painterResource(Res.drawable.article_cover),
            modifier = Modifier.height(160.dp),
            contentScale = ContentScale.Crop
        )
    }
) {
    PantrixText(text = article.title, style = PantrixTheme.typography.title)
    PantrixText(text = article.summary, maxLines = 3)
}
```

### In colours of its own

```kotlin
val info = PantrixTheme.colors.info
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Filled,
    colors = CardColors(container = info.container, content = info.onContainer)
) {
    PantrixText(text = stringResource(Res.string.new_feature), style = PantrixTheme.typography.title)
    PantrixText(text = stringResource(Res.string.new_feature_summary))
}
```

### Cards of one height in a row

```kotlin
Row(Modifier.height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
    plans.forEach { plan ->
        PantrixCard(
            modifier = Modifier.weight(1f).fillMaxHeight(),
            footer = {
                PantrixButton(text = stringResource(Res.string.choose), onClick = { choose(plan) }, tagKey = plan.id)
            }
        ) {
            PantrixText(text = plan.name, style = PantrixTheme.typography.title)
            PantrixText(text = plan.summary)
        }
    }
}
```

### In place of the card until its data arrives

```kotlin
if (order == null) {
    PantrixCardSkeleton(modifier = Modifier.fillMaxWidth(), lines = 2, footerButtons = 2)
} else {
    OrderCard(order, modifier = Modifier.fillMaxWidth())
}
```

### A loading list, announced once

```kotlin
val loading = PantrixTheme.strings.loading
LazyColumn(Modifier.semantics { contentDescription = loading }) {
    items(count = 3, contentType = { "skeleton" }) {
        PantrixCardSkeleton(variant = CardVariant.Outlined, contentDescription = null)
    }
}
```

### In the colours of the card it stands in for

```kotlin
val info = PantrixTheme.colors.info
PantrixCardSkeleton(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Filled,
    colors = CardColors(container = info.container),
    skeletonColors = SkeletonColors(base = info.onContainer.copy(alpha = 0.3f), highlight = info.container),
    lines = 1
)
```

## Örnekler

### En yalın hâli

En az yazılan hâli: bir `PantrixCard` ve gövdesi. Varyant verilmedi, `Elevated`'dır. Gövdedeki satırlar alt alta durur, aralarında temanın küçük boşluğu vardır.

İlk karta genişlik verilmedi: en geniş satırı kadar geniştir. İkincisine `fillMaxWidth()` verildi ve bulunduğu yeri doldurur.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard {
    PantrixText(text = "Haftalık özet", style = PantrixTheme.typography.title)
    PantrixText(text = "Üç yeni sipariş, bir iade")
}
PantrixCard(modifier = Modifier.fillMaxWidth()) {
    PantrixText(text = "Aylık özet", style = PantrixTheme.typography.title)
    PantrixText(text = "Genişlik verildi: kart bulunduğu yeri doldurur")
}
```

### Üç varyant

`variant` kartın durduğu yerden nasıl ayrıldığını seçer. `Elevated` temanın `surface` rengindedir ve bir gölgeyle yükselir; iOS'ta gölgesi yoktur, kartı yalnızca yüzey rengi ayırır. `Filled` yükselmez, nötr rolün dolgusuyla ayrılır: zaten yükselmiş bir yüzeyin üstündeki kart içindir. `Outlined` temanın `divider` renginde ince bir kenarla çevrilir: çok gölgenin gürültüye dönüştüğü sık kart listeleri içindir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Elevated) {
    PantrixText(text = "Yükseltilmiş kart", style = PantrixTheme.typography.title)
    PantrixText(text = "Varsayılan varyant: gölgeyle ayrılır")
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Filled) {
    PantrixText(text = "Dolgulu kart", style = PantrixTheme.typography.title)
    PantrixText(text = "Gölge yerine renkle ayrılır")
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
    PantrixText(text = "Kenarlı kart", style = PantrixTheme.typography.title)
    PantrixText(text = "İnce bir kenarla ayrılır")
}
```

### Görsel, başlık ve eylemler

Kartın üç yuvası. `media` en üstte, başlığın da üstünde durur ve kartın iç boşluğunu almaz: kartın kenarlarına kadar uzanır, köşelerini kart keser. `header` gövdenin üstündedir, çoğunlukla kartın başlığıdır. `footer` eylemleri bir satırda, kartın bitiş kenarında toplar; ana eylem sonda durur.

Karta genişlik verildiği için görsel o genişliğe yayılır ve eylemler bitiş kenarına yaslanır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

PantrixCard(
    modifier = Modifier.widthIn(max = 360.dp).fillMaxWidth(),
    header = {
        PantrixText(
            text = "Compose Multiplatform",
            style = PantrixTheme.typography.title,
            role = TextRole.Heading(level = 3)
        )
    },
    media = {
        PantrixImage(
            painter = painterResource(Res.drawable.compose_multiplatform),
            modifier = Modifier.height(140.dp).background(PantrixTheme.colors.info.container),
            contentDescription = null
        )
    },
    footer = {
        PantrixButton(text = "Sonra", onClick = {}, variant = ButtonVariant.Text, tagKey = "article_later")
        PantrixButton(text = "Oku", onClick = {}, tagKey = "article_read")
    },
    tagKey = "article"
) {
    PantrixText(text = "Tek bir kod tabanıyla Android, iOS, masaüstü ve web.")
}
```

### Bir satırda aynı boyda

Bir satırdaki kartlar en uzununun boyunda: satıra `height(IntrinsicSize.Min)`, her karta `weight(1f)` ve `fillMaxHeight()` verildi. Yükseklik verilen kartın gövdesi onu doldurur: `footer` kartın dibinde durur, kısa açıklamalı planın düğmesi de. Gövdede `Modifier.weight(1f)` alan bir çocuk aradaki yeri alır ve fiyatı düğmenin üstüne iter.

Yükseklik verilmeyen bir kart içindekiler kadar uzundur ve `footer` gövdenin hemen altında durur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    modifier = Modifier.fillMaxWidth().height(IntrinsicSize.Min),
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    PLANS.forEach { plan ->
        PantrixCard(
            modifier = Modifier.weight(1f).fillMaxHeight(),
            variant = CardVariant.Outlined,
            footer = { PantrixButton(text = "Seç", onClick = {}, tagKey = "plan_${plan.key}") },
            tagKey = "plan_${plan.key}"
        ) {
            PantrixText(text = plan.name, style = PantrixTheme.typography.title)
            PantrixText(text = plan.summary, color = PantrixTheme.colors.textSecondary)
            Spacer(Modifier.weight(1f))
            PantrixText(text = plan.price, style = PantrixTheme.typography.callout)
        }
    }
}

private val PLANS = listOf(
    Plan("solo", "Tek kişi", "Bir uygulama için.", "Ücretsiz"),
    Plan("team", "Ekip", "Beş kişiye kadar bir ekip, ortak bir tema ve paylaşılan bileşenler için.", "Aylık 400 ₺")
)

private class Plan(val key: String, val name: String, val summary: String, val price: String)
```

### Tamamı tek bir düğme

`onClick` verilen kartın tamamı tek bir düğmedir. Bir şey açan kartı kurmanın erişilebilir yolu budur: ekran okuyucu tek bir hedef duyar, kartın yazısıyla ya da verildiyse `contentDescription` ile. İlk karta bas: uygulamanın snackbar'ı haber verir.

İkinci kartın `enabled`'ı false: basılamaz ve içindekilere temanın devre dışı rengini verir; basılamadığını yazısının bu rengi söyler. `onClick`'i olmayan bir kart `enabled`'a bakmaz.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.overlay.snackbar.LocalPantrixSnackbars
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.launch

val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Outlined,
    onClick = { scope.launch { snackbars?.show(message = "Sipariş #1043 açıldı", tagKey = "order_opened") } },
    contentDescription = "Sipariş 1043'ü aç",
    tagKey = "order_1043"
) {
    PantrixText(text = "Sipariş #1043", style = PantrixTheme.typography.title)
    PantrixText(text = "Kartın tamamı tek bir düğme", color = PantrixTheme.colors.textSecondary)
}
PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined, onClick = {}, enabled = false) {
    PantrixText(text = "Sipariş #1039", style = PantrixTheme.typography.title)
    PantrixText(text = "İptal edildi, açılamaz")
}
```

### Kendi renkleriyle

`colors` karta varyantının değil, verilen renkleri verir; verilmeyen alan varyantınki kalır.

İlk karta yalnızca dolgu verildi ve o dolgu temanın bir rolünün rengi: tema, üstünde okunan rengi kendisi eşleştirir. İkincinin dolgusu temanın hiçbir rolünde yok, uygulamanın kendi moru: üstünde ne okunacağını tema bilemez, `content` de verilir. Üçüncü `Outlined` kartın yalnızca kenarı değişti.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardColors
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Filled,
    colors = CardColors(container = PantrixTheme.colors.info.container)
) {
    PantrixText(text = "Yeni özellik", style = PantrixTheme.typography.title)
    PantrixText(text = "Yalnızca dolgu verildi, yazının rengini tema eşleştirdi")
}
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Filled,
    colors = CardColors(container = own.container, content = own.onContainer),
    tagKey = "own_colors"
) {
    PantrixText(text = "Üyelik", style = PantrixTheme.typography.title)
    PantrixText(text = "Dolgu da içeriğin rengi de verildi")
}
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Outlined,
    colors = CardColors(border = own.color)
) {
    PantrixText(text = "Seçili plan", style = PantrixTheme.typography.title)
    PantrixText(text = "Yalnızca kenarın rengi verildi")
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Şekil, iç boşluk ve stil

`shape` tek bir kartın köşelerini değiştirir ve stilin köşesinin önüne geçer. `contentPadding` başlığın, gövdenin ve eylemlerin çevresindeki boşluktur; varsayılanı `spacing.lg`'dir, ikinci kartta `spacing.sm` verildi.

`style` kartın geometrisini değiştirir: son kartta `CardStyle(elevation = 8.dp)` ile daha derin bir gölge. Yalnızca verilen alan değişir ve her platformda değişir: bu kartın iOS'ta da gölgesi vardır.

```kotlin
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardStyle
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard(modifier = Modifier.fillMaxWidth(), shape = PantrixTheme.shapes.none) {
    PantrixText(text = "Köşeli", style = PantrixTheme.typography.title)
    PantrixText(text = "shape = PantrixTheme.shapes.none")
}
PantrixCard(
    modifier = Modifier.fillMaxWidth(),
    variant = CardVariant.Outlined,
    contentPadding = PaddingValues(PantrixTheme.spacing.sm)
) {
    PantrixText(text = "Dar iç boşluk", style = PantrixTheme.typography.title)
    PantrixText(text = "contentPadding = PaddingValues(PantrixTheme.spacing.sm)")
}
PantrixCard(modifier = Modifier.fillMaxWidth(), style = CardStyle(elevation = 8.dp)) {
    PantrixText(text = "Daha derin gölge", style = PantrixTheme.typography.title)
    PantrixText(text = "style = CardStyle(elevation = 8.dp)")
}
```

### Veri gelene kadar: iskelet

"Yenile"ye bas: iki kart iki saniyeliğine iskeletleriyle yer değiştirir. `PantrixCardSkeleton` bir karta benzetilerek çizilmez, kartın kendi şekli, dolgusu, gölgesi, iç boşluğu ve aralıklarıyla kurulur. Çubukları, yerini tuttukları şeyin kapladığı yeri kaplar: veri gelince kartın yüksekliği değişmez ve altındaki hiçbir şey yerinden oynamaz.

İskelet kartın içinde ne olduğunu bilemez: `showHeader`, `lines`, `footerButtons` ve `mediaHeight` yerine geçtiği karta göre verilir. İlk kartın bir başlığı, bir satırı ve iki düğmesi var: `lines = 1`, `footerButtons = 2`.

"Kampanya" kartının dolgusu ve içeriğinin rengi dışarıdan verildi. İskeleti de kartın renklerini `colors` ile alır; çubukları `skeletonColors` ile verilen renkte çizilir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.container.card.CardColors
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.container.card.PantrixCardSkeleton
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.skeleton.SkeletonColors
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.components.elements.text.TextRole
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay

val own = ownColors()
val campaign = CardColors(container = own.container, content = own.onContainer)
var loading by remember { mutableStateOf(false) }
LaunchedEffect(loading) {
    if (loading) {
        delay(2_000)
        loading = false
    }
}
if (loading) {
    PantrixCardSkeleton(modifier = Modifier.fillMaxWidth(), lines = 1, footerButtons = 2)
} else {
    PantrixCard(
        modifier = Modifier.fillMaxWidth(),
        header = {
            PantrixText(
                text = "Sipariş #1042",
                style = PantrixTheme.typography.title,
                role = TextRole.Heading(level = 3)
            )
        },
        footer = {
            PantrixButton(
                text = "Yenile",
                onClick = { loading = true },
                variant = ButtonVariant.Text,
                tagKey = "reload"
            )
            PantrixButton(text = "Takip et", onClick = {}, tagKey = "track")
        }
    ) {
        PantrixText(text = "İki ürün, perşembe günü teslim")
    }
}
if (loading) {
    PantrixCardSkeleton(
        modifier = Modifier.fillMaxWidth(),
        variant = CardVariant.Filled,
        colors = campaign,
        skeletonColors = SkeletonColors(base = own.onContainer.copy(alpha = 0.3f), highlight = own.container),
        lines = 1
    )
} else {
    PantrixCard(
        modifier = Modifier.fillMaxWidth(),
        variant = CardVariant.Filled,
        colors = campaign,
        tagKey = "campaign"
    ) {
        PantrixText(text = "Kampanya", style = PantrixTheme.typography.title)
        PantrixText(text = "Dolgusu ve içeriğinin rengi dışarıdan verildi")
    }
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Yüklenen liste

Yüklenen bir liste: iki kenarlı kartın iskeleti. `mediaHeight` kartın göstereceği görselin yerini tutar, `lines` gövdenin satırlarının, `footerButtons` eylemlerin.

Tek başına duran iskelet ekran okuyucuya bir kez, kartın tamamı için duyurulur: temanın "yükleniyor" sözüyle. Zaten yüklendiğini söyleyen bir şeyin içinde bu söz kapatılır: burada yüklendiğini liste bir kez söyler, iskeletlere `contentDescription = null` verildi.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.widthIn
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCardSkeleton
import com.pantrixui.foundation.theme.PantrixTheme

val loading = PantrixTheme.strings.loading
Column(
    modifier = Modifier.widthIn(max = 360.dp).semantics { contentDescription = loading },
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
) {
    repeat(2) {
        PantrixCardSkeleton(
            modifier = Modifier.fillMaxWidth(),
            variant = CardVariant.Outlined,
            lines = 2,
            footerButtons = 1,
            mediaHeight = 96.dp,
            contentDescription = null
        )
    }
}
```

## API

### PantrixCard

`import com.pantrixui.components.container.card.PantrixCard`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCard(
    modifier: Modifier = Modifier,
    variant: CardVariant = CardVariant.Elevated,
    onClick: (() -> Unit)? = null,
    enabled: Boolean = true,
    style: CardStyle? = null,
    shape: Shape = PantrixTheme.style(CardStyle, style).shape.toShape(),
    colors: CardColors? = null,
    contentPadding: PaddingValues = PaddingValues(PantrixTheme.spacing.lg),
    header: (@Composable () -> Unit)? = null,
    media: (@Composable () -> Unit)? = null,
    footer: (@Composable RowScope.() -> Unit)? = null,
    contentDescription: String? = null,
    tagKey: String? = null,
    interactionSource: MutableInteractionSource? = null,
    content: @Composable ColumnScope.() -> Unit
)
```

Tek bir konuyu toplayan kapsayıcı: kendi yüzeyinde bir başlık, bir gövde ve eylemler, üstlerinde kenardan kenara duran bir görsel.

`onClick` verilen kartın tamamı tek bir düğmedir. Bir şey açan bir kartı kurmanın erişilebilir yolu budur: ekran okuyucu tek bir hedef duyurur, kartın yazısıyla ya da `contentDescription`'ıyla; kartın çocuklarından hangisinin gerçek bağlantı olduğunu bulmak kullanıcıya bırakılmaz. `footer`'daki bir düğme kendi basışını korur.

Temanın yüzeyi üstünde, yani yükseltilmiş ve kenarlı kartın durduğu yerde, kart içindekilere renk vermez: her çocuk kendi varsayılanıyla çizilir, bir metin `textPrimary` ile. Bir `CardVariant.Filled` kart ve dolgu olarak bir rolün rengi verilen kart, o dolguda okunan rengi verir. Basılamayan bir kart, yani `onClick`'i olan ve `enabled`'ı false olan kart, içeriğine bunun yerine devre dışı rengi verir; böylece yazısı ve ikonları basılamadığını söyler. Kendi rengini veren bir çocuk o rengi korur.

Kart, eylemleri olsun olmasın, en geniş parçası kadar geniştir. Genişlik verildiğinde, çoğunlukla `fillMaxWidth()` ile, görseli o genişliğe yayılır ve eylemleri bitiş kenarına yaslanır. Yükseklik verildiğinde, bir satırın kartlarına `fillMaxHeight()` ile en uzununun boyu verildiği gibi, gövdesi onu doldurur: eylemleri kartın dibinde durur, gövdede `Modifier.weight(1f)` verilen bir çocuk aradaki yeri alır ve ondan sonra gelenler en altta kalır.

Parametreler:

- `modifier: Modifier`: Kartın modifier'ı.
- `variant: CardVariant`: Kartın durduğu yerden nasıl ayrıldığı: dolgusu, gölgesi ve kenarı.
- `onClick: (() -> Unit)?`: Verildiğinde kartın tamamı tek bir düğme olur ve bir basış, varyantı taşıyan bir `Card` olayı olarak bildirilir.
- `enabled: Boolean`: `onClick`'i olan bir karta basılıp basılamayacağı. `onClick`'i olmayan kart buna bakmaz.
- `style: CardStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer. Yalnızca verdiği alanlar değişir ve her platformda değişir. Kartın köşeleri ve derinliği yoğunlukla ölçeklenmez.
- `shape: Shape`: Kartın köşeleri: varsayılanı, geçerli stilin köşeleridir. Burada verilen şekil, `style`'ın köşelerinin önüne geçer.
- `colors: CardColors?`: Bu kartın kendi renkleri: verdiği renkler kullanılır, gerisi varyantınki kalır.
- `contentPadding: PaddingValues`: Başlığın, gövdenin ve eylemlerin çevresindeki boşluk. Görsel bu boşluğu almaz.
- `header: (@Composable () -> Unit)?`: Gövdenin üstüne çizilir: çoğunlukla kartın başlığıdır.
- `media: (@Composable () -> Unit)?`: İç boşluğu olan içeriğin üstüne, kenardan kenara çizilir; çünkü kartın iç boşluğu kadar içeri çekilmiş bir resim hata gibi görünür.
- `footer: (@Composable RowScope.() -> Unit)?`: Kartın eylemleri; bitiş kenarında bir satırda durur, ana eylem sondadır: orası telefonda başparmağa en yakın yer, geniş bir kartta da gözün okumayı bitirdiği yerdir. İçindekilerden uzun bir kartta kartın dibinde dururlar.
- `contentDescription: String?`: Ekran okuyucunun kart için söylediği. `onClick`'i olan bir kartta, kartın neyi açtığı yazılır.
- `tagKey: String?`: Kartın otomasyon anahtarı: kart `Card_<tagKey>` olarak etiketlenir.
- `interactionSource: MutableInteractionSource?`: Kartın dışarı taşınan etkileşimleri. Null olduğunda kart kendi kaynağını tutar.
- `content: @Composable ColumnScope.() -> Unit`: Kartın gövdesi: çocuklarının arasında `spacing.sm` olan bir sütunda durur. Ağırlık verilen bir çocuk, kartın yüksekliğinin bıraktığı yeri alır.

### PantrixCardSkeleton

`import com.pantrixui.components.container.card.PantrixCardSkeleton`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCardSkeleton(
    modifier: Modifier = Modifier,
    variant: CardVariant = CardVariant.Elevated,
    style: CardStyle? = null,
    shape: Shape = PantrixTheme.style(CardStyle, style).shape.toShape(),
    colors: CardColors? = null,
    skeletonColors: SkeletonColors? = null,
    contentPadding: PaddingValues = PaddingValues(PantrixTheme.spacing.lg),
    showHeader: Boolean = true,
    lines: Int = 3,
    footerButtons: Int = 0,
    mediaHeight: Dp? = null,
    contentDescription: String? = PantrixTheme.strings.loading,
    tagKey: String? = null
)
```

İçeriği henüz gelmemiş bir `PantrixCard`: kartın kendi yüzeyi, başlığının, gövdesinin ve eylemlerinin geleceği yerde çubuklarla.

Bir karta benzetilerek çizilmez; kartın kendi şekli, dolgusu, gölgesi, iç boşluğu ve aralıklarıyla kurulur. Böylece verinin içine geleceği çerçeve baştan yerindedir. Çubukları, yerini tuttukları şey kadar yer kaplar: başlığın çubuğu temanın title stilinde bir satır kadar, gövdenin çubukları bir `PantrixText`'in stil verilmediğinde yazıldığı stilde, yani temanın label stilinde `lines` satır metin kadar, eylemlerin çubukları orta boy düğmeler kadar. O içeriği taşıyan bir kart iskeletiyle aynı yüksekliktedir ve veri geldiğinde altındaki hiçbir şey yerinden oynamaz. İskelet bir kartın içinde ne olduğunu bilemez: `showHeader`, `lines`, `footerButtons` ve `mediaHeight` yerine geçtiği karta göre verilir.

Bir kez, kartın tamamı için duyurulur. Her biri yüklendiğini söyleyen bir düzine çubuk, yüklenen bir listeyi ekran okuyucuyla kullanılmaz hâle getirirdi. Kendisine verilen genişliği doldurur: bir çubuğun kendi genişliği yoktur.

Parametreler:

- `modifier: Modifier`: İskeletin modifier'ı.
- `variant: CardVariant`: Yerine geçtiği kartın varyantı: aynı dolgu, gölge ve kenar.
- `style: CardStyle?`: Bu çağrının kendi `CardStyle`'ı: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Eylemlerin çubukları temanın düğme şeklini korur.
- `shape: Shape`: Kartın köşeleri: varsayılanı, geçerli stilin köşeleridir. Burada verilen şekil, `style`'ın köşelerinin önüne geçer.
- `colors: CardColors?`: Yerine geçtiği kartın renkleri, o kartın kendi renkleri varsa: aynı dolgu ve kenar.
- `skeletonColors: SkeletonColors?`: Çubukların, temadan gelmeyen kendi renkleri.
- `contentPadding: PaddingValues`: Çubukların çevresindeki boşluk; bir kartın içeriğinin çevresindeki gibidir.
- `showHeader: Boolean`: Başlığın yerini bir çubuğun tutup tutmayacağı: temanın title stilinde bir satır kadar.
- `lines: Int`: Çubukların kaç satır metnin yerini tuttuğu; metin, bir `PantrixText`'in stil verilmediğinde yazıldığı stildedir.
- `footerButtons: Int`: Eylemlerin çubuklarının kaç düğmenin yerini tuttuğu.
- `mediaHeight: Dp?`: Kartın, içeriğinin üstünde göstereceği görselin yüksekliği; görseli olmayan bir kart için null.
- `contentDescription: String?`: Ekran okuyucunun iskeletin tamamı için söylediği; zaten yüklendiğini söyleyen bir şeyin içinde null.
- `tagKey: String?`: iskeletin otomasyon anahtarı: iskelet `CardSkeleton_<tagKey>`'dır, çubuklarının kendi etiketleri yoktur. Anahtar yoksa etiketi olmaz.

### CardVariant

`import com.pantrixui.components.container.card.CardVariant`, `com.pantrixui:components` içinden

```kotlin
enum class CardVariant
```

Bir `PantrixCard`'ın durduğu yerden nasıl ayrıldığı.

Değerleri:

- `Elevated`: Yüzey rengindedir ve sayfadan bir gölgeyle yükselir. Varsayılandır. iOS'ta preset'in gölgesi yoktur, kartı yalnızca yüzey rengi ayırır.
- `Filled`: Yükselmez, nötr rolün dolgusuyla renklenir: zaten yükselmiş bir yüzeyin üstündeki kart içindir.
- `Outlined`: Temanın çizgi renginde ince bir kenarla çevrilir: çok gölgenin gürültüye dönüştüğü sık kart listeleri içindir.

### CardStyle

`import com.pantrixui.components.container.card.CardStyle`, `com.pantrixui:components` içinden

```kotlin
class CardStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val elevation: Dp = Dp.Unspecified
) : PantrixStyle<CardStyle>
```

`PantrixCard`'ın geometrisi: köşeleri ve yükseltilmiş varyantının gölgesi.

iOS'ta kart düzdür ve köşesi daha büyüktür, çünkü iOS yüzeyleri gölgeyle değil, dolgularının kontrastıyla ayrılır. İki değer de yoğunlukla ölçeklenmez: köşe ve gölge hava değildir. Bir kartın renkleri stilinin parçası değildir: `CardVariant`'ından, kendi renkleri olan bir kartta ise `CardColors`'tan gelir.

Parametreler:

- `shape: ShapeSpec`: Kartın köşeleri: Android'de orta, iOS'ta büyük, masaüstünde ve web'de küçük.
- `elevation: Dp`: `CardVariant.Elevated`'ın altındaki gölge: Android'de 2dp, iOS'ta yok, masaüstünde ve web'de 1dp. Öteki varyantlar gölge çizmez.

### CardColors

`import com.pantrixui.components.container.card.CardColors`, `com.pantrixui:components` içinden

```kotlin
data class CardColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

Varyantının renklerini almayan bir `PantrixCard`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen varyantınki kalır.

```kotlin
PantrixCard(colors = CardColors(container = brand.container, content = brand.onContainer)) {
    PantrixText(text = stringResource(Res.string.new_feature))
}
```

Çalıştıramadığı bir eylemi olan kart, yani `onClick`'i olan ve `enabled`'ı false olan kart, `content` ne olursa olsun içeriğine yine temanın devre dışı rengini verir.

Burada verilen dolgu temanın kendi renklerinden biriyse, üstüne çizilenlerin rengi de ayrıca verilmediği sürece, temanın o dolguyla eşleştirdiği rengi getirir. Hiçbir rolde olmayan bir dolgu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Kartın dolgusu. Temanın `surface`'ıdır; bir `CardVariant.Filled` kartta nötr rolün `container`'ıdır.
- `content: Color`: Kartın tuttuklarının, kendi rengini vermeyen bir çocuğun, çizildiği renk. Verilmezse `container`'ın üstünde okunan renktir: temanın `surface`'ında hiçbiri, orada her çocuk kendi varsayılanıyla çizilir, bir yazı `textPrimary` ile; dolgulu bir kartta nötr rolün `onContainer`'ı; temanın `background`'ında `textPrimary`; bir rolün renginde de temanın onunla eşlediği renk.
- `border: Color`: Kartın çevresindeki ince kenar. Bir `CardVariant.Outlined` kartta temanın `divider`'ıdır; o karta temanın zeminlerinden olmayan, o çizginin okunmayacağı bir dolgu verildiğinde ise orada yazılan rengin bir payıdır: Subtle düğmenin kenarı gibi. Öteki varyantların, burada verilmedikçe, ince kenarı yoktur.
