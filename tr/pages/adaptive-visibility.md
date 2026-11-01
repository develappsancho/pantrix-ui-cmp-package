# Göster ve gizle

Örnek vaka: bir parçanın yalnızca bazı pencerelerde, platformlarda ya da girdilerde görünmesi. Göstermek ve gizlemek için düz `if` yeter. Dikkat edilecek tek şey durumdur: `if`'in içindeki bir parça gizlenince kompozisyondan çıkar ve hatırladıklarını bırakır.

Üç ayrı soru vardır ve karıştırılmamalıdır: pencere ne kadar yer veriyor, kod hangi platformda çalışıyor, uygulama neyle kullanılıyor. Pencereye bakan örneklerin kartında bir pencere seçicisi durur: "Dar", "Orta", "Kısa" ve "Geniş" o örneğe sabit bir pencere verir, "Gerçek" uygulamanınkini; katlanmaya bakan örneklerde "Kitap" ve "Masa" da. Telefonda geniş pencerenin, masaüstünde dar pencerenin, katlanmayan bir cihazda katlanan birinin hâli böylece pencereye dokunmadan görülür.

## Özellikler

- **Pencere ne kadar yer veriyor?** `window.isNarrow`, `window.isShort`, `window.widthClass >= ...`. Telefonda da, daraltılmış bir masaüstü penceresinde de aynı cevabı verir: "mobil görünüm" çoğu zaman budur.
- **Kod hangi platformda çalışıyor?** `PantrixTheme.platform.type`. Pencerenin boyutuyla ilgisi yoktur: "uygulamayı indir" afişi yalnızca web'de, "mağazada puanla" yalnızca Android'de ve iOS'ta anlamlıdır.
- **Neyle kullanılıyor?** `PantrixTheme.platform.isTouch`: parmakla mı, fareyle mi. Platform bunu söylemez: telefonun tarayıcısı da web'dir ama parmakla kullanılır.
- **Gizlemek yerine değiştirmek.** Aynı bileşen iki düzende de varsa gizlenip başka bir yerden çağrılmaz; ona verilen değer değişir. Koşula bağlı bir modifier `Modifier.thenIf` ile yazılır.
- **Gizlenenin durumu.** Aynı içerik iki ayrı yerden çağrılırsa Compose onu iki ayrı içerik sayar: pencere sınıf değiştirince biri gider, öteki sıfırdan başlar. Tek yerden çağrılır, değişen parametreyle verilir.
- **Taşımak.** İçeriğin içinde durduğu şey değişmek zorundaysa, dar pencerede alt alta ve genişte yan yana, `movableContentOf` onu hatırladıklarıyla birlikte taşır.
- **Kaydedilen durum.** Kalması gereken durum `rememberSaveable` ile tutulur: Android bir Activity'yi yeniden yarattığında `remember` ile hatırlanan gider, kaydedilen çağrıldığı yere göre geri gelir.
- **Bir parçaya kendi penceresi.** `LocalPantrixWindow` ekranın bir parçasına başka bir pencere verir: bir önizlemeyi ya da bir testi belli bir boyutta kurmanın yolu, kartlardaki pencere seçicisinin de yaptığı.

## Örnekler

### Pencereye göre

Pencerenin verdiği yere göre gelen ve giden parçalar. `isNarrow` yalnızca dar pencerede, `!isNarrow` dar olmayan her pencerede tutar. Sınıflar sıralıdır: `widthClass >= WindowWidthClass.Expanded` bir sınıftan itibaren, `widthClass in Medium..Expanded` iki sınıf arasında tutar. `isShort` yalnızca kısa pencerede. Gizlenen parça kompozisyonda yoktur: yer de tutmaz, okunmaz da.

Dikey telefonda yalnızca "dar pencerede" satırı görünür; yatay çevrilince çoğu telefonda öteki dördü. 1200 dp'den geniş bir masaüstü penceresinde "dar olmayan" ve "Expanded'dan itibaren" satırları kalır.

Karttaki pencere seçicisi bu örneğe kendi penceresini verir: "Dar" 360 × 800, "Orta" 768 × 1024, "Kısa" 880 × 400, "Geniş" 1280 × 800 dp'lik sabit bir pencere, "Gerçek" uygulamanınki. Altındaki satır örneğin o an hangi pencereye baktığını söyler. "Orta" dik tutulan bir tablettir ve `Medium`'dur: "dar olmayan" ve "Medium ve Expanded'da" satırları görünür. "Kısa" yatay tutulan bir telefondur, 880 dp ile `Expanded`'dır ve 400 dp ile kısadır: "dar pencerede" dışındaki dört satır da görünür.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.WindowWidthClass
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.adaptive.isShort
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
// Yalnızca dar pencerede: dikey telefon ve daraltılmış her pencere.
if (window.isNarrow) {
    PantrixText(
        text = "Yalnızca dar pencerede: sayfanın altındaki 'Sepete ekle' bar'ı",
        tagKey = "narrow_only"
    )
}
// Dar olmayan her pencerede: tabletten masaüstüne.
if (!window.isNarrow) {
    PantrixText(text = "Dar olmayan pencerede: eylem başlıktaki düğmedir", tagKey = "not_narrow")
}
// Belli bir sınıftan itibaren: sınıflar sıralıdır, karşılaştırılır.
if (window.widthClass >= WindowWidthClass.Expanded) {
    PantrixText(text = "Expanded'dan itibaren: listenin yanındaki detay paneli", tagKey = "from_expanded")
}
// İki sınıf arasında: aralık.
if (window.widthClass in WindowWidthClass.Medium..WindowWidthClass.Expanded) {
    PantrixText(text = "Yalnızca Medium ve Expanded'da: etiketli ray", tagKey = "medium_to_expanded")
}
// Yalnızca kısa pencerede: yatay tutulan telefon.
if (window.isShort) {
    PantrixText(text = "Yalnızca kısa pencerede: küçültülmüş üst bar", tagKey = "short_only")
}
```

### Platforma göre

Platforma göre gelen ve giden parçalar: `PantrixTheme.platform.type`. Pencerenin boyutuyla ilgisi yoktur: geniş bir Android tableti de Android'dir, daraltılmış bir tarayıcı penceresi de web'dir. "Mobilde görünsün" derken hangisinin kastedildiğine karar verilir: çoğu zaman pencere, bazen platform.

Web'de ilk satır, Android'de ve iOS'ta ikincisi görünür; masaüstü uygulamasında yalnızca platformun adı yazar.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.platform.PlatformType
import com.pantrixui.foundation.theme.PantrixTheme

val platform = PantrixTheme.platform.type
if (platform == PlatformType.Web) {
    PantrixText(text = "Yalnızca web'de: 'Uygulamayı indir' afişi", tagKey = "web_only")
}
if (platform == PlatformType.Android || platform == PlatformType.Ios) {
    PantrixText(text = "Android'de ve iOS'ta: 'Mağazada puanla' bağlantısı", tagKey = "store_platforms")
}
PantrixText(
    text = "Bu platform: ${platform.name}",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "platform"
)
```

### Girdiye göre

Uygulama parmakla mı kullanılıyor, fareyle mi: `PantrixTheme.platform.isTouch`. Bunu platformun türü söylemez. Android ve iOS hep dokunmatiktir, masaüstü hep fareyledir; web ikisi de olur: masadaki tarayıcı fareyle, telefondaki parmakla kullanılır. Tarayıcıda cevap canlıdır, işaretçi değişince o da değişir.

Dokunmatik kullanımda çekerek yenileme ipucu, fareyle kullanımda klavye kısayolları ipucu görünür. Dokunma hedefi de aynı cevaba bağlıdır: Android'de 48, iOS'ta 44 dp; masaüstünde ve web'de fare için 32, parmak için 48 dp. Bileşenler onu temadan kendileri alır; burada yalnızca gösterilir.

```kotlin
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val platform = PantrixTheme.platform
if (platform.isTouch) {
    PantrixText(text = "Dokunmatik kullanımda: çekerek yenile ipucu", tagKey = "touch_only")
}
if (!platform.isTouch) {
    PantrixText(text = "Fareyle kullanımda: klavye kısayolları ipucu", tagKey = "pointer_only")
}
PantrixText(
    text = "Dokunmatik: ${if (platform.isTouch) "evet" else "hayır"} · " +
        "dokunma hedefi: ${platform.minTouchTarget.value.roundToInt()} dp",
    style = PantrixTheme.typography.footnote,
    color = PantrixTheme.colors.textSecondary,
    tagKey = "input"
)
```

### Aynı bileşen, değişen değer

Gizlenmeyen ama pencereye göre değişen tek bir bileşen: düğme dar pencerede satırı doldurur, genişte kendi genişliğindedir. Bileşen aynı çağrıdır; değişen yalnızca ona verilen değerdir. `Modifier.thenIf`, koşul tutunca bloğu zincire ekler.

Karttaki pencere seçicisinden "Dar" ve "Geniş"i dene ya da telefonu çevir: düğme yerinde kalır, genişliği değişir.

```kotlin
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.primitives.thenIf
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
PantrixButton(
    text = "Devam et",
    onClick = {},
    modifier = Modifier.thenIf(window.isNarrow) { fillMaxWidth() },
    tagKey = "continue"
)
```

### Gizlenince durum ne olur

İki sayaç, aynı iş, iki yazım. İlki dar ve geniş pencere için iki ayrı yerden çağrılır: Compose bunları iki ayrı sayaç sayar, pencere sınıf değiştirince biri gider, öteki sıfırdan başlar. İkincisi tek bir yerden çağrılır ve yalnızca etiketi değişir: sayısı durur.

İkisini de artır, sonra karttaki pencere seçicisinden "Dar" ile "Geniş" arasında geç: iki yerden çağrılan sıfırlanır, öteki kalır. Bir ek için, bir ipucu ya da bir afiş gibi, bu sorun değildir; iki düzende de olan içerik tek yerden çağrılır.

Sayaç sayısını `rememberSaveable` ile hatırlar: Android bir Activity'yi yeniden yarattığında düz `remember` ile hatırlanan, nereden çağrıldığına bakılmadan gider. Kaydedilen değer de çağrıldığı yere göre geri gelir: tek yerden çağrılan sayaç sayısını hep bulur. İki yerden çağrılan, Activity yeniden yaratıldığında pencere dar ise dar, geniş ise geniş kaldıysa bulur: aynı dal kurulur. Dardan genişe ya da genişten dara geçtiyse, dönen bir telefonda olduğu gibi, bulamaz.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
// Sayaçlar yan yana sığmazsa alt satıra geçer: etiketleri pencereye göre uzar.
FlowRow(
    horizontalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md),
    verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
) {
    // YANLIŞ: aynı içerik iki ayrı yerden. Sınıf değişince sayı sıfırlanır.
    if (window.isNarrow) {
        Counter(label = "İki yerden (dar)", tagKey = "two_sites")
    } else {
        Counter(label = "İki yerden (geniş)", tagKey = "two_sites")
    }
    // DOĞRU: tek yerden; değişen etiket parametredir. Sayı korunur.
    Counter(label = if (window.isNarrow) "Tek yerden (dar)" else "Tek yerden (geniş)", tagKey = "one_site")
}

@Composable
private fun Counter(
    label: String,
    tagKey: String
) {
    var count by rememberSaveable { mutableIntStateOf(0) }
    PantrixButton(
        text = "$label: $count",
        onClick = { count++ },
        variant = ButtonVariant.Outline,
        tagKey = tagKey
    )
}
```

### Aynı içerik, başka dizilim

Aynı içerik, başka bir dizilimde: dar pencerede alt alta, genişte yan yana. `Column` ile `Row` iki ayrı çağrı yeridir: içerik birinden ötekine düz bir çağrıyla geçseydi hatırladıklarını bırakırdı. `movableContentOf` içeriği taşır: aynı kompozisyon yeni yerine gider, sayaçlar sayılarını korur. Tek bir çağrı yeri yetmediğinde, yani içeriğin içinde durduğu şey değişmek zorunda olduğunda kullanılır.

Sayaçları artır, sonra karttaki pencere seçicisinden "Dar" ile "Geniş" arasında geç: dizilim değişir, sayılar kalır.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.movableContentOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.foundation.adaptive.isNarrow
import com.pantrixui.foundation.theme.PantrixTheme

val window = PantrixTheme.window
val spacing = PantrixTheme.spacing
// Bir kez kurulur ve hatırlanır; çağrıldığı yer değişince içerik oraya taşınır.
val counters = remember {
    movableContentOf {
        Counter(label = "Taşınan A", tagKey = "moved_a")
        Counter(label = "Taşınan B", tagKey = "moved_b")
    }
}
if (window.isNarrow) {
    Column(verticalArrangement = Arrangement.spacedBy(spacing.sm)) { counters() }
} else {
    Row(horizontalArrangement = Arrangement.spacedBy(spacing.md)) { counters() }
}

@Composable
private fun Counter(
    label: String,
    tagKey: String
) {
    var count by rememberSaveable { mutableIntStateOf(0) }
    PantrixButton(
        text = "$label: $count",
        onClick = { count++ },
        variant = ButtonVariant.Outline,
        tagKey = tagKey
    )
}
```

### Bir parçaya kendi penceresi

Kartlardaki pencere seçicisinin yaptığı, en yalın hâliyle: `LocalPantrixWindow` ekranın bir parçasına başka bir pencere verir. İçindeki her `PantrixTheme.window` ve `responsive(...)` o pencereye sorar. Sabit pencere `PantrixWindow(size, breakpoints)` ile kurulur ve gerçeğinin sınırlarıyla sınıflanır: ürün temaya kendi sınırlarını verdiyse o da onlara uyar.

İlk satır örneğin gördüğü pencereyi yazar: uygulamanınkini, ya da karttaki seçici bir pencere verdiyse onu. Altındaki iki parçaya birer sabit pencere verildi: biri hep dar, öteki hep geniş düzeni seçer, çevrelerindeki pencere ne olursa olsun. Karttaki pencere seçicisinde "Dar" ve "Geniş"i dene: ilk satır değişir, altındaki ikisi değişmez. Aynı teknik bir önizlemeyi ya da bir testi belli bir boyutta kurmak için de kullanılır. Platform ve girdi bundan etkilenmez.

```kotlin
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.adaptive.LocalPantrixWindow
import com.pantrixui.foundation.adaptive.PantrixWindow
import com.pantrixui.foundation.adaptive.responsive
import com.pantrixui.foundation.theme.PantrixTheme

val real = PantrixTheme.window
// Sabit iki pencere, gerçeğinin sınırlarıyla sınıflanır.
val narrow = remember(real) { PantrixWindow(DpSize(360.dp, 800.dp), breakpoints = real.breakpoints) }
val wide = remember(real) { PantrixWindow(DpSize(1280.dp, 800.dp), breakpoints = real.breakpoints) }
PantrixText(text = "Örneğin gördüğü pencere: ${real.widthClass.name}", tagKey = "theme_window")
CompositionLocalProvider(LocalPantrixWindow provides narrow) {
    PantrixText(
        text = "360 × 800 dp verilen parça: ${PantrixTheme.window.widthClass.name}, " +
            responsive(compact = "dar düzen", expanded = "geniş düzen"),
        tagKey = "narrow_part"
    )
}
CompositionLocalProvider(LocalPantrixWindow provides wide) {
    PantrixText(
        text = "1280 × 800 dp verilen parça: ${PantrixTheme.window.widthClass.name}, " +
            responsive(compact = "dar düzen", expanded = "geniş düzen"),
        tagKey = "wide_part"
    )
}
```

## API

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Pencere dar mı: genişlik sınıfı `WindowWidthClass.Compact` mı. Dikey tutulan telefon böyledir. Tek panelli ve gezinmesi altta olan düzenin sorusudur.

`widthClass == WindowWidthClass.Compact` için bir addır, kod uyduğu kural gibi okunsun diye: `if (window.isNarrow) BottomBar()`. "Şu genişlikten itibaren" için sınıf karşılaştırılır: `widthClass >= Expanded`.

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

### PantrixWindow.isShort

`import com.pantrixui.foundation.adaptive.isShort`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isShort: Boolean
```

Pencere kısa mı: yükseklik sınıfı `WindowHeightClass.Compact` mı. Yatay tutulan telefon böyledir. Böyle bir pencere çoğu zaman geniştir, genişliğine göre Medium ya da Expanded'dır, ama bar'ları üst üste dizecek yüksekliği yoktur: ana eylem alttaki bir bar'a değil başlığa gider ve alt kenardan hiçbir şey açılmaz.

`heightClass == WindowHeightClass.Compact` için bir addır:

```kotlin
if (window.isShort) HeaderAction() else StickyBottomBar()
```

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

### Modifier.thenIf

`import com.pantrixui.foundation.primitives.thenIf`, `com.pantrixui:foundation` içinden

```kotlin
inline fun Modifier.thenIf(
    condition: Boolean,
    block: Modifier.() -> Modifier
): Modifier
```

`condition` tutuyorsa `block` uygulanmış, tutmuyorsa değişmemiş hâliyle bu modifier: zincirin atlayabileceği bir halka.

Parametreler:

- `condition: Boolean`
- `block: Modifier.() -> Modifier`

### LocalPantrixWindow

`import com.pantrixui.foundation.adaptive.LocalPantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixWindow: ProvidableCompositionLocal<PantrixWindow>
```

Geçerli pencere: en yakın `PantrixTheme`'in sağladığı pencere. Çevrede tema yoksa Compose'un bildirdiği penceredir, varsayılan sınırlarla sınıflanır ve düzdür.

`PantrixTheme.window` onu okur. Ekranın bir parçasına ikinci bir tema olmadan kendi penceresini vermek için sağlanır: içeriği panelin genişliğine bakması gereken bir panele.

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
interface PantrixWindow
```

İçeriğin çizildiği pencere, bir düzenin bilmesi gereken hâliyle: ne kadar geniş ve ne kadar yüksek olduğu, cihazının nasıl katlandığı. `PantrixTheme` onu sağlar, `PantrixTheme.window` okur: kurulumu yoktur.

Cihaz ya da ekran değil, penceredir: bölünmüş ekranın yarısındaki, boyutu değiştirilmiş bir masaüstü penceresindeki ya da bir tarayıcı sekmesindeki uygulama o kadar geniştir. Bir düzen boyuta değil sınıfa sorar:

```kotlin
val window = PantrixTheme.window
val columns = window.byWidth(compact = 2, medium = 4)
if (window.widthClass >= WindowWidthClass.Expanded) ListBesideDetail() else ListAlone()
```

Tema durduğu sürece pencere tek bir nesnedir ve değerleri sorulduğunda okunur. `widthClass` ya da `heightClass` okuyan, sınıf değişince yeniden kurulur, daha önce değil. `size` okuyan her değişimi izler: bir dönüşün her karesini, sürüklenen pencere kenarının her pikselini.

Kendi başına bir panel olan bileşen, bir scaffold ya da bir sheet, pencereye sormaz, kendisine verilen yeri ölçer: dar bir panelin içinde pencere yine geniştir. `BoxWithPantrixWindow` bir bileşene o yeri bir pencere olarak söyler.

Masaüstünde ve web'de içerik ilk kez kurulurken pencerenin henüz boyutu yoktur ve o tek kompozisyon Compact bir pencere bulur. Android ve iOS boyutu baştan söyler. Sınıf kullanıldığı yerde okunur, başta ne olduğu saklanmaz.

Üyeleri:

- `size: DpSize`: Pencerenin boyutu. Android'de sistem çubuklarıyla birlikte penceredir, web'de uygulamanın çizildiği kutu. Platform söyleyene kadar sıfırdır ya da belirtilmemiştir: sınıflar o zamana kadar Compact'tır.
- `isSizeKnown: Boolean`: Platform pencerenin boyutunu söyledi mi: hem genişliğini hem yüksekliğini.

  Android'de ve iOS'ta ilk kompozisyondan itibaren true'dur. Masaüstünde ve web'de ilk kompozisyonda false'tur: içerik orada pencerenin boyutu gelmeden bir kez kurulur. Sonraki kompozisyondan itibaren true'dur. O zamana kadar pencere iki yönde de Compact okunur, bu yüzden bir kez verilip saklanan her karar, bir başlangıç sayfası ya da hatırlanan bir seçim, bunu bekler:

  ```kotlin
  PantrixTheme {
      // The app is composed for the first time in a window whose class is the real one.
      if (PantrixTheme.window.isSizeKnown) App()
  }
  ```

  Okuyan, cevap değişince yeniden kurulur; pencere boyut değiştirirken kurulmaz.
- `widthClass: WindowWidthClass`: Pencerenin genişlik sınıfı: düzen buna göre seçilir.
- `heightClass: WindowHeightClass`: Pencerenin yükseklik sınıfı: `WindowHeightClass.Compact` yatay tutulan bir telefondur.
- `posture: WindowPosture`: Pencerenin cihazının nasıl katlandığı. Kat yeri olmayan yerde `WindowPosture.Flat`'tir.
- `verticalBar: WindowVerticalBar?`: Sistemin pencerenin bir kenarı boyunca dik duran bar'lar için ayırdığı sütun, ya da ayırmadığı yerde null: iPhone Duo'nun dış ekranı dışında her ekranda olduğu gibi. Yerleri pencerenin koordinatlarındadır: bir düzen onun kendi yanında nerede durduğunu `rememberVerticalBarInNode` ile sorar.
- `breakpoints: PantrixBreakpoints`: Bu pencerenin sınıflarının başladığı yer: pencerenin sınıflandığı sınırlar. Elle sınıflanan bir boyut da aynı sınırlara uyar, `BoxWithPantrixWindow`'un bir bileşene verilen yeri sınıflaması gibi:

  ```kotlin
  val pane = PantrixWindow(paneSize, breakpoints = PantrixTheme.window.breakpoints)
  ```

### PantrixWindow

`import com.pantrixui.foundation.adaptive.PantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixWindow(
    size: DpSize,
    posture: WindowPosture = WindowPosture.Flat,
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    verticalBar: WindowVerticalBar? = null
): PantrixWindow
```

Değerleri sabit bir pencere, gerçeğinin doğru cevabı vermediği yerler için: bir düzenin belli bir boyuttaki testi ya da önizlemesi ve native bir ekranın bir parçasına gömülen Compose. Orada yer o parçanındır.

```kotlin
PantrixTheme(window = PantrixWindow(DpSize(700.dp, 900.dp))) { … }
```

Pikselle verilen bir `verticalBar`, sistemin sütunu olan bir ekranın, iPhone Duo'nun dış ekranının nasıl göründüğünü, sütunun olmadığı yerde çizer.

Parametreler:

- `size: DpSize`: pencerenin boyutu; genişlik ve yükseklik sınıfları ondan gelir.
- `posture: WindowPosture`: pencerenin cihazının nasıl katlandığı: bir kat verilmedikçe düz, katı olmayan her cihaz gibi.
- `breakpoints: PantrixBreakpoints`: her sınıfın başladığı genişlikler ve yükseklikler: ürünün kendi sınırları yoksa Android'in pencere boyutu sınıfları.
- `verticalBar: WindowVerticalBar?`

### WindowWidthClass

`import com.pantrixui.foundation.adaptive.WindowWidthClass`, `com.pantrixui:foundation` içinden

```kotlin
enum class WindowWidthClass
```

Bir pencerenin ne kadar geniş olduğu, beş sınıftan biri olarak. Bir düzen bu sınıfa göre seçer: gezinmesinin biçimini, panel sayısını, bir ızgaranın sütunlarını.

Sınıflar sıralıdır, bu yüzden bir genişlikten itibaren geçerli olan kural bir karşılaştırmadır: `widthClass >= WindowWidthClass.Expanded`. Her birinin nerede başladığını `PantrixBreakpoints` söyler.

Değerleri:

- `Compact`: 600dp'den dar: dikey tutulan bir telefon, bir katlanabilirin kapak ekranı, dar bir tarayıcı penceresi.
- `Medium`: 600dp'den itibaren: açık bir katlanabilir, dikey tutulan bir tablet, bölünmüş ekran.
- `Expanded`: 840dp'den itibaren: yatay tutulan bir tablet ve yatay tutulan çoğu telefon (bkz. `WindowHeightClass.Compact`).
- `Large`: 1200dp'den itibaren: bir masaüstü penceresi, bir tarayıcı, büyük bir tablet.
- `ExtraLarge`: 1600dp'den itibaren: geniş bir masaüstü penceresi, harici bir ekran.

### PlatformType

`import com.pantrixui.foundation.platform.PlatformType`, `com.pantrixui:foundation` içinden

```kotlin
enum class PlatformType
```

Bir temanın kurallarına uyduğu platform: dokunma hedefleri, bileşen preset'leri. `currentPlatformType` kodun çalıştığı platformdur, `PantrixTheme(platform = …)` ile bir başkası istenebilir.

Değerleri:

- `Android`: Android'in gelenekleri: Material'ın 48dp'lik dokunma alanı ve bileşenlerin Android ön ayarları.
- `Ios`: iOS'un gelenekleri: Apple'ın 44pt'lik dokunma alanı ve bileşenlerin iOS ön ayarları.
- `Desktop`: Bir masaüstünün gelenekleri: bir imlecin dokunma alanı ve bileşenlerin masaüstü ön ayarları.
- `Web`: Bir tarayıcının gelenekleri: bir imlecin dokunma alanı ve bileşenlerin web ön ayarları.

### PantrixPlatform

`import com.pantrixui.foundation.a11y.PantrixPlatform`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixPlatform(
    public val type: PlatformType,
    public val minTouchTarget: Dp,
    public val showFocusRingOnlyForKeyboard: Boolean,
    public val focusRingWidth: Dp,
    public val isTouch: Boolean = type.isTouchByNature
)
```

Görsel değil, erişilebilirlik kararı olan platform kuralları.

Parametreler:

- `type: PlatformType`: Bu kuralların ait olduğu platform.
- `minTouchTarget: Dp`: Bir kontrolün en küçük dokunma hedefi: yerleşimde kapladığı yer de, bir dokunuşun ona ulaştığı yer de, ikisi birden. `Modifier.minTouchTarget` bir kontrole bu yeri verir.
- `showFocusRingOnlyForKeyboard: Boolean`: Odak halkasının yalnızca klavyeyle gezinirken görünüp görünmediği. Bugün her yerde true'dur: fare tıklamalarını izleyen bir halka gürültüdür, ona ihtiyacı olanlar da klavyeyle gezinir. Bir yasa değil, bir ürün kararı olduğu için bayrak olarak tutulur.
- `focusRingWidth: Dp`: Halkanın kalınlığı. Sabit değil token'dır, çünkü yüksek kontrast onu kalınlaştırır.
- `isTouch: Boolean`: Platformun dokunarak kullanılıp kullanılmadığı, yani asıl işaretçisinin parmak olup olmadığı. Android'de, iOS'ta ve bir telefonun ya da tabletin tarayıcısında true; asıl işaretçinin fare ya da trackpad olduğu yerde, masaüstünde ve masaüstündeki tarayıcıda false. Web için `type`'ın söyleyemediği şeydir ve platforma göre değil işaretçiye göre belirlenen her şeye o karar verir: bir parmak hareketi ya da bir kısayol için ipucu, işaretçinin üstüne gelmesini bekleyen ya da beklemeyen bir şey. Verilmezse platformun doğasından gelir: Android'de ve iOS'ta dokunmatik.

Üyeleri:

- `focusRingReach: Dp`: Bir odak halkasının öğesinden ne kadar taştığı: halka kadar bir boşluk ve halkanın kendisi. Kayan bir içeriğin, sonlarında duran öğenin halkası için bıraktığı yer budur; lazy bir liste de onu içerik boşluğuna katar ve öğelerine `Modifier.scrollPadding` ile söyler.
- `fun scaled(density: PantrixDensity): PantrixPlatform`: Dokunma hedefine uygulanan yoğunluk: Spacious onu büyütür, Compact hiçbir zaman küçültmez.

  Platformun değeri bir başlangıç noktası değil, bir tabandır. Compact, fare kullananlar için boşlukları sıkıştırmak üzere vardır; bir parmağın, ya da titreyen bir elin, basmak zorunda olduğu bölgeyi platformun kendi en küçük değerinin altına indirmemelidir.

  `density`: temaya verilen arayüz yoğunluğu.

Tipin kendisinde:

- `PantrixPlatform.forType(type: PlatformType, highContrast: Boolean = false, isTouch: Boolean = type.isTouchByNature): PantrixPlatform`: `type`'ın alışkanlıkları. Dokunma hedefi Android'de (48dp, Material) ve iOS'ta (44pt, Apple HIG), onlara ne dokunursa dokunsun, platformun kılavuzundaki en küçük ölçüdür. Hiçbir kılavuzun kapsamadığı masaüstü ve web işaretçiye bakar: fare için 32dp, parmak için de Android'de parmağa verilen ölçü, 48dp. Odak halkası 2dp'dir, `highContrast`'ta 3dp'ye kalınlaşır.

  `isTouch` platformun dokunarak kullanılıp kullanılmadığını söyler. Verilmezse platformun doğasıdır: Android'de ve iOS'ta dokunma, masaüstünde ve tarayıcıda işaretçi. Telefondaki bir tarayıcı ve dokunmatik ekrandaki bir masaüstü uygulaması bunu söyler:

  ```kotlin
  PantrixPlatform.forType(PlatformType.Web, isTouch = true)
  ```

  `rememberPantrixPlatform` sisteme sorar; böylece platform verilmeyen bir tema, telefonun tarayıcısında da doğrudur.
