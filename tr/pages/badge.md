# Badge

Bir şeyin üstünde duran küçük bir işaret: bir sayı ya da yalnızca bir nokta. Okunmamış mesajları, bekleyen bildirimleri, bir kişinin çevrimiçi olup olmadığını söyler. Kendi başına bir şey anlatmaz; üstünde durduğu ikonla ya da avatarla birlikte okunur.

- `PantrixBadge` (`com.pantrixui.components.elements.badge`, `com.pantrixui:components`): Başka bir öğe için bir sayı ya da durum noktası; açıklama verilmedikçe ekran okuyuculardan gizlenir. Anahtar sözcükler: rozet, sayı, bildirim noktası, durum noktası, gösterge, okunmamış, sayaç.
- `PantrixBadgedBox` (`com.pantrixui.components.elements.badge`, `com.pantrixui:components`): İçeriğinin bir köşesine, çevresindeki kutuya ya da içindeki daireye bir rozet koyar; içeriğin boyutunu değiştirmez. Anahtar sözcükler: ikon üstünde rozet, bildirim rozeti, sayılı ikon, köşe rozeti.

## Özellikler

- **Sayı ya da nokta.** `count` verilirse sayıyı yazan bir haptır, verilmezse bir nokta. Tek haneli sayı bir dairenin içindedir.
- **Taşan sayı.** `maxCount`'u aşan sayı "99+" diye yazılır ve hap orada büyümeyi bırakır.
- **Sıfır da bir sayıdır.** Sıfır "0" olarak çizilir: sayacak bir şey kalmadığında rozeti kaldırmak çağıranın işidir. Sıfırın altındaki bir sayı da "0" olur.
- **Altı ton.** `tone` rozeti temanın bir rolüyle doldurur; `colors` rol dışı bir renk verir.
- **Bir şeyin köşesinde.** `PantrixBadgedBox` rozeti içeriğinin köşesine oturtur; yuvarlak bir içerikte kutunun değil çemberin üstüne (`BadgeOverlap.Circular`).
- **Ekran okuyucu.** `contentDescription` verilmeyen rozet okuyucudan gizlidir: tek başına okunan bir "3" bir şey anlatmaz, sayıyı üstünde durduğu öğenin açıklaması söyler.
- **Yazı ölçeği.** Sayı temanın `caption` stiliyle yazılır ve sistemin yazı boyutuyla birlikte büyür, hap da onunla.

## Kullanım

### An unread count on an icon, which the icon says

```kotlin
PantrixBadgedBox(badge = { PantrixBadge(count = unread, tagKey = "unread") }) {
    PantrixIcon(
        imageVector = PantrixIcons.Inbox,
        contentDescription = pluralStringResource(Res.plurals.inbox_unread, unread, unread)
    )
}
```

### A status dot that says what it means

```kotlin
PantrixBadge(tone = BadgeTone.Success, contentDescription = stringResource(Res.string.online))
```

### In colours of its own

```kotlin
PantrixBadge(
    count = offers,
    colors = BadgeColors(container = campaign.color, content = campaign.onColor),
    contentDescription = stringResource(Res.string.new_offers, offers)
)
```

### A count on a tab's icon

```kotlin
PantrixBadgedBox(badge = { if (unread > 0) PantrixBadge(count = unread) }) {
    PantrixIcon(imageVector = PantrixIcons.Inbox, contentDescription = null)
}
```

### A status dot on a round avatar, at the bottom where lines end

```kotlin
PantrixBadgedBox(
    badge = { PantrixBadge(tone = BadgeTone.Success, contentDescription = stringResource(Res.string.online)) },
    alignment = Alignment.BottomEnd,
    overlap = BadgeOverlap.Circular
) {
    PantrixAvatar(contentDescription = member.name, initials = member.initials)
}
```

## Örnekler

### Nokta ve sayı

`count` verilmeyen rozet bir noktadır; verilen, sayısıyla birlikte genişleyen bir hap. Tek haneli sayı tam bir dairedir, hap hiçbir zaman boyundan dar olmaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixBadge()
    PantrixBadge(count = 3)
    PantrixBadge(count = 12)
    PantrixBadge(count = 128)
}
```

### Taşan sayı

`maxCount`'u aşan sayı yazılmaz, yerine sınır ve bir artı yazılır: varsayılan sınır 99'dur. Hap orada büyümeyi bırakır ve üstünde durduğu ikonu örtmez. Son rozetin sınırı 9'dur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixBadge(count = 99)
    PantrixBadge(count = 100)
    PantrixBadge(count = 2500)
    PantrixBadge(count = 12, maxCount = 9)
}
```

### Tonlar

`tone` rozeti temanın bir rolünün rengiyle doldurur ve sayıyı o rengin üstünde okunan renkle yazar. Varsayılan ton `Danger`'dır: bir rozet çoğunlukla bakılması gereken bir şeyi söyler. Üst satırda her tonda bir sayı, altta her tonda bir nokta var.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.BadgeTone
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    itemVerticalAlignment = Alignment.CenterVertically
) {
    BadgeTone.entries.forEachIndexed { index, tone ->
        PantrixBadge(count = TONE_COUNTS[index], tone = tone, tagKey = "tone_${tone.name}")
    }
}
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)) {
    BadgeTone.entries.forEach { tone -> PantrixBadge(tone = tone) }
}

private val TONE_COUNTS = listOf(1, 12, 5, 8, 120, 0)
```

### Bir ikonun köşesinde

`PantrixBadgedBox` rozeti içeriğinin köşesine oturtur: varsayılan köşe, satırın bittiği yandaki üst köşedir.

Rozet okuyucudan gizlidir; sayıyı ikonun kendi açıklaması söyler ("Gelen kutusu, 5 okunmamış"). Sayı sıfıra inince rozet hiç konmaz: bunu rozet değil, çağıran yapar. Düğmelerle sayıyı artır: 99'u geçince "99+" olur ve hap ikonun dışına doğru uzar.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.components.elements.badge.PantrixBadgedBox
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

var unread by rememberSaveable { mutableIntStateOf(START_UNREAD) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.lg),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixBadgedBox(badge = { if (unread > 0) PantrixBadge(count = unread, tagKey = "unread") }) {
        PantrixIcon(
            imageVector = PantrixIcons.Inbox,
            contentDescription = if (unread > 0) "Gelen kutusu, $unread okunmamış" else "Gelen kutusu",
            tagKey = "inbox"
        )
    }
    PantrixButton(
        text = "+1",
        onClick = { unread += 1 },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "one_more"
    )
    PantrixButton(
        text = "+50",
        onClick = { unread += MANY },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "many_more"
    )
    PantrixButton(
        text = "Okundu",
        onClick = { unread = 0 },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        tagKey = "read"
    )
}

private const val START_UNREAD = 5

private const val MANY = 50
```

### Avatarların üstünde

Yuvarlak bir içerikte rozet kutunun köşesinde değil çemberin üstünde durur: `overlap = BadgeOverlap.Circular`. `alignment` hangi köşe olduğunu söyler; durum noktası altta, satırın bittiği yandadır.

Durum noktaları `BadgeStyle(dotSize = 12.dp)` ile büyütüldü: bir avatarın üstünde seçilecek kadar. Noktanın ne anlama geldiğini avatarın açıklaması söyler ("İbrahim Öztürk, çevrimiçi"); nokta okuyucudan gizlidir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.badge.BadgeOverlap
import com.pantrixui.components.elements.badge.BadgeStyle
import com.pantrixui.components.elements.badge.BadgeTone
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.components.elements.badge.PantrixBadgedBox
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val statusDot = BadgeStyle(dotSize = 12.dp)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xl)) {
    PantrixBadgedBox(
        badge = { PantrixBadge(count = 2, tagKey = "messages") },
        overlap = BadgeOverlap.Circular
    ) {
        PantrixAvatar(contentDescription = "Ayşe Yılmaz, 2 yeni mesaj", initials = "AY", tagKey = "badged_ayse")
    }
    PantrixBadgedBox(
        badge = { PantrixBadge(tone = BadgeTone.Success, style = statusDot, tagKey = "online") },
        alignment = Alignment.BottomEnd,
        overlap = BadgeOverlap.Circular
    ) {
        PantrixAvatar(
            contentDescription = "İbrahim Öztürk, çevrimiçi",
            initials = "İÖ",
            tone = AvatarTone.Info,
            tagKey = "badged_ibrahim"
        )
    }
    PantrixBadgedBox(
        badge = { PantrixBadge(tone = BadgeTone.Neutral, style = statusDot, tagKey = "offline") },
        alignment = Alignment.BottomEnd,
        overlap = BadgeOverlap.Circular
    ) {
        PantrixAvatar(
            contentDescription = "ilker kaya, çevrimdışı",
            initials = "ik",
            tone = AvatarTone.Success,
            tagKey = "badged_ilker"
        )
    }
    PantrixBadgedBox(
        badge = { PantrixBadge(count = MANY * 3, tagKey = "team") },
        overlap = BadgeOverlap.Circular
    ) {
        PantrixAvatar(
            contentDescription = "Ekip, 99'dan fazla yeni mesaj",
            icon = PantrixIcons.Person,
            tone = AvatarTone.Primary,
            tagKey = "badged_team"
        )
    }
}

private const val MANY = 50
```

### Kendi rengi ve kendi açıklaması

`colors` rozete bir tonun değil, verilen rengin dolgusunu verir: burada temanın hiçbir rolünde olmayan, uygulamanın kendi moru. Yalnızca verilen alanlar değişir; verilmeyeni yine ton belirler.

Bu rozetler tek başına durur, bir ikonun üstünde değil. Bu yüzden ne söylediklerini kendileri söyler: `contentDescription` verildi ve ekran okuyucu "4 yeni teklif" diye okur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.badge.BadgeColors
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixBadge(count = 3, contentDescription = "3 yeni bildirim", tagKey = "described")
    PantrixBadge(
        count = 4,
        colors = BadgeColors(container = own.color, content = own.onColor),
        contentDescription = "4 yeni teklif",
        tagKey = "own_colors"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Bir yazının yanında

Rozet bir yazının üstünde de durabilir. `PantrixBadgedBox` içeriğinin satır çizgisini korur: `alignByBaseline` ile "yeni" etiketi yanındaki başlıkla aynı satırda durur, nokta da etiketin köşesinde.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.badge.BadgeTone
import com.pantrixui.components.elements.badge.PantrixBadge
import com.pantrixui.components.elements.badge.PantrixBadgedBox
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixText(
        text = "Kampanyalar",
        modifier = Modifier.alignByBaseline(),
        style = PantrixTheme.typography.callout
    )
    PantrixBadgedBox(
        badge = { PantrixBadge(tone = BadgeTone.Primary, tagKey = "new") },
        modifier = Modifier.alignByBaseline()
    ) {
        PantrixText(text = "yeni", style = PantrixTheme.typography.footnote)
    }
}
```

## API

### PantrixBadge

`import com.pantrixui.components.elements.badge.PantrixBadge`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixBadge(
    modifier: Modifier = Modifier,
    count: Int? = null,
    maxCount: Int = 99,
    tone: BadgeTone = BadgeTone.Danger,
    colors: BadgeColors? = null,
    style: BadgeStyle? = null,
    contentDescription: String? = null,
    tagKey: String? = null
)
```

Bir sayı ya da bir durum noktası. Çoğunlukla `PantrixBadgedBox` ile başka bir öğenin üstüne konur.

`count` verilmeyen rozet bir noktadır. Verilen rozet sayısıyla birlikte büyüyen bir haptır, tek hanenin çevresinde ise bir daire. `maxCount`'un üstünde o sayıyı ve bir artıyı yazar, varsayılan olarak `99+`, ve büyümeyi bırakır. Sıfır `0` olarak çizilir: sayacak bir şey olmadığında rozeti kaldırmak çağıranın işidir. Sıfırın altındaki bir sayı da `0` olarak çizilir: sunucudan yanlış gelen bir sayı uygulamayı çökertmek için sebep değildir.

Sayı temanın caption stiliyle yazılır ve yazı ölçeğiyle birlikte büyür, hap da onunla. Hap her zaman en az yüksekliği kadar geniştir.

`contentDescription` verilmeyen rozet ekran okuyucudan gizlenir. Bir ikonun ardından tek başına okunan bir "3" bir şey söylemez. Bu yüzden sayıyı rozetin üstünde durduğu şey söylemelidir: "Gelen kutusu, 3 okunmamış". Rozet yalnızca tek başına durduğu yerde kendi adına bir şey söyler. Rozet basılmaz ve dokunma hedefi yoktur.

Parametreler:

- `modifier: Modifier`: Rozetin modifier'ı.
- `count: Int?`: Gösterilecek sayı; nokta için null.
- `maxCount: Int`: Olduğu gibi yazılan en büyük sayı. Pozitif olmalıdır.
- `tone: BadgeTone`: Rozetin dolgusunu veren renk rolü.
- `colors: BadgeColors?`: Bu rozetin, tonunun renkleri yerine geçen kendi renkleri. Verdiği renkler kullanılır, gerisi tonundan gelir.
- `style: BadgeStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `contentDescription: String?`: Ekran okuyucunun rozet için söylediği. Rozeti okuyucudan gizlemek için null.
- `tagKey: String?`: Rozetin otomasyon anahtarı: rozet `Badge_<tagKey>` etiketini taşır ve yalnızca anahtar verildiğinde etiketlenir.

### PantrixBadgedBox

`import com.pantrixui.components.elements.badge.PantrixBadgedBox`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixBadgedBox(
    badge: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    alignment: Alignment = Alignment.TopEnd,
    overlap: BadgeOverlap = BadgeOverlap.Rectangular,
    content: @Composable () -> Unit
)
```

`badge`'i `content`'in üstüne, ortası bir köşesine gelecek şekilde koyar ve rozet için yer ayırmaz.

Kutu `content` kadar büyüktür. Rozet kutunun kenarından dışarı taşar ve hiçbir şeyi itmez. Bu yüzden gelip giden bir rozet çevresindeki hiçbir şeyi oynatmaz. Kırpan bir üst öğe taşan kısmı keser. Rozet, neyin üstünde durursa dursun, sayısı kadar büyüktür. `content`'in satır çizgisi kutunun da satır çizgisidir, böylece rozetli bir etiket yanındaki yazıyla aynı hizada durur. Yüksekliğinden geniş bir rozetin yuvarlak ucu köşeye oturur ve rozet içerikten dışarı doğru büyür, her platformda bir sekmenin rozetinin yaptığı gibi: üç hane bir ikonun, tek hanenin örttüğünden fazlasını örtmez.

`alignment` hangi köşe ya da hangi kenar olduğunu söyler: varsayılanı satırların bittiği yandaki üst köşedir, sağdan sola düzende bu sol üst köşedir. `overlap` köşelerin neyin köşeleri olduğunu söyler. Kutu ikonun kendisinin çevresine konur: dokunma hedefiyle birlikte bir düğme gibi daha büyük bir şeyin köşesi, çizilenden uzaktadır.

Parametreler:

- `badge: @Composable () -> Unit`: İçeriğin üstüne konan şey: çoğunlukla bir `PantrixBadge`. Gösterilecek bir şey yoksa hiçbir şey.
- `modifier: Modifier`: Kutunun modifier'ı.
- `alignment: Alignment`: Rozetin ortasının `content` üstünde nerede olduğu.
- `overlap: BadgeOverlap`: Bu yerin `content`'in çevresindeki kutunun mu, içindeki çemberin mi üstünde olduğu.
- `content: @Composable () -> Unit`: Rozetin ait olduğu şey.

### BadgeTone

`import com.pantrixui.components.elements.badge.BadgeTone`, `com.pantrixui:components` içinden

```kotlin
enum class BadgeTone
```

Rozetin nasıl renklendiği: temanın renk rollerinden biriyle. Böylece bir marka bütün rozetleri birden değiştirir.

Rozet her tonda rolün `color` ve `onColor` renkleriyle dolu çizilir. Birkaç milimetre genişliğinde bir işarettir ve inceliğe yeri yoktur: rolün soluk `container` rengi üstünde bir sayı rozet gibi değil, ortada kalmış bir rakam gibi okunur, bir noktanın ise üstünde kontrast kuracak hiçbir şeyi yoktur.

Değerleri:

- `Primary`: Markanın rengi: iyi haber olan ya da telaşa gerek olmadan fark edilecek bir sayı.
- `Info`: Bilmeye değer bir şey: bir öğe sayısı, yeni bir kayıt.
- `Success`: Başarıyla biten ya da yolunda olan bir şey: bitmiş bir iş, çevrimiçi olan biri.
- `Warning`: Soruna dönüşmeden önce bakılması gereken bir şey.
- `Danger`: Dikkat isteyen bir şey: okunmamış mesajlar, hatalar. Varsayılan budur, her platformun kendi rozetinde olduğu gibi.
- `Neutral`: Hiç aciliyeti olmayan bir sayı.

### BadgeOverlap

`import com.pantrixui.components.elements.badge.BadgeOverlap`, `com.pantrixui:components` içinden

```kotlin
enum class BadgeOverlap
```

Bir `PantrixBadgedBox` içinde rozetin, ait olduğu şeyin üstünde nasıl durduğu.

Değerleri:

- `Rectangular`: Ait olduğu şeyin çevresindeki kutunun üstünde: köşesinde ya da kenarında. Bir ikon, bir etiket, köşeli bir resim için. Varsayılan.
- `Circular`: O kutunun içindeki çemberin üstünde. Yuvarlak bir avatar için: avatarın kendi kenarı kutusunun köşelerinin epey içindedir, köşedeki bir rozet avatarın üstünde değil yanında asılı kalırdı.

### BadgeStyle

`import com.pantrixui.components.elements.badge.BadgeStyle`, `com.pantrixui:components` içinden

```kotlin
class BadgeStyle(
    public val dotSize: Dp = Dp.Unspecified,
    public val height: Dp = Dp.Unspecified,
    public val minWidth: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified
) : PantrixStyle<BadgeStyle>
```

`PantrixBadge`'in geometrisi: sayacak bir şey yoksa bir nokta, varsa sayısıyla birlikte büyüyen bir hap.

Hap 16dp yüksekliğinde, nokta 6dp çapındadır: Material 3'ün büyük ve küçük rozeti gibi. iOS'ta, sekme çubuğunun rozeti örnek alınarak, biraz daha büyüktür. Hap her platformda en az yüksekliği kadar geniştir, bu yüzden tek hane bir dairenin içinde durur.

Hapın yüksekliği, en az genişliği ve iç boşluğu yoğunluğu izler, çünkü bunlar sayının çevresindeki yerdir. Nokta izlemez: o bir işarettir ve daha sık bir ekranla birlikte küçülen bir işaret, bakılacak şeyin daha çok olduğu yerde daha zor görülürdü.

Parametreler:

- `dotSize: Dp`: Noktanın genişliği ve yüksekliği.
- `height: Dp`: Hapın yüksekliği. Büyük bir yazı ölçeğinde hapa sığmayacak kadar büyük yazılan sayı hapı yükseltir.
- `minWidth: Dp`: Hapın en az genişliği. Bu ne derse desin, hap hiçbir zaman yüksekliğinden dar olmaz.
- `horizontalPadding: Dp`: Sayının iki yanındaki boşluk. Sayı büyüdükçe hapı yüksekliğinden geniş yapan budur.

### BadgeColors

`import com.pantrixui.components.elements.badge.BadgeColors`, `com.pantrixui:components` içinden

```kotlin
data class BadgeColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

Tonunun renklerini almayan bir rozet için `PantrixBadge`'in boyandığı renkler: verilen renk kullanılır, verilmeyen tonun renginde kalır.

```kotlin
PantrixBadge(count = offers, colors = BadgeColors(container = brand, content = onBrand))
```

Burada verilen dolgu temanın kendi renklerinden biriyse, üstüne çizilenlerin rengi de ayrıca verilmediği sürece, temanın o dolguyla eşleştirdiği rengi getirir. Hiçbir rolde olmayan bir dolgu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Rozetin dolgusu, bir noktanın ise tamamı. Tonun rolünün `color` rengi.
- `content: Color`: Sayı: `container` üstünde okunan renk. Tonun rolünün `onColor` rengi.
