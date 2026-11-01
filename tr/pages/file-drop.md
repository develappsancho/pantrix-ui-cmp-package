# File Drop

Kullanıcının uygulamaya dosya verdiği yer: basınca platformun seçicisini açan, üstüne bırakılan dosyaları alan kesik kenarlı bir bölge. Seçmek ve okumak foundation'ın dosya API'siyle her platformda aynıdır.

- `PantrixFileDrop` (`com.pantrixui.components.elements.filedrop`, `com.pantrixui:components`): Basınca platformun dosya seçicisini açan ve üstüne bırakılan dosyaları türüne, boyutuna ve sayısına göre süzerek alan bir alan. Anahtar sözcükler: dosya yükleme, yükle, bırakma alanı, dosya seçici, sürükle bırak, ek.
- `PantrixFileItem` (`com.pantrixui.components.elements.filedrop`, `com.pantrixui:components`): Uygulamanın aldığı bir dosyanın satırı: adı, boyutu ya da hatası, ne kadarının gönderildiği ve onu kaldıran bir düğme. Anahtar sözcükler: yükleme ilerlemesi, ek satırı, dosya satırı, yüklenen dosya, dosyayı kaldır.

## Özellikler

- **Basmak her yerde çalışır.** Bölgeye basmak (ya da odaktayken Enter veya Boşluk) platformun seçicisini açar: Android'de belgeler, iOS'ta Dosyalar, masaüstünde sistemin penceresi, web'de tarayıcınınki. Yalnızca görsel alınıyorsa Android ve iOS fotoğraf seçicisini açar. Hiçbiri izin istemez.
- **Bırakmak işaretçinin işidir.** Masaüstünde ve web'de dosyalar bölgenin üstüne sürüklenip bırakılır; Android'de ve iPad'de yandaki bir uygulamadan da. Sürüklerken bölge birincil rolün rengine döner ve "Eklemek için bırakın" der. Yazısı da buna göredir: masaüstünde ve web'de önce bırakmayı, telefonda önce seçmeyi söyler.
- **Eleme.** `accept` alınan türleri, `maxSize` en büyük boyutu, `multiple` birden fazla dosyayı belirler. Uymayan dosyalar nedenleriyle (tür, boyut, sayı) `onRejected`'a gider, gerisi `onFiles`'a; ne söyleneceği uygulamanındır.
- **Bölge durum tutmaz.** Alınan dosyaları uygulama tutar ve bölgenin altına `PantrixFileItem` satırları olarak dizer: ad (uzunsa ortası kısaltılır), dile göre boyut, kaldırma düğmesi, isteğe bağlı ilerleme ve hata.
- **Okumak.** `PantrixFile` adını, boyutunu ve türünü taşır; baytlarını `readBytes()` istendiğinde okur. Platformun kendi dosyası da oradadır: Android'de `uri`, iOS'ta `url`, masaüstünde `file`, web'de `domFile`.
- **Ekran okuyucu.** Bütün bölge tek bir düğmedir. Kaç dosya alındığı ve kaç dosyanın alınmadığı kibarca duyurulur; `error` ile yardım metni hata olarak okunur.
- **Platform.** Bölge telefonda 140dp, masaüstünde ve web'de 120dp yüksekliğindedir; satırlar telefonda 56dp, işaretçinin altında 44dp.

## Kullanım

### Attachments on a form

```kotlin
var attachments by remember { mutableStateOf(emptyList<PantrixFile>()) }
PantrixFileDrop(
    onFiles = { attachments += it },
    accept = listOf(PantrixFileType.Pdf, PantrixFileType.Images),
    multiple = true,
    maxSize = 10_000_000,
    supportingText = stringResource(Res.string.pdf_or_image_up_to_10_mb),
    tagKey = "attachments"
)
attachments.forEach { file ->
    PantrixFileItem(name = file.name, size = file.size, onRemove = { attachments -= file })
}
```

### A refusal, with its reason

```kotlin
var refused by remember { mutableStateOf<List<RejectedFile>>(emptyList()) }
PantrixFileDrop(
    onFiles = { avatar = it.single(); refused = emptyList() },
    accept = listOf(PantrixFileType.Images),
    maxSize = 2_000_000,
    onRejected = { refused = it },
    error = refused.isNotEmpty(),
    supportingText = if (refused.isEmpty()) stringResource(Res.string.image_up_to_2_mb)
        else stringResource(Res.string.image_too_large),
    tagKey = "avatar"
)
```

### The files of a drop zone

```kotlin
attachments.forEach { file ->
    PantrixFileItem(name = file.name, size = file.size, onRemove = { attachments -= file }, tagKey = file.name)
}
```

### A file being sent, and one that failed

```kotlin
PantrixFileItem(name = "Contract.pdf", size = 1_250_000, progress = 0.4f)
PantrixFileItem(name = "Scan.png", size = 8_400_000, error = stringResource(Res.string.too_large), onRemove = {})
```

## Örnekler

### Ekler: türler, boyut ve satırlar

Bir formun ekleri: PDF ya da görsel, birden fazla, her biri en çok 10 MB. Alınan her dosya bir satır olur ve gönderiliyormuş gibi dolan bir çubuk alır; kaldırma düğmesi satırı siler. Alınmayanlar nedenleriyle yardım metninde yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.filedrop.FileRejection
import com.pantrixui.components.elements.filedrop.PantrixFileDrop
import com.pantrixui.components.elements.filedrop.PantrixFileItem
import com.pantrixui.components.elements.filedrop.RejectedFile
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.PantrixFileType
import com.pantrixui.foundation.theme.PantrixTheme
import kotlinx.coroutines.delay

val attachments = remember { mutableStateListOf<PantrixFile>() }
val sent = remember { mutableStateMapOf<PantrixFile, Float>() }
var refused by remember { mutableStateOf(emptyList<RejectedFile>()) }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixFileDrop(
        onFiles = { files ->
            attachments += files
            refused = emptyList()
        },
        accept = listOf(PantrixFileType.Pdf, PantrixFileType.Images),
        multiple = true,
        maxSize = TEN_MEGABYTES,
        onRejected = { refused = it },
        supportingText = if (refused.isEmpty()) "PDF ya da görsel, her biri en çok 10 MB" else reasonOf(refused),
        error = refused.isNotEmpty(),
        tagKey = "attachments"
    )
    attachments.forEach { file ->
        key(file) {
            SendingLater(file, sent)
            PantrixFileItem(
                name = file.name,
                size = file.size,
                onRemove = {
                    attachments -= file
                    sent -= file
                },
                progress = sent[file]?.takeIf { it < 1f },
                tagKey = file.name
            )
        }
    }
}

@Composable
private fun SendingLater(
    file: PantrixFile,
    sent: MutableMap<PantrixFile, Float>
) {
    LaunchedEffect(file) {
        if (file in sent) return@LaunchedEffect
        repeat(STEPS + 1) { step ->
            sent[file] = step / STEPS.toFloat()
            delay(STEP_MILLIS)
        }
    }
}

private fun reasonOf(refused: List<RejectedFile>): String = refused.groupBy { it.reason }.entries.joinToString(" · ") {
    val names = it.value.joinToString { rejected -> rejected.file.name }
    when (it.key) {
        FileRejection.Type -> "Bu tür alınmıyor: $names"
        FileRejection.Size -> "Çok büyük: $names"
        FileRejection.Count -> "Yalnızca bir dosya alınır: $names"
    }
}

private const val TEN_MEGABYTES = 10_000_000L

private const val STEPS = 10

private const val STEP_MILLIS = 150L
```

### Tek bir görsel ve ret nedeni

Tek bir görsel, en çok 2 MB: bir profil resmi. Telefonda fotoğraf seçicisi açılır. Seçilen resim okunur ve gösterilir; daha büyüğü ya da görsel olmayan bir dosya reddedilir ve nedeni bölgenin altında hata olarak yazılır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.filedrop.FileRejection
import com.pantrixui.components.elements.filedrop.PantrixFileDrop
import com.pantrixui.components.elements.filedrop.PantrixFileItem
import com.pantrixui.components.elements.filedrop.RejectedFile
import com.pantrixui.components.elements.image.PantrixImage
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.PantrixFileType
import com.pantrixui.foundation.theme.PantrixTheme
import org.jetbrains.compose.resources.decodeToImageBitmap

var avatar by remember { mutableStateOf<PantrixFile?>(null) }
var refused by remember { mutableStateOf<RejectedFile?>(null) }
var picture by remember { mutableStateOf<ImageBitmap?>(null) }
LaunchedEffect(avatar) {
    // Baytlar ancak istenince okunur: burada, bölgenin işi bittikten sonra.
    picture = avatar?.let { file -> runCatching { file.readBytes().decodeToImageBitmap() }.getOrNull() }
}
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixFileDrop(
        onFiles = { files ->
            avatar = files.single()
            refused = null
        },
        accept = listOf(PantrixFileType.Images),
        maxSize = TWO_MEGABYTES,
        onRejected = { refused = it.first() },
        label = "Profil resmi seçin",
        supportingText = refused?.let { reasonOf(listOf(it)) } ?: "PNG, JPEG ya da WebP, en çok 2 MB",
        error = refused != null,
        tagKey = "avatar"
    )
    picture?.let {
        PantrixImage(bitmap = it, contentDescription = "Seçilen resim", modifier = Modifier.size(PICTURE_SIZE))
    }
    avatar?.let { PantrixFileItem(name = it.name, size = it.size, onRemove = { avatar = null }, tagKey = "avatar") }
}

private fun reasonOf(refused: List<RejectedFile>): String = refused.groupBy { it.reason }.entries.joinToString(" · ") {
    val names = it.value.joinToString { rejected -> rejected.file.name }
    when (it.key) {
        FileRejection.Type -> "Bu tür alınmıyor: $names"
        FileRejection.Size -> "Çok büyük: $names"
        FileRejection.Count -> "Yalnızca bir dosya alınır: $names"
    }
}

private val PICTURE_SIZE = 96.dp

private const val TWO_MEGABYTES = 2_000_000L
```

### Kendi sözleri, renkleri ve devre dışı

Bölgenin kendi sözleri ve renkleri: ilk satırı çağıran yazar, dolgusu ve kenarı uygulamanın kendi rengidir. Anahtar kapalıyken bölge hiçbir şey almaz: basılmaz, üstüne bırakılan alınmaz, soluk çizilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.filedrop.FileDropColors
import com.pantrixui.components.elements.filedrop.PantrixFileDrop
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

var open by rememberSaveable { mutableStateOf(true) }
var taken by remember { mutableStateOf(0) }
val own = ownColors()
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixSwitchButton(checked = open, onCheckedChange = { open = it }, label = "Bölge dosya alıyor", tagKey = "accepting")
    PantrixFileDrop(
        onFiles = { taken += it.size },
        multiple = true,
        label = "Raporlarınızı buraya bırakın",
        enabled = open,
        colors = FileDropColors(container = own.container, border = own.color, action = own.color),
        tagKey = "reports"
    )
    PantrixText(
        text = "Alınan dosya: $taken",
        color = PantrixTheme.colors.textSecondary,
        tagKey = "taken"
    )
}
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `ownColors`: Örneklerde "uygulamanın kendi rengi": temanın hiçbir rolünde olmayan bir mor. Bir bileşene `colors` verildiğinde neyin değiştiğini göstermek içindir; temanın bir rolü verilseydi, renk bileşenin tonundan mı yoksa parametreden mi geldi, anlaşılmazdı.

### Kendi stiliyle alçak bir alan ve sık satırlar

Kendi stiliyle: `FileDropStyle` bırakma alanının yüksekliğini, kesik çizgisini ve köşesini, `FileItemStyle` dosya satırının yüksekliğini ve ilerleme çizgisini verir. Verilmeyen her alan platformun ön ayarıdır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.filedrop.FileDropStyle
import com.pantrixui.components.elements.filedrop.FileItemStyle
import com.pantrixui.components.elements.filedrop.PantrixFileDrop
import com.pantrixui.components.elements.filedrop.PantrixFileItem
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.shape.ShapeRole

val files = remember { mutableStateListOf<PantrixFile>() }
Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
    PantrixFileDrop(
        onFiles = { files += it },
        multiple = true,
        style = FileDropStyle(minHeight = 72.dp, shape = ShapeRole.Large, dashLength = 4.dp, dashGap = 4.dp),
        tagKey = "low"
    )
    files.forEach { file ->
        key(file) {
            PantrixFileItem(
                name = file.name,
                size = file.size,
                onRemove = { files -= file },
                style = FileItemStyle(minHeight = 40.dp, verticalPadding = 4.dp, progressHeight = 2.dp),
                tagKey = file.name
            )
        }
    }
}
```

## API

### PantrixFileDrop

`import com.pantrixui.components.elements.filedrop.PantrixFileDrop`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFileDrop(
    onFiles: (List<PantrixFile>) -> Unit,
    modifier: Modifier = Modifier,
    accept: List<PantrixFileType> = listOf(PantrixFileType.Any),
    multiple: Boolean = false,
    maxSize: Long? = null,
    onRejected: (List<RejectedFile>) -> Unit = {},
    label: String? = null,
    supportingText: String? = null,
    enabled: Boolean = true,
    error: Boolean = false,
    picker: FilePicker = rememberFilePicker(),
    interactionSource: MutableInteractionSource? = null,
    style: FileDropStyle? = null,
    colors: FileDropColors? = null,
    tagKey: String? = null
)
```

Uygulamaya dosya verilen yer: basılınca platformun seçicisini açan, üstüne platformun dosyalarından, başka bir uygulamadan ya da başka bir pencereden bırakılan dosyaları alan, kesik kenarlı bir bölge.

Basmak her platformda giriş yoludur ve hiçbir şeyin sürüklenmediği yerde tek yoldur: bir telefon, bir klavye, bir ekran okuyucu. Bölge bunu sözleriyle de söyler: işaretçinin altında, masaüstünde ve web'de önce bırakmayı, telefonda önce seçiciyi söyler. Yalnızca görsel alınıyorsa (`PantrixFileType.Images`) Android ve iOS fotoğraf seçicilerini açar.

Seçilen ya da bırakılan, uygulamaya verilmeden önce elenir: `accept`'te olmayan türden bir dosya, `maxSize`'tan büyük olan ve yalnızca bir dosya alınıyorsa ilkinden sonraki her biri nedeniyle `onRejected`'a gider, gerisi `onFiles`'a. Bölge hiçbir şey tutmaz: alınanı bölgenin altında `PantrixFileItem`'larla listelemek de, alınmayanı `supportingText` ve `error` ile söylemek de uygulamanın işidir. Ekran okuyucuya bölgenin kaç dosya aldığı ve kaçını almadığı kibarca söylenir.

Burada hiçbir şey okunmaz: bir `PantrixFile` baytlarını uygulama isteyince okur; büyük bir dosya ekranın işinin dışında okunmalı ve okundukça gideceği yere gönderilmelidir.

```kotlin
PantrixFileDrop(
    onFiles = { files -> attachments += files },
    accept = listOf(PantrixFileType.Pdf),
    multiple = true,
    maxSize = 10_000_000,
    onRejected = { refused = it },
    supportingText = stringResource(Res.string.pdf_up_to_10_mb),
    tagKey = "attachments"
)
```

Parametreler:

- `onFiles: (List<PantrixFile>) -> Unit`: bölgenin aldığı dosyalar, en az bir tane, geldikleri sırayla ona verilir.
- `modifier: Modifier`: bölgenin modifier'ı, yardım metniyle birlikte. Bölge kendisine verilen genişliği doldurur.
- `accept: List<PantrixFileType>`: bölgenin aldığı dosya türleri. Platformun seçicisi süzebiliyorsa seçici yalnızca bunları gösterir.
- `multiple: Boolean`: bölgenin bir seferde birden fazla dosya alıp almadığı.
- `maxSize: Long?`: bölgenin aldığı bir dosyanın en çok kaç bayt olabileceği ya da her boyut için null.
- `onRejected: (List<RejectedFile>) -> Unit`: bölgenin almadığı dosyalar, her biri nedeniyle, en az bir tane, ona verilir.
- `label: String?`: bölgenin platformun sözleri yerine ilk söylediği.
- `supportingText: String?`: bölgenin altında bir satır: ne aldığı ve ne büyüklükte, ya da neyin yanlış olduğu.
- `enabled: Boolean`: bölgenin bir şey alıp almadığı: bir basış ya da bir bırakma. Almayan bölge soluk çizilir.
- `error: Boolean`: bölgenin, kendisine verilenin doğru olmadığını gösterip göstermediği: kenarı ve yardım metni tehlike renginde. Ekran okuyucu yardım metnini hata olarak duyar.
- `picker: FilePicker`: bir basışın açtığı: platformun kendi seçicisi ya da bir testinki.
- `interactionSource: MutableInteractionSource?`: bölgenin etkileşimleri: basışı, üstüne gelinmesi ve odağı.
- `style: FileDropStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: FileDropColors?`: bu bölgenin kendi renkleri: verdikleri, gerisi temanın.
- `tagKey: String?`: bölgenin otomasyon anahtarı: `FileDrop_<tagKey>` olur.

### PantrixFileItem

`import com.pantrixui.components.elements.filedrop.PantrixFileItem`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixFileItem(
    name: String,
    modifier: Modifier = Modifier,
    size: Long? = null,
    onRemove: (() -> Unit)? = null,
    progress: Float? = null,
    error: String? = null,
    icon: ImageVector = PantrixIcons.File,
    enabled: Boolean = true,
    style: FileItemStyle? = null,
    tagKey: String? = null
)
```

Uygulamanın aldığı bir dosya, bir satırda: ikonu, adı, boyutu ya da onunla ilgili neyin yanlış gittiği, ne kadarının gönderildiği ve onu kaldıran düğme. Satırlar bir `PantrixFileDrop`'un altında, her biri uygulamanın tuttuğu bir dosya için durur.

Uzun bir ad ortasından kısaltılır, böylece hem başı hem uzantısı görünür: `Quarterly rep….pdf`. Boyut dilin yazdığı gibi yazılır, Türkçede `1,2 MB`; bir `error` onun yerinde, tehlike renginde durur ve satırın kenarı da o renge döner. Bir `progress` sözlerin altına, okuma yönünün başından dolan bir çubuk çizer; ekran okuyucu onu bir ilerleme çubuğu olarak duyar.

Ekran okuyucu satırı tek bir şey olarak duyar, adını ve boyutunu ya da hatasını; düğmeyi ondan ayrı, kaldırdığının adıyla: `Remove report.pdf`.

```kotlin
PantrixFileItem(name = file.name, size = file.size, onRemove = { attachments -= file }, progress = sent[file])
```

Parametreler:

- `name: String`: dosyanın adı.
- `modifier: Modifier`: satırın modifier'ı. Satır kendisine verilen genişliği doldurur.
- `size: Long?`: dosyanın kaç bayt olduğu ya da hiçbir şey söylememek için null.
- `onRemove: (() -> Unit)?`: kaldırma düğmesinin yaptığı ya da düğmesiz bir satır için null.
- `progress: Float?`: dosyanın ne kadarının gönderildiği, sıfırdan bire, ya da çubuk olmaması için null.
- `error: String?`: dosyayla ilgili neyin yanlış gittiği, boyutunun yerinde, ya da null.
- `icon: ImageVector`: adın önünde duran: varsayılan olarak bir dosya.
- `enabled: Boolean`: kaldırma düğmesine basılıp basılamayacağı. Basılamayan satır soluk çizilir.
- `style: FileItemStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `tagKey: String?`: satırın otomasyon anahtarı: `FileItem_<tagKey>` olur, düğmesininki de onun içinde `IconButton_remove`. Yalnızca anahtar verildiğinde etiketlenir.

### FileDropStyle

`import com.pantrixui.components.elements.filedrop.FileDropStyle`, `com.pantrixui:components` içinden

```kotlin
class FileDropStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minHeight: Dp = Dp.Unspecified,
    public val padding: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val dashLength: Dp = Dp.Unspecified,
    public val dashGap: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified
) : PantrixStyle<FileDropStyle>
```

`PantrixFileDrop`'un geometrisi: bölge, kesik kenarı ve içinde duranlar.

Hiçbir platformun kendi bırakma bölgesi yoktur. Bölge, ekranın öbür ucundan hedef olacak kadar yüksektir; bir başparmağın bastığı telefonda işaretçinin altında olduğundan daha yüksektir. Köşeleri bir kartınkidir, kenarı kesiklidir: düz bir kenar kart gibi, kesik bir kenar bir şey konacak yer gibi okunur.

En az yükseklik, içteki boşluk, aralar ve kesiklerin arası yoğunluğa uyar. Kenarın kalınlığı, kesiklerin uzunluğu, köşeler ve ikon uymaz.

Parametreler:

- `shape: ShapeSpec`: Bölgenin köşeleri: markanın şekil ölçeğinden bir basamak ya da sabit bir şekil.
- `minHeight: Dp`: Bölgenin en az yüksekliği. Daha büyük bir yazı onu yükseltir.
- `padding: Dp`: Bölgenin kenarı ile içinde duranlar arasındaki boşluk.
- `borderWidth: Dp`: Kesik kenarın kalınlığı.
- `dashLength: Dp`: Kenarın her bir kesiğinin uzunluğu.
- `dashGap: Dp`: İki kesik arasındaki boşluk.
- `iconSize: Dp`: Bölgenin sözlerinin üstündeki ikonun genişliği ve yüksekliği.
- `gap: Dp`: İkon ile sözler arasında ve iki söz satırı arasında.

### FileDropColors

`import com.pantrixui.components.elements.filedrop.FileDropColors`, `com.pantrixui:components` içinden

```kotlin
data class FileDropColors(
    public val container: Color = Color.Unspecified,
    public val content: Color = Color.Unspecified,
    public val action: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val overContainer: Color = Color.Unspecified,
    public val overContent: Color = Color.Unspecified,
    public val overBorder: Color = Color.Unspecified,
    public val error: Color = Color.Unspecified,
    public val supporting: Color = Color.Unspecified
)
```

Bir `PantrixFileDrop`'un temanın renkleri yerine boyandığı renkler: verilen renk kullanılır, verilmeyen temanın kalır.

Burada verilen ve temanın rol renklerinden biri olan bir `container`, `content` da verilmedikçe bölgede yazılan için temanın onunla eşlediği rengi getirir; bir `overContainer` da `overContent` verilmedikçe üstünde bir şey sürüklenen bölge için kendi eşini getirir. Hiçbir rolün olmayan bir dolgu getirmez: onun üstünde okunanı vermek çağıranındır.

Parametreler:

- `container: Color`: Bölgenin dolgusu. Temanın `surface`'ı.
- `content: Color`: Bölgenin ilk satırı ve ikonu. Temanın `textPrimary`'si ya da `container` olarak verilen bir rol dolgusunun üstünde durana verdiği renk.
- `action: Color`: İkinci satır, seçiciyi açan basış, bir bağlantı gibi. Temanın kendi zeminlerinde birincil rolün `color`'ı, başka bir dolguda `content`.
- `border: Color`: Kesik kenar. Temanın kendi zeminlerinde `border`'ı, işaretçinin altında `borderHover`'ı; başka bir dolguda, bir dolgu üstündeki çizgi gibi `content`'in bir payı.
- `overContainer: Color`: Üstünde bir şey sürüklenirken bölgenin dolgusu. Birincil rolün `container`'ı.
- `overContent: Color`: O sırada içinde yazılan. Birincil rolün `onContainer`'ı.
- `overBorder: Color`: O sıradaki kenar. Birincil rolün `color`'ı.
- `error: Color`: Hata gösteren bir bölgenin kenarı ve yardım metni. Tehlike rolünün `color`'ı.
- `supporting: Color`: Bölgenin altındaki yardım metni. Temanın `textSecondary`'si.

### FileItemStyle

`import com.pantrixui.components.elements.filedrop.FileItemStyle`, `com.pantrixui:components` içinden

```kotlin
class FileItemStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val minHeight: Dp = Dp.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val progressHeight: Dp = Dp.Unspecified
) : PantrixStyle<FileItemStyle>
```

`PantrixFileItem`'ın geometrisi: uygulamanın aldığı bir dosya için ikonu, adı ve boyutu ve onu kaldıran düğmesiyle bir satır.

Satır bir listenin satırıdır: her platformda onun kadar yüksek, bir başparmağın düğmesine bastığı telefonda 56dp, işaretçinin altında 44dp. Köşeleri ve kenarı bir kartınkidir, telefonda bölgeninkinden bir basamak aşağı.

En az yükseklik, içteki boşluk, ara ve ilerleme çubuğunun yüksekliği yoğunluğa uyar. Kenarın kalınlığı, köşeler ve ikon uymaz.

Parametreler:

- `shape: ShapeSpec`: Satırın köşeleri.
- `minHeight: Dp`: Satırın en az yüksekliği. Daha büyük bir yazı, bir ilerleme çubuğu ya da bir hata onu yükseltir.
- `horizontalPadding: Dp`: Satırın yanları ile tuttukları arasındaki boşluk.
- `verticalPadding: Dp`: Tuttuklarının üstündeki ve altındaki boşluk.
- `borderWidth: Dp`: Satırın kenarının kalınlığı.
- `iconSize: Dp`: Dosyanın ikonunun genişliği ve yüksekliği.
- `gap: Dp`: İkon, sözler ve düğme arasında; sözler ile ilerleme çubuğu arasında.
- `progressHeight: Dp`: Sözlerin altındaki ilerleme çubuğunun yüksekliği.

### RejectedFile

`import com.pantrixui.components.elements.filedrop.RejectedFile`, `com.pantrixui:components` içinden

```kotlin
class RejectedFile(
    public val file: PantrixFile,
    public val reason: FileRejection
)
```

Bir `PantrixFileDrop`'un almadığı bir dosya ve nedeni: uygulamanın kullanıcıya, bölgenin yardım metninde ne diyeceği kendi sözüdür.

Parametreler:

- `file: PantrixFile`: bölgenin almadığı dosya.
- `reason: FileRejection`: neden almadığı.

### FileRejection

`import com.pantrixui.components.elements.filedrop.FileRejection`, `com.pantrixui:components` içinden

```kotlin
enum class FileRejection
```

Bir bırakma bölgesinin bir dosyayı neden almadığı.

Değerleri:

- `Type`: Dosya bölgenin aldığı türlerin hiçbirinden değil.
- `Size`: Bölgenin aldığı en büyük boyuttan büyük.
- `Count`: Bölge tek dosya alıyor ve bu, aldığından sonra geldi.

### PantrixFile

`import com.pantrixui.foundation.files.PantrixFile`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixFile
```

Kullanıcının uygulamaya verdiği bir dosya: platformun seçicisinde seçilen (`rememberFilePicker`) ya da bir bırakma hedefine bırakılan (`fileDropTarget`), her platformda aynı.

Ortak Compose'un kendi dosya türü yoktur: seçilen ya da bırakılan dosya her platformun kendi türüyle gelir; Android'de bir içerik `Uri`'si, iOS'ta bir `NSURL`, masaüstünde bir `java.io.File`, web'de tarayıcının `File`'ı. Bu, uygulamanın ortak kodunun aldığıdır; platformun kendi türü de onu gereken kod için oradadır: `uri`, `url`, `file` ve `domFile`, her biri kendi platformunun kaynak kümesinde.

`readBytes` çağrılana kadar hiçbir şey okunmaz. Bir dosya bir değer değildir: aynı adda ve aynı boyutta iki dosya, iki kâğıt gibi iki dosyadır.

```kotlin
picker.pick(FilePickRequest(accept = listOf(PantrixFileType.Pdf))) { files ->
    scope.launch { upload(files.first().name, files.first().readBytes()) }
}
```

Parametreler:

- `name: String`: dosyanın adı, uzantısı varsa uzantısıyla, içinde durduğu klasörler olmadan.
- `size: Long?`: dosyanın kaç bayt olduğu ya da platform söylemiyorsa null.
- `mimeType: String`: dosyanın tuttuğu, MIME türü olarak: platformun söylediği, ya da uzantısının söylediği, ya da `application/octet-stream`.

Başka bir kurucu:

```kotlin
constructor(
    name: String,
    bytes: ByteArray,
    mimeType: String = mimeTypeOf(name)
)
```

A file held in memory: one the app made itself, or a test's, in the place of one the user chose.

Parametreleri:

- `name: String`: what the file is called.
- `bytes: ByteArray`: what it holds. They are copied: changing the array afterwards does not change the file.
- `mimeType: String`: what it holds, as a MIME type: by default the one its name's extension stands for. `mimeTypeOf`: The MIME type a file named `name` holds by its extension, or `application/octet-stream`: for a file whose platform did not say, and for one made in memory.

Üyeleri:

- `suspend fun readBytes(): ByteArray`: Dosyanın tamamını belleğe okur; platform bir diskten okuyorsa ana iş parçacığının dışında. Artık orada olmayan ya da uygulamanın artık okuyamadığı bir dosya platformun hatasını fırlatır.

### PantrixFileType

`import com.pantrixui.foundation.files.PantrixFileType`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixFileType(
    public val mimeType: String,
    public val extensions: List<String> = emptyList()
)
```

Bir uygulamanın aldığı bir dosya türü: alt türü joker olabilen bir MIME türü (`image` ve her alt türü `Images`'ındır) ve o türdeki dosyaların adlandırıldığı uzantılar.

Her platformun seçicisine tür kendi yoluyla söylenir: Android'e ve web'e MIME türüyle, iOS'a MIME türünün ve uzantıların karşılığı olan tekdüze türle (uniform type), masaüstünün penceresine uzantılarla. Bir dosya, MIME türü uyduğunda ya da uzantısı `extensions`'tan biri olduğunda türe uyar; böylece platformu ne tuttuğunu söyleyemeyen bir dosya da adıyla tanınır.

```kotlin
val spreadsheets = PantrixFileType("text/csv", listOf("csv"))
```

Parametreler:

- `mimeType: String`: türün MIME türü: `type/subtype`, ikisinden biri `*` olabilir.
- `extensions: List<String>`: o türdeki dosyaların adlandırıldığı uzantılar, noktasız, büyük ya da küçük harfle.

Üyeleri:

- `fun accepts(file: PantrixFile): Boolean`: `file`'ın bu türden olup olmadığı: MIME türü uyuyorsa ya da adı uzantılardan biriyle bitiyorsa.

Tipin kendisinde:

- `PantrixFileType.Any: PantrixFileType`: Her dosya.
- `PantrixFileType.Images: PantrixFileType`: Resimler: fotoğraflar, ekran görüntüleri, çizimler. Yalnızca bunlar alınıyorsa telefon fotoğraf seçicisini açar.
- `PantrixFileType.Videos: PantrixFileType`: Filmler ve görüntülü kayıtlar.
- `PantrixFileType.Audio: PantrixFileType`: Ses: müzik, sesli notlar.
- `PantrixFileType.Pdf: PantrixFileType`: PDF belgeleri.
- `PantrixFileType.Text: PantrixFileType`: Her türden düz metin: notlar, günlükler, virgülle ayrılmış değerler.

### FilePicker

`import com.pantrixui.foundation.files.FilePicker`, `com.pantrixui:foundation` içinden

```kotlin
fun interface FilePicker
```

Platformun kendi dosya seçicisini açar ve kullanıcının seçtiğini uygulamaya verir.

`rememberFilePicker` platformunkini verir: Android'in belgeleri (`ACTION_OPEN_DOCUMENT`), iOS'un Dosyaları, masaüstünün kendi penceresi ve tarayıcınınki. Yalnızca görsel istenince (`FilePickRequest.imagesOnly`) Android ve iOS bunun yerine fotoğraf seçicilerini açar. Hiçbiri izin istemez.

Bir test ya da seçici olmadan önce gösterilen bir ekran kendi seçicisini verir:

```kotlin
val picker = FilePicker { _, onPicked -> onPicked(listOf(PantrixFile("report.pdf", bytes))) }
```

Üyeleri:

- `fun pick(request: FilePickRequest, onPicked: (List<PantrixFile>) -> Unit)`: Seçiciyi `request` için açar. `onPicked`, kullanıcının seçtiğiyle, platformun verdiği sırayla ana iş parçacığında çağrılır; kullanıcı hiçbir şey seçmediyse çağrılmaz.

### FilePickRequest

`import com.pantrixui.foundation.files.FilePickRequest`, `com.pantrixui:foundation` içinden

```kotlin
class FilePickRequest(
    public val accept: List<PantrixFileType> = listOf(PantrixFileType.Any),
    public val multiple: Boolean = false
)
```

Bir seçiciden istenen: gösterdiği dosya türleri ve kullanıcının birden fazla dosya seçip seçemeyeceği.

Parametreler:

- `accept: List<PantrixFileType>`: seçicinin gösterdiği dosya türleri. Platformun seçicisi ayırt edebiliyorsa hiçbirinden olmayan bir dosya seçilemez: masaüstünün Windows'taki penceresi ayırt edemez ve her dosyayı gösterir.
- `multiple: Boolean`: kullanıcının birden fazla dosya seçip seçemeyeceği.

Üyeleri:

- `fun accepts(file: PantrixFile): Boolean`: `file`'ın seçicinin gösterdiği türlerden biri olup olmadığı.
- `imagesOnly: Boolean`: Yalnızca görsel istenip istenmediği: her tür bir görselin türüdür. Android ve iOS o zaman dosyaları yerine kullanıcının resimlerinin durduğu fotoğraf seçicisini açar.

### rememberFilePicker

`import com.pantrixui.foundation.files.rememberFilePicker`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFilePicker(): FilePicker
```

Platformun kendi dosya seçicisi: bkz. `FilePicker`. Android'de sonuç tutan bir etkinlik ister, bir `ComponentActivity`; her Compose etkinliği öyledir. `LocalFilePicker` bir seçici verdiğinde o seçicidir.

### Modifier.fileDropTarget

`import com.pantrixui.foundation.files.fileDropTarget`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.fileDropTarget(
    enabled: Boolean = true,
    onOver: (Boolean) -> Unit = {},
    onFiles: (List<PantrixFile>) -> Unit
): Modifier
```

Bu öğenin üstüne platformun dosyalarından, başka bir uygulamadan ya da başka bir pencereden bırakılan dosyaları `PantrixFile` olarak alır.

Compose bir bırakmayı her platformun kendi türüyle verir: Android'de `ClipData`'sı içerik `Uri`'leri tutan bir `DragEvent`, iOS'ta yükleyicileri dosyalarını henüz yüklemesi gereken `UIDragItem`'lar, masaüstünde dosya adreslerinden bir liste, web'de dosyaları yalnızca bırakma sürerken okunabilen bir `DataTransfer`. Bu, her birini aynı listeye çevirir. Android'de başka bir uygulamanın bıraktığını okuma hakkını etkinlikten ister; istenmeyen bir bırakmada bu hak kaybolur. iOS'ta her dosyayı uygulamanın geçici klasörüne kopyalar, çünkü yükleyicinin dosyası yükleme bitince gider.

Bir dosyayı sürükleyip getirmek işaretçinin işidir ve bazı platformlarda hiç işaretçi yoktur: yanında başka bir uygulama olmayan bir telefon. Bir bırakma hedefi uygulamaya dosya vermenin hiçbir zaman tek yolu değildir: yanına aynı basışla açılan bir `FilePicker` koyun.

```kotlin
Box(Modifier.fileDropTarget(onOver = { over = it }) { files -> attach(files) })
```

Parametreler:

- `enabled: Boolean`: bir bırakmanın alınıp alınmadığı. Almayan hedef ışıklanmaz da: üstünde bir şey olduğu ona hiç söylenmez.
- `onOver: (Boolean) -> Unit`: dosya tutabilecek bir şey bu öğenin üstüne sürüklenince true, ayrılınca, bırakılınca ya da sürükleme başka bir yerde bitince false söylenir.
- `onFiles: (List<PantrixFile>) -> Unit`: bir bırakmanın dosyaları ana iş parçacığında ona verilir. Dosya tutmayan bir bırakma için çağrılmaz; iOS'ta dosyalar yüklenince, bırakmadan biraz sonra çağrılır.
