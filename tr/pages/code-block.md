# Code Block

Okunmak için dizilmiş kod: temanın kod yazısıyla, her satır kendi satırında, her parçası ne olduğunun renginde ve kopyalanmaya hazır. Bir belgedeki kullanım örneği, incelenen bir dosya, bir komut, iki sürümün farkı böyle gösterilir.

Blok gösterdiği dili bilmez. Kodu renklendiren, çağıranın verdiği parçalardır (`tokens`): metnin hangi harflerinin anahtar sözcük, hangilerinin metin, hangilerinin yorum olduğu. Bu sayfada onları uygulamanın kendi Kotlin okuyucusu verir; parça verilmeyen kod tek renkle yazılır.

- `PantrixCodeBlock` (`com.pantrixui.components.data.codeblock`, `com.pantrixui:components`): Okunmak için dizilmiş kod: çağıranın verdiği belirteçlerle renklenir; yana kaydırılırken yerinde kalan satır numaraları, satırlarında işaretler, bir üst bölüm ve kopyalayan bir düğmeyle. Anahtar sözcükler: kod bloğu, kod parçası, söz dizimi renklendirme, kaynak kod, kodu kopyala, eş aralıklı.

## Özellikler

- **İki biçim.** `code` alan biçim bir metni gösterir. `lines` alan biçim satırları tek tek alır: her satır kendi parçalarını ve kendisi hakkında söyleneni taşır. Bir metnin satırlarını `codeLines` verir; ekran oradan başlar ve istediği satırı işaretler.
- **Parçalar.** Sekiz tür parça vardır: düz yazı, yorum, anahtar sözcük, tür, metin, sayı, noktalama ve bir şeyin başına yazılan adlar (`@Composable`). Renkleri temanın rollerinden gelir; yorum ayrıca eğik yazılır. İki parça aynı harflerin üstündeyse sonra verilen boyar.
- **Başlık.** Kodun üstünde, söyleyecek bir şey oldukça bir başlık durur: `title`, çoğu zaman bir dosyanın adı; `language`, dilin adı; `icon`; ekranın `leading` ile başına, `trailing` ile sonuna koyduğu şey. Kopyalama düğmesi başlığın sonundadır; söyleyecek başka bir şey yoksa başlık da yoktur ve düğme kodun üstünde, kendi şeridinde durur.
- **Kopyalama ve seçme.** Düğme kodun tamamını kopyalar, ekranda hangi parçası görünüyor olursa olsun. Kopyalayınca iki saniye bir onay işareti gösterir ve bunu ekran okuyucuya da söyler; `onCopy` kodun panoya ulaşıp ulaşmadığını bildirir. Ekrandaki satırlar da seçilir, fareyle sürükleyerek ya da uzun basarak. `copyable = false` düğmeyi kaldırır, `selectable = false` seçmeyi kapatır.
- **Satır numaraları.** `lineNumbers` her satırın başına numarasını yazar; `firstLineNumber` ilk satırın numarasını verir: bir dosyadan alınmış bir parça, orada başladığı yerden başlar. Numaralar seçilmez ve ekran okuyucuya okunmaz.
- **Yana kayma.** Bloğa sığmayan satır bölünmez: kod yana kayar, satır numaraları yerinde durur. Girintisi kaybolan bir kod satırı okunmaz.
- **Bölünen satırlar.** `softWrap` ile uzun satır kendi altında sürer: sütunlardan çok sözcüklerin önemli olduğu dar bir ekran için.
- **Yükseklik.** Yükseklik verilen blokta kod o yüksekliğin içinde, yerinde duran başlığın altında kayar ve yalnızca ekrandaki satırlar kurulur. Yükseklik verilmeyen blok, kayan bir sayfada, 300 satırı geçmiyorsa satırları kadar yüksektir; daha uzun kodda pencereden yüksek olmaz ve onun içinde kayar.
- **Kaydırma çubukları.** Kaydığı yerde bloğun kendi çubuğu vardır: yan kenarında, yana kayan kodda alt kenarında da. İmleci olan okuyucuda kayacak bir şey oldukça durur ve fareyle sürüklenir; parmağın altında yalnızca kod kayarken görünür.
- **Klavye.** İmlecin olduğu yerde, kayacak bir şey varken satırlar Tab için bir duraktır. Odak oradayken ok tuşları bir satır ve, yana, bir adım kaydırır; Page Up ve Page Down bir ekran; Home ve End ilk ve son satıra gider.
- **Satır işaretleri.** Bir satırın işareti (`CodeMark`) satırın arkasına tonunun rolünün yumuşak dolgusunu, sol kenarına rolün renginde bir çubuk çizer; `message` verilirse mesaj satırın altında durur. Altı ton vardır: `Primary`, `Info`, `Success`, `Warning`, `Danger` ve `Neutral`. İşaretli satırın tamamı, temanın o dolguyla eşlediği tek renkle yazılır.
- **Kodun yazısı.** `textStyle` kodu temanın `code`'undan başka bir stille yazar: bir telefonun sayfasında daha küçük.
- **Yazı yönü.** Kod her dilde soldan sağa yazılır; başlık ve bir işaretin mesajı uygulamanın yönündedir.
- **Renk.** Temanın kendi zeminlerinde her tür parçanın kendi rengi vardır. Temanın bir rol renginin üstünde kodun tamamı orada okunan tek renkle yazılır. `CodeBlockColors` ile verilen renk kullanılır, verilmeyen temanınki kalır.
- **Platform.** Kod satırları sık durur: içlerinde basılan bir şey yoktur. Temanın kod yazısıyla bir satır 20dp'dir; Android yazının üstünde ve altında 2dp, iOS 1dp bırakır, masaüstü ve web hiç bırakmaz. Köşeler kartınkilerdir.
- **Ekran okuyucu.** Kod satır satır okunur; satır numaraları geçilir. Bir işaretin mesajı satırından sonra, tek bir şey olarak okunur.
- **Otomasyon.** `tagKey` ile blok `CodeBlock_<tagKey>`, bir satırı `CodeBlock_<tagKey>.Line_<number>`, bir satırın altındaki mesaj `CodeBlock_<tagKey>.Note_<number>`, klavyenin kaydırdığı pencere `CodeBlock_<tagKey>.Lines_window`, kopyalama düğmesi `CodeBlock_<tagKey>.Button_copy` olur. Bir kopyalama, panoya ulaşıp ulaşmadığıyla, `copy` olarak bildirilir. Koddan hiçbir şey bildirilmez.

## Kullanım

### A snippet, coloured by the app's own reader of the language

```kotlin
PantrixCodeBlock(
    code = snippet,
    tokens = remember(snippet) { kotlinTokens(snippet) },
    language = "Kotlin",
    tagKey = "usage"
)
```

### A file in a room of its own, with its lines numbered

```kotlin
PantrixCodeBlock(
    code = file.text,
    modifier = Modifier.height(320.dp),
    title = file.name,
    lineNumbers = true,
    tagKey = "source"
)
```

### A finding on the line it is about

```kotlin
val lines = remember(source, finding) {
    codeLines(source).mapIndexed { index, line ->
        if (index == finding.line) {
            line.copy(mark = CodeMark(CodeTone.Danger, message = finding.message, source = finding.rule))
        } else {
            line
        }
    }
}
PantrixCodeBlock(lines = lines, title = "AuthRepository.kt", lineNumbers = true, tagKey = "review")
```

## Örnekler

### Bir kod parçası

En yalın hâli: bir kod metni, onu renklendiren parçalar ve dilin adı. Blok dili bilmez; neyin anahtar sözcük, neyin metin, neyin yorum olduğunu `tokens` söyler. Burada onları uygulamanın kendi Kotlin okuyucusu verir.

Anahtar sözcükler temanın `primary`, türler `info`, metinler `success`, sayılar `warning`, `@` ile başlayan adlar `danger` rolünün rengindedir; yorum `textSecondary` ile ve eğik yazılır. Başlıktaki düğme kodun tamamını kopyalar ve iki saniye bir onay işareti gösterir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.PantrixCodeBlock

PantrixCodeBlock(
    code = GREETING,
    tokens = remember { kotlinTokens(GREETING) },
    language = "Kotlin",
    tagKey = "snippet"
)

private val GREETING =
    """
    @Composable
    fun Greeting(name: String) {
        // The greeting a new account is met with.
        val unread = 3
        PantrixText(text = "Hello, " + name + ": " + unread + " new messages")
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `kotlinTokens`: Kotlin kodunun renklendirilecek parçaları: anahtar sözcükler, metinler, sayılar, yorumlar, `@` ile başlayan adlar ve büyük harfle başlayan adlar, yani türler ve composable'lar. `PantrixCodeBlock` dil bilmez: neyin ne olduğunu ona çağıran söyler, bu uygulamada söyleyen de budur.

### Bir dosya, kendi yüksekliğinde

Bir dosya: `title` adını, `icon` başındaki ikonu, `lineNumbers` satır numaralarını verir. Bloğa bir yükseklik verildi: kod onun içinde, yerinde duran başlığın altında kayar ve yalnızca ekrandaki satırlar kurulur.

Sığmayan satır bölünmez. Kodu yana kaydır: satır numaraları yerinde durur, satırlar onların altından geçer. İmleci olan bir ekranda bloğun iki kaydırma çubuğu da görünür ve fareyle sürüklenir; Tab ile satırlara gelince ok tuşları kodu kaydırır.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.foundation.icons.PantrixIcons

PantrixCodeBlock(
    code = REPOSITORY,
    modifier = Modifier.height(220.dp),
    tokens = remember { kotlinTokens(REPOSITORY) },
    title = "OrderRepository.kt",
    language = "Kotlin",
    icon = PantrixIcons.Folder,
    lineNumbers = true,
    tagKey = "file"
)

private val REPOSITORY =
    """
    package com.example.orders

    import kotlinx.coroutines.flow.Flow
    import kotlinx.coroutines.flow.map

    /** Reads the orders of an account, newest first. */
    class OrderRepository(private val api: OrderApi, private val cache: OrderCache, private val clock: Clock) {
        fun orders(account: String): Flow<List<Order>> = cache.observe(account).map { it.sortedBy(Order::placedAt) }

        suspend fun refresh(account: String) {
            val fresh = api.orders(account, since = cache.newest(account))
            cache.put(account, fresh, at = clock.now())
        }

        suspend fun cancel(order: Order): Boolean {
            if (order.shipped) return false
            api.cancel(order.id)
            cache.remove(order.id)
            return true
        }
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `kotlinTokens`: Kotlin kodunun renklendirilecek parçaları: anahtar sözcükler, metinler, sayılar, yorumlar, `@` ile başlayan adlar ve büyük harfle başlayan adlar, yani türler ve composable'lar. `PantrixCodeBlock` dil bilmez: neyin ne olduğunu ona çağıran söyler, bu uygulamada söyleyen de budur.

### Bir bulgu, ilgili satırın altında

Bir inceleme: bulgu, hakkında olduğu satırın altında durur. `lines` alan biçimde her satır kendi işaretini taşır; `codeLines` metnin satırlarını verir, ekran istediğini işaretler. Bir işaret satırın arkasına tonunun rolünün yumuşak dolgusunu, sol kenarına rolün renginde bir çubuk çizer; `message` satırın altında, tonun ikonundan sonra yazılır ve `source` sonunda durur.

İşaretli satır, temanın o dolguyla eşlediği tek renkle yazılır. `firstLineNumber` parçanın dosyada başladığı yeri verir: bulgunun satırı dosyadaki numarasını taşır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.data.codeblock.codeLines

val lines = remember {
    codeLines(REVIEWED, kotlinTokens(REVIEWED)).mapIndexed { index, line ->
        when (index) {
            1 -> {
                line.copy(
                    mark = CodeMark(
                        tone = CodeTone.Danger,
                        message = "Jeton burada boş olabilir; `!!` uygulamayı çökertir.",
                        source = "kotlin:S2259"
                    )
                )
            }

            4 -> {
                line.copy(mark = CodeMark(CodeTone.Warning, message = "Süre sabiti bir ada alınmalı."))
            }

            else -> {
                line
            }
        }
    }
}
PantrixCodeBlock(
    lines = lines,
    title = "AuthRepository.kt",
    lineNumbers = true,
    firstLineNumber = 41,
    tagKey = "finding"
)

private val REVIEWED =
    """
    suspend fun token(): String {
        val cached = cache.token!!
        if (cached.isFresh()) return cached.value
        val fresh = api.refresh(cached.refreshToken)
        cache.keep(fresh, seconds = 3600)
        return fresh.value
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `kotlinTokens`: Kotlin kodunun renklendirilecek parçaları: anahtar sözcükler, metinler, sayılar, yorumlar, `@` ile başlayan adlar ve büyük harfle başlayan adlar, yani türler ve composable'lar. `PantrixCodeBlock` dil bilmez: neyin ne olduğunu ona çağıran söyler, bu uygulamada söyleyen de budur.

### Eklenen ve çıkarılan satırlar

Mesajı olmayan bir işaret yalnızca bir banttır: iki sürümün farkında eklenen satırlar `Success`, çıkarılanlar `Danger` tonunda. Bandın ne demek olduğunu burada satırın başındaki `+` ve `-` de söyler: bir renk, onu göremeyene bir şey söylemez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.data.codeblock.codeLines

val lines = remember {
    codeLines(CHANGES, kotlinTokens(CHANGES)).map { line ->
        when {
            line.text.startsWith("+") -> line.copy(mark = CodeMark(CodeTone.Success))
            line.text.startsWith("-") -> line.copy(mark = CodeMark(CodeTone.Danger))
            else -> line
        }
    }
}
PantrixCodeBlock(lines = lines, title = "Greeting.kt", tagKey = "changes")

private val CHANGES =
    """
      @Composable
      fun Greeting(name: String) {
    -     PantrixText(text = "Hello")
    +     PantrixText(text = "Hello, " + name)
    +     PantrixDivider()
      }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `kotlinTokens`: Kotlin kodunun renklendirilecek parçaları: anahtar sözcükler, metinler, sayılar, yorumlar, `@` ile başlayan adlar ve büyük harfle başlayan adlar, yani türler ve composable'lar. `PantrixCodeBlock` dil bilmez: neyin ne olduğunu ona çağıran söyler, bu uygulamada söyleyen de budur.

### Bir kılavuzun adımları

İşaretler ekranın verisidir: bir kılavuzun hangi adımında olunduğu değişince başka satırlar öne çıkar. Burada her adım kendi satırlarını `Primary` tonuyla işaretler; adımı değiştir, bant öteki satırlara geçer.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.CodeMark
import com.pantrixui.components.data.codeblock.CodeTone
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.data.codeblock.codeLines
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var step by remember { mutableIntStateOf(0) }
val lines = remember(step) {
    codeLines(GREETING, kotlinTokens(GREETING)).mapIndexed { index, line ->
        if (index in STEP_LINES[step]) line.copy(mark = CodeMark(CodeTone.Primary)) else line
    }
}
PantrixSegmentButton(
    options = STEPS,
    selected = step,
    onSelect = { step = it },
    fullWidth = false,
    tagKey = "step"
)
PantrixCodeBlock(lines = lines, lineNumbers = true, copyable = false, tagKey = "steps")

private val STEPS = listOf(
    SegmentOption(value = 0, label = "1. İmza", tagKey = "signature"),
    SegmentOption(value = 1, label = "2. Durum", tagKey = "state"),
    SegmentOption(value = 2, label = "3. Çizim", tagKey = "drawing")
)

private val STEP_LINES = listOf(0..1, 3..3, 4..4)

private val GREETING =
    """
    @Composable
    fun Greeting(name: String) {
        // The greeting a new account is met with.
        val unread = 3
        PantrixText(text = "Hello, " + name + ": " + unread + " new messages")
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `kotlinTokens`: Kotlin kodunun renklendirilecek parçaları: anahtar sözcükler, metinler, sayılar, yorumlar, `@` ile başlayan adlar ve büyük harfle başlayan adlar, yani türler ve composable'lar. `PantrixCodeBlock` dil bilmez: neyin ne olduğunu ona çağıran söyler, bu uygulamada söyleyen de budur.

### Bölünen satırlar

Uzun bir komut. `softWrap` ile satır bloğa sığmadığı yerde kendi altında sürer ve blok yana kaymaz; kapalıyken komut tek satırdır ve kod yana kayar. Anahtarı çevir, ikisini karşılaştır.

Bölünen bir satır girintisini kaybeder: `softWrap` bir komut ya da bir günlük satırı için iyidir, girintisi anlam taşıyan kod için değil.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var wraps by remember { mutableStateOf(true) }
PantrixSwitchButton(
    checked = wraps,
    onCheckedChange = { wraps = it },
    label = "Uzun satır kendi altında sürsün",
    tagKey = "code_wraps"
)
PantrixCodeBlock(code = COMMAND, softWrap = wraps, language = "Shell", tagKey = "command")

private val COMMAND =
    "./gradlew :ui:components:jvmTest --tests 'com.pantrixui.components.CodeBlockTest' --offline --console=plain"
```

### Kopyalama ve başlığın sonu

`onCopy` düğmeye basıldıktan sonra, kodun panoya ulaşıp ulaşmadığıyla çağrılır: bunu kendi yoluyla söyleyen ekran burayı dinler. `trailing` başlığın sonuna, kopyalama düğmesinden önce ekranın kendi şeyini koyar: burada satır sayısı.

İkinci blokta `copyable` ve `selectable` kapalı, başlıkta duracak başka bir şey de yok: başlığı yoktur ve kod seçilmez.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
PantrixCodeBlock(
    code = DEPENDENCIES,
    title = "build.gradle.kts",
    onCopy = { copied -> report(if (copied) "Kod panoya kopyalandı" else "Kod panoya kopyalanamadı") },
    trailing = { PantrixText(text = "4 satır", style = PantrixTheme.typography.caption) },
    tagKey = "copied"
)
PantrixCodeBlock(code = DEPENDENCIES, selectable = false, copyable = false, tagKey = "plain")

private val DEPENDENCIES =
    """
    dependencies {
        implementation("com.pantrixui:foundation:0.1.0")
        implementation("com.pantrixui:components:0.1.0")
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Başlıkta sekmeler

`leading` başlığın başına, ikondan ve başlıktan önce ekranın kendi şeyini koyar: burada aynı satırın iki biçimi arasında seçen iki sekme, bir belgelemenin kurulum adımındaki gibi. Başlığın yazı renginde yazılırlar.

`textStyle` kodu temanın `code`'undan başka bir stille yazar: burada `caption` boyunda, kodun ailesiyle, dar bir sütun için. `style`'ın `headerLineWidth`'i başlığın altındaki çizginin kalınlığıdır; `headerHorizontalPadding` başlıktakileri kenara satırlardan daha yakın durdurur.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.codeblock.CodeBlockStyle
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

var form by remember { mutableIntStateOf(0) }
val code = FORMS[form].second
val type = PantrixTheme.typography
PantrixCodeBlock(
    code = code,
    tokens = remember(code) { kotlinTokens(code) },
    style = CodeBlockStyle(headerLineWidth = 2.dp, headerHorizontalPadding = PantrixTheme.spacing.xs),
    leading = {
        FORMS.forEachIndexed { index, (name, _) ->
            PantrixButton(
                text = name,
                onClick = { form = index },
                variant = if (index == form) ButtonVariant.Soft else ButtonVariant.Text,
                size = ButtonSize.Small,
                tagKey = "form_$index"
            )
        }
    },
    textStyle = type.caption.copy(fontFamily = type.code.fontFamily),
    tagKey = "tabs"
)

private val FORMS = listOf(
    "Kotlin" to """implementation("com.pantrixui:components:0.1.0")""",
    "Groovy" to """implementation 'com.pantrixui:components:0.1.0'"""
)
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `kotlinTokens`: Kotlin kodunun renklendirilecek parçaları: anahtar sözcükler, metinler, sayılar, yorumlar, `@` ile başlayan adlar ve büyük harfle başlayan adlar, yani türler ve composable'lar. `PantrixCodeBlock` dil bilmez: neyin ne olduğunu ona çağıran söyler, bu uygulamada söyleyen de budur.

### Bir kartın içinde, kendi renkleriyle

Bloğun kendi dolgusu ve kenarı vardır: dolgu temanın `surface`'ı, kenar temanın `divider`'ıdır. İkisi de olan bir kartın içinde `colors` ikisini de saydam verir. Verilen renk kullanılır, verilmeyen temanınki kalır.

`style` bloğun geometrisini değiştirir; yalnızca verilen alanlar değişir. Burada satırlar kartın iç boşluğunun bittiği yerden başlasın diye `horizontalPadding` sıfır verildi.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.data.codeblock.CodeBlockColors
import com.pantrixui.components.data.codeblock.CodeBlockStyle
import com.pantrixui.components.data.codeblock.PantrixCodeBlock
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
    PantrixText(text = "Kurulum", style = PantrixTheme.typography.title)
    PantrixCodeBlock(
        code = DEPENDENCIES,
        tokens = remember { kotlinTokens(DEPENDENCIES) },
        style = CodeBlockStyle(horizontalPadding = 0.dp),
        colors = CodeBlockColors(container = Color.Transparent, border = Color.Transparent),
        tagKey = "in_a_card"
    )
}

private val DEPENDENCIES =
    """
    dependencies {
        implementation("com.pantrixui:foundation:0.1.0")
        implementation("com.pantrixui:components:0.1.0")
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `kotlinTokens`: Kotlin kodunun renklendirilecek parçaları: anahtar sözcükler, metinler, sayılar, yorumlar, `@` ile başlayan adlar ve büyük harfle başlayan adlar, yani türler ve composable'lar. `PantrixCodeBlock` dil bilmez: neyin ne olduğunu ona çağıran söyler, bu uygulamada söyleyen de budur.

### Elle yazılan parçalar

Blok bir dil okuyucusu taşımaz; parçaları uygulama verir. Okuyucusu olmayan kısa bir metnin parçaları elle de yazılır: her `CodeToken` satırdaki bir aralığın (`start`'tan `end`'e) ne olduğudur (`CodeTokenKind`). Burada bir kabuk komutunun satırları doğrudan `CodeLine` olarak kuruldu: yorum `Comment`, komut `Keyword`, görev `StringLiteral`, seçenek `Type`.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.codeblock.CodeLine
import com.pantrixui.components.data.codeblock.CodeToken
import com.pantrixui.components.data.codeblock.CodeTokenKind
import com.pantrixui.components.data.codeblock.PantrixCodeBlock

PantrixCodeBlock(lines = SHELL_LINES, language = "Shell", tagKey = "hand_tokens")

private val SHELL_LINES = listOf(
    CodeLine(text = "# Masaüstü demosunu çalıştır", tokens = listOf(CodeToken(0, 28, CodeTokenKind.Comment))),
    CodeLine(
        text = "./gradlew :app:desktopApp:run --offline",
        tokens = listOf(
            CodeToken(0, 9, CodeTokenKind.Keyword),
            CodeToken(10, 29, CodeTokenKind.StringLiteral),
            CodeToken(30, 39, CodeTokenKind.Type)
        )
    )
)
```

## API

### PantrixCodeBlock

`import com.pantrixui.components.data.codeblock.PantrixCodeBlock`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCodeBlock(
    code: String,
    modifier: Modifier = Modifier,
    tokens: List<CodeToken> = emptyList(),
    title: String? = null,
    language: String? = null,
    icon: ImageVector? = null,
    lineNumbers: Boolean = false,
    firstLineNumber: Int = 1,
    softWrap: Boolean = false,
    selectable: Boolean = true,
    copyable: Boolean = true,
    onCopy: ((copied: Boolean) -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    style: CodeBlockStyle? = null,
    colors: CodeBlockColors? = null,
    tagKey: String? = null,
    leading: (@Composable RowScope.() -> Unit)? = null,
    textStyle: TextStyle? = null
)
```

Okunmak için dizilmiş kod: temanın kod yazısıyla, her satır kendi satırında, her parçası ne olduğunun renginde ve kopyalanmaya hazır.

Blok gösterdiği dili bilmez. Kodu renklendiren, çağıranın verdiği `tokens`'tır: metnin parçaları ve her birinin ne olduğu, kodu okuyan her neyse onun bulduğu gibi. Parça verilmeyen kod tek renkle yazılır.

Kodun üstünde, söyleyecek bir şey oldukça bir başlık durur: çoğu zaman bir dosyanın adı olan `title`, `language`, bir `icon`, ekranın `trailing` ile koyduğu şey. Kopyalama düğmesi başlığın sonunda durur; oraya koyacak başka bir şeyi olmayan bloğun başlığı yoktur ve düğme kodun üstünde, kendi şeridinde durur. O düğme kodun tamamını kopyalar, ekranda hangi parçası olursa olsun, ve ardından kısa bir süre bir onay işareti gösterir. Ekrandaki kod da seçilir ve parça parça kopyalanır.

Bloğa sığmayan satır bölünmez: kod, yerinde duran satır numaralarının altında yana kayar. Yerin bittiği yerde bölünen bir kod satırı, girintisinin söylediğini kaybeder. `softWrap` ile satır yine de kendi altında sürer: sütunlardan çok sözcüklerin önemli olduğu dar bir ekran için.

Blok kendisine verilen genişliği doldurur. Yükseklik verilirse kod onun içinde, yerinde duran başlığın altında kayar ve yalnızca ekrandaki satırlar kurulur. Yükseklik verilmezse, kayan bir sayfada, üç yüz satırı geçmiyorsa satırları kadar yüksektir; daha uzun kod orada pencereden yüksek olmaz ve onun içinde kayar. Kaydığı yerde kenarındaki bir çubuk ne kadar kaydığını gösterir ve fareyle sürüklenir.

İmlecin olduğu yerde, kayacak bir şey varken satırlar Tab için bir duraktır: odak oradayken ok tuşları bir satır ve, yana, bir adım kaydırır; Page Up ve Page Down bir ekran dolusu satır; Home ve End ilk ve son satıra gider. Ekran okuyucu kodu satır satır okur ve satır numaralarını geçer.

Kod her dilde soldan sağa yazılır, burada satırları da öyledir. Başlık uygulamanın yönünde dizilir.

```kotlin
PantrixCodeBlock(code = snippet, language = "Kotlin", tagKey = "usage")
```

Parametreler:

- `code: String`: Kod. Satırları bir satır beslemede, bir satır başında ya da ikisi birlikteyken biter; metni bitiren satır sonu yeni bir satır başlatmaz.
- `modifier: Modifier`: Bloğun modifier'ı. Burada verilen yükseklik, kodun içinde kaydığı yerdir.
- `tokens: List<CodeToken>`: `code`'un rengi olan parçaları; yerleri metnin tamamının harfleriyle sayılır. Verilmezse hiçbiri yoktur.
- `title: String?`: Başlığın ilk söylediği: bir dosyanın adı ya da kodun ne olduğu. Başlığa sığmayan ad kısaltılır.
- `language: String?`: Dilin adı; başlıkta addan sonra, okunacağı gibi yazılır: `Kotlin`, `TS`. Blok bir dil listesi tutmaz.
- `icon: ImageVector?`: Adın önündeki ikon.
- `lineNumbers: Boolean`: Her satırın, numarasını kodun önünde taşıyıp taşımadığı.
- `firstLineNumber: Int`: İlk satırın numarası. Bir dosyadan alınmış bir parça, orada başladığı yerden başlar.
- `softWrap: Boolean`: Bloğa sığmayan satırın kendi altında sürüp sürmediği. Verilmezse hiçbir satır sürmez ve kod yana kayar.
- `selectable: Boolean`: Kodun seçilip seçilemediği: üstünde bir imleç sürüklenerek ya da parmak basılı tutularak seçilir ve sistemin kendi yoluyla kopyalanır. Böyle kopyalanan, ekrandaki satırların gösterdiğidir: numaraları ve haklarında söylenen olmadan. Kendi yüksekliğinde kayan kod yalnızca ekranındaki satırları kurmuştur; orada "tümünü seç" de onları seçer. Düğme ise kodun tamamını kopyalar.
- `copyable: Boolean`: Blokta kodu kopyalayan düğmenin olup olmadığı.
- `onCopy: ((copied: Boolean) -> Unit)?`: O düğmeye basıldıktan sonra, kodun panoya ulaşıp ulaşmadığıyla çağrılır: bunu kendi yoluyla söyleyen ekran burayı dinler. Düğmenin kendisi kısa bir süre bir onay işareti gösterir ve ekran okuyucuya söyler; sistem her kopyayı kendisi gösteriyorsa (`PantrixClipboard.traits`) söylemez: orada başka bir şey gerekmez.
- `trailing: (@Composable () -> Unit)?`: Ekranın başlığın sonuna, kopyalama düğmesinden önce koyduğu şey: bir sayı, kendi düğmesi. Bloğun yazı rengiyle çizilir.
- `style: CodeBlockStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Her platformda yalnızca verdiği alanlar değişir.
- `colors: CodeBlockColors?`: Bu bloğun, temadan gelmeyen kendi renkleri: burada verilenler kullanılır, gerisi temanınki kalır.
- `tagKey: String?`: Bloğun otomasyon anahtarı: blok `CodeBlock_<tagKey>`, bir satırı `CodeBlock_<tagKey>.Line_<number>`, bir satırın altındaki mesaj `CodeBlock_<tagKey>.Note_<number>`, klavyenin kaydırdığı satır penceresi `CodeBlock_<tagKey>.Lines_window`, kopyalama düğmesi `CodeBlock_<tagKey>.Button_copy` olur. O düğmeye basış, kodun panoya ulaşıp ulaşmadığıyla, bir `CodeBlock` `copy` olayı olarak bildirilir. Koddan hiçbir şey bildirilmez.
- `leading: (@Composable RowScope.() -> Unit)?`: Ekranın başlığın başına, ikondan ve başlıktan önce koyduğu şey; başlığın renginde yazılır: bir belge sayfasının iki depo için bir kurulumu gösterdiği gibi, aynı dosyanın iki biçiminin sekmeleri.
- `textStyle: TextStyle?`: Kodun yazıldığı stil: verilmezse temanın `code`'u, bir telefonun sayfasında daha küçüğü.

### PantrixCodeBlock

`import com.pantrixui.components.data.codeblock.PantrixCodeBlock`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixCodeBlock(
    lines: List<CodeLine>,
    modifier: Modifier = Modifier,
    title: String? = null,
    language: String? = null,
    icon: ImageVector? = null,
    lineNumbers: Boolean = false,
    firstLineNumber: Int = 1,
    softWrap: Boolean = false,
    selectable: Boolean = true,
    copyable: Boolean = true,
    onCopy: ((copied: Boolean) -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
    style: CodeBlockStyle? = null,
    colors: CodeBlockColors? = null,
    tagKey: String? = null,
    leading: (@Composable RowScope.() -> Unit)? = null,
    textStyle: TextStyle? = null
)
```

Satırları tek tek verilen `PantrixCodeBlock`; her satır kendisi hakkında söyleneni taşır: bakılacak bir satırın arkasındaki bant, eklenen ve çıkarılan satırlar, hakkında olduğu satırın altında mesajıyla bir bulgu.

`codeLines` bir metnin satırlarını verir; işaretlemeye oradan başlanır.

```kotlin
val lines = remember(source, finding) {
    codeLines(source).mapIndexed { index, line ->
        if (index == finding.line) line.copy(mark = CodeMark(CodeTone.Danger, message = finding.message)) else line
    }
}
PantrixCodeBlock(lines = lines, title = "AuthRepository.kt", lineNumbers = true, tagKey = "review")
```

İşaretli bir satır, tonunun rolünün yumuşak dolgusu üstüne çizilir ve temanın o dolguyla eşlediği tek renkle yazılır; sol kenarından rolün renginde bir çubuk iner. Bir işaretin mesajı satırının altında, tonun ikonundan sonra, uygulamanın kendi okuma yönünde durur ve kodla birlikte yana kaymaz.

Parametreler:

- `lines: List<CodeLine>`: Satırlar, sırasıyla. Düğme onların metinlerini satır satır kopyalar.
- `modifier: Modifier`: Bloğun modifier'ı. Burada verilen yükseklik, kodun içinde kaydığı yerdir.
- `title: String?`: Başlığın ilk söylediği: bir dosyanın adı ya da kodun ne olduğu.
- `language: String?`: Dilin adı; başlıkta addan sonra, okunacağı gibi yazılır.
- `icon: ImageVector?`: Adın önündeki ikon.
- `lineNumbers: Boolean`: Her satırın, numarasını kodun önünde taşıyıp taşımadığı.
- `firstLineNumber: Int`: İlk satırın numarası. Bir dosyadan alınmış bir parça, orada başladığı yerden başlar.
- `softWrap: Boolean`: Bloğa sığmayan satırın kendi altında sürüp sürmediği.
- `selectable: Boolean`: Kodun seçilip sistemin kendi yoluyla kopyalanıp kopyalanamadığı.
- `copyable: Boolean`: Blokta kodu kopyalayan düğmenin olup olmadığı.
- `onCopy: ((copied: Boolean) -> Unit)?`: O düğmeye basıldıktan sonra, kodun panoya ulaşıp ulaşmadığıyla çağrılır.
- `trailing: (@Composable () -> Unit)?`: Ekranın başlığın sonuna, kopyalama düğmesinden önce koyduğu şey.
- `style: CodeBlockStyle?`: bu çağrının kendi stili: çevreleyen her stilin üstünde, yoğunluğun altında. Her platformda yalnızca verdiği alanlar değişir.
- `colors: CodeBlockColors?`: Bu bloğun, temadan gelmeyen kendi renkleri: burada verilenler kullanılır, gerisi temanınki kalır.
- `tagKey: String?`: Bloğun otomasyon anahtarı; öteki biçimdeki gibi.
- `leading: (@Composable RowScope.() -> Unit)?`: Ekranın başlığın başına, ikondan ve başlıktan önce koyduğu şey: bir dosyanın iki biçiminin sekmeleri, başlığın renginde yazılır.
- `textStyle: TextStyle?`: Kodun yazıldığı stil: verilmezse temanın `code`'u.

### codeLines

`import com.pantrixui.components.data.codeblock.codeLines`, `com.pantrixui:components` içinden

```kotlin
fun codeLines(
    code: String,
    tokens: List<CodeToken> = emptyList()
): List<CodeLine>
```

`code`'un satırları; her biri, `tokens`'ın üstüne düşen parçalarıyla: bir metin alan `PantrixCodeBlock`'a verilen budur, satırların bir kısmını kendisi işaretleyen ekran da buradan başlar.

```kotlin
val lines = remember(source) {
    codeLines(source, kotlinTokens(source)).mapIndexed { index, line ->
        if (index == failed) line.copy(mark = CodeMark(CodeTone.Danger, message = why)) else line
    }
}
PantrixCodeBlock(lines = lines, lineNumbers = true)
```

Bir satır satır beslemede, satır başında ya da ikisi birlikteyken biter. Metni bitiren satır sonu son satırı bitirir ve yenisini başlatmaz: dosyaların bittiği gibi biten bir dosyanın ardında boş bir satır yoktur. Boş bir metin tek bir boş satırdır.

Döndürdüğü: metnin sırasıyla satırlar; onları bitiren olmadan.

Parametreler:

- `code: String`: Metin.
- `tokens: List<CodeToken>`: `code`'un rengi olan parçaları; yerleri metnin tamamının harfleriyle sayılır. Bir satırın sonunu aşan parça, birkaç satırlık bir yorum gibi, her satır için bir parçaya bölünür.

### CodeLine

`import com.pantrixui.components.data.codeblock.CodeLine`, `com.pantrixui:components` içinden

```kotlin
data class CodeLine(
    public val text: String,
    public val tokens: List<CodeToken> = emptyList(),
    public val mark: CodeMark? = null
)
```

Bir `PantrixCodeBlock`'un bir satırı: ne yazdığı, nasıl renklendirildiği ve hakkında ne söylendiği.

Bir satır hakkında söyleneni satırın kendisi taşır; satırların yanında, numarasının altında tutulmaz: bir numara, blokta olmayan bir satırı gösterebilir.

Parametreler:

- `text: String`: Satır; onu bitiren olmadan. İçindeki bir sekme, yazının onu çizdiği genişlikte çizilir: sütunların hizalanması gereken yerde boşluğu boşluk karakterleriyle yaz.
- `tokens: List<CodeToken>`: `text`'in rengi olan parçaları; her birinin yeri bu satırın harfleriyle sayılır.
- `mark: CodeMark?`: Satır hakkında söylenen, ya da hiçbir şey.

### CodeToken

`import com.pantrixui.components.data.codeblock.CodeToken`, `com.pantrixui:components` içinden

```kotlin
data class CodeToken(
    public val start: Int,
    public val end: Int,
    public val kind: CodeTokenKind
)
```

Bir kod metninin renkli bir parçası: `start`'tan `end`'e kadarki harfler ve ne oldukları.

Yeri, birlikte verildiği metnin harfleriyle sayılır: `codeLines` için metnin tamamının harfleriyle, ki o birkaç satırı aşan bir parçayı her satır için bir parçaya böler; bir `CodeLine` için satırın kendi harfleriyle. İki parça aynı harflerin üstündeyse sonra gelen boyar. Metnin sonunu aşan kısım orada kesilir; içinde bir şey olmayan parça hiçbir şeyi boyamaz.

Parametreler:

- `start: Int`: Parçanın ilk harfinin yeri; sıfırdan sayılır.
- `end: Int`: Son harfinden sonraki yer.
- `kind: CodeTokenKind`: Parçanın ne olduğu.

### CodeTokenKind

`import com.pantrixui.components.data.codeblock.CodeTokenKind`, `com.pantrixui:components` içinden

```kotlin
enum class CodeTokenKind
```

Bir kod parçasının ne olduğu; rengini veren de budur.

Temanın onları ayırt edecek rengi olduğu kadar tür vardır: ancak komşusu gibi çizilebilecek bir tür, iki ayrı şeyin bir olduğunu söylerdi. Bir dili okuyan daha fazlasını biliyorsa gerisini bunlara katar: bir işleç `Punctuation`, bir özellik `Plain`, bir metnin içindeki kaçış ise `StringLiteral`'ın parçasıdır.

Değerleri:

- `Plain`: Başka hiçbir türün sahiplenmediği: adlar, sözcüklerin arasındaki boşluk. Bu türden bir parça, altındakinin rengini kaldırır.
- `Comment`: Yorum. Renkli olduğu gibi eğik de yazılır.
- `Keyword`: Dilin bir sözcüğü: `fun`, `val`, `return`.
- `Type`: Bir türün adı.
- `StringLiteral`: Tırnaklarıyla birlikte bir metin ya da bir karakter.
- `Number`: Bir sayı.
- `Punctuation`: Parantezler, virgüller, noktalı virgüller: kodu bir arada tutan ve kendisi bir şey söylemeyen.
- `Annotation`: Ardından geleni niteleyen bir ad: `@Composable`, `@Override`, bir dekoratör, bir öznitelik.

### CodeMark

`import com.pantrixui.components.data.codeblock.CodeMark`, `com.pantrixui:components` içinden

```kotlin
data class CodeMark(
    public val tone: CodeTone,
    public val message: String? = null,
    public val source: String? = null
)
```

Bir kod satırı hakkında söylenen: satırın arkasında `tone`'un rolünün yumuşak dolgusunda bir bant, sol kenarında rolün renginde bir çubuk ve, `message` verilirse, satırın altında mesaj.

```kotlin
// The line someone was sent to:
CodeMark(CodeTone.Primary)
// A finding, with what reported it:
CodeMark(CodeTone.Danger, message = "This may be null here.", source = "kotlin:S2259")
```

Parametreler:

- `tone: CodeTone`: İşaretin ne demek olduğu.
- `message: String?`: Satırın altına yazılan; uygulamanın kendi sözleriyle ve okuma yönünde. Ekran okuyucu ona satırdan sonra gelir. Verilmezse yoktur: yalnızca bant kalır.
- `source: String?`: Bunu söyleyen; mesajın sonunda durur: bir kuralın ya da bir denetimin adı. Yalnızca mesajla birlikte yazılır.

### CodeTone

`import com.pantrixui.components.data.codeblock.CodeTone`, `com.pantrixui:components` içinden

```kotlin
enum class CodeTone
```

Bir kod satırındaki işaretin ne demek olduğu: bandının ve çubuğunun çizildiği, temanın rolü.

Bir boya, onu göremeyene bir şey söylemez. Bir işaretin ne demek olduğu, mesajında sözle yazar.

Değerleri:

- `Primary`: Markanın rengi: birinin gönderildiği satır, bir kılavuzun bir adımının anlattığı satır.
- `Info`: İyi ya da kötü olmayan, bilinmeye değer bir şey.
- `Success`: İyi giden bir şey: eklenen bir satır, geçen bir denetim.
- `Warning`: Sorun olmadan önce bakılacak bir şey.
- `Danger`: Yanlış giden bir şey: bir bulgu, bir hata, çıkarılan bir satır.
- `Neutral`: İçinde bir yargı olmadan ayrı tutulan.

### CodeBlockStyle

`import com.pantrixui.components.data.codeblock.CodeBlockStyle`, `com.pantrixui:components` içinden

```kotlin
class CodeBlockStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val linePadding: Dp = Dp.Unspecified,
    public val headerHeight: Dp = Dp.Unspecified,
    public val gutterGap: Dp = Dp.Unspecified,
    public val iconSize: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val barWidth: Dp = Dp.Unspecified,
    public val headerLineWidth: Dp = Dp.Unspecified,
    public val headerHorizontalPadding: Dp = Dp.Unspecified
) : PantrixStyle<CodeBlockStyle>
```

`PantrixCodeBlock`'un geometrisi: satırlarının çevresindeki boşluk, başlığı, satırlar numaralıyken kodun önündeki yer ve kenar.

Satırlar, kod satırları gibi sık durur: içlerinde basılan bir şey yoktur ve parmak için yer gerekmez. Temanın kod yazısıyla bir satır 20dp'dir; Android yazının üstünde ve altında 2dp, iOS 1dp bırakır, masaüstü ve web hiç bırakmaz.

Köşeler her platformda kartın köşeleridir: Android'de orta, iOS'ta büyük, masaüstünde ve web'de küçük.

İç boşluklar, başlığın yüksekliği ve aralık yoğunlukla ölçeklenir, çünkü yazının çevresindeki boşluktur. İkonların boyutu, kenarın ve bir işaretin çubuğunun kalınlığı ve şekil ölçeklenmez.

Parametreler:

- `shape: ShapeSpec`: Bloğun köşeleri: markanın şekil ölçeğinden bir basamak ya da sabit bir şekil.
- `horizontalPadding: Dp`: Bloğun yanları ile içindekiler arasındaki boşluk: başlığın yazısı, satırlar, bir satırın altındaki mesaj. Bir işaretin bandı bu boşluğun üstünden, yanlara kadar çizilir.
- `verticalPadding: Dp`: İlk satırın üstündeki ve son satırın altındaki, bir de bir mesajın altındaki boşluk. Bir mesajın yazısının üstünde bunun yarısı vardır.
- `linePadding: Dp`: Her satırın yazısının üstündeki ve altındaki boşluk.
- `headerHeight: Dp`: Başlığın en az yüksekliği. İçinde durana göre büyür. Başlığında kopyalama düğmesinden başka bir şey olmayan bloğun başlığı yoktur: düğmenin şeridi düğme kadar yüksektir.
- `gutterGap: Dp`: Satırlar numaralıyken, satır numaraları ile kod arasındaki aralık.
- `iconSize: Dp`: Başlıktaki ikonun, kopyalama düğmesinin ikonunun ve bir mesajın önündeki ikonun eni ve boyu.
- `borderWidth: Dp`: Bloğun çevresindeki kenarın ve, `headerLineWidth` verilmediğinde, başlığının altındaki çizginin kalınlığı. Sıfır hiçbirini çizmez.
- `barWidth: Dp`: İşaretli bir satırın sol kenarından inen çubuğun kalınlığı. Sıfır verilirse çizilmez.
- `headerLineWidth: Dp`: Başlığın altındaki çizginin kalınlığı: verilmezse `borderWidth`; böylece kenarı olmayan bir bloğun başlığı da bir çizgiyle ayrılabilir. Sıfır hiçbirini çizmez.
- `headerHorizontalPadding: Dp`: Bloğun yanlarıyla başlığındakiler arasındaki boşluk: verilmezse `horizontalPadding`. Başlığın başındaki sekmeler kenara satırlardan daha yakın durur.

### CodeBlockColors

`import com.pantrixui.components.data.codeblock.CodeBlockColors`, `com.pantrixui:components` içinden

```kotlin
data class CodeBlockColors(
    public val container: Color = Color.Unspecified,
    public val text: Color = Color.Unspecified,
    public val comment: Color = Color.Unspecified,
    public val keyword: Color = Color.Unspecified,
    public val type: Color = Color.Unspecified,
    public val string: Color = Color.Unspecified,
    public val number: Color = Color.Unspecified,
    public val punctuation: Color = Color.Unspecified,
    public val annotation: Color = Color.Unspecified,
    public val lineNumber: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir blok için `PantrixCodeBlock`'un renkleri: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// No fill and no edge of its own, in a card that has both:
PantrixCodeBlock(
    code = snippet,
    colors = CodeBlockColors(container = Color.Transparent, border = Color.Transparent)
)
```

Temanın kendi zeminlerinde her tür parçanın, temanın rollerinden, kendi rengi vardır. Başka bir dolgunun üstünde o renklerin okunup okunmayacağı bilinmez. Temanın rol renklerinden biri olan bir `container` da, üstünde duranlara renk veren bir dolgunun üstündeki saydam bir dolgu da kodun tamamını orada okunan tek renkle yazar; temada olmayan bir dolgu ise onu temanın yazı rengiyle yazar. Burada verilen her renk, blok nerede durursa dursun kullanılır.

İşaretli bir satır, tonunun rolünün yumuşak dolgusu üstüne çizilir ve tamamı, bir tablonun tonlu satırı gibi, temanın o dolguyla eşlediği tek renkle yazılır: parça türlerinin renkleri temanın zeminleri içindir ve bir rolün dolgusu üstünde okunup okunmayacağı bilinmez. Yorum orada da eğik yazılır.

Parametreler:

- `container: Color`: Başlığın ve satırların arkasındaki dolgu: temanın `surface`'ı. `Color.Transparent` verilirse bloğun arkasındaki görünür.
- `text: Color`: Hiçbir parçanın boyamadığı yazı ve başlıktaki ad. Temanın `textPrimary`'si.
- `comment: Color`: Yorum; ayrıca eğik yazılır. Temanın `textSecondary`'si.
- `keyword: Color`: Dilin bir sözcüğü. Temanın primary rolü.
- `type: Color`: Bir türün adı. Temanın info rolü.
- `string: Color`: Bir metin. Temanın success rolü.
- `number: Color`: Bir sayı. Temanın warning rolü.
- `punctuation: Color`: Parantezler, virgüller ve noktalı virgüller. Temanın `textSecondary`'si.
- `annotation: Color`: Ardından geleni niteleyen bir ad. Temanın danger rolü.
- `lineNumber: Color`: Satır numaraları, başlıktaki dil ve ikon, kopyalama düğmesinin ikonu ve kaydırma çubukları. Temanın `textSecondary`'si.
- `border: Color`: Bloğun çevresindeki kenar ve başlığının altındaki çizgi. Temanın kendi zeminlerinde temanın `divider`'ıdır; o çizginin okunmayacağı bir dolgunun üstünde ise orada yazılan rengin bir payıdır.
