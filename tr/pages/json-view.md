# JSON View

Okunmak için dizilmiş bir JSON metni: her satırda bir değer, her düzey kendisini tutandan içeride, her tür değer kendi renginde. Nesneler ve diziler ilk satırlarının arkasına katlanır. Bir sunucunun yanıtı, bir ayar belgesi, uzun bir dışa aktarım böyle okunur.

Açık bir belgenin gösterdiği belgenin kendisidir: adlar ve metin değerleri tırnaklarıyla, parantezler ve virgüller yerinde, bir biçimlendiricinin yazdığı gibi. Bir sayı metinde yazıldığı gibi, son basamağına kadar gösterilir. Katlanmış bir nesne ya da dizi tek satırdır: parantezlerinin arasında bir üç nokta, ardından içinde kaç şey olduğu.

Neyin açık olduğunu görünüm kendisi tutar: başta `expandedDepth`'in söylediği kadarı açıktır, sonra okuyucunun katladığı ve açtığı öyle kalır, altındaki metin değişse de. Belgeyi kendi düğmesiyle açan ya da neyin açık olduğunu bir yerde saklayan ekran bu durumu kendisi tutar: `expanded` alan biçimle.

- `PantrixJsonView` (`com.pantrixui.components.data.jsonview`, `com.pantrixui:components`): Okunmak için dizilmiş bir JSON metni: satır başına bir değer, türüne göre renkli; katlanan nesneler ve diziler, bir arama, satır numaraları ve kopyalayan bir düğmeyle. Anahtar sözcükler: json ağacı, json görüntüleyici, düzgün yazdır, api yanıtı, nesne görüntüleyici, katlanır json.

## Özellikler

- **Katlama.** Katlanan satır bir düğmedir ve başında bir ok durur: satır açıkken aşağıyı, katlanmışken ileriyi gösterir. Basmak, Enter ve boşluk satırı katlar ve açar.
- **Kılavuz çizgileri.** Açık her nesneden ve diziden, okunun altından, içindekilerin sonuna kadar ince bir çizgi iner: girintinin dar olduğu yerde bir düzeyi ötekinden ayırır. Kalınlığı `JsonViewStyle.guideWidth`, rengi `JsonViewColors.guide`'dır; kalınlık sıfır verilirse çizilmez.
- **Klavye.** Belge Tab için tek bir duraktır: odak en son durduğu satıra gelir ve oradan oklarla gezilir. Aşağı ve yukarı oklar bir değerin başladığı satırları sırayla gezer, Home ve End ilk ve son satıra gider. Sağ ok katlanmış satırı açar, açık satırda içindeki ilk şeye girer; sol ok açık satırı katlar, başka her satırda o satırı tutan değeri açan satıra çıkar. Kopyalama düğmesi Tab'ın bir sonraki durağıdır.
- **İlk açılış.** `expandedDepth` başta kaç düzeyin açık olduğunu söyler: `1` metnin kendi değerini açar ve içindekileri katlanmış bırakır, `2` onları da açar. Verilmezse her düzey açıktır. Başka bir derinlik vermek görünümü oradan yeniden başlatır.
- **Ekranın durumu.** `expanded` alan biçimde açık nesnelerin ve dizilerin yolları ekranın durumudur: bir satıra basılınca açık olması gereken yeni küme `onExpandedChange` ile bildirilir, görünüm kendiliğinden bir şey değiştirmez.
- **Yollar.** Bir yol bir JSON Pointer'dır (RFC 6901): metnin kendi değeri boş metindir, `user` üyesi `/user`, onun `tags`'inin ilki `/user/tags/0`. `jsonViewPaths` bir belgeyi istenen derinliğe kadar açan yolları verir.
- **Arama.** `search` aradığını adlarda ve değerlerde, büyük küçük harfe bakmadan işaretler; içinde aranandan bir şey olan katlanmış bir değer bütünüyle işaretlenir. Görünüm, kaydığı yerde, bulduklarının ilkini ekrana getirir. Neyin açık olduğunu kendisi tutan görünüm, içinde aranandan bir şey olan değerleri de açar; okuyucunun katladığı katlı kalır. `expanded` alan biçimde açmak ekranın işidir: açılacak yolları `jsonViewSearchPaths` verir. İşaretin dolgusu `JsonViewColors.match`'tir.
- **Satır numaraları.** `lineNumbers` her satırın başına numarasını yazar: belge bütünüyle açıkken taşıdığı numarayı. Katlanmış bir değer açıldığı satırın numarasını korur ve ardındaki satır, katlanan satırların biteceği yerden sürer. Numaralar seçilmez ve ekran okuyucuya okunmaz.
- **Genişlik.** Görünüm kendisine verilen genişliği doldurur; sığmayan satır kendi altında sürer. Bir satır, ne kadar derinde olursa olsun, görünümün genişliğinin yarısından fazla içeri girmez.
- **Bölünmeyen satırlar.** `softWrap = false` her değeri tek satırda tutar: görünüm genişliğini korur ve belge yana kayar. Bölünmeyen bir satır yarı genişlikte tutulmaz, girintisinin tamamı kadar içeridedir.
- **Yükseklik.** Yükseklik verilen görünümde belge o yüksekliğin içinde kayar ve yalnızca ekrandaki satırlar kurulur: binlerce satırlık bir belge böyle gösterilir. Yükseklik verilmeyen görünüm, kayan bir sayfada, belgenin tamamı açıkken 300 satırı geçmiyorsa gösterdiği satırlar kadar yüksektir; daha uzun bir belgede pencereden yüksek olmaz ve onun içinde kayar.
- **Kaydırma çubukları.** Kaydığı yerde görünümün kendi kaydırma çubuğu vardır: yan kenarında, yana kayan belgede alt kenarında da. Çubuk belgenin ne kadarının ekranda olduğunu ve neresinde durulduğunu gösterir. İmleci olan okuyucuda, masaüstünde ve masaüstündeki web'de, kayacak bir şey oldukça durur ve fareyle sürüklenir; parmağın altında yalnızca belge kayarken görünür.
- **Kopyalama ve seçme.** Görünümün sağ üst köşesindeki düğme belgenin tamamını, açık bir görünümün yazdığı gibi kopyalar: her satırda bir değer, her düzeyde iki boşluk, ekranda ne katlanmış olursa olsun. Kopyalayınca iki saniye bir onay işareti gösterir ve bunu ekran okuyucuya da söyler; `onCopy` belgenin panoya ulaşıp ulaşmadığını bildirir. Ekrandaki satırlar da seçilir, fareyle sürükleyerek ya da uzun basarak, ve sistemin kendi yoluyla kopyalanır: böyle kopyalanan, satırların gösterdiğidir. `copyable = false` düğmeyi kaldırır, `selectable = false` seçmeyi kapatır.
- **Yazı yönü.** Belge her dilde soldan sağa yazılır, kod gibi.
- **JSON olmayan metin.** Olduğu gibi gösterilir; üstündeki satır okumanın nerede durduğunu, satır ve sütunla, temanın dilinde söyler.
- **Renk.** Temanın kendi zeminlerinde her tür değerin, temanın rollerinden, kendi rengi vardır: bir sayı, rakamlardan oluşan bir metin değerinden tırnaklarına bakılmadan ayırt edilir. Temanın bir rol renginin üstünde belgenin tamamı orada okunan tek renkle yazılır. `JsonViewColors` ile verilen renk kullanılır, verilmeyen temanınki kalır.
- **Platform.** Parmakla kullanılan yerde, Android'de, iOS'ta ve web'de, bir satırın yazısının üstünde ve altında 4dp vardır ve satır temanın kod yazısıyla 28dp olur; masaüstünde, imleç için, 2dp vardır. Bir düzey masaüstünde ve web'de 16dp, telefonda 12dp içeridedir. Köşeler kartınkilerdir.
- **Ekran okuyucu.** Katlanan satırda basışın ne yapacağı sunulur ve satırın açık olup olmadığı söylenir. Satır adını, katlanmışsa içinde kaç şey olduğunu ve kaçıncı düzeyde olduğunu söyler, son ikisini temanın sözleriyle: "items, Öğe sayısı: 2, Düzey 2". Metnin kendi değerinin adı yoktur: açıkken yalnızca "Düzey 1" der. Öteki satırlar yazıldıkları gibi okunur; açık bir değeri kapatan satır okunmaz.
- **Otomasyon.** `tagKey` ile görünüm `JsonView_<tagKey>`, bir satırı `JsonView_<tagKey>.Row_<path>` olur: yol yazıldığı gibidir (`Row_/user/tags/0`), metnin kendi değeri `Row_root`'tur. Açık bir değeri kapatan satır `JsonView_<tagKey>.End_<path>`, JSON olmayan metnin üstündeki satır `JsonView_<tagKey>.Note_fault`, kopyalama düğmesi `JsonView_<tagKey>.Button_copy` olur. Bir basış, satırın düzeyiyle, `expand` ya da `collapse` olarak; bir kopyalama, panoya ulaşıp ulaşmadığıyla, `copy` olarak bildirilir. Belgeden hiçbir şey bildirilmez.

## Kullanım

### A response, as it came

```kotlin
PantrixJsonView(json = response.body, tagKey = "response")
```

### A long document in a room of its own, searched from a field of the screen's

```kotlin
var query by remember { mutableStateOf("") }
PantrixTextField(value = query, onValueChange = { query = it }, label = stringResource(Res.string.search))
PantrixJsonView(
    json = export,
    modifier = Modifier.height(320.dp),
    expandedDepth = 2,
    search = query,
    lineNumbers = true,
    tagKey = "export"
)
```

### Opened and folded from the screen's own buttons

```kotlin
var open by remember(json) { mutableStateOf(jsonViewPaths(json, depth = 1)) }
PantrixButton(text = stringResource(Res.string.expand_all), onClick = { open = jsonViewPaths(json) })
PantrixJsonView(json = json, expanded = open, onExpandedChange = { open = it }, tagKey = "settings")
```

## Örnekler

### Bir yanıt

En yalın hâli: bir JSON metni, bir de otomasyon anahtarı. Görünüm metni okunacak biçimde dizer: her satırda bir değer, her düzey kendisini tutandan içeride. Adlar ve metin değerleri tırnaklarıyla, parantezler ve virgüller yerinde durur: açık bir belgenin gösterdiği belgenin kendisidir. Sayılar metinde yazıldığı gibidir, `249.90` son sıfırını korur.

Her tür değer kendi rengindedir: metin değerleri, sayılar, `true`, `false` ve `null`. Nesnelerin ve dizilerin ilk satırı bir düğmedir: `"items"` satırına bas, dizi tek satıra katlanır ve içinde kaç şey olduğunu yazar. Yeniden bas, açılır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView

PantrixJsonView(json = RESPONSE, tagKey = "response")

private val RESPONSE =
    """
    {
      "id": 4821,
      "status": "shipped",
      "total": 249.90,
      "paid": true,
      "coupon": null,
      "customer": {
        "name": "Ada Yılmaz",
        "city": "İzmir"
      },
      "items": [
        { "sku": "KB-104", "quantity": 1, "price": 189.90 },
        { "sku": "MS-220", "quantity": 2, "price": 30.00 }
      ]
    }
    """.trimIndent()
```

### İlk açılışta ne kadarı açık

`expandedDepth` belgenin başta kaç düzeyinin açık olduğunu söyler. `1` metnin kendi değerini açar ve içindeki her şeyi katlanmış bırakır; `2` onları da açar; verilmezse her düzey açıktır.

Neyin açık olduğunu görünüm kendisi tutar: bir satıra basıp katladığın ya da açtığın öyle kalır. Başka bir derinlik verilince görünüm oradan yeniden başlar: `"customer"` satırına bas, sonra başka bir derinlik seç.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.elements.segmentbutton.PantrixSegmentButton
import com.pantrixui.components.elements.segmentbutton.SegmentOption

var depth by rememberSaveable { mutableIntStateOf(1) }
PantrixSegmentButton(
    options = DEPTHS,
    selected = depth,
    onSelect = { depth = it },
    fullWidth = false,
    tagKey = "depth"
)
PantrixJsonView(json = RESPONSE, expandedDepth = depth, tagKey = "by_depth")

private val DEPTHS = listOf(
    SegmentOption(value = 1, label = "1 düzey", tagKey = "one"),
    SegmentOption(value = 2, label = "2 düzey", tagKey = "two"),
    SegmentOption(value = Int.MAX_VALUE, label = "Hepsi", tagKey = "all")
)

private val RESPONSE =
    """
    {
      "id": 4821,
      "status": "shipped",
      "total": 249.90,
      "paid": true,
      "coupon": null,
      "customer": {
        "name": "Ada Yılmaz",
        "city": "İzmir"
      },
      "items": [
        { "sku": "KB-104", "quantity": 1, "price": 189.90 },
        { "sku": "MS-220", "quantity": 2, "price": 30.00 }
      ]
    }
    """.trimIndent()
```

### Yüksekliği verilen uzun bir belge

Birkaç yüz satırlık bir belge, 280dp yüksekliğinde bir yerde. Yükseklik görünümün `modifier`'ına verildi: belge o yüksekliğin içinde kayar ve yalnızca ekrandaki satırlar kurulur. Binlerce satırlık bir belge de böyle gösterilir.

Yükseklik verilmeseydi görünüm, bu sayfa gibi kayan bir sayfada, 300 satırı geçen bu belgeyle pencerenin yüksekliğini alır ve onun içinde kayardı. 300 satırı geçmeyen bir belgeyle bütün satırları kadar yüksek olurdu: yüksekliği verilmeyen öteki örneklerde öyledir. Metin yalnızca değiştiğinde yeniden okunur; burada bir kez kurulur ve `remember` ile tutulur.

```kotlin
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.jsonview.PantrixJsonView

val readings = remember { sensorReadings(count = 60) }
PantrixJsonView(json = readings, modifier = Modifier.height(280.dp), tagKey = "readings")

private fun sensorReadings(count: Int): String =
    (1..count).joinToString(separator = ",", prefix = "[", postfix = "]") { n ->
        """{"id": $n, "sensor": "T-${n % 4 + 1}", "celsius": ${18 + n % 7}.${n % 10}, "ok": ${n % 9 != 0}}"""
    }
```

### Arama

`search` aradığını adlarda ve değerlerde bulur, büyük küçük harfe bakmadan, ve üç şey yapar: bulduğunu işaretler, onu tutan değerleri açar ve görünümün kaydığı yerde bulduklarının ilkini ekrana getirir.

Belge kırk sekiz siparişlik bir dizidir, 240dp yüksekliğinde bir yerde, ve yalnızca ilk düzeyi açıktır: her sipariş tek satıra katlanmış durur. Alana `returned` yaz: iade edilen dört sipariş açılır, sözcük dördünde de işaretlenir ve görünüm ilkine, on ikinci siparişe kayar. Alanı boşalt: işaretler kalkar ve aramanın açtığı siparişler yeniden katlanır.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.inputs.textfield.PantrixTextField

val query = rememberTextFieldState()
val orders = remember { orderExport(count = 48) }
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Siparişlerde ara",
    showClearButton = true,
    contentDescription = "Siparişlerde ara",
    tagKey = "order_search"
)
PantrixJsonView(
    json = orders,
    modifier = Modifier.height(240.dp),
    expandedDepth = 1,
    search = query.text.toString(),
    tagKey = "orders"
)

private fun orderExport(count: Int): String =
    (1..count).joinToString(separator = ",", prefix = "[", postfix = "]") { n ->
        val status = if (n % 12 == 0) "returned" else "shipped"
        """{"id": ${4800 + n}, "status": "$status", "total": ${30 + n * 4}.50}"""
    }
```

### Satır numaraları ve bölünmeyen satırlar

`lineNumbers` her satırın başına numarasını yazar: belge bütünüyle açıkken taşıdığı numarayı. `"request"` satırına bas: katlanan değer açıldığı satırın numarasını, 4'ü, korur ve ardındaki satır 9'dan sürer.

`"signature"` değeri karta sığmayacak kadar uzundur. Başta satır kendi altında sürer ve tek bir numara taşır. Anahtarı kapat: `softWrap = false` her değeri tek satırda tutar, görünüm genişliğini korur ve belge yana kayar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton

var wraps by rememberSaveable { mutableStateOf(true) }
PantrixSwitchButton(
    checked = wraps,
    onCheckedChange = { wraps = it },
    label = "Uzun satır kendi altında sürsün",
    tagKey = "soft_wrap"
)
PantrixJsonView(json = WEBHOOK, softWrap = wraps, lineNumbers = true, tagKey = "webhook")

private val WEBHOOK =
    """
    {
      "event": "payment.failed",
      "order": 4821,
      "request": {
        "method": "POST",
        "url": "https://api.example.com/v2/payments",
        "attempts": 3
      },
      "signature": "${"9f2c41d7a0b35e68".repeat(14)}",
      "handled": false
    }
    """.trimIndent()
```

### Kopyalama ve seçme

Görünümün sağ üst köşesindeki düğme belgenin tamamını kopyalar: ekranda katlanmış olanı da, açık bir görünümün yazdığı gibi, her satırda bir değer ve her düzeyde iki boşlukla. Kopyalayınca düğme iki saniye bir onay işareti gösterir.

`onCopy` belgenin panoya ulaşıp ulaşmadığını bildirir: burada kartın "Son olay" satırına yazılır. Bunu kullanıcısına söyleyen bir ekran, sistemin kopyalananı kendisi gösterdiği yerde, Android 13 ve üstünde, yalnızca kopyalanamadığında söyler: orada `rememberPantrixClipboard().traits.announcedBySystem` true'dur.

Üstteki görünümde ekrandaki satırlar da seçilir, fareyle sürükleyerek ya da uzun basarak, ve sistemin kendi yoluyla kopyalanır. Alttaki görünüm aynı belgedir: `copyable = false` düğmeyi kaldırır, `selectable = false` seçmeyi kapatır.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView

val report = LocalExampleEvents.current
PantrixJsonView(
    json = SETTINGS,
    expandedDepth = 1,
    onCopy = { copied -> report(if (copied) "Belge panoya kopyalandı" else "Belge panoya kopyalanamadı") },
    tagKey = "copyable"
)
PantrixJsonView(
    json = SETTINGS,
    expandedDepth = 1,
    selectable = false,
    copyable = false,
    tagKey = "not_copyable"
)

private val SETTINGS =
    """
    {
      "theme": "dark",
      "fontScale": 1.15,
      "notifications": {
        "email": true,
        "push": false,
        "quietHours": { "from": "22:00", "to": "07:00" }
      },
      "shortcuts": [
        { "keys": "Ctrl+K", "action": "search" },
        { "keys": "Ctrl+S", "action": "save" }
      ]
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Ekranın kendi düğmeleriyle

`expanded` alan biçimde neyin açık olduğunu ekran tutar, bir accordion'ın bölümlerinde olduğu gibi: görünüme açık nesnelerin ve dizilerin yolları verilir, bir satıra basılınca açık olması gereken yeni küme `onExpandedChange` ile bildirilir. Görünüm kendiliğinden hiçbir şeyi değiştirmez.

Durum `jsonViewPaths(json, depth = 1)` ile kuruldu: yalnızca metnin kendi değeri açık. "Hepsini aç" belgenin bütün yollarını koyar, "Hepsini kapat" kümeyi boşaltır: açık hiçbir şey kalmaz ve belge tek satıra iner. Her değişiklik, kaç yolun açık olduğuyla birlikte, kartın "Son olay" satırına yazılır.

Bir yol bir JSON Pointer'dır: metnin kendi değeri boş metin, `notifications` üyesi `/notifications`, `shortcuts`'un ilki `/shortcuts/0`.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.data.jsonview.jsonViewPaths
import com.pantrixui.components.elements.button.ButtonSize
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.theme.PantrixTheme

val report = LocalExampleEvents.current
var open by rememberSaveable { mutableStateOf(jsonViewPaths(SETTINGS, depth = 1)) }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)) {
    PantrixButton(
        text = "Hepsini aç",
        onClick = {
            open = jsonViewPaths(SETTINGS)
            report("Hepsi açıldı, açık yol: ${open.size}")
        },
        variant = ButtonVariant.Outline,
        size = ButtonSize.Small,
        tagKey = "json_open_all"
    )
    PantrixButton(
        text = "Hepsini kapat",
        onClick = {
            open = emptySet()
            report("Hepsi kapatıldı, açık yol: ${open.size}")
        },
        variant = ButtonVariant.Text,
        size = ButtonSize.Small,
        tagKey = "json_close_all"
    )
}
PantrixJsonView(
    json = SETTINGS,
    expanded = open,
    onExpandedChange = { paths ->
        open = paths
        report("Satıra basıldı, açık yol: ${paths.size}")
    },
    tagKey = "settings"
)

private val SETTINGS =
    """
    {
      "theme": "dark",
      "fontScale": 1.15,
      "notifications": {
        "email": true,
        "push": false,
        "quietHours": { "from": "22:00", "to": "07:00" }
      },
      "shortcuts": [
        { "keys": "Ctrl+K", "action": "search" },
        { "keys": "Ctrl+S", "action": "save" }
      ]
    }
    """.trimIndent()
```

Kodun demo uygulamasının kendisinden çağırdıkları; bir uygulama bunları kendisi yazar:

- `LocalExampleEvents`: Bir örneğin, olan biteni kartına bildirdiği yer: basılan düğme, seçilen satır, kapanan dialog. Kart en son bildirileni örneğin altında, "Son olay" satırında yazar.

### Arama, ekranın kendi durumuyla

`expanded` alan biçimde arama yalnızca işaretler; bulduğunu açmak ekranın işidir. `jsonViewSearchPaths` içinde aranandan bir şey olan değerlerin yollarını verir ve ekran onları kendi kümesine ekler.

Alana `ctrl` yaz: `shortcuts` dizisi ve içindeki iki nesne açılır, `Ctrl` ikisinde de işaretlenir. Arama sürerken bu satırlar katlanmaz: aramanın yolları kümeye her seferinde yeniden eklenir. Alanı boşalt: açık olan yine yalnızca ekranın kümesidir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.data.jsonview.jsonViewPaths
import com.pantrixui.components.data.jsonview.jsonViewSearchPaths
import com.pantrixui.components.inputs.textfield.PantrixTextField

val query = rememberTextFieldState()
var open by rememberSaveable { mutableStateOf(jsonViewPaths(SETTINGS, depth = 1)) }
PantrixTextField(
    state = query,
    modifier = Modifier.fillMaxWidth(),
    placeholder = "Ayarlarda ara",
    showClearButton = true,
    contentDescription = "Ayarlarda ara",
    tagKey = "settings_search"
)
PantrixJsonView(
    json = SETTINGS,
    expanded = open + jsonViewSearchPaths(SETTINGS, query.text.toString()),
    onExpandedChange = { open = it },
    search = query.text.toString(),
    tagKey = "searched_settings"
)

private val SETTINGS =
    """
    {
      "theme": "dark",
      "fontScale": 1.15,
      "notifications": {
        "email": true,
        "push": false,
        "quietHours": { "from": "22:00", "to": "07:00" }
      },
      "shortcuts": [
        { "keys": "Ctrl+K", "action": "search" },
        { "keys": "Ctrl+S", "action": "save" }
      ]
    }
    """.trimIndent()
```

### JSON olmayan bir metin

Son üyesinden sonra bir virgül kalmış bir metin: JSON değildir. Görünüm okuyamadığı metni saklamaz, olduğu gibi, satır satır gösterir. Üstündeki satır, temanın dilinde, okumanın nerede durduğunu söyler: satır ve sütun, ikisi de birden sayılır.

Burada okuma dördüncü satırın ilk karakterinde durur: virgülden sonra bir ad beklenirken kapanış parantezi gelir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.data.jsonview.PantrixJsonView

PantrixJsonView(json = NOT_JSON, tagKey = "not_json")

private val NOT_JSON =
    """
    {
      "id": 4821,
      "status": "shipped",
    }
    """.trimIndent()
```

### Bir kartın içinde, kendi renkleriyle

Görünümün kendi dolgusu ve kenarı vardır: dolgu temanın `surface`'ı, kenar temanın `divider`'ıdır. İkisi de olan bir kartın içinde `colors` ikisini de saydam verir. Verilen renk kullanılır, verilmeyen temanınki kalır: adlar temanın `textPrimary`'si, parantezler ve virgüller `textSecondary`'sidir; metin değerleri `success`, sayılar `warning`, `true`, `false` ve `null` ise `primary` rolünün rengindedir.

`style` görünümün geometrisini değiştirir; yalnızca verilen alanlar değişir. Burada satırlar kartın iç boşluğunun bittiği yerden başlasın diye `horizontalPadding` sıfır verildi, her düzey de 24dp içeride: `indent`.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.card.CardVariant
import com.pantrixui.components.container.card.PantrixCard
import com.pantrixui.components.data.jsonview.JsonViewColors
import com.pantrixui.components.data.jsonview.JsonViewStyle
import com.pantrixui.components.data.jsonview.PantrixJsonView
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

PantrixCard(modifier = Modifier.fillMaxWidth(), variant = CardVariant.Outlined) {
    PantrixText(text = "Son sipariş", style = PantrixTheme.typography.title)
    PantrixJsonView(
        json = RESPONSE,
        style = JsonViewStyle(horizontalPadding = 0.dp, indent = 24.dp),
        colors = JsonViewColors(container = Color.Transparent, border = Color.Transparent),
        tagKey = "in_a_card"
    )
}

private val RESPONSE =
    """
    {
      "id": 4821,
      "status": "shipped",
      "total": 249.90,
      "paid": true,
      "coupon": null,
      "customer": {
        "name": "Ada Yılmaz",
        "city": "İzmir"
      },
      "items": [
        { "sku": "KB-104", "quantity": 1, "price": 189.90 },
        { "sku": "MS-220", "quantity": 2, "price": 30.00 }
      ]
    }
    """.trimIndent()
```

## API

### PantrixJsonView

`import com.pantrixui.components.data.jsonview.PantrixJsonView`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixJsonView(
    json: String,
    modifier: Modifier = Modifier,
    expandedDepth: Int = Int.MAX_VALUE,
    search: String = "",
    softWrap: Boolean = true,
    lineNumbers: Boolean = false,
    selectable: Boolean = true,
    copyable: Boolean = true,
    onCopy: ((copied: Boolean) -> Unit)? = null,
    style: JsonViewStyle? = null,
    colors: JsonViewColors? = null,
    tagKey: String? = null
)
```

Okunmak için dizilmiş bir JSON metni: her satırda bir değer, her düzey kendisini tutandan içeride, her tür değer kendi renginde. Her nesne ve her dizi ilk satırının arkasına katlanır.

Açık bir belgenin gösterdiği belgenin kendisidir: adlar ve metin değerleri tırnaklarıyla, parantezler ve virgüller yerinde, bir biçimlendiricinin yazdığı gibi. Bir sayı metinde yazıldığı gibi, son basamağına kadar gösterilir. Katlanmış bir nesne ya da dizi tek satırdır: parantezlerinin arasında bir üç nokta, ardından içinde kaç şey olduğu. Açık olandan ise, okunun altından, içindekilerin sonuna kadar ince bir çizgi iner.

Bu görünüm neyin açık olduğunu kendisi tutar: başta `expandedDepth`'e kadar olan her şey açıktır, sonra okuyucunun katladığı ve açtığı, okuyucunun bıraktığı gibi kalır: altındaki metin değişse de, bir arama gelip gitse de. Belgeyi kendi düğmesiyle açan ya da neyin açık olduğunu bir yerde saklayan ekran bu durumu kendisi tutar: `expanded` alan overload ile.

Belge Tab için tek bir duraktır, bir ağaç gibi: odak en son durduğu satıra, o satır ekrandan kaydırılmışsa ekrandaki ilk satıra gelir ve oradan tuşlarla gezilir; tuşlar bir değerin başladığı satırlarda durur, bir değeri kapatan parantez kendi başına bir şey söylemez ve geçilir. Aşağı ve yukarı oklar bir sonraki ve bir önceki satıra, Home ve End ilk ve son satıra gider, o satır belgenin neresinde olursa olsun. Sağ ok katlanmış satırı açar, açık satırda içindeki ilk şeye girer; sol ok açık satırı katlar, başka her satırda o satırı tutan değeri açan satıra çıkar. Katlanan satır bir düğmedir: basmak, Enter ve boşluk onu katlar ve açar. Ekran okuyucuya basışın ne yapacağı sunulur ve satırın açık olup olmadığı söylenir; satırın adı, katlanmış bir satırın içinde kaç şey olduğu ve satırın kaçıncı düzeyde olduğu temanın sözleriyle okunur.

`search` aradığını bir adda ya da bir değerde geçtiği her yerde işaretler, içinde aranandan bir şey olan değerleri açar ve görünümün kaydığı yerde bulduklarının ilkini ekrana getirir. `lineNumbers` satırları açık belgedeki sıralarıyla numaralar: katlanmış bir değer açıldığı satırın numarasını korur ve ardındaki satır, katlanan satırların biteceği yerden sürer.

Metin alınıp götürülebilir. Görünümün köşesindeki düğme belgenin tamamını, açık bir görünümün yazdığı gibi kopyalar; ekrandaki ise seçilir ve parça parça kopyalanır.

Görünüm kendisine verilen genişliği doldurur; sığmayan satır kendi altında sürer. `softWrap` kapalıyken hiçbir satır sürmez ve belge yana kayar. Yükseklik verilirse belge onun içinde kayar ve yalnızca ekrandaki satırlar kurulur: binlerce satırlık bir belge böyle gösterilir. Yükseklik verilmezse, kayan bir sayfada, belgenin tamamı açıkken üç yüz satırı geçmediği yerde görünüm gösterdiği satırlar kadar yüksektir; daha uzun bir belge orada pencereden yüksek olmaz ve onun içinde kayar. Kaydığı yerde kenarındaki bir kaydırma çubuğu ne kadar kaydığını gösterir; çubuk fareyle sürüklenir.

Belge her dilde soldan sağa yazılır, kod gibi. JSON olmayan bir metin olduğu gibi gösterilir; üstündeki satır okumanın nerede durduğunu söyler.

```kotlin
PantrixJsonView(json = response.body, tagKey = "response")
```

Parametreler:

- `json: String`: JSON metni, RFC 8259'un yazdığı gibi. Yalnızca değiştiğinde yeniden okunur: bir megabaytı bir telefon saniyenin onda birkaçında okur.
- `modifier: Modifier`: Görünümün modifier'ı. Burada verilen yükseklik, belgenin içinde kaydığı yerdir.
- `expandedDepth: Int`: Başta kaç düzeyin açık olduğu: `1` metnin kendi değerini, içindeki her şey katlanmış olarak gösterir, `2` onları da açar; varsayılan olarak her düzey açıktır. Başka bir derinlik vermek görünümü oradan yeniden başlatır.
- `search: String`: Adlarda ve değerlerde aranan, büyük ya da küçük harfle. Varsayılan olarak boştur ve hiçbir şey işaretlenmez. Verildiği gibi, satırların yazıldığı hâlinde aranır: bir ad ve bir metin değeri tırnaklarıyla; aranan metnin başındaki ve sonundaki boşluk atılmaz. Her değiştiğinde belgenin tamamına bakılır: megabaytlarca bir metinde, okuyan yazmayı bıraktığında ver.
- `softWrap: Boolean`: Görünüme sığmayan satırın kendi altında sürüp sürmediği. Değeri false ise her değer tek satırda kalır ve belge yana kayar.
- `lineNumbers: Boolean`: Her satırın, açık belgedeki numarasını başında, geri kalanından önce taşıyıp taşımadığı.
- `selectable: Boolean`: Satırların yazdığının seçilip seçilemediği: üstünde bir imleç sürüklenerek ya da parmak basılı tutularak seçilir ve sistemin kendi yoluyla kopyalanır. Böyle kopyalanan, satırların gösterdiğidir, satır satır: girintisi olmadan, katlanmış bir değer de katlandığı gibi. Kendi yüksekliğinde kayan bir görünüm yalnızca ekranındaki satırları kurmuştur; orada "tümünü seç" de onları seçer. Düğme ise belgenin kendisini kopyalar.
- `copyable: Boolean`: Görünümde belgeyi kopyalayan düğmenin olup olmadığı.
- `onCopy: ((copied: Boolean) -> Unit)?`: O düğmeye basıldıktan sonra, belgenin panoya ulaşıp ulaşmadığıyla çağrılır: bunu kendi yoluyla söyleyen ekran burayı dinler. Düğmenin kendisi kısa bir süre bir onay işareti gösterir ve ekran okuyucuya söyler; sistem her kopyayı kendisi gösteriyorsa (`PantrixClipboard.traits`) söylemez: orada başka bir şey gerekmez.
- `style: JsonViewStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: JsonViewColors?`: Bu görünümün, temadan gelmeyen kendi renkleri: burada verilenler kullanılır, gerisi temanınki kalır.
- `tagKey: String?`: Görünümün otomasyon anahtarı: görünüm `JsonView_<tagKey>`, içindeki bir satır `JsonView_<tagKey>.Row_<path>` olarak etiketlenir; yol yazıldığı gibidir (`Row_/user/tags/0`, metnin kendi değeri için `Row_root`). Açık bir değeri kapatan satır `JsonView_<tagKey>.End_<path>`, JSON olmayan bir metnin üstündeki satır `JsonView_<tagKey>.Note_fault`, kopyalama düğmesi `JsonView_<tagKey>.Button_copy` olarak etiketlenir. Yalnızca aynı adı taşıyan iki üye aynı yolu, dolayısıyla aynı test etiketini paylaşır. Bir basış `JsonView` olayı olarak bildirilir: `expand` ve `collapse` satırın düzeyiyle, `copy` panoya ulaşıp ulaşmadığıyla. Belgeden hiçbir şey bildirilmez.

### PantrixJsonView

`import com.pantrixui.components.data.jsonview.PantrixJsonView`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixJsonView(
    json: String,
    expanded: Set<String>,
    onExpandedChange: (Set<String>) -> Unit,
    modifier: Modifier = Modifier,
    search: String = "",
    softWrap: Boolean = true,
    lineNumbers: Boolean = false,
    selectable: Boolean = true,
    copyable: Boolean = true,
    onCopy: ((copied: Boolean) -> Unit)? = null,
    style: JsonViewStyle? = null,
    colors: JsonViewColors? = null,
    tagKey: String? = null
)
```

Neyin açık olduğunu çağıranın tuttuğu `PantrixJsonView`, bir accordion'ın bölümlerinde olduğu gibi: `expanded` verilir, `onExpandedChange`'in bildirdiği uygulanır. Böylece bir ekran kendi düğmesiyle her şeyi açabilir, bir aramanın bulduğu değere giden yolu açabilir ya da başka bir ekrana gidip dönünce açık olanı koruyabilir.

`search`'ün bulduğu burada da işaretlenir; içinde aranandan bir şey olan katlanmış bir değer bütünüyle işaretlenir. Onu açmak çağıranın işidir: `jsonViewSearchPaths`'in verdiği yollarla.

```kotlin
var open by remember(json) { mutableStateOf(jsonViewPaths(json, depth = 1)) }
PantrixJsonView(json = json, expanded = open, onExpandedChange = { open = it }, tagKey = "settings")
```

Parametreler:

- `json: String`: JSON metni, RFC 8259'un yazdığı gibi. Yalnızca değiştiğinde yeniden okunur.
- `expanded: Set<String>`: Açık nesnelerin ve dizilerin yolları, `jsonViewPaths`'in yazdığı gibi: metnin kendi değeri için boş metin, `user` üyesi için `/user`, onun `tags`'inin ilki için `/user/tags/0`. Katlanan bir şeye götürmeyen yol hiçbir şeyi değiştirmez.
- `onExpandedChange: (Set<String>) -> Unit`: Bir satıra basıldığında, bundan sonra açık olması gereken yollarla çağrılır: `expanded`, o satırın yolu eklenmiş ya da çıkarılmış olarak. Görünüm kendiliğinden hiçbir şeyi değiştirmez.
- `modifier: Modifier`: Görünümün modifier'ı. Burada verilen yükseklik, belgenin içinde kaydığı yerdir.
- `search: String`: Adlarda ve değerlerde aranan, büyük ya da küçük harfle.
- `softWrap: Boolean`: Görünüme sığmayan satırın kendi altında sürüp sürmediği.
- `lineNumbers: Boolean`: Her satırın, açık belgedeki numarasını taşıyıp taşımadığı.
- `selectable: Boolean`: Satırların yazdığının seçilip sistemin kendi yoluyla kopyalanıp kopyalanamadığı.
- `copyable: Boolean`: Görünümde belgeyi kopyalayan düğmenin olup olmadığı.
- `onCopy: ((copied: Boolean) -> Unit)?`: O düğmeye basıldıktan sonra, belgenin panoya ulaşıp ulaşmadığıyla çağrılır.
- `style: JsonViewStyle?`: Bu çağrının kendi stili: çevresindeki her stili ezer, yoğunluk ona da uygulanır. Yalnızca verdiği alanlar değişir ve her platformda değişir.
- `colors: JsonViewColors?`: Bu görünümün, temadan gelmeyen kendi renkleri: burada verilenler kullanılır, gerisi temanınki kalır.
- `tagKey: String?`: Görünümün otomasyon anahtarı, öteki overload'daki gibi.

### jsonViewPaths

`import com.pantrixui.components.data.jsonview.jsonViewPaths`, `com.pantrixui:components` içinden

```kotlin
fun jsonViewPaths(
    json: String,
    depth: Int = Int.MAX_VALUE
): Set<String>
```

`json`'daki, bir `PantrixJsonView`'in katlayabildiği nesnelerin ve dizilerin yolları, `depth` düzeye kadar: bir belgeyi o kadar açmak için `expanded`'a verilen küme.

Bir yol bir JSON Pointer'dır (RFC 6901): metnin kendi değerinden bir değere götüren adlar ve sıralar, her biri bir eğik çizgiden sonra. Metnin kendi değeri boş metindir, `user` üyesi `/user`, onun `tags`'inin ilki `/user/tags/0`. Bir addaki eğik çizgi `~1`, tilde `~0` olarak yazılır. İçinde hiçbir şey olmayan bir nesnenin ya da dizinin katlanacak bir şeyi yoktur ve yolu bunların arasında değildir.

```kotlin
var open by remember(json) { mutableStateOf(jsonViewPaths(json, depth = 1)) }
PantrixJsonView(json = json, expanded = open, onExpandedChange = { open = it })
// Everything open, from a button of the screen's own:
open = jsonViewPaths(json)
```

Metin, bu her çağrıldığında yeniden okunur: metin aynı kaldıkça verdiğini sakla, yukarıdaki `remember`'ın yaptığı gibi.

Döndürdüğü: yollar, metinde yazıldıkları sırayla.

Parametreler:

- `json: String`: Metin. JSON olmayan bir metnin yolu yoktur.
- `depth: Int`: Kaç düzeyin sayıldığı: `1` yalnızca metnin kendi değeri, `2` o değer ve içindekiler; varsayılan olarak her düzey. Sıfır ve daha azı hiçbirini saymaz.

### jsonViewSearchPaths

`import com.pantrixui.components.data.jsonview.jsonViewSearchPaths`, `com.pantrixui:components` içinden

```kotlin
fun jsonViewSearchPaths(
    json: String,
    search: String,
    language: String = ""
): Set<String>
```

`json`'daki nesnelerden ve dizilerden, içinde `search`'ün aradığından bir şey olanların yolları: aranan bir adda ya da bir değerde, ne kadar derinde olursa olsun. Bulunan her şeyi göstermek için bir `PantrixJsonView`'in `expanded`'ına verilen ya da eklenen küme.

```kotlin
val found = remember(json, query) { jsonViewSearchPaths(json, query) }
PantrixJsonView(
    json = json,
    expanded = open + found,
    onExpandedChange = { open = it },
    search = query
)
```

Metin, bu her çağrıldığında yeniden okunur: metin ve aranan aynı kaldıkça verdiğini sakla.

Döndürdüğü: açık olması gereken değerlerin yolları, `jsonViewPaths`'in bir yolu yazdığı gibi. Bir değer bunların arasına içindekiler için girer, kendi adı için değil: adını taşıyan satır onu tutanın içindedir.

Parametreler:

- `json: String`: Metin. JSON olmayan bir metnin yolu yoktur.
- `search: String`: Aranan, büyük ya da küçük harfle. Boş bir arama hiçbir şey bulmaz.
- `language: String`: Aramanın küçük harflerini karşılaştırdığı dil, görünümün yaptığı gibi temanın `locale.language`'ı: Türkçede ve Azericede noktasız ı, I'nın küçük harfidir; bu yüzden "i" "İstanbul"u bulur, "Irmak"ı bulmaz.

### JsonViewStyle

`import com.pantrixui.components.data.jsonview.JsonViewStyle`, `com.pantrixui:components` içinden

```kotlin
class JsonViewStyle(
    public val shape: ShapeSpec = ShapeSpec.Unspecified,
    public val horizontalPadding: Dp = Dp.Unspecified,
    public val verticalPadding: Dp = Dp.Unspecified,
    public val linePadding: Dp = Dp.Unspecified,
    public val indent: Dp = Dp.Unspecified,
    public val chevronSize: Dp = Dp.Unspecified,
    public val chevronGap: Dp = Dp.Unspecified,
    public val borderWidth: Dp = Dp.Unspecified,
    public val guideWidth: Dp = Dp.Unspecified
) : PantrixStyle<JsonViewStyle>
```

`PantrixJsonView`'in geometrisi: satırlarının çevresindeki boşluk, bir düzeyin ne kadar içeride durduğu ve kenar.

Satırlar bir listenin değil bir belgenin satırlarıdır: kod satırları gibi sık durur. Parmakla kullanılan yerde, Android'de, iOS'ta ve tarayıcısı dokunmatik bir ekranda olabilen web'de, bir satırın yazısının üstünde ve altında 4dp vardır ve satır temanın kod yazısıyla 28dp olur; masaüstünde, imleç için, 2dp vardır. Bir düzey masaüstünde ve web'de o yazının iki harfi kadar, satırın kısa olduğu telefonda bir buçuk harfi kadar içeride durur.

Köşeler her platformda kartın köşeleridir: Android'de orta, iOS'ta büyük, masaüstünde ve web'de küçük.

İç boşluklar, girinti ve aralık yoğunlukla ölçeklenir, çünkü yazının çevresindeki boşluktur. Okun boyutu, kenarın ve kılavuz çizgilerinin kalınlığı ve şekil ölçeklenmez.

Parametreler:

- `shape: ShapeSpec`: Görünümün köşeleri: markanın şekil ölçeğinden bir basamak ya da sabit bir şekil.
- `horizontalPadding: Dp`: Görünümün yan kenarları ile satırları arasındaki boşluk. İmlecin altındaki iz ve basış bu boşluğun da üstüne, yan kenarlara kadar çizilir.
- `verticalPadding: Dp`: İlk satırın üstündeki ve son satırın altındaki boşluk.
- `linePadding: Dp`: Her satırın yazısının üstündeki ve altındaki boşluk.
- `indent: Dp`: Her düzeyin, kendisini tutandan ne kadar içeride durduğu. Satırların kendi altında sürdüğü yerde bir satır, ne kadar derinde olursa olsun, kendisine kalan yerin yarısından fazla içeri girmez.
- `chevronSize: Dp`: Katlanan bir satırın başındaki okun genişliği ve yüksekliği.
- `chevronGap: Dp`: O ok ile satırın yazısı arasındaki aralık. Her satır okun yerini boş bırakır: böylece bir düzeyin adları alt alta başlar.
- `borderWidth: Dp`: Görünümün çevresindeki kenarın kalınlığı. Sıfır verilirse kenar çizilmez.
- `guideWidth: Dp`: Açık bir nesneden ya da diziden, okunun altından, içindekilerin sonuna kadar inen çizgilerin kalınlığı: girintinin dar olduğu yerde bir düzeyi ötekinden ayıran bunlardır. Sıfır verilirse çizgi çizilmez.

### JsonViewColors

`import com.pantrixui.components.data.jsonview.JsonViewColors`, `com.pantrixui:components` içinden

```kotlin
data class JsonViewColors(
    public val container: Color = Color.Unspecified,
    public val key: Color = Color.Unspecified,
    public val string: Color = Color.Unspecified,
    public val number: Color = Color.Unspecified,
    public val literal: Color = Color.Unspecified,
    public val punctuation: Color = Color.Unspecified,
    public val border: Color = Color.Unspecified,
    public val guide: Color = Color.Unspecified,
    public val match: Color = Color.Unspecified
)
```

Temanın renklerini almayan bir görünüm için `PantrixJsonView`'in renkleri: verilen renk kullanılır, verilmeyen temanınki kalır.

```kotlin
// No fill and no edge of its own, in a card that has both:
PantrixJsonView(
    json = response,
    colors = JsonViewColors(container = Color.Transparent, border = Color.Transparent)
)
```

Temanın kendi zeminlerinde her tür değerin, temanın rollerinden, kendi rengi vardır: böylece bir sayı, rakamlardan oluşan bir metin değerinden tırnaklarına bakılmadan ayırt edilir. Başka bir dolgunun üstünde o renklerin okunup okunmayacağı bilinmez. Temanın rol renklerinden biri olan bir `container` da, üstünde duranlara renk veren bir dolgunun üstündeki saydam bir dolgu da belgenin tamamını orada okunan tek renkle yazar; temada olmayan bir dolgu ise onu temanın yazı rengiyle yazar. Burada verilen her renk, görünüm nerede durursa dursun kullanılır.

Parametreler:

- `container: Color`: Satırların arkasındaki dolgu: temanın `surface`'ı. `Color.Transparent` verilirse görünümün arkasındaki görünür.
- `key: Color`: Bir üyenin adı. Katlanan bir satırda imlecin altındaki iz ve basış da bu renkle çizilir. Temanın `textPrimary`'si.
- `string: Color`: Bir metin değeri. Temanın `success` rolü.
- `number: Color`: Bir sayı. Temanın `warning` rolü.
- `literal: Color`: `true`, `false` ve `null`. Temanın `primary` rolü.
- `punctuation: Color`: Parantezler, iki noktalar ve virgüller, katlanmış olanın üç noktası ile içinde kaç şey olduğu, katlanan bir satırın başındaki ok ve JSON olmayan bir metin. Temanın `textSecondary`'si.
- `border: Color`: Görünümün çevresindeki kenar. Temanın kendi zeminlerinde temanın `divider`'ıdır; o çizginin okunmayacağı bir dolgunun üstünde ise orada yazılan rengin bir payıdır.
- `guide: Color`: Açık bir nesneden ya da diziden inen çizgiler. Temanın kendi zeminlerinde temanın `divider`'ıdır; bir dolgunun üstünde ise orada yazılan rengin bir payıdır. `border` da, kendisine bir şey verilmediğinde budur; ama ikisi ayrıdır: `border`'a verilen renk kılavuz çizgilerini değiştirmez.
- `match: Color`: Bir aramanın bulduğu harflerin arkasına konan dolgu. Temanın `warning` rolünün yumuşatılmış hâlidir ve üstündeki harfler temanın onunla eşlediği renkle yazılır; bir dolgunun üstünde ise orada yazılan rengin bir payıdır ve harfler kendi renklerini korur. Burada verilen renk temanın rol renklerinden biriyse eşini de getirir.
