# Avatar

Bir kişinin ya da bir şeyin resmi: bir fotoğraf, bir adın baş harfleri ya da ikisinin yerini tutan bir ikon. Bir liste satırında adın yanında, bir yorumun başında, bir profilin tepesinde durur.

Avatar çizilir, basılmaz. Bir profili açan avatar, basışı alan şeyin içine konur: bir düğmenin, bir liste satırının.

- `PantrixAvatar` (`com.pantrixui.components.elements.avatar`, `com.pantrixui:components`): Bir kişinin ya da bir şeyin resmi: uygulamanın yüklediği bir fotoğraf, altında onun yerini tutan bir adın baş harfleri ya da bir ikon. Anahtar sözcükler: profil resmi, kullanıcı resmi, baş harfler, kullanıcı fotoğrafı, hesap.

## Özellikler

- **Baş harfler, ikon ya da hiçbiri.** `initials` verilirse onlar çizilir; verilmezse `icon`; ikisi de yoksa avatar tonunun rengiyle dolu, düz bir şekildir.
- **Fotoğraf.** Pantrix resim yüklemez. `image` bir yuvadır: uygulama resmi kendi yükleyicisiyle, bir kaynaktan ya da kendi çizimiyle oraya koyar. Resim baş harflerin üstüne çizilir: yüklenirken ve yüklenemediğinde harfler görünür.
- **Altı ton.** `tone` avatarı temanın bir rolünün rengiyle doldurur; `colors` rol dışı bir renk verir. Ton tek başına bir şey söylemez: ekran okuyucu rengi değil açıklamayı okur.
- **Boyut.** `size` ya da `modifier` avatarın boyutunu verir. Baş harfler ve ikon avatarın bir payıdır: her boyutta oranını korur. Stildeki boyut Android'de ve iOS'ta 40dp, masaüstünde ve web'de 32dp'dir.
- **Şekil.** Avatar her platformda bir dairedir; `AvatarStyle(shape = ...)` köşelerini değiştirir.
- **Yazıldığı gibi.** Baş harfler büyük harfe çevrilmez. İlk iki harf tutulur, aralarındaki boşluklar atılır.
- **Ekran okuyucu.** `contentDescription` verilen avatar o adla, bir görsel olarak okunur. Null verilen gizlenir: yanında adı yazan avatar için doğrusu budur. Baş harfler hiçbir zaman okunmaz.
- **Yazı ölçeği.** Baş harfler sistemin yazı boyutu büyütülünce de payını korur: avatar çevresindeki yazıyla birlikte büyümez.

## Kullanım

### Initials beside a name that is already read

```kotlin
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixAvatar(contentDescription = null, initials = member.initials)
    PantrixText(text = member.name)
}
```

### A photograph the app loads, over initials that show until it is there

```kotlin
PantrixAvatar(contentDescription = member.name, initials = member.initials, tagKey = member.id) {
    AsyncImage(model = member.photoUrl, contentDescription = null, contentScale = ContentScale.Crop)
}
```

### An icon in the brand's colour, large, at the top of a profile

```kotlin
PantrixAvatar(
    contentDescription = stringResource(Res.string.your_account),
    icon = PantrixIcons.Person,
    tone = AvatarTone.Primary,
    size = 72.dp
)
```

### A team in its own colour

```kotlin
PantrixAvatar(
    contentDescription = team.name,
    initials = team.initials,
    colors = AvatarColors(container = team.color, content = team.onColor)
)
```

## Örnekler

### En yalın hâli

En az yazılan hâli: bir açıklama ve baş harfler. Tonu `Neutral`'dır, boyutu stilin boyutu.

Tek başına duran avatar adını açıklamasından alır: ekran okuyucu onu "Ayşe Yılmaz" adında bir görsel olarak okur. "AY" harfleri okunmaz; onlar açıklamanın kısaltmasıdır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.PantrixAvatar

PantrixAvatar(contentDescription = "Ayşe Yılmaz", initials = "AY", tagKey = "ayse")
```

### Bir adın yanında

Adının yanında duran avatarın açıklaması yoktur: `contentDescription = null`. Ad yanında yazar; ekran okuyucu aynı adı iki kez okumaz ve avatar ondan gizlenir.

Baş harfler yazıldığı gibi çizilir, büyük harfe çevrilmez: son satırdaki "ik" küçük kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

CONTACTS.forEachIndexed { index, contact -> ContactRow(contact = contact, key = "contact_$index") }

@Composable
private fun ContactRow(
    contact: AvatarContact,
    key: String
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        PantrixAvatar(contentDescription = null, initials = contact.initials, tone = contact.tone, tagKey = key)
        Column {
            PantrixText(text = contact.name, style = PantrixTheme.typography.label)
            PantrixText(
                text = contact.lastTransfer,
                style = PantrixTheme.typography.footnote,
                color = PantrixTheme.colors.textSecondary
            )
        }
    }
}

private class AvatarContact(
    val name: String,
    val initials: String,
    val lastTransfer: String,
    val tone: AvatarTone = AvatarTone.Neutral
)

private val CONTACTS = listOf(
    AvatarContact(name = "Ayşe Yılmaz", initials = "AY", lastTransfer = "Dün 250,00 TL gönderildi"),
    AvatarContact(
        name = "İbrahim Öztürk",
        initials = "İÖ",
        lastTransfer = "3 Eylül'de 1.200,00 TL alındı",
        tone = AvatarTone.Info
    ),
    // Baş harfler yazıldığı gibi çizilir: küçük yazılan küçük kalır.
    AvatarContact(name = "ilker kaya", initials = "ik", lastTransfer = "Henüz işlem yok", tone = AvatarTone.Success)
)
```

### Tonlar

`tone` avatarı temanın bir rolünün rengiyle doldurur ve harfleri o rengin üstünde okunan renkle yazar. Varsayılan `Neutral`'dır: hiçbir anlamı olmayan bir gri.

Avatar her tonda rolün dolu rengiyle çizilir, soluk `container` rengiyle değil: o renkte küçük bir daire açık bir sayfada kaybolur. Ton tek başına bir şey söylemez; bir rengin ne anlama geldiği yanındaki sözlerde yazmalıdır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.theme.PantrixTheme

FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    AvatarTone.entries.forEachIndexed { index, tone ->
        PantrixAvatar(
            contentDescription = "${tone.name} tonunda avatar",
            initials = TONE_INITIALS[index],
            tone = tone,
            tagKey = "tone_${tone.name}"
        )
    }
}

private val TONE_INITIALS = listOf("AL", "GH", "KJ", "MR", "ŞÖ", "WY")
```

### Boyutlar

`size` avatarın genişliği ve yüksekliğidir: bir yorumda 24dp, sık bir satırda 32dp, bir satırda 40dp, bir kartta 56dp, bir profilde 72dp. Boyut `modifier` ile de verilebilir; o zaman `size`'ın yerine geçer.

Baş harfler avatarın onda dördü, ikon onda altısı kadardır: boyut ne olursa olsun oran aynı kalır, ayrı bir stil gerekmez.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.theme.PantrixTheme

Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm),
    verticalAlignment = Alignment.CenterVertically
) {
    listOf(24, 32, 40, 56, 72).forEach { size ->
        PantrixAvatar(
            contentDescription = null,
            initials = "DK",
            tone = AvatarTone.Primary,
            size = size.dp,
            tagKey = "size_$size"
        )
    }
}
```

### Baş harfler

Baş harfler yazıldığı gibi çizilir. Büyük harfe çevrilmez: `i` Türkçede `İ`, başka dillerde `I` olur ve avatar bir adı yanlış yazacak yer değildir. İlk avatara "ik" verildi, öyle kaldı.

Verilenin ilk iki harfi tutulur, aralarındaki boşluklar atılır: "Ayşe Yılmaz" verilen avatar "Ay", "D K" verilen "DK" yazar. Bir adın nasıl kısaltılacağını avatar değil, uygulama söyler: çizilecek harfleri o verir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixAvatar(contentDescription = "ilker kaya", initials = "ik", tagKey = "as_written")
    PantrixAvatar(contentDescription = "Ayşe Yılmaz", initials = "Ayşe Yılmaz", tagKey = "first_two")
    PantrixAvatar(contentDescription = "Deniz Kara", initials = "D K", tagKey = "without_spaces")
    PantrixAvatar(contentDescription = "Zeynep", initials = "Z", tagKey = "one_letter")
}
```

### Sonradan gelen fotoğraf

Fotoğrafı sonradan gelen bir profil. `image` yuvası avatara baştan verilir, ama "Fotoğrafı yükle"ye basılana kadar hiçbir şey çizmez: o sırada baş harfler görünür. Fotoğraf gelince harflerin üstünü örter. Bir görsel yükleyicinin yüklerken ya da hata verdiğinde yaptığı da budur.

Yuva avatarın boyutundadır ve onun şekline kesilir. Buradaki "fotoğraf" kendi boyutu olmayan bir renk geçişidir; kare olmayan bir resim için `ContentScale.Crop` istenir. Resmin kendi açıklaması okunmaz: avatarınki ikisinin yerine geçer.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.painter.BrushPainter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var loaded by rememberSaveable { mutableStateOf(false) }
Row(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalAlignment = Alignment.CenterVertically
) {
    PantrixAvatar(
        contentDescription = "Deniz Kara'nın profil fotoğrafı",
        initials = "DK",
        tone = AvatarTone.Primary,
        size = 72.dp,
        tagKey = "profile"
    ) {
        if (loaded) Photo()
    }
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        PantrixText(text = "Deniz Kara", style = PantrixTheme.typography.callout)
        PantrixButton(
            text = if (loaded) "Fotoğrafı kaldır" else "Fotoğrafı yükle",
            onClick = { loaded = !loaded },
            variant = ButtonVariant.Outline,
            tagKey = "load_photo"
        )
    }
}

@Composable
private fun Photo() {
    val colors = PantrixTheme.colors
    val gradient = remember(colors) {
        BrushPainter(Brush.linearGradient(listOf(colors.warning.color, colors.danger.color, colors.primary.color)))
    }
    PantrixImage(painter = gradient, contentScale = ContentScale.Crop, contentDescription = null)
}
```

### İkonlu ve boş avatar

Baş harfi olmayan avatar `icon`'unu çizer: bir kişi, bir grup, bir şirket. İkon, harfler gibi, tonun üstünde okunan renkle çizilir.

İkincisine ne harf ne ikon verildi: tonunun rengiyle dolu, düz bir dairedir. Adını yine açıklaması söyler.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixAvatar(contentDescription = "Ortak hesap", icon = PantrixIcons.Person, tagKey = "shared")
    PantrixAvatar(contentDescription = "Adı bilinmeyen kişi", tagKey = "unknown")
}
```

### Köşeli avatar

Avatar her platformda bir dairedir. `style` yalnızca bu avatarın stilini değiştirir: `AvatarStyle(shape = ...)` köşeleri temanın şekil ölçeğinin bir basamağına çeker. Burada bir klasörün ve bir şirketin avatarı `ShapeRole.Medium` ile köşeli çizildi.

Yalnızca verilen alan değişir: boyut ve harflerin payı temanın stilinden gelir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.AvatarStyle
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val rounded = AvatarStyle(shape = ShapeRole.Medium)
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixAvatar(
        contentDescription = "Belgeler",
        icon = PantrixIcons.Folder,
        tone = AvatarTone.Info,
        style = rounded
    )
    PantrixAvatar(
        contentDescription = "Pantrix A.Ş.",
        initials = "PX",
        tone = AvatarTone.Primary,
        style = rounded,
        tagKey = "company"
    )
}
```

### Saydam bir logo

Bir yanı saydam olan resim altındakini gösterir. Böyle bir resim tek başına, baş harfsiz ve ikonsuz verilir: bu logonun arkasında yalnızca tonun rengi durur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.AvatarTone
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.image.PantrixImage
import org.jetbrains.compose.resources.painterResource
import pantrixui.app.shared.generated.resources.Res
import pantrixui.app.shared.generated.resources.compose_multiplatform

PantrixAvatar(contentDescription = "Compose Multiplatform", tone = AvatarTone.Primary, tagKey = "logo") {
    PantrixImage(painter = painterResource(Res.drawable.compose_multiplatform), contentDescription = null)
}
```

### Kendi rengi

`colors` avatara bir tonun değil, verilen rengin dolgusunu verir: bir ekibin ya da bir etiketin kendi rengi gibi. İlk avatarın rengi temanın hiçbir rolünde yok; dolgusu da harflerinin rengi de verildi, çünkü temanın tanımadığı bir dolgunun üstünde neyin okunduğunu ancak veren bilir.

İkincisine yalnızca dolgu verildi ve o temanın kendi renklerinden biri, `success.container`. Harflerin rengi kendiliğinden temanın o dolguyla eşlediği renk olur.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.avatar.AvatarColors
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.foundation.theme.PantrixTheme

val own = ownColors()
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixAvatar(
        contentDescription = "Tasarım ekibi",
        initials = "TE",
        colors = AvatarColors(container = own.color, content = own.onColor),
        tagKey = "team"
    )
    PantrixAvatar(
        contentDescription = "Destek ekibi",
        initials = "DE",
        colors = AvatarColors(container = PantrixTheme.colors.success.container),
        tagKey = "support_team"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

## API

### PantrixAvatar

`import com.pantrixui.components.elements.avatar.PantrixAvatar`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixAvatar(
    contentDescription: String?,
    modifier: Modifier = Modifier,
    initials: String? = null,
    icon: ImageVector? = null,
    tone: AvatarTone = AvatarTone.Neutral,
    colors: AvatarColors? = null,
    style: AvatarStyle? = null,
    size: Dp = PantrixTheme.style(AvatarStyle, style).size,
    tagKey: String? = null,
    image: (@Composable () -> Unit)? = null
)
```

Bir kişinin ya da bir şeyin resmi: bir fotoğraf, bir adın baş harfleri ya da ikisinin yerini tutan bir ikon.

Avatar `initials`'ını, o yoksa `icon`'unu, `tone`'unun üstüne çizer. İkisi de yoksa tonunun rengiyle dolu, düz bir şekildir. Resim bunların üstüne çizilir. Bu yüzden resim yüklenirken ve yüklenemediğinde baş harfler görünür, resim gelince üstleri örtülür. Saydam yerleri olan bir resim, o yerlerin altındakini gösterir: böyle bir resim tek başına, baş harfsiz ve ikonsuz verilir.

Pantrix resim yüklemez. `image` bir yuvadır, böylece uygulama resmi zaten kullandığı şeyle çizer: bir görsel yükleyiciyle, bir kaynağı gösteren bir `PantrixImage` ile ya da kendi çizimiyle. Yuva avatarın boyutundadır ve onun şekline kesilir. Kare olmayan bir resim kendi kuralına göre sığdırılır, bu yüzden `ContentScale.Crop` istenir.

Baş harfler yazıldığı gibi çizilir. Büyük harfe çevrilmez: `i` Türkçede `İ`, başka her yerde `I` olur ve avatar bir adı yanlış yazacak yer değildir. Ne çizilecekse o verilir. Verilenin iki harfi tutulur, aralarındaki boşluklar atılır. Bir adın nasıl kısaltılacağını söylemek uygulamanın ve dilinin işidir.

Baş harfler ve ikon avatarın bir payıdır. Bu yüzden avatar, boyutu `size` ile de `modifier` ile de verilse, her boyutta oranlarını korur. Baş harfler bu payı her yazı ölçeğinde korur: avatar çevresindeki yazıyla birlikte büyümez, büyüyen harfler ise dışına taşardı.

`contentDescription` verilen avatar o adla, bir görsel olarak okunur. Verilmeyen avatar ekran okuyucudan gizlenir: okuyucunun zaten okuduğu bir adın yanında doğrusu budur. Baş harfler hiçbir zaman okunmaz: onlar açıklamanın kısaltmasıdır. Avatar çizilir, basılmaz. Bir profili açan avatar, basışı alan şeyin içine konur: bir düğmenin ya da bir liste satırının.

Parametreler:

- `contentDescription: String?`: Ekran okuyucunun avatar için söylediği: çoğunlukla avatarın yerini tuttuğu ad. Avatarı okuyucudan gizlemek için null.
- `modifier: Modifier`: Avatarın modifier'ı. Burada verilen boyut `size`'ın yerine geçer.
- `initials: String?`: Çizilecek harfler, çoğunlukla bir ya da iki tane. İkiden fazlası kesilir, hiç harf yoksa `icon` kalır.
- `icon: ImageVector?`: Baş harf olmadığında çizilen: bir kişi, bir grup, bir şirket.
- `tone: AvatarTone`: Baş harflerin ya da ikonun altındaki renk ve onların kendi rengi. Bir resim onu örter.
- `colors: AvatarColors?`: Bu avatarın, tonunun renkleri yerine geçen kendi renkleri. Verdiği renkler kullanılır, gerisi tonundan gelir.
- `style: AvatarStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `size: Dp`: Avatarın genişliği ve yüksekliği: verilmezse stilin boyutu.
- `tagKey: String?`: Avatarın otomasyon anahtarı: avatar `Avatar_<tagKey>` etiketini taşır ve yalnızca anahtar verildiğinde etiketlenir.
- `image: (@Composable () -> Unit)?`: Avatarı dolduran, baş harflerin ya da ikonun üstüne gelen resim. Resmin kendi açıklaması okunmaz: avatarın açıklaması ikisinin yerine geçer.

### AvatarTone

`import com.pantrixui.components.elements.avatar.AvatarTone`, `com.pantrixui:components` içinden

```kotlin
enum class AvatarTone
```

Bir resmin örtmediği yerde avatarın nasıl renklendiği: temanın renk rollerinden biriyle. Böylece bir marka bütün avatarları birden değiştirir.

Avatar her tonda rolün `color` ve `onColor` renkleriyle dolu çizilir: dolu bir dairenin üstündeki baş harfler başka her yerde de böyle çizilir. Rolün soluk `container` rengi ekran genişliğinde bir alan için seçilmiştir ve bu renkte 32dp çapında bir daire beyaz bir sayfada kaybolur.

Ton tek başına bir şey söylemez: ekran okuyucu avatarın rengini değil açıklamasını duyar. Bu yüzden bir rengin ne anlama geldiği yanındaki sözlerde yazmalıdır.

Değerleri:

- `Primary`: Markanın rengi: uygulamayı kullanan kişi.
- `Info`: Yargı taşımayan bir ayrım: bir konuk, bir grup, kişi olmayan bir hesap.
- `Success`: Durumu iyi olan biri ya da bir şey.
- `Warning`: Bakılması gereken biri ya da bir şey.
- `Danger`: Başarısız olmuş ya da engellenmiş biri ya da bir şey.
- `Neutral`: Hiçbir anlamı yok: baş harflerin üstünde duracağı bir gri. Varsayılan.

### AvatarStyle

`import com.pantrixui.components.elements.avatar.AvatarStyle`, `com.pantrixui:components` içinden

```kotlin
class AvatarStyle(
    public val size: Dp = Dp.Unspecified,
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val initialsScale: Float = Float.NaN,
    public val iconScale: Float = Float.NaN
) : PantrixStyle<AvatarStyle>
```

`PantrixAvatar`'ın geometrisi: ne kadar büyük olduğu, köşelerinin nasıl olduğu ve baş harflerin ya da ikonun onun ne kadarını kapladığı.

Avatar her platformda bir dairedir. Android'de ve iOS'ta, Material 3'ün bir liste satırının yanına koyduğu gibi, 40dp çapındadır. Satırların daha alçak olduğu masaüstünde ve web'de 32dp'dir. Baş harfler avatarın onda dördü, ikon onda altısıdır: bir ikon kutusunu, büyük bir harfin satırını doldurduğundan daha az doldurur ve bu paylarla ikisi birbirine benzer görünür.

İki pay kendi başına birer boyut değil, avatarın kesirleridir. Bu yüzden boyut verilen bir avatar, bir profilin tepesindeki büyük bir avatar ya da bir yorumdaki küçük bir avatar, ikinci bir stil gerekmeden oranlarını korur.

Dördünden hiçbiri yoğunluğu izlemez: avatar bir satırın kimliğidir ve daha sık bir satır onu küçültmez.

Parametreler:

- `size: Dp`: Avatarın genişliği ve yüksekliği.
- `shape: ShapeSpec`: Avatarın köşeleri: markanın şekil ölçeğinin yuvarlak ucu, bir daire. Bir marka ya da bir tema ölçeğin bir basamağını ya da kendi şeklini isterse o kullanılır.
- `initialsScale: Float`: Baş harflerin yazıldığı yükseklik: avatarın kısa kenarının bir kesri.
- `iconScale: Float`: İkonun genişliği ve yüksekliği: avatarın kısa kenarının bir kesri.

### AvatarColors

`import com.pantrixui.components.elements.avatar.AvatarColors`, `com.pantrixui:components` içinden

```kotlin
data class AvatarColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified
)
```

Tonunun renklerini almayan bir avatar için `PantrixAvatar`'ın boyandığı renkler: verilen renk kullanılır, verilmeyen tonun renginde kalır.

```kotlin
PantrixAvatar(
    contentDescription = team.name,
    initials = team.initials,
    colors = AvatarColors(container = team.color, content = team.onColor)
)
```

Burada verilen dolgu temanın kendi renklerinden biriyse, üstüne çizilenlerin rengi de ayrıca verilmediği sürece, temanın o dolguyla eşleştirdiği rengi getirir. Hiçbir rolde olmayan bir dolgu getirmez: üstünde okunan rengi çağıran verir.

Parametreler:

- `container: Color`: Baş harflerin ya da ikonun altında duran ve bir resmin örttüğü dolgu. Tonun rolünün `color` rengi.
- `content: Color`: Baş harfler ya da ikon: `container` üstünde okunan renk. Tonun rolünün `onColor` rengi.
