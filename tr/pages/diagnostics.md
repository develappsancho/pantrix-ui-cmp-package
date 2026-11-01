# Tanılama

Yalnızca çalışan bir ekranın gösterebildiği kusurlar: tanılaması açık bir tema onları arar ve bulduğunu bir alıcıya verir. Pantrix derlemenin türünü bilmez; uygulama tanılamayı kendi debug derlemesinde açar. Bu uygulamada tanılama açıktır, "Ayarlar"dan kapatılır.

## Özellikler

- **Alıcı.** `PantrixTheme(diagnostics = …)`: `PantrixDiagnostics.Off`, varsayılan, hiçbir şey aramaz; `PantrixDiagnostics.Log` platformun günlüğüne yazar; `PantrixFindings` testler ve inspector için toplar. İçteki bir tema kendi alıcısını alabilir; `LocalPantrixDiagnostics` o noktadaki alıcıdır.
- **Altı denetim.** `PantrixCheck`: iki düğümde aynı etiket, okunmayan renkler, sıkışan dokunma hedefi, boş bir ad, dili için sözleri olmayan bir tema ve gölgede kalan bir kısayol.
- **Bulgu.** `PantrixFinding`: denetimi, bileşeni, etiketi, bölümü, İngilizce iletisi ve ölçtüğü değerler.
- **Ne zaman.** Bir bulgu sürdüğü sürece bir kez bildirilir; yerleşimin bulduğu yarım saniye, yinelenen bir etiket bir buçuk saniye sürerse: bir sayfa geçişi iki sayfayı aynı etiketlerle birlikte gösterir.
- **Kendi bileşenin.** `Modifier.checkName` ve `Modifier.checkContrast` (`ContrastPair`, `ContrastNeed`) bir bileşeni denetimlere katar; `contrastRatio` iki rengin WCAG oranıdır.

## Örnekler

### Okunmayan renkler

Bir markanın soluk rengi, üstüne beyaz yazılmış: düğmenin sözleri zor okunur. Örneğin kendi teması bulduğunu kendi alıcısında toplar ve altında yazar: oranı, gereken oran ve iki renk.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Color
import com.pantrixui.components.elements.button.ButtonColors
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    PantrixButton(
        text = "Gönder",
        onClick = {},
        colors = ButtonColors(container = Color(0xFFFFE082), content = Color.White),
        tagKey = "send"
    )
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "Henüz bir bulgu yok.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Boş bir ad

Bir kaynaktan boş gelen bir ad: ikon düğmesinin ekran okuyucuya söyleyecek bir şeyi yok. Pantrix'in adı alan her bileşeni, adı boşsa bunu söyler.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    PantrixIconButton(imageVector = PantrixIcons.Close, contentDescription = " ", onClick = {}, tagKey = "close")
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "Henüz bir bulgu yok.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Sıkışan dokunma hedefi

Onay kutusunun satırı 24 dp'lik bir kutuya sıkıştırılmış: her platformun dokunma hedefinden alçak. Yerleşimin bulduğu, yarım saniye sürünce bildirilir: açılan bir satır içindekini bir an sıkıştırır.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.checkbox.PantrixCheckbox
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    Box(Modifier.height(24.dp)) {
        PantrixCheckbox(checked = true, onCheckedChange = {}, label = "Koşulları okudum", tagKey = "terms")
    }
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "Henüz bir bulgu yok.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Aynı etiket iki düğümde

Aynı anahtarla iki düğme: ikisinin etiketi de `Button_save`, bir test hangisini bulduğunu bilemez. Her birine kendi anahtarı ya da kendi bölümü (`TestScope`) verilir.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
        PantrixButton(text = "Kaydet", onClick = {}, tagKey = "save")
        PantrixButton(text = "Kaydet ve kapat", onClick = {}, tagKey = "save")
    }
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "Henüz bir bulgu yok.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Dili için sözleri olmayan tema

Almanca bir tema: Pantrix'in Almanca sözleri yok, bileşenler İngilizce konuşur. Uygulama o dilin sözlerini `PantrixTheme(strings = …)` ile verince bulgu kalkar.

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.l10n.PantrixLocale
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings, locale = PantrixLocale.forLanguageTag("de")) {
    PantrixText(text = "Bir Almanca ekran", style = PantrixTheme.typography.footnote)
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "Henüz bir bulgu yok.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Gölgede kalan kısayol

Bir ekranın kökü ve içindeki bir alan aynı kısayolu dinliyor: tuşa basılınca dıştaki çalışır, içteki hiç çalışmaz.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.keyboard.PantrixShortcut
import com.pantrixui.foundation.keyboard.onShortcut
import com.pantrixui.foundation.testing.pantrixTestTag
import com.pantrixui.foundation.testing.rememberPantrixTestTag
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings() }
val search = PantrixShortcut(Key.F, command = true)
PantrixTheme(diagnostics = findings) {
    Column(Modifier.onShortcut(search) {}) {
        val tag = rememberPantrixTestTag(component = "SearchBox", tagKey = "inner")
        PantrixText(
            text = "İçteki alan da aynı kısayolu dinliyor",
            modifier = Modifier.pantrixTestTag(tag).onShortcut(search) {}
        )
    }
}
Found(findings)

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "Henüz bir bulgu yok.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Kendi bileşeninin denetimi

Uygulamanın kendi bileşeni de denetimlere katılır: `Swatch` adını `checkName` ile, yazısıyla zemininin çiftini `checkContrast` ile söyler. Altındaki satır iki rengin oranını `contrastRatio` ile yazar.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.ContrastNeed
import com.pantrixui.foundation.diagnostics.ContrastPair
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.diagnostics.checkContrast
import com.pantrixui.foundation.diagnostics.checkName
import com.pantrixui.foundation.theme.PantrixTheme
import com.pantrixui.foundation.token.color.contrastRatio

val findings = remember { PantrixFindings() }
PantrixTheme(diagnostics = findings) {
    Swatch(name = "Kum", fill = Color(0xFFF5E6C8), label = Color(0xFFB0A080))
}
Found(findings)

@Composable
private fun Swatch(
    name: String,
    fill: Color,
    label: Color
) {
    Column(
        modifier = Modifier
            .checkName("Swatch", name)
            .checkContrast("Swatch") { listOf(ContrastPair("label on fill", label, fill, ContrastNeed.Text)) }
            .background(fill)
            .padding(12.dp)
    ) {
        PantrixText(text = name, color = label)
    }
    PantrixText(
        text = "Oran: ${(contrastRatio(label, fill) * 100).toInt() / 100f}",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}

@Composable
private fun Found(findings: PantrixFindings) {
    if (findings.all.isEmpty()) {
        PantrixText(
            text = "Henüz bir bulgu yok.",
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
    findings.all.forEach { finding ->
        PantrixText(text = finding.check.name, style = PantrixTheme.typography.callout)
        PantrixText(
            text = finding.message,
            style = PantrixTheme.typography.footnote,
            color = PantrixTheme.colors.textSecondary
        )
    }
}
```

### Günlüğe ve bir teste

Bir test ya da günlük için: `PantrixFindings(then = PantrixDiagnostics.Log)` bulguları hem toplar hem günlüğe yazar. `LocalPantrixDiagnostics` temanın o noktadaki alıcısıdır; bir bulgunun alanları tek tek okunur.

```kotlin
import androidx.compose.runtime.remember
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.diagnostics.LocalPantrixDiagnostics
import com.pantrixui.foundation.diagnostics.PantrixCheck
import com.pantrixui.foundation.diagnostics.PantrixDiagnostics
import com.pantrixui.foundation.diagnostics.PantrixFindings
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val findings = remember { PantrixFindings(then = PantrixDiagnostics.Log) }
PantrixTheme(diagnostics = findings) {
    PantrixIconButton(imageVector = PantrixIcons.Search, contentDescription = "", onClick = {}, tagKey = "search")
    val here = LocalPantrixDiagnostics.current
    PantrixText(
        text = "Bu noktadaki alıcı toplayan alıcı mı: ${here === findings}",
        style = PantrixTheme.typography.footnote
    )
}
findings.all.forEach { finding ->
    val missing = finding.check == PantrixCheck.MissingName
    PantrixText(
        text = "${finding.check.name} · ${finding.component} · ${finding.testTag} · boş ad: $missing",
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary
    )
}
```

## API

### PantrixDiagnostics

`import com.pantrixui.foundation.diagnostics.PantrixDiagnostics`, `com.pantrixui:foundation` içinden

```kotlin
fun interface PantrixDiagnostics
```

Bir temanın tanılamasının bulduğunu gönderdiği yer.

Varsayılan `Off` denetimleri de kapatır: ilk satırlarında dönerler ve bir yayın sürümü onlar için neredeyse hiçbir şey ödemez. Pantrix hangi tür bir derlemede çalıştığını bilmez; bu yüzden bir uygulama onları kendi debug derlemesinde açar: `PantrixTheme(diagnostics = if (debug) PantrixDiagnostics.Log else PantrixDiagnostics.Off)`. Bir test ya da bir inspector bulguları `PantrixFindings` ile toplar.

Bir bulgu sürdüğü sürece bir kez bildirilir; düzeltildikten sonra geri gelirse yeniden. Bir yerleşimin yaptığı sıkışan bir dokunma hedefi yarım saniye sürünce bildirilir: açılan bir satır içindekini bir an sıkıştırır. Aynı etiketi taşıyan iki düğüm, bir sayfa geçişinden uzun, bir buçuk saniye sürünce bildirilir: geçiş, giden sayfayla gelen sayfayı birlikte gösterir.

Üyeleri:

- `fun report(finding: PantrixFinding)`: Her `finding` ile arayüz iş parçacığında, kompozisyonun ve yerleşimin dışında çağrılır.

Tipin kendisinde:

- `PantrixDiagnostics.Off: PantrixDiagnostics`: Denetimleri kapatır: hiçbir şey aranmaz, hiçbir şey bildirilmez.
- `PantrixDiagnostics.Log: PantrixDiagnostics`: Her bulguyu platformun günlüğüne yazar: Android'de Logcat'e, iOS'ta ve tarayıcıda konsola, JVM'de standart hataya.

### PantrixFindings

`import com.pantrixui.foundation.diagnostics.PantrixFindings`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixFindings(
    private val then: PantrixDiagnostics = PantrixDiagnostics.Off
) : PantrixDiagnostics
```

Bir temanın tanılamasının bulduğunu, bir testin okuması ve bir inspector'ın göstermesi için saklar; her bulguyu `then`'e de iletir.

```kotlin
val findings = PantrixFindings()
setContent { PantrixTheme(diagnostics = findings) { CheckoutScreen() } }
assertEquals(emptyList(), findings.all)
```

Parametreler:

- `then: PantrixDiagnostics`: Her bulgunun saklandıktan sonra gittiği yer: `PantrixDiagnostics.Log` onu günlüğe de yazar.

Üyeleri:

- `all: List<PantrixFinding>`: Bu kurulduğundan ya da son temizlendiğinden beri bulunanlar, bulundukları sırayla: listenin okunduğu andaki hâli, aynı bulguları taşıyan her listeye eşittir. Düzeltildikten sonra geri gelen bir bulgu bir kez saklanır; bir kompozisyonda okunan liste büyüdükçe izlenir.
- `fun clear()`: Bulunanları unutur.
- `fun boundsOf(finding: PantrixFinding): Rect?`: `finding`'in üstünde yapıldığı düğümün şimdi nerede olduğu, çizildiği pencerenin koordinatlarında: bir inspector'ın çerçevelediği yer. O düğüm gitmişse ve bir düğümün üstünde yapılmamış bir bulgu için, bir temanın renkleri üzerine olan gibi, null.

### PantrixFinding

`import com.pantrixui.foundation.diagnostics.PantrixFinding`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixFinding(
    public val check: PantrixCheck,
    public val component: String?,
    public val testTag: String?,
    public val screen: String?,
    public val message: String,
    public val values: Map<String, String> = emptyMap()
)
```

Bir denetimin bulduğu: hangi denetim, nerede ve neden.

Parametreler:

- `check: PantrixCheck`: Onu bulan denetim.
- `component: String?`: Bulunduğu bileşen, örneğin `Button`; bir bileşen bilinmiyorsa null.
- `testTag: String?`: Bulunduğu düğümün otomasyon etiketi; düğüm bir etiket taşımıyorsa null.
- `screen: String?`: Dıştaki `TestScope` zinciri, örneğin `Checkout.PaymentForm`; bir bölümün dışında null.
- `message: String`: Neyin yanlış olduğu ve nasıl düzeltileceği, İngilizce: onu uygulamanın kullanıcısı değil bir geliştirici okur.
- `values: Map<String, String>`: İletinin sözünü ettiği ölçülen değerler: bir kontrastın `ratio`'su ve gerektirdiği oran gibi.

### PantrixCheck

`import com.pantrixui.foundation.diagnostics.PantrixCheck`, `com.pantrixui:foundation` içinden

```kotlin
enum class PantrixCheck
```

Yalnızca çalışan bir ekranın gösterdiği, bir temanın tanılamasının açıkken aradığı bir kusur türü.

Değerleri:

- `DuplicateTestTag`: Bir pencerenin iki düğümü aynı otomasyon etiketini taşır ve onu arayan bir test hangisini bulduğunu bilemez.
- `LowContrast`: Bir renk üstüne çizildiği renkte zor okunur: WCAG 2.2'nin ölçtüğü gibi yazı 4,5:1'in, büyük yazı ve bir kontrolün işareti 3:1'in altında.
- `SmallTouchTarget`: Bir kontrol platformun dokunma hedefinden daha az yere yerleştirilir ve bir basışa ondan daha az bir yerde yanıt verir.
- `MissingName`: Bir ekran okuyucunun bir kontrol ya da bir resim için söylediği boştur.
- `NoStringsForLanguage`: Temanın dilinin kendi sözleri yoktur ve bileşenler o dilde İngilizce konuşur.
- `ShadowedShortcut`: Bir klavye kısayolunu önce bulunduğu düğümün çevresindeki bir düğüm duyar ve kısayol bulunduğu yerde hiç çalışmaz.

### LocalPantrixDiagnostics

`import com.pantrixui.foundation.diagnostics.LocalPantrixDiagnostics`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixDiagnostics: ProvidableCompositionLocal<PantrixDiagnostics>
```

Bir temanın içindeki bileşenlerin denetimlerinin bulduğunu gönderdiği yer: temanın `diagnostics`'i.

İçeriği gösterilirken tanılaması değişen bir tema, o içeriğin denetimlerini hemen açar ya da kapatır.

### ContrastPair

`import com.pantrixui.foundation.diagnostics.ContrastPair`, `com.pantrixui:foundation` içinden

```kotlin
data class ContrastPair(
    public val what: String,
    public val foreground: Color,
    public val background: Color,
    public val need: ContrastNeed
)
```

Bir bileşenin bir rengin üstüne çizdiği bir renk ve orada ne kadar okunur olması gerektiği.

Parametreler:

- `what: String`: Çiftin bir bulgudaki adı, örneğin `label on container`.
- `foreground: Color`: Çizilen renk: bir yazı, bir ikon, bir işaret.
- `background: Color`: Üstüne çizildiği renk.
- `need: ContrastNeed`: Ne kadar okunur olması gerektiği.

### ContrastNeed

`import com.pantrixui.foundation.diagnostics.ContrastNeed`, `com.pantrixui:foundation` içinden

```kotlin
enum class ContrastNeed(
    public val ratio: Float
)
```

Bir rengin altındaki rengin üstünde ne kadar okunur olması gerektiği, WCAG 2.2'nin istediği gibi.

Parametreler:

- `ratio: Float`: Gereken en düşük kontrast, `contrastRatio`'nun ölçtüğü gibi.

Değerleri:

- `Text`: Yazı: 4,5:1.
- `LargeText`: 18pt ve üstü yazı ya da kalın 14pt ve üstü yazı: 3:1.
- `Mark`: Bir kontrolü ya da durumunu sözsüz gösteren, bir checkbox'ın kutusu, bir alanın kenarı ya da bir odak halkası gibi: 3:1.

### Modifier.checkContrast

`import com.pantrixui.foundation.diagnostics.checkContrast`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.checkContrast(
    component: String,
    pairs: () -> List<ContrastPair>
): Modifier
```

Temanın tanılamasına, açıkken, `component`'in hangi renkleri hangilerinin üstüne çizdiğini söyler: gerekenin altında okunan bir çift `PantrixCheck.LowContrast` olarak bildirilir; bileşen ve o renkler için bir kez, onları kaç tanesi gösterirse göstersin. `pairs` yalnızca tanılama açıkken çağrılır; tanılama ya da temanın renkleri değişince yeniden.

Altındakini gösteren bir zemin, dolgusu olmayan bir düğmeninki gibi, bileşen temanın kendi zeminlerinden birinin üstünde duruyorsa temanın arka planı ve yüzeyi üstünde ölçülür, ikisinden düşük olanı sayılır. Üstünde durana kendi içerik rengini veren başka renkte bir dolgunun üstünde böyle bir çift ölçülmez: altında ne olduğu bilinmez. Rengi belirtilmemiş bir çift de ölçülmez.

Parametreler:

- `component: String`: Bileşenin bir bulgudaki adı, örneğin `Button`.
- `pairs: () -> List<ContrastPair>`: Bulunduğu durumda hangi renkleri hangilerinin üstüne çizdiği. Kimsenin okuması beklenmeyen devre dışı bir bileşen hiçbirini vermez.

### Modifier.checkName

`import com.pantrixui.foundation.diagnostics.checkName`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.checkName(
    component: String,
    name: String?
): Modifier
```

Temanın tanılamasına, açıkken, bir ekran okuyucunun `component` için ne söylediğini söyler: boş bir `name` `PantrixCheck.MissingName` olarak bildirilir. Null bir ad burada verilmemiş bir addır, yalnızca süs olan bir resimde ya da yazısıyla adlanan bir kontrolde olduğu gibi, ve bildirilmez; başka adı olmayan bir kontrol adını, boş da olsa, olduğu gibi verir.

Parametreler:

- `component: String`: Bileşenin bir bulgudaki adı, örneğin `IconButton`.
- `name: String?`: Bir ekran okuyucunun onun için söylediği: `contentDescription`'ı, `label`'ı ya da `title`'ı.

### contrastRatio

`import com.pantrixui.foundation.token.color.contrastRatio`, `com.pantrixui:foundation` içinden

```kotlin
fun contrastRatio(
    foreground: Color,
    background: Color
): Float
```

`foreground`'un `background`'dan ne kadar ayrıldığı, WCAG 2.2'nin ölçtüğü gibi: ikisinden açık olanın göreli parlaklığının koyu olanınkine oranı, ikisine de 0,05 eklenerek. Bir rengin kendi üstünde 1'den, beyaz üstünde siyahta 21'e kadar gider. Yazı 4,5 ve üstünde okunur; büyük yazı ve bir kontrolün işareti, bir checkbox'ın kutusu gibi, 3 ve üstünde.

Arkasını gösteren bir `foreground` çizildiği gibi ölçülür: `background`'un üstüne konarak. `background` verildiği gibi ölçülür; altındakini gösteren bir zemin, önce altındakinin üstüne konup öyle verilir.

Parametreler:

- `foreground: Color`
- `background: Color`
