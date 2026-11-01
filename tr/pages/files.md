# Dosyalar

Dosyalar, bir bileşen olmadan: platformun kendi dosya seçicisi ve bir yere bırakılan dosyalar. `PantrixFileDrop` bu ikisinin üstünde kurulur; kendi görünüşünü isteyen bir ekran onları doğrudan kullanır.

## Özellikler

- **Seçici.** `rememberFilePicker()` platformun seçicisini verir (`FilePicker`); `pick(request) { files -> … }` onu açar ve seçilenleri verir. `FilePickRequest` neyin gösterileceğini (`accept`) ve birden çok dosyanın seçilip seçilemeyeceğini (`multiple`) söyler. Yalnızca resim istendiğinde Android ve iOS fotoğraf seçicisini açar.
- **Bırakmak.** `Modifier.fileDropTarget(onOver, onFiles)` bir öğeye bırakılan dosyaları alır: masaüstünde ve web'de başka bir uygulamadan, bir başka pencereden. `onOver` dosyalar üstündeyken `true` söyler.
- **Kaydetmek.** `rememberFileSaver()` platformun kaydetme penceresini verir (`FileSaver`); `save(file) { result -> … }` dosyayı kullanıcının seçtiği yere yazar ve ne olduğunu söyler (`FileSaveResult`): Android'de yeni belge penceresi, iOS'ta Dosyalar, masaüstünde kaydetme penceresi, web'de tarayıcının indirmesi.
- **Dosya.** `PantrixFile` adını, boyunu ve türünü taşır; içeriği istenince okunur.
- **Bir ekranın seçicisi.** `LocalFilePicker` bir seçici verince `rememberFilePicker()` platformunkinin yerine onu döndürür: bir önizleme ya da bir test, bir ekranın bütün seçicilerine aynı seçiciyi bir kerede verir. `LocalFileSaver` kaydedici için aynısını yapar.

## Örnekler

### Dosya seçtirmek

Platformun kendi seçicisi: "PDF seç" yalnızca PDF'leri gösterir ve birden çok dosya seçtirir (`FilePickRequest(accept = listOf(PantrixFileType.Pdf), multiple = true)`). Seçilenler adlarıyla ve boylarıyla altta yazar; vazgeçilirse liste boş gelir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.FilePickRequest
import com.pantrixui.foundation.files.FilePicker
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.PantrixFileType
import com.pantrixui.foundation.files.rememberFilePicker
import com.pantrixui.foundation.theme.PantrixTheme

val picker: FilePicker = rememberFilePicker()
var chosen by remember { mutableStateOf(emptyList<PantrixFile>()) }
PantrixButton(
    text = "PDF seç",
    onClick = {
        picker.pick(FilePickRequest(accept = listOf(PantrixFileType.Pdf), multiple = true)) { files ->
            chosen = files
        }
    },
    variant = ButtonVariant.Outline,
    tagKey = "pick_pdf"
)
FileLines(files = chosen, empty = "Bir dosya seçilmedi")

@Composable
private fun FileLines(
    files: List<PantrixFile>,
    empty: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (files.isEmpty()) {
            PantrixText(text = empty, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
        }
        files.forEach { file ->
            val size = file.size?.let { bytes -> " · ${(bytes + 1023) / 1024} KB" }.orEmpty()
            PantrixText(text = "${file.name}$size", style = PantrixTheme.typography.footnote)
        }
    }
}
```

### Bir yere bırakılan dosyalar

Bir yere bırakılan dosyalar: kutu `fileDropTarget` taşır. Masaüstünde ya da web'de bir dosyayı kutunun üstüne sürükle: kutu üstündeyken renklenir, bırakınca dosyalar altta yazar. Telefonda dosya bırakılmaz; orada seçici kullanılır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.fileDropTarget
import com.pantrixui.foundation.theme.PantrixTheme

var over by remember { mutableStateOf(false) }
var dropped by remember { mutableStateOf(emptyList<PantrixFile>()) }
val colors = PantrixTheme.colors
Box(
    modifier = Modifier
        .fillMaxWidth()
        .height(96.dp)
        .background(if (over) colors.primary.container else Color.Transparent, PantrixTheme.shapes.md)
        .border(1.dp, if (over) colors.primary.color else colors.border, PantrixTheme.shapes.md)
        .fileDropTarget(onOver = { over = it }, onFiles = { files -> dropped = files }),
    contentAlignment = Alignment.Center
) {
    PantrixText(text = if (over) "Bırak" else "Dosyaları buraya sürükle", color = colors.textSecondary)
}
FileLines(files = dropped, empty = "Bir dosya bırakılmadı")

@Composable
private fun FileLines(
    files: List<PantrixFile>,
    empty: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (files.isEmpty()) {
            PantrixText(text = empty, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
        }
        files.forEach { file ->
            val size = file.size?.let { bytes -> " · ${(bytes + 1023) / 1024} KB" }.orEmpty()
            PantrixText(text = "${file.name}$size", style = PantrixTheme.typography.footnote)
        }
    }
}
```

### Örnek dosyalarla bir ekran

Bir ekranın seçicisini dışarıdan vermek: "Örnek dosyalar" açıkken ekran `LocalFilePicker` ile bir örnek seçici alır ve "Teklif seç" platformun seçicisini açmadan iki örnek dosya verir; kapalıyken platformun seçicisi açılır. Ekranın kendisi değişmez, `rememberFilePicker()` çağırır: bir önizleme ya da test onu böyle sınar. `PantrixFileDrop` da varsayılan seçicisini buradan alır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.FilePickRequest
import com.pantrixui.foundation.files.FilePicker
import com.pantrixui.foundation.files.LocalFilePicker
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.PantrixFileType
import com.pantrixui.foundation.files.rememberFilePicker
import com.pantrixui.foundation.theme.PantrixTheme

var samples by remember { mutableStateOf(true) }
val sample = remember {
    FilePicker { _, onPicked ->
        onPicked(listOf(PantrixFile("teklif.pdf", ByteArray(48_000)), PantrixFile("ek.pdf", ByteArray(12_000))))
    }
}
PantrixSwitchButton(
    checked = samples,
    onCheckedChange = { samples = it },
    label = "Örnek dosyalar",
    tagKey = "sample_files"
)
CompositionLocalProvider(LocalFilePicker provides sample.takeIf { samples }) {
    OfferScreen()
}

@Composable
private fun OfferScreen() {
    val picker = rememberFilePicker()
    var chosen by remember { mutableStateOf(emptyList<PantrixFile>()) }
    PantrixButton(
        text = "Teklif seç",
        onClick = {
            picker.pick(FilePickRequest(accept = listOf(PantrixFileType.Pdf), multiple = true)) { chosen = it }
        },
        variant = ButtonVariant.Outline,
        tagKey = "pick_offer"
    )
    FileLines(files = chosen, empty = "Bir teklif seçilmedi")
}

@Composable
private fun FileLines(
    files: List<PantrixFile>,
    empty: String
) {
    Column(verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.xs)) {
        if (files.isEmpty()) {
            PantrixText(text = empty, style = PantrixTheme.typography.footnote, color = PantrixTheme.colors.textSecondary)
        }
        files.forEach { file ->
            val size = file.size?.let { bytes -> " · ${(bytes + 1023) / 1024} KB" }.orEmpty()
            PantrixText(text = "${file.name}$size", style = PantrixTheme.typography.footnote)
        }
    }
}
```

### Dosya kaydettirmek

Uygulamanın yaptığı bir dosyayı kullanıcıya vermek: "Notu kaydet" platformun kaydetme penceresini açar, dosya seçilen yere yazılır ve ne olduğu altta yazar: kaydedildi, vazgeçildi ya da web'de indirme başladı.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.FileSaveResult
import com.pantrixui.foundation.files.FileSaver
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.rememberFileSaver
import com.pantrixui.foundation.theme.PantrixTheme

val saver: FileSaver = rememberFileSaver()
var result by remember { mutableStateOf<FileSaveResult?>(null) }
PantrixButton(
    text = "Notu kaydet",
    onClick = {
        val note = PantrixFile("not.txt", "Pazartesi: tasarımı gözden geçir".encodeToByteArray())
        saver.save(note) { result = it }
    },
    variant = ButtonVariant.Outline,
    tagKey = "save_note"
)
SaveLine(result, tagKey = "note_result")

@Composable
private fun SaveLine(
    result: FileSaveResult?,
    tagKey: String
) {
    PantrixText(
        text = when (result) {
            null -> "Henüz kaydedilmedi"
            FileSaveResult.Saved -> "Kaydedildi"
            FileSaveResult.Cancelled -> "Vazgeçildi"
            FileSaveResult.Started -> "İndirme başladı"
            FileSaveResult.Failed -> "Kaydedilemedi"
        },
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}
```

### Örnek kaydediciyle bir ekran

Bir ekranın kaydedicisini dışarıdan vermek: "Örnek kaydedici" açıkken ekran `LocalFileSaver` ile bir kaydedici alır ve "Raporu kaydet" pencere açmadan dosyayı alıp kaydedildi der; kapalıyken platformun penceresi açılır. Bir önizleme ya da test, ekranı değiştirmeden böyle sınar.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.files.FileSaveResult
import com.pantrixui.foundation.files.FileSaver
import com.pantrixui.foundation.files.LocalFileSaver
import com.pantrixui.foundation.files.PantrixFile
import com.pantrixui.foundation.files.rememberFileSaver
import com.pantrixui.foundation.theme.PantrixTheme

var sample by remember { mutableStateOf(true) }
val kept = remember { FileSaver { _, onResult -> onResult(FileSaveResult.Saved) } }
PantrixSwitchButton(
    checked = sample,
    onCheckedChange = { sample = it },
    label = "Örnek kaydedici",
    tagKey = "sample_saver"
)
CompositionLocalProvider(LocalFileSaver provides kept.takeIf { sample }) {
    ReportScreen()
}

@Composable
private fun ReportScreen() {
    val saver = rememberFileSaver()
    var result by remember { mutableStateOf<FileSaveResult?>(null) }
    PantrixButton(
        text = "Raporu kaydet",
        onClick = { saver.save(PantrixFile("rapor.csv", "ay,ziyaret\nekim,1200".encodeToByteArray())) { result = it } },
        variant = ButtonVariant.Outline,
        tagKey = "save_report"
    )
    SaveLine(result, tagKey = "report_result")
}

@Composable
private fun SaveLine(
    result: FileSaveResult?,
    tagKey: String
) {
    PantrixText(
        text = when (result) {
            null -> "Henüz kaydedilmedi"
            FileSaveResult.Saved -> "Kaydedildi"
            FileSaveResult.Cancelled -> "Vazgeçildi"
            FileSaveResult.Started -> "İndirme başladı"
            FileSaveResult.Failed -> "Kaydedilemedi"
        },
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}
```

## API

### rememberFilePicker

`import com.pantrixui.foundation.files.rememberFilePicker`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFilePicker(): FilePicker
```

Platformun kendi dosya seçicisi: bkz. `FilePicker`. Android'de sonuç tutan bir etkinlik ister, bir `ComponentActivity`; her Compose etkinliği öyledir. `LocalFilePicker` bir seçici verdiğinde o seçicidir.

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

### LocalFilePicker

`import com.pantrixui.foundation.files.LocalFilePicker`, `com.pantrixui:foundation` içinden

```kotlin
val LocalFilePicker: ProvidableCompositionLocal<FilePicker?>
```

`rememberFilePicker`'ın içinde verdiği seçici: bir testin ya da önizlemenin, bir ekranın bütün dosya bırakma bölgeleri için bir kerede platformunkinin yerine koyduğu seçici. Varsayılan null, platformunkini bırakır.

### rememberFileSaver

`import com.pantrixui.foundation.files.rememberFileSaver`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFileSaver(): FileSaver
```

Platformun dosya kaydetmek için kendi penceresi: bkz. `FileSaver`. Android'de sonuç tutan bir activity ister, her Compose activity'si gibi bir `ComponentActivity`. `LocalFileSaver` bir kaydedici veriyorsa o olur.

### FileSaver

`import com.pantrixui.foundation.files.FileSaver`, `com.pantrixui:foundation` içinden

```kotlin
fun interface FileSaver
```

Uygulamanın yaptığı bir dosyayı, seçtiği yerde tutsun diye kullanıcıya verir: platformun dosya kaydetmek için kendi penceresi, `FilePicker`'ın öteki yarısı.

`rememberFileSaver` platformunkini verir: Android'in belgeleri (`ACTION_CREATE_DOCUMENT`), iOS'un Dosyalar'ı, masaüstünün kendi penceresi ve tarayıcının indirmesi. Hiçbiri izin istemez: kullanıcının bir yer seçmesi oraya yazma iznidir.

```kotlin
val saver = rememberFileSaver()
PantrixButton(
    text = stringResource(Res.string.download_theme),
    onClick = { saver.save(PantrixFile("Theme.kt", source.encodeToByteArray())) { result -> show(result) } }
)
```

Bir test ya da bir kaydedici var olmadan gösterilen bir ekran kendisininkini verir:

```kotlin
val saver = FileSaver { file, onResult -> kept += file; onResult(FileSaveResult.Saved) }
```

Üyeleri:

- `fun save(file: PantrixFile, onResult: (FileSaveResult) -> Unit)`: Kullanıcıya `file`'ı, adıyla ve türüyle, nerede tutacağını sorar ve oraya yazar. `onResult` bir kez, ana iş parçacığında, ona ne olduğuyla çağrılır. Tarayıcının kaydedicisi, seçicisi gibi kullanıcının bir basışından çağrılır: tarayıcı hiçbir basışın istemediği bir indirmeyi tutabilir.

### FileSaveResult

`import com.pantrixui.foundation.files.FileSaveResult`, `com.pantrixui:foundation` içinden

```kotlin
enum class FileSaveResult
```

`FileSaver.save`'e verilen bir dosyaya ne olduğu.

Değerleri:

- `Saved`: Kullanıcı bir yer seçti ve dosya oraya yazıldı.
- `Cancelled`: Kullanıcı platformun penceresini bir yer seçmeden kapattı: hiçbir şey yazılmadı.
- `Started`: Dosya tarayıcıya verildi; tarayıcı onu kullanıcısının ayarladığı gibi tutar: indirilenler klasöründe ya da sorduğu yerde. Bir sayfaya bundan fazlası söylenmez.
- `Failed`: Dosya okunamadı ya da kullanıcının seçtiği yere yazılamadı.

### LocalFileSaver

`import com.pantrixui.foundation.files.LocalFileSaver`, `com.pantrixui:foundation` içinden

```kotlin
val LocalFileSaver: ProvidableCompositionLocal<FileSaver?>
```

`rememberFileSaver`'ın içinde verdiği kaydedici: bir testin ya da bir önizlemenin platformunkinin yerine koyduğu. Varsayılan null platformunkini bırakır.
