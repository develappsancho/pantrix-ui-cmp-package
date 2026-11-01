# com.pantrixui:foundation

Pantrix UI's theme, tokens, adaptive window and platform services for Compose Multiplatform.

## Paket com.pantrixui.foundation.a11y

### rememberFocusRingVisible

`import com.pantrixui.foundation.a11y.rememberFocusRingVisible`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFocusRingVisible(interactionSource: InteractionSource): Boolean
```

Bir odak halkasının şu an görünüp görünmeyeceği: öğe odakta, üstünde gösterilen bir modal yok, ve odak klavyeden geldi ya da platform halkayı her odakta gösteriyor (`PantrixPlatform.showFocusRingOnlyForKeyboard`).

Odağın nasıl geldiği Compose'un kendi `androidx.compose.ui.input.InputMode`'udur, Touch ya da Keyboard: bir tuş basışı pencereyi klavye kipine sokar, bir dokunuş çıkarır. İşaret aygıtının ne kadar kesin olduğundan bir şey söylemez.

Bir modalın altında odak, modal kapanınca yine orada olmak için olduğu yerde kalır, ama ona hiçbir tuş ulaşmaz: halka orada modal kapanana kadar gösterilmez (`PantrixModalLayer`).

Parametreler:

- `interactionSource: InteractionSource`: öğenin etkileşim kaynağı: halka onun bildirdiği odağı izler.

Belgelendiği sayfalar: [Erişilebilirlik](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/accessibility.md)

### Modifier.focusRing

`import com.pantrixui.foundation.a11y.focusRing`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun Modifier.focusRing(
    interactionSource: InteractionSource,
    shape: Shape,
    color: Color,
    width: Dp,
    inset: Boolean = false
): Modifier
```

Odak halkasını öğenin çevresine, sınırlarının dışına çizer.

Halka `width` genişliğindedir ve öğeyle arasında o genişlikte bir boşluk bırakır; böylece öğenin kendi dolgusundan ve kenarından ayrı kalır: halkanın renginde dolu bir düğme de halkasından ayırt edilir. Köşeleri boşluk ve halka kadar büyütülmüş `shape`'i izler; yuvarlak bir öğe aynı eğrilik merkezli bir halka alır. Genişliği sıfır olan `width` halka çizmez.

Halka çizilir, yerleştirilmez; yer kaplamaz. Değiştiriciyi öğenin kendi zincirindeki her `clip`'ten ya da katmandan önce koy, yoksa onlar halkayı keser; öğeye yer bırak: kırpan bir üst öğe de onu keser. `inset` onu sınırların içine çizer: kabı kadar geniş ya da uzun bir öğe için, bir liste satırı ya da bir panel ayırıcısı gibi, dışarıdaki halkası kabın kenarlarını aşacak olan.

Öğeyi kaydıran ne varsa, öğe odağı alınca onu görünüre getirir, kendi kenarından ötesine değil. Halka belirirken çizildiği yeri de ister; böylece kayan bir satır ya da sütun halkayı bütün gösterir, halkasının bir yanı kesik bir öğe değil. Yalnızca kaydırılabilecek kadarı istenir: bir kaydırıcının tuttuğunun en sonunda öğenin ötesinde bir şey yoktur ve kaydırıcının içeriği o yeri iç boşluk olarak ister, halka ve boşluğu, `width`'in iki katı (`PantrixPlatform.focusRingReach`). Tembel bir listeden yalnızca öğe istenir: öğelerinin ne kadar sürdüğü bir öğeden anlaşılamaz. Orada yer listenin içerik boşluğudur ve her öğe bunu `scrollPadding` ile söyler.

Parametreler:

- `interactionSource: InteractionSource`: öğenin etkileşim kaynağı; halkanın çizilip çizilmeyeceğini onun odağı belirler.
- `shape: Shape`
- `color: Color`: halkanın rengi: temanın `focusRing`'i, ya da bir dolgunun üstünde o dolgunun üstüne yazılan renk; böylece halka orada yazı gibi okunur.
- `width: Dp`
- `inset: Boolean`

Belgelendiği sayfalar: [Erişilebilirlik](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/accessibility.md)

### PantrixModalLayer

`import com.pantrixui.foundation.a11y.PantrixModalLayer`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixModalLayer(content: @Composable () -> Unit)
```

`content`'in bir modal katmanın olduğunu söyler: uygulamanın üstünde gösterilen ve kapanana kadar tuşlarını ve basışlarını alan bir şey, bir dialog ve bir sheet gibi. O kurulu kaldıkça `PantrixTheme.isUnderModal` penceredeki başka her şey için true, `content`'te false'tur. Sonra açılan bir katman öncekinin üstünde durur; öncekinin içi o andan itibaren bir modalın altındadır.

Pantrix'in kendi modal katmanları bunu kendileri söyler. Uygulamanın `Dialog` üstüne kurulan kendi katmanı gösterdiğini bunun içine koyar, `Dialog`'un çevresine ya da içine; böylece örttüğü şey odakta görünmez olur: bir modalın altında odak, modal kapanınca yine orada olmak için olduğu yerde kalır ve bir odak halkası yalnızca bir tuşun ulaşacağı yerde çizilir. Android'de o `Dialog` kendi başına bir penceredir: gösterdiğinin kökündeki `com.pantrixui.foundation.testing.pantrixAutomationRoot` test etiketlerinin platformun otomasyonuna ulaşmasını sağlar.

Pencere, çağrının çevresindeki en dış temanınkidir: bir başkasının içindeki tema aynı penceredir, yan yana iki tema iki penceredir.

Parametreler:

- `content: @Composable () -> Unit`

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

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

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md), [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md)

### LocalPantrixPlatform

`import com.pantrixui.foundation.a11y.LocalPantrixPlatform`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixPlatform: ProvidableCompositionLocal<PantrixPlatform>
```

The platform whose conventions are in effect, which `PantrixTheme` provides: what `PantrixTheme.platform` reads. Outside a theme, Android's.

### rememberPantrixPlatform

`import com.pantrixui.foundation.a11y.rememberPantrixPlatform`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixPlatform(): PantrixPlatform
```

Bu cihazın kuralları: `PlatformType`'ınınkiler, sistem yüksek karşıtlıktayken kalınlaşmış odak halkasıyla, ve onu işaret edenin dokunma alanıyla: tarayıcıda telefonda bir parmağınki, masada bir farenin. İkisi de değiştikçe izlenir.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### Modifier.scrollPadding

`import com.pantrixui.foundation.a11y.scrollPadding`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.scrollPadding(padding: PaddingValues): Modifier
```

Bir kaydırıcının içeriğinin sonlarında ne kadar boşluk bıraktığını söyler; böylece gösterilmesi istenen şey o boşluğun içinde gösterilir: içeriğin altından kaydığı bar'ın üstünde, kaydırıcının tam kenarında değil.

Bir öğeyi kaydıran her şey, öğe odağı alınca onu görünür alana getirir, ama kaydırıcının kendi kenarından öteye değil. İçerik bir bar'ın altından kayıyorsa, bar'ların payı kadar boşluk verilen bir scaffold içeriğinde olduğu gibi, o kenar bar'ın arkasıdır: klavyenin odağı görünmeyen bir yere gider ve sayfa WCAG 2.2'nin 2.4.11 ölçütünü (Focus Not Obscured) karşılamaz. Bu modifier içeriğin üstündeyken, içindeki bir şeyi gösterme isteklerinin her biri, odağınki de başkası da, geçerken `padding` kadar büyütülür ve kaydırıcı öğeyi kenarından o kadar içeride gösterir: bar'ın üstünde.

Kaydırılanın üstüne, kaydırıcının içine konur ve kendisi boşluk eklemez: içeriğin bıraktığı boşluğu söyler.

- Kayan bir satırın ya da sütunun içeriğinde, kaydırmadan sonra ve sözünü ettiği boşluktan önce: `Modifier.verticalScroll(state).scrollPadding(padding).padding(padding)`.

- `contentPadding`'i `padding` olan bir lazy listenin ya da ızgaranın her öğesinde.

Kendisinde olandan fazlası istenen bir kaydırıcı hiçbir şeyi kaydırmaz ve artanı kullanıcının bir sürüklemesi olarak üstündekine geçirir; bu, içinde durduğu bir sheet'i oynatır. Bu yüzden bir satırda ya da sütunda içeriğin uzandığından fazlası istenmez: kaydırılan içerik boyundan bulunur, yerinden büyüktür, ve en sondaki öğe kenardan, ardında ne kadar içerik varsa o kadar içeride gösterilir. Lazy bir listede ve içeriğin kaydırıcısına sığdığı yerde içeriğin nereye kadar uzandığı bilinemez ve `padding`'in tamamı istenir: içeriğin sonlarında o kadar boşluk olmalıdır; aynı boşluk verildiyse vardır. İçerideki bir kaydırıcıya dokunulmaz: öğeyi kendi başına gösterdiği gibi gösterir, çevresindekinden istenen ise buradan geçer.

Odak halkası, içerik o kadar uzanıyorsa kendi yerini kendisi ister (`focusRing`). Lazy bir listede isteyemez: orada listenin içerik boşluğu ve bu değer halkanın yerini de içerir, `PantrixPlatform.focusRingReach`.

Bütünü docs/guide/scroll-padding/SCROLL_PADDING_GUIDE.md'dedir; bu kütüphaneyi kullanmayan bir proje için aynısı da orada.

Parametreler:

- `padding: PaddingValues`: İçeriğin her kenarda, kaydırıcının içinde bıraktığı boşluk: bir scaffold'un içeriğine verdiği bar payı, bir lazy listenin `contentPadding`'i. Baş ve son, düzenin yönünü izler. Kaydırıcının kendisi klavyenin üstünde bitiyorsa, `imePadding` ile olduğu gibi, altındaki bar klavyenin arkasındadır ve kaydırıcının hiçbir yerini örtmez: orada klavyenin payı düşülür, `padding - WindowInsets.ime.asPaddingValues()`, yoksa yazılan şey bir bar boyu fazla yukarıda gösterilir.

Belgelendiği sayfalar: [Scaffold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/scaffold.md)

### Modifier.minTouchTarget

`import com.pantrixui.foundation.a11y.minTouchTarget`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.minTouchTarget(min: Dp): Modifier
```

Bileşenin çizdiğini değiştirmeden düzende en az `min` kadar yer ayırır.

Sorunun bu yarısı kolay yarısıdır. Öteki yarısı isabet denetimidir; Compose onu `ViewConfiguration.minimumTouchTargetSize`'dan alır: bu değiştiricinin ulaşamadığı sabit bir değer. Yalnızca bu değiştiriciyi uygulayan bir bileşen 48dp yer kaplar ama yine yalnızca görünen sınırlarının içinde *tepki verir*; bu, bir ekran görüntüsünde hiç görünmeyen türden bir kusurdur.

Bu yüzden `PantrixTheme` `LocalViewConfiguration`'ı da `PantrixViewConfiguration` ile ezer; iki yarı aynı sayıyı kullanır. İkisi birlikte Material 3'ün `LocalMinimumInteractiveComponentSize`'ının yalnızca Foundation'la kurulmuş karşılığıdır.

Temanın tanılaması açıkken, yarım saniye boyunca `min`'den az yer verilen bir bileşen `PantrixCheck.SmallTouchTarget` olarak bildirilir: çevresinde duran onu daha az yere yerleştirmiştir ve ona daha az bir yerde basılır.

Parametreler:

- `min: Dp`

Belgelendiği sayfalar: [Erişilebilirlik](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/accessibility.md)

### PantrixViewConfiguration

`import com.pantrixui.foundation.a11y.PantrixViewConfiguration`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixViewConfiguration(
    private val delegate: ViewConfiguration,
    private val minTouchTarget: Dp
) : ViewConfiguration by delegate
```

Compose'un isabet payını platformun hazır ayarına uydurur.

`PantrixTheme` verir; dokunma alanı dışındaki her şeyi devreder; böylece Compose'un `ViewConfiguration`'a ileride ekleyecekleri burada bir değişiklik olmadan çalışmaya devam eder.

Parametreler:

- `delegate: ViewConfiguration`: Dokunma alanı dışındaki her şeyin geldiği ayar: zaten geçerli olan.
- `minTouchTarget: Dp`: Dokunma alanı, iki yönde de aynı.

Belgelendiği sayfalar: [Erişilebilirlik](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/accessibility.md)

## Paket com.pantrixui.foundation.adaptive

### BoxWithPantrixWindow

`import com.pantrixui.foundation.adaptive.BoxWithPantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun BoxWithPantrixWindow(
    modifier: Modifier = Modifier,
    contentAlignment: Alignment = Alignment.TopStart,
    propagateMinConstraints: Boolean = false,
    breakpoints: PantrixBreakpoints = LocalPantrixWindow.current.breakpoints,
    content: @Composable (box: PantrixWindow) -> Unit
)
```

İçeriğine, kendisine verilen yeri bir pencere gibi söyleyen kutu: pencereye göre değil, kendi yerine göre değişen bir bileşen içindir. Dar yerde liste olan bir tablo kendi kutusuna sorar, çünkü geniş bir pencerenin dar bir panelinde pencere yine geniştir:

```kotlin
BoxWithPantrixWindow(modifier) { box ->
    val withDate = box.widthClass >= WindowWidthClass.Expanded
    if (box.isNarrow) OrderList(orders) else OrderTable(orders, withDate)
}
```

Kutunun altında `BoxWithConstraints` vardır ve söylediği, alabileceği en fazla yerdir: onun `maxWidth` ve `maxHeight`'ı. Bir ekran pencereye ne soruyorsa `content` de kendisine verilen pencereye onu sorar: `isNarrow`, `byWidth`, `widthClass >= …`.

- Kutu `breakpoints` ile sınıflanır; verilmezse bunlar geçerli pencerenin sınırlarıdır: penceresini kendi sınırlarıyla sınıflayan bir ürünün bileşenleri de aynı sınırlarla sınıflanır.

- Kutunun bir sınıfını okuyan, o sınıf değişince yeniden kurulur; `BoxWithConstraints`'in içeriği gibi her boyutta değil. `size`'ını okuyan her değişimi izler. Yeri değişirken kutu aynı nesnedir.

- Kaydırılan bir sayfanın içinde bir kutunun alabileceği yüksekliğin sonu yoktur: yükseklik sınıfı Expanded'dır ve kutu hiçbir zaman kısa değildir. Genişlik kutuya, yükseklik pencereye sorulur.

- Kutu düzdür. Kat yeri pencerenindir ve kutuyu nerede kestiği burada bilinmez: pencereye sorulur.

- Kutunun içinde `PantrixTheme.window` ve `responsive` yine pencereye sorar. İçteki her şeyin kutuya sorması isteniyorsa, içeriği kendi başına bir ekran olan bir panelde olduğu gibi, kutu içeridekilere aktarılır: `CompositionLocalProvider(LocalPantrixWindow provides box) { … }`.

`BoxWithConstraints` gibi kutu da içeriğini ölçülürken kurar, bu yüzden ona intrinsic boyutu sorulamaz: `IntrinsicSize` ile boyutlanan bir satırın ya da sütunun içine konmaz.

Parametreler:

- `modifier: Modifier`: Kutunun kendi modifier'ı. Kutunun söylediği yer, bu modifier'ın ona bıraktığı yerdir.
- `contentAlignment: Alignment`: İçerik kutudan küçükse kutunun içinde nereye yerleştirildiği.
- `propagateMinConstraints: Boolean`: İçeriğin en az kutunun en küçük boyutu kadar büyük olup olmayacağı.
- `breakpoints: PantrixBreakpoints`: Kutunun sınıflandığı sınırlar.
- `content: @Composable (box: PantrixWindow) -> Unit`: Kutunun içeriği; yer ona bir pencere olarak verilir.

Belgelendiği sayfalar: [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### Modifier.keepClearOfFolds

`import com.pantrixui.foundation.adaptive.keepClearOfFolds`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.keepClearOfFolds(): Modifier
```

Bu düğümün tuttuklarını, düğümü kesen ve pencerenin bir şeridini örten bir menteşeden uzak tutar: menteşenin düğüme daha az yer kalan yanı boş bırakılır, düğümün tuttukları öbür yana yerleşir.

İki ekranlı bir cihazın iki ekranı arasında böyle bir menteşe vardır (`WindowFold.isOccluding`), altına çizilen görünmez. Onun biraz ötesine uzanan bir düğüm, bir ekrandan biraz geniş bir liste ya da bütün bir kenar boyunca bir çubuk, tuttuklarını çoğunun durduğu ekrana koyar. Hiçbir şeyi örtmeyen bir kat yerinden, nasıl tutulursa tutulsun tek ekran olan katlanabilirinkinden, uzak durulmaz: üstüne çizilen görünür.

```kotlin
Box(Modifier.fillMaxSize()) {
    Inbox()
    // A bar along the whole bottom edge keeps to one screen of the two.
    Toolbar(Modifier.align(Alignment.BottomCenter).fillMaxWidth().keepClearOfFolds())
}
```

Menteşe bir düğümün tam ortasından geçiyorsa ondan uzak durmak düğümü yarıya indirir: orada `PantrixTwoPane` düğümün tuttuklarını iki yanına dizer. Burada düğüm bir yanda kalır, iki yanın yeri eşitse başlangıç yanında.

Düğüm en son yerleştiği yere göre ölçülür: yer değiştirip yeniden yerleşince, menteşenin üstüne ya da dışına, yeniden ölçülür. Uzak durduğu menteşenin kestiği eksende, içindekilerin boyutu ne olursa olsun, kendisine verilen yerin tamamını alır: yoksa boş bırakılan yan onu her geçişte büyütür ve menteşenin daha da üstüne taşırdı. O eksende sınırsız bir yerde, kayan bir satırdaki gibi, hiçbir şeyden uzak durmaz.

Belgelendiği sayfalar: [Menteşede katmanlar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-fold-overlays.md)

### Modifier.maxContentWidth

`import com.pantrixui.foundation.adaptive.maxContentWidth`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun Modifier.maxContentWidth(alignment: Alignment.Horizontal = Alignment.Start): Modifier
```

İçeriği `PantrixTheme.layout.maxContentWidth`'ten geniş tutmaz: bir masaüstü penceresinde sayfanın yazısı okunan bir genişlikte kalır, yerin geri kalanı yanında boş kalır. Onu sınırlayan sınıfın altında içerik verilen bütün yeri alır.

İçerik yerinden darsa bu yeri alır ve içeriği içine `alignment`'a göre koyar: başta, orada başlayan bir başlığın altında, ya da ortada.

```kotlin
Column(
    Modifier
        .verticalScroll(scroll)
        .padding(horizontal = PantrixTheme.layout.margin)
        .maxContentWidth()
) { … }
```

Sınır yürürlükteki pencereninkidir ya da pencere olarak aktarılan bir bileşen kutusununki; pencerenin sınıfı değiştikçe onu izler. Dolduracağı sınırlı bir genişlik yoksa içerik olduğu gibi ölçülür.

Parametreler:

- `alignment: Alignment.Horizontal`: içeriğin, olabileceğinden geniş bir yerde nerede durduğu: varsayılan başta.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### OverlayWindow

`import com.pantrixui.foundation.adaptive.OverlayWindow`, `com.pantrixui:foundation` içinden

```kotlin
class OverlayWindow
```

Burada açılan bir katmanın üstünde gösterildiği pencere, kat yerinden uzak duran bir katmanın kendini yerleştirdiği bilgiyle: o pencerenin nerede olduğu, kat yerleri, ve katmanın nereden açıldığı.

Bu, uygulamanın içinde olduğu penceredir ya da içeriğin çizildiği `PantrixWindowFrame`. Bir çerçevenin içinde açılan katman çerçeveyi kendi penceresi sayar, katlanabilir bir önizlemede açılan dialog o önizlemede açıldığı gibi: scrim'i çerçeveyi örter, sheet çerçevenin kenarlarından gelir, kat yeri çerçevenin kat yeridir. Bir iskelenin bir paneline pencere diye söylediği yer böyle bir pencere değildir: bir panelde açılan dialog panelin içinde olduğu pencerenin üstünde gösterilir.

Pantrix'in kendi katmanları kendilerini buna göre yerleştirir. Uygulamanın kendi katmanı, kendisinin gösterdiği bir `Dialog` ya da `Popup`, de öyle yapar:

```kotlin
val overlay = rememberOverlayWindow()
// Asked as the dialog opens: where it was opened from, and the fold the window is in two pieces at.
val openedFrom = remember { overlay.openedFrom() }
val fold = overlay.folds.firstOrNull { it.isSeparating }
val onTheLeft = fold != null && openedFrom != null && openedFrom.x < fold.bounds.center.x
```

Yerleri uygulamanın içinde olduğu pencerenin koordinatlarında ve pikseldir: o pencereyi dolduran bir `Dialog`'un tuttuklarını yerleştirdiği yer. Uygulamanınkinin yanında kendine ait bir pencere olan bir katman, Android'de bir popup gibi, onları uygulamanın penceresinin ekrandaki yerine göre kaydırır.

Üyeleri:

- `window: PantrixWindow`: Katmanın üstünde gösterildiği pencere, katmanın gösterdiklerine söylenmesi gerektiği gibi: çerçevenin penceresi, yoksa en dıştaki `PantrixTheme`'in temsil ettiği pencere. Katmanın açıldığı bir panelin yeri değil.
- `frame: Rect?`: Çerçevenin görüldüğü yer, çizildiği gibi: uygulamanın içinde olduğu penceredeki sınırları, piksel olarak, görünen kısmına kesilmiş. Sayfası kısmen kaymış bir çerçeve hâlâ görünen kısmıdır ve üstündeki katman daha fazlasını örtmez: sayfanın barının durduğu yeri örtmez. Uygulamanın penceresinin üstünde null'dır, bir katman onu bütünüyle örter; çerçeve yerleşene kadar da null'dır.

  Çerçevenin şu anki yeridir: çerçeve kaydıkça onu izleyen bir katman yeniden sorar.
- `scale: Float`: Çerçevenin ne kadar büyük çizildiği: kendi boyutunun hangi payında çizildiği, onu küçük çizen bir katmanda 1'den az. Üstündeki katman da o kadar küçük çizilir, çerçevenin tuttukları gibi. Uygulamanın penceresinin üstünde 1'dir.
- `folds: List<WindowFold>`: Pencerenin kat yerleri, uygulamanın içinde olduğu pencerede durdukları yerde: sınırları ve boş bırakılan şeritleri piksel olarak, küçük çizilen bir çerçeveninkiler o kadar küçük. Henüz yerleşmemiş bir çerçevenin kat yeri yoktur.
- `fun openedFrom(): Offset?`: Şimdi açılan bir katmanın nereden açıldığı, uygulamanın içinde olduğu pencerede ve piksel olarak: penceredeki son basışın düştüğü yer, ondan sonra bir tuşa basıldıysa odağı tutan denetimin ortası. İkisi de bilinmiyorsa null'dır, hiçbir şeye basılmadan açılan bir katmanda olduğu gibi.

  Katman açılırken bir kez sorulur: katmanın içindeki bir basış bir sonrakinin açıldığı yerdir. Pencerenin katmanlarının köklerinde duyulur: en dıştaki `PantrixTheme`'inkinde, ve `pantrixTransientsRoot` taşıyan bir katmanın düğümünde.

Belgelendiği sayfalar: [Menteşede katmanlar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-fold-overlays.md)

### rememberOverlayWindow

`import com.pantrixui.foundation.adaptive.rememberOverlayWindow`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberOverlayWindow(): OverlayWindow
```

Burada açılan bir katmanın üstünde gösterildiği pencere: içeriğin çizildiği `PantrixWindowFrame`, ya da uygulamanın içinde olduğu pencere.

Belgelendiği sayfalar: [Menteşede katmanlar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-fold-overlays.md)

### PantrixWindow.paneCount

`import com.pantrixui.foundation.adaptive.paneCount`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixWindow.paneCount(maxPanes: Int = 2): Int
```

Bir düzenin bu pencerede yan yana dizdiği panel sayısı, en çok `maxPanes`: Compact ve Medium bir pencerede bir, Expanded'dan itibaren iki, Large'dan itibaren üç. Dikey bir kat yerinin ayırdığı pencere, kitap gibi tutulan bir katlanabilir ya da iki ekran arasındaki bir menteşe, her genişlikte iki alır: kat yerinin iki yanında birer tane.

```kotlin
if (PantrixTheme.window.paneCount() >= 2) InboxAndMessage() else Inbox()
```

Paneller arasındaki boşluk düzenin sütun arasıdır, `PantrixTheme.layout.gutter`. Bir kat yeri pencereyi ayırıyorsa paneller orada buluşur ve aradaki boşluk kat yerinin `clearance`'ıdır.

Parametreler:

- `maxPanes: Int`: düzenin en çok kaç paneli olduğu: bir liste ve detayı için iki, yanlarında bir panel daha varsa üç.

Belgelendiği sayfalar: [İki panel](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### PantrixWindowFrame

`import com.pantrixui.foundation.adaptive.PantrixWindowFrame`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixWindowFrame(
    window: PantrixWindow?,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
)
```

Kendi başına bir pencere olan kutu: içeriğine içinde durduğu pencere olarak `window` bildirilir ve `window`'un kat yerleri, kutunun üst baş köşesi pencereninki olarak, bu kutuda yerlerindedir. Bir ekranın belli bir boyuttaki önizlemesi, bir tasarım aracının çerçevesi ya da bir kataloğun pencere seçicisi bir pencereyi bunun içinde çizer.

```kotlin
val book = PantrixWindow(DpSize(951.dp, 669.dp), posture = WindowPosture(listOf(fold)))
PantrixWindowFrame(book, Modifier.size(951.dp, 669.dp)) { Inbox() }
```

Uygulamanın içinde durduğu pencerenin kat yerleri o pencerenin koordinatlarındadır; bir çerçevenin içinde çerçevenin koordinatlarında. Bir kat yerinden bölen düzen onu, nerede çizilirse çizilsin, `rememberFoldsInNode` ile bulur. Ölçeklenmiş bir katmanda küçük ya da büyük çizilen çerçeve, içeriğinin kat yerlerini içerikte oldukları yerde tutar: kat yeri içerikle birlikte ölçeklenir.

Parametreler:

- `window: PantrixWindow?`: içeriğe bildirilen pencere; kutunun içinde durduğu pencere için null. Böylece gerçek pencereyi uydurulmuş pencerelerin yanında sunan bir seçici, hangisi seçilirse seçilsin, içeriği kompozisyondaki yerinde ve durumuyla birlikte tutar.
- `modifier: Modifier`: kutunun modifier'ı. Pencerenin üst baş köşesi içeriğinin başladığı yerdir: modifier'ın iç boşluğunun ve kenarlığının içinde.
- `content: @Composable () -> Unit`: pencerenin içindekiler.

Belgelendiği sayfalar: [İki panel](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### FoldsInNode

`import com.pantrixui.foundation.adaptive.FoldsInNode`, `com.pantrixui:foundation` içinden

```kotlin
class FoldsInNode
```

Pencerenin kat yerleri, bir düğümü kestikleri yerde, düğümün kendi koordinatlarında ve piksel cinsinden: yerini bir kat yerinden bölen bir düzenin ölçerken baktığı. `modifier`'ı düğüme koyun; `folds` düğüm yer değiştirdikçe ve boyutu değiştikçe, pencere değiştikçe ve cihaz katlandıkça onu izler.

Kat yerinin kesmediği bir düğümün kat yeri yoktur. Düğüm ilk kez yerleştirilene kadar kat yerleri, pencereyi dolduran bir düğüm gibi pencerenin köşesinden başlayan bir düğümde olacakları yerdedir.

Üyeleri:

- `modifier: Modifier`: Kat yerleri sorulan düğüme konur. Düğümün penceredeki yerini izler: bir sayfanın kat yerinin önünden kaydırdığı düğüm, kaydıkça yeniden ölçülür.
- `folds: List<WindowFold>`: Düğümü kesen kat yerleri; sınırları ve boş şeritleri düğümün koordinatlarında.
- `separatingFold: WindowFold?`: Düğümü ayıran kat yeri, varsa: `folds`'un ayıran ilki.

Belgelendiği sayfalar: [İki panel](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### rememberFoldsInNode

`import com.pantrixui.foundation.adaptive.rememberFoldsInNode`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFoldsInNode(window: PantrixWindow = LocalPantrixWindow.current): FoldsInNode
```

`window`'un kat yerleri, `FoldsInNode.modifier`'ın konduğu düğümü kestikleri yerde.

Parametreler:

- `window: PantrixWindow`: kat yerleri sorulan pencere: verilmezse içeriğe bildirilen pencere.

Belgelendiği sayfalar: [İki panel](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### PantrixLayout

`import com.pantrixui.foundation.adaptive.PantrixLayout`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixLayout(
    val margin: Dp,
    val gutter: Dp,
    val columns: Int = 4,
    val maxContentWidth: Dp = Dp.Infinity
)
```

Tek bir genişlik sınıfındaki pencerede bir sayfanın düzenlendiği ölçüler. `PantrixTheme.layout` geçerli pencerenin ölçülerini verir:

```kotlin
Column(Modifier.padding(horizontal = PantrixTheme.layout.margin).maxContentWidth()) { … }
Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout.gutter)) { … }
```

Kenar boşluğu ve sütun arası boşluktur: arayüz yoğunluğu onları boşluğu ölçeklediği gibi ölçekler. Sütunlar bir sayı, içeriğin en fazla genişliği içeriğin ölçüsüdür; yoğunluk ikisini de ölçeklemez.

Parametreler:

- `margin: Dp`: Pencerenin ya da bir panelin kenarı ile içerik arasındaki boşluk: bir sayfanın içeriğine yanlarında verdiği iç boşluk.
- `gutter: Dp`: Bir ızgaranın sütunları arasındaki ve yan yana duran paneller arasındaki boşluk.
- `columns: Int`: Bir sayfanın ızgarasının yerinde kaç sütun olduğu: sayfanın bir parçası bunlardan birkaçına yayılır, ne kadar geniş olduğunu `spanWidth` söyler. Telefonda 4, tablette 8, daha geniş bir pencerede 12.
- `maxContentWidth: Dp`: Bir sayfanın içeriğinin en fazla ne kadar genişlediği: ötesinde geniş bir pencerenin yeri içeriğin yanında boş kalır, çünkü bir masaüstü penceresi boyunca uzanan bir satır okunmaz. İçeriğin elindeki bütün yeri aldığı yerde `Dp.Infinity`. `Modifier.maxContentWidth()` içeriği ona göre tutar.

Üyeleri:

- `fun scaled(factor: Float): PantrixLayout`: Bir arayüz yoğunluğunda bu ölçüler: kenar boşluğu ve sütun arası `factor` ile çarpılır, sütunlar ve içeriğin en fazla genişliği olduğu gibi kalır.
- `fun spanWidth(available: Dp, span: Int): Dp`: `span` kadar `columns`'a yayılan bir parçanın `available` yerde ne kadar geniş olduğu: sütunları ve aralarındaki sütun araları. Sütunlar birbiri kadar geniştir, her ikisinin arasında bir sütun arası durur:

  ```kotlin
  BoxWithConstraints {
      val layout = PantrixTheme.layout
      Row(horizontalArrangement = Arrangement.spacedBy(layout.gutter)) {
          Article(Modifier.width(layout.spanWidth(maxWidth, span = 8)))
          Related(Modifier.width(layout.spanWidth(maxWidth, span = 4)))
      }
  }
  ```

  Sütun aralarına dar gelen bir yer sütunlara genişlik bırakmaz: parça o zaman yayıldığı sütun araları kadar geniştir.

  `available`: sütunların paylaştığı yer, sayfanın içeriği kadar geniş: kenar boşluklarının içinde.

  `span`: parçanın kaç sütuna yayıldığı, 1'den `columns`'a kadar.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixLayouts

`import com.pantrixui.foundation.adaptive.PantrixLayouts`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixLayouts(
    val compact: PantrixLayout = PantrixLayout(margin = 16.dp, gutter = 16.dp, columns = 4),
    val medium: PantrixLayout = PantrixLayout(margin = 24.dp, gutter = 16.dp, columns = 8),
    val expanded: PantrixLayout = PantrixLayout(margin = 24.dp, gutter = 24.dp, columns = 12),
    val large: PantrixLayout = PantrixLayout(margin = 32.dp, gutter = 24.dp, columns = 12, maxContentWidth = 1040.dp),
    val extraLarge: PantrixLayout = large
)
```

Bir pencerenin her genişlik sınıfı için düzen ölçüleri: `PantrixTheme.layout` bunların arasından seçer.

Telefonun verecek genişliği azdır, masaüstü penceresinin fazladır; bu yüzden kenar boşluğu ve sütun arası pencereyle büyür. Varsayılan kenar boşluğu 16dp, Medium'dan itibaren 24dp, Large'dan itibaren 32dp; sütun arası 16dp, Expanded'dan itibaren 24dp. Her biri boşluk ölçeğinin bir adımıdır. Izgara 4 sütundur, Medium'dan itibaren 8, Expanded'dan itibaren 12; içerik Large'a kadar sınırsız genişler, orada 1040dp'de durur.

Bir ürün, tasarladığı sınıflar için kendi ölçülerini temaya verir; gerisi olduğu gibi kalır:

```kotlin
PantrixTheme(layouts = PantrixLayouts(compact = PantrixLayout(margin = 20.dp, gutter = 12.dp))) { … }
```

Kendi ölçüleri verilen bir sınıfın sütunları ve en fazla içerik genişliği de verilendir: verilmezlerse bir telefonunkilerdir, 4 sütun ve sınırsız. Daha geniş bir sınıfa kendi ölçülerini veren bir ürün onları da verir:

```kotlin
PantrixLayouts(large = PantrixLayout(margin = 40.dp, gutter = 24.dp, columns = 12, maxContentWidth = 1200.dp))
```

Parametreler:

- `compact: PantrixLayout`: 600dp'den dar bir pencerenin ölçüleri: dikey tutulan bir telefon.
- `medium: PantrixLayout`: 600dp'den itibaren ölçüler: dikey tutulan bir tablet, açık bir katlanabilir.
- `expanded: PantrixLayout`: 840dp'den itibaren ölçüler: yatay tutulan bir tablet.
- `large: PantrixLayout`: 1200dp'den itibaren ölçüler: bir masaüstü penceresi, bir tarayıcı.
- `extraLarge: PantrixLayout`: 1600dp'den itibaren ölçüler. Verilmezse `large`'ın ölçüleridir: o genişliği ayrıca tasarlayan ürün azdır.

Üyeleri:

- `fun forWidth(widthClass: WindowWidthClass): PantrixLayout`: Genişlik sınıfı `widthClass` olan bir pencerenin ölçüleri.
- `fun scaled(factor: Float): PantrixLayouts`: Yoğunluk her çağrı yerinde değil, burada uygulanır; böylece tek bir anahtar her sınıfın ölçülerini yeniden ölçekler.

  `factor`: arayüz yoğunluğunun ölçeği: her sınıfın kenar boşluğu ve sütun arası onunla çarpılır.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### LocalPantrixLayouts

`import com.pantrixui.foundation.adaptive.LocalPantrixLayouts`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixLayouts: ProvidableCompositionLocal<PantrixLayouts>
```

The layout's measures in effect, for every class: what the nearest `PantrixTheme` was given, scaled by its density. `PantrixTheme.layout` picks the class of the window from them.

### rememberPantrixLayouts

`import com.pantrixui.foundation.adaptive.rememberPantrixLayouts`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixLayouts(): PantrixLayouts
```

Pantrix's layout measures.

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

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

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

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixWindow.byWidth

`import com.pantrixui.foundation.adaptive.byWidth`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byWidth(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

Bu pencerenin genişlik sınıfı için verilen değer. Verilmeyen sınıf bir küçüğünün değerini alır, bu yüzden bir düzen yalnızca değiştiği genişlikleri yazar:

```kotlin
val columns = PantrixTheme.window.byWidth(compact = 2, medium = 4)
```

Parametreler:

- `compact: T`: Compact bir pencerede, en dar sınıfta değer.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede değer; verilmezse `medium`'unki.
- `large: T`: Large bir pencerede değer; verilmezse `expanded`'ınki.
- `extraLarge: T`: ExtraLarge bir pencerede, en geniş sınıfta değer; verilmezse `large`'ınki.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixWindow.byHeight

`import com.pantrixui.foundation.adaptive.byHeight`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byHeight(
    compact: T,
    medium: T = compact,
    expanded: T = medium
): T
```

Bu pencerenin yükseklik sınıfı için verilen değer. Verilmeyen sınıf bir küçüğünün değerini alır:

```kotlin
val barHeight = PantrixTheme.window.byHeight(compact = 44.dp, medium = 56.dp)
```

Parametreler:

- `compact: T`: Compact bir pencerede, en kısa sınıfta değer: yan tutulan bir telefon.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede, en uzun sınıfta değer; verilmezse `medium`'unki.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md)

### PantrixWindow.byPosture

`import com.pantrixui.foundation.adaptive.byPosture`, `com.pantrixui:foundation` içinden

```kotlin
fun <T> PantrixWindow.byPosture(
    flat: T,
    book: T = flat,
    tabletop: T = flat
): T
```

Bu pencerenin duruşu için verilen değer: cihaz kitap gibi yarı açık ve kat yeri dikey tutulurken `book`, masadaki bir dizüstü gibi kat yeri yatay tutulurken `tabletop`, geri kalan zamanda `flat`. Bu da kat yeri olmayan her cihaz ve düz açılmış bir katlanabilir demektir. Verilmeyen duruş `flat`'in değerini alır, bu yüzden bir düzen yalnızca değiştiği duruşları yazar:

```kotlin
// Two panes side by side in a book, one above the other on a table, and one pane otherwise.
val panes = PantrixTheme.window.byPosture(flat = Panes.One, book = Panes.SideBySide, tabletop = Panes.Stacked)
```

Aynı anda iki yönde de katlanmış bir cihaz kitap sayılır. `byWidth` ve `byHeight` ile aynı ailenin üçüncüsüdür.

Parametreler:

- `flat: T`
- `book: T`
- `tabletop: T`

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### PantrixWindow.isNarrow

`import com.pantrixui.foundation.adaptive.isNarrow`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixWindow.isNarrow: Boolean
```

Pencere dar mı: genişlik sınıfı `WindowWidthClass.Compact` mı. Dikey tutulan telefon böyledir. Tek panelli ve gezinmesi altta olan düzenin sorusudur.

`widthClass == WindowWidthClass.Compact` için bir addır, kod uyduğu kural gibi okunsun diye: `if (window.isNarrow) BottomBar()`. "Şu genişlikten itibaren" için sınıf karşılaştırılır: `widthClass >= Expanded`.

Pencerenin boyutu bilinmezken de true'dur, çünkü sınıflar o zamana kadar Compact'tır: bkz. `PantrixWindow.isSizeKnown`.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

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

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### rememberPantrixWindow

`import com.pantrixui.foundation.adaptive.rememberPantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixWindow(
    breakpoints: PantrixBreakpoints = PantrixBreakpoints.Default,
    posture: WindowPosture = systemWindowPosture(),
    verticalBar: WindowVerticalBar? = systemVerticalBar()
): PantrixWindow
```

Compose'un bildirdiği pencere; `breakpoints` ile sınıflanır, `posture`'ın dediği gibi katlanır ve sistemin `verticalBar`'ı vardır: `PantrixTheme`'in kendisine pencere verilmediğinde sağladığı.

Ürünün kendi sınırlarıyla sınıflamak ya da sistemin bildirmediği bir katlanmayı bildirmek için temaya verilir:

```kotlin
PantrixTheme(window = rememberPantrixWindow(breakpoints = PantrixBreakpoints(medium = 640.dp))) { … }
```

Pencere, `posture` ve `verticalBar` değişirken aynı nesne kalır; `breakpoints` değiştiğinde yenisi kurulur.

Parametreler:

- `breakpoints: PantrixBreakpoints`
- `posture: WindowPosture`
- `verticalBar: WindowVerticalBar?`

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### responsive

`import com.pantrixui.foundation.adaptive.responsive`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun <T> responsive(
    compact: T,
    medium: T = compact,
    expanded: T = medium,
    large: T = expanded,
    extraLarge: T = large
): T
```

Geçerli pencerenin genişlik sınıfı için verilen değer: `PantrixTheme.window`'un `byWidth`'i, tek sözcükle. Pencereye değil bir değere ihtiyacı olan composable içindir. Verilmeyen sınıf bir küçüğünün değerini alır:

```kotlin
val columns = responsive(compact = 2, medium = 4)
val cardPadding = responsive(compact = 12.dp, medium = 16.dp, large = 20.dp)
```

Sayfanın kenar boşluğu ve sütun arası elle seçilmez: `PantrixTheme.layout` onları sınıfa göre verir. Çağıran, sınıf değişince yeniden kurulur; pencere sınıfın içinde boyut değiştirirken kurulmaz. Yalnızca genişliğe bakar. Yükseklik için ve bir composable'ın dışında pencereye sorulur: `byHeight`, `byWidth`.

Parametreler:

- `compact: T`: Compact bir pencerede, en dar sınıfta değer.
- `medium: T`: Medium bir pencerede değer; verilmezse `compact`'ınki.
- `expanded: T`: Expanded bir pencerede değer; verilmezse `medium`'unki.
- `large: T`: Large bir pencerede değer; verilmezse `expanded`'ınki.
- `extraLarge: T`: ExtraLarge bir pencerede, en geniş sınıfta değer; verilmezse `large`'ınki.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md)

### rememberWindowIsAtLeast

`import com.pantrixui.foundation.adaptive.rememberWindowIsAtLeast`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberWindowIsAtLeast(width: Dp): Boolean
```

Geçerli pencere en az `width` genişliğinde mi: hiçbir sınıfın başlamadığı bir genişlikte değişen düzen içindir.

```kotlin
// A third column from 1000dp on, which is neither Expanded's 840 nor Large's 1200.
val threeColumns = rememberWindowIsAtLeast(1000.dp)
```

Çağıran, pencere `width`'i hangi yönde olursa olsun geçerken yeniden kurulur; pencere onun bir yanında boyut değiştirirken kurulmaz. `PantrixTheme.window.size.width >= width` aynı şeyi sorar ve onu okuyan her boyutta yeniden kurulur: bir dönüşün her karesinde, sürüklenen pencere kenarının her pikselinde.

Pencerenin boyutu bilinmezken genişliği sıfır sayılır, yani cevap false'tur. Bir ürünün bütün düzenleri aynı genişliklerde değişiyorsa bunun yerine o genişlikler pencereye verilir: `PantrixBreakpoints`.

Parametreler:

- `width: Dp`

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### LocalPantrixWindow

`import com.pantrixui.foundation.adaptive.LocalPantrixWindow`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixWindow: ProvidableCompositionLocal<PantrixWindow>
```

Geçerli pencere: en yakın `PantrixTheme`'in sağladığı pencere. Çevrede tema yoksa Compose'un bildirdiği penceredir, varsayılan sınırlarla sınıflanır ve düzdür.

`PantrixTheme.window` onu okur. Ekranın bir parçasına ikinci bir tema olmadan kendi penceresini vermek için sağlanır: içeriği panelin genişliğine bakması gereken bir panele.

Belgelendiği sayfalar: [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### FoldOrientation

`import com.pantrixui.foundation.adaptive.FoldOrientation`, `com.pantrixui:foundation` içinden

```kotlin
enum class FoldOrientation
```

Bir kat yerinin penceresini hangi yönde kestiği.

Değerleri:

- `Vertical`: Pencerenin üstünden altına: iki yarı yan yanadır.
- `Horizontal`: Pencerenin bir yanından ötekine: yarılardan biri ötekinin üstündedir.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### WindowFold

`import com.pantrixui.foundation.adaptive.WindowFold`, `com.pantrixui:foundation` içinden

```kotlin
data class WindowFold(
    public val bounds: Rect,
    public val orientation: FoldOrientation,
    public val isHalfOpened: Boolean,
    public val isSeparating: Boolean,
    public val isOccluding: Boolean,
    public val clearance: Rect = bounds
)
```

Penceredeki bir kat yeri ya da menteşe.

Parametreler:

- `bounds: Rect`: Nerede olduğu, piksel cinsinden ve pencerenin koordinatlarında. Tek ekrandaki bir kat yerinin kalınlığı yoktur: sınırları sıfır genişliğinde bir çizgidir. İki ekran arasındaki bir menteşe aradaki boşluk kadar geniştir.
- `orientation: FoldOrientation`: Hangi yönde uzandığı.
- `isHalfOpened: Boolean`: Cihaz kısmen açık mı tutuluyor, iki yarı birbirine açılı mı. Düz açılmışsa değildir.
- `isSeparating: Boolean`: Pencere burada, üstüne hiçbir şey yerleştirilemeyecek biçimde iki parça mı: yarı açık tutulan bir kat yeri ya da hangi açıda olursa olsun iki ekran arasındaki bir menteşe böyledir. Düz açılmış bir kat yeri hiçbir şeyi ayırmaz.
- `isOccluding: Boolean`: Pencerenin bir şeridini gizliyor mu: iki ekran arasındaki bir menteşe gizler.
- `clearance: Rect`: Çevresinde dokunulanların boş bıraktığı şerit, piksel cinsinden ve pencerenin koordinatlarında: `bounds` ve sistemin iki yanında istediği pay. iOS bir pay ister, katlanan bir iPhone'un kat yerinin iki yanında 20pt; Android ve tarayıcılar istemez ve şerit `bounds`'un kendisidir. Kat yerinden bölünen iki panel aralarında bu şeridi bırakır.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [İki panel](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-two-pane.md)

### WindowPosture

`import com.pantrixui.foundation.adaptive.WindowPosture`, `com.pantrixui:foundation` içinden

```kotlin
data class WindowPosture(public val folds: List<WindowFold> = emptyList())
```

Pencerenin cihazının nasıl katlandığı: pencereyi kesen kat yerleri. Kat yeri olmayan cihazda hiçbiri yoktur.

Bir düzen iki duruş için yazılır: `isBook` ve `isTabletop`. Düz açılmış bir kat yeri `folds`'tadır ve hiçbir şeyi değiştirmez: ekran tek parçadır.

Parametreler:

- `folds: List<WindowFold>`: Pencereyi kesen kat yerleri.

Üyeleri:

- `isBook: Boolean`: Cihaz kitap gibi tutuluyor, yarı açık ve kat yeri dikey: yan yana iki panel, kat yerinden bölünmüş. Kat yerinin üstünden hiçbir şey geçmez.
- `isTabletop: Boolean`: Cihaz masadaki bir dizüstü gibi tutuluyor, yarı açık ve kat yeri yatay: bakılacaklar kat yerinin üstüne, kontroller, formlar ve gezinme altına gelir.
- `separatingFold: WindowFold?`: Pencereyi iki parçaya ayıran kat yeri, pencere tek parçaysa null. İçerik bu kat yerinden kaçınır.

Tipin kendisinde:

- `WindowPosture.Flat: WindowPosture`: Kat yeri yok: katlanmayan her telefon, tablet, masaüstü penceresi ve tarayıcı.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### systemWindowPosture

`import com.pantrixui.foundation.adaptive.systemWindowPosture`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemWindowPosture(): WindowPosture
```

Sistemin bu pencere için bildirdiği duruş. Cihaz katlandıkça, açıldıkça ve döndürüldükçe izlenir.

Android katlanmayı Jetpack WindowManager ile, tarayıcı Chromium'da bulunan Device Posture ve Viewport Segments API'leriyle, iOS ise 27.1'den itibaren UIKit'in menteşesi ve ayrılmış bölgeleriyle bildirir. Masaüstü bir katlanma bildirmez; 27.1'den önceki bir iOS ve 27.1'den önceki bir Xcode ile derlenmiş bir kütüphane de bildirmez: orada duruş `WindowPosture.Flat`'tir. Katlanmayı kendi yoluyla okuyan bir uygulama, duruşunu bunun yerine `rememberPantrixWindow`'a verir.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

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

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### WindowHeightClass

`import com.pantrixui.foundation.adaptive.WindowHeightClass`, `com.pantrixui:foundation` içinden

```kotlin
enum class WindowHeightClass
```

Bir pencerenin ne kadar yüksek olduğu, üç sınıftan biri olarak.

Bir düzen önce genişliğe bakar. Yükseklik, üst üste dizecek yer kalmadığını söyler: `Compact` bir pencere yatay tutulan bir telefondur, bir tablet kadar geniştir ve yüksekliği onun yarısından azdır. Orada ekran boyunca uzanan her bar ekranın yedide birini alır.

Değerleri:

- `Compact`: 480dp'den kısa: yatay tutulan bir telefon.
- `Medium`: 480dp'den itibaren: dikey tutulan çoğu telefon, yatay tutulan bir tablet.
- `Expanded`: 900dp'den itibaren: dikey tutulan bir tablet, bir masaüstü penceresi ve dikey tutulan uzun bir telefon.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Giriş ekranı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-login.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### PantrixBreakpoints

`import com.pantrixui.foundation.adaptive.PantrixBreakpoints`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixBreakpoints(
    public val medium: Dp = 600.dp,
    public val expanded: Dp = 840.dp,
    public val large: Dp = 1200.dp,
    public val extraLarge: Dp = 1600.dp,
    public val heightMedium: Dp = 480.dp,
    public val heightExpanded: Dp = 900.dp
)
```

Her pencere sınıfının başladığı yer: Medium, Expanded, Large ve ExtraLarge bir pencerenin en küçük genişliği, Medium ve Expanded bir pencerenin en küçük yüksekliği. `medium`'dan dar bir pencere Compact'tır, `heightMedium`'dan kısa olan da öyle.

Varsayılanlar Android'in pencere boyutu sınıflarıdır. Düzenleri başka yerlerde değişen bir ürün kendi sınırlarını `rememberPantrixWindow`'a verir.

Parametreler:

- `medium: Dp`: `WindowWidthClass.Medium` bir pencerenin en küçük genişliği.
- `expanded: Dp`: `WindowWidthClass.Expanded` bir pencerenin en küçük genişliği.
- `large: Dp`: `WindowWidthClass.Large` bir pencerenin en küçük genişliği.
- `extraLarge: Dp`: `WindowWidthClass.ExtraLarge` bir pencerenin en küçük genişliği.
- `heightMedium: Dp`: `WindowHeightClass.Medium` bir pencerenin en küçük yüksekliği.
- `heightExpanded: Dp`: `WindowHeightClass.Expanded` bir pencerenin en küçük yüksekliği.

Üyeleri:

- `fun widthClassOf(width: Dp): WindowWidthClass`: `width` genişliğindeki bir pencerenin sınıfı: en küçük genişliğine ulaştığı en yüksek sınıf. Henüz bilinmeyen bir genişlik, sıfır ya da belirtilmemiş, Compact'tır.
- `fun heightClassOf(height: Dp): WindowHeightClass`: `height` yüksekliğindeki bir pencerenin sınıfı: en küçük yüksekliğine ulaştığı en yüksek sınıf. Henüz bilinmeyen bir yükseklik, sıfır ya da belirtilmemiş, Compact'tır.

Tipin kendisinde:

- `PantrixBreakpoints.Default: PantrixBreakpoints`: 600, 840, 1200 ve 1600dp genişlikte; 480 ve 900dp yükseklikte.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md), [Tablo](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-table.md)

### WindowVerticalBar

`import com.pantrixui.foundation.adaptive.WindowVerticalBar`, `com.pantrixui:foundation` içinden

```kotlin
data class WindowVerticalBar(
    public val bounds: Rect,
    public val barBounds: Rect
)
```

Sistemin pencerenin bir kenarı boyunca dik duran bar'lar için ayırdığı sütun: tepesinde durum çubuğu, altında bir uygulamanın araç düğmeleri ve sekmeleri. iPhone Duo'nun dış ekranında iOS 27.1'den itibaren bitiş kenarı boyunca bir tane vardır; UIKit bir sekme bar'ını ve bir gezinme bar'ının düğmelerini oraya koyar. Pencerenin güvenli alanı içeriği ondan uzak tutar.

Bir uygulamanın kendi bar'ları `barBounds`'ta durur: düğmeler tepesinde, durum çubuğunun altında; gezinme dibinde, ana ekran çizgisinin üstünde. `PantrixScaffold` gezinmesini ve bir üst bar'ın düğmelerini dik tutulan dış ekranda oraya kendisi koyar. İç ekranda ve yana çevrilen iki ekranda da bir sütun vardır; onu durum çubuğuna bırakır.

Parametreler:

- `bounds: Rect`: Sütun, pencerenin tepesinden dibine; pikselle ve pencerenin koordinatlarında.
- `barBounds: Rect`: Bir uygulamanın bar'larının sütunda durduğu yer: durum çubuğunun altında ve ana ekran çizgisinin üstünde, sütun kadar geniş. Ondan dar bir bar onun ortasında durur; burası sistemin kendi bar'larını koyduğu yerdir ve her zaman sütunun ortası değildir: ekranın yuvarlak köşesi sütunun dış yanından bir pay alır. Pikselle ve pencerenin koordinatlarında.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### systemVerticalBar

`import com.pantrixui.foundation.adaptive.systemVerticalBar`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemVerticalBar(): WindowVerticalBar?
```

Sistemin bu pencerede ayırdığı dikey bar, ya da ayırmadığı yerde null: iPhone Duo'nun dış ekranının iOS 27.1'den itibaren sütunu. Android'de, masaüstünde ve tarayıcılarda yoktur; iOS 27.1'den önce ve 27.1'den eski bir Xcode ile derlenen bir kütüphanede de yoktur. Cihaz çevrildikçe ve ekranları değiştikçe izlenir.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### VerticalBarInNode

`import com.pantrixui.foundation.adaptive.VerticalBarInNode`, `com.pantrixui:foundation` içinden

```kotlin
class VerticalBarInNode
```

Pencerenin bir düğümün yanındaki dikey bar'ı, düğümün kendi koordinatlarında ve pikselle: bar'larını sistemin sütununa koyan bir düzenin ölçtüğü şey. `modifier`'ı düğüme koy; `verticalBar` düğüm yer değiştirip boyu değiştikçe, pencere de bar'ı gelip gittikçe onu izler.

Bar pencerenindir: düğümün çizildiği çerçevenin söylediği, ya da en dıştaki `PantrixTheme`'in temsil ettiği pencereninki; bir panele kendi penceresi diye söylenen yerinki değil. Sütuna uzanmayan bir düğümün, o kenardan uzaktaki bir paneldekinin, sütunu yoktur. Düğüm ilk kez yerleşene kadar sütun, pencerenin köşesinden başlayan bir düğümün yanında olacağı yerdedir: pencereyi dolduran bir düğümünki gibi.

Üyeleri:

- `modifier: Modifier`: Dikey bar'ı sorulan düğüme konur. Düğümün penceredeki yerini izler.
- `verticalBar: WindowVerticalBar?`: Dikey bar, sütunu ve bar'larının yeri düğümün koordinatlarında: düğüm sütunun üstünden pencerenin kenarına uzandıkça; uzanmadığı yerde ve pencerede dikey bar olmadığında null.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

### rememberVerticalBarInNode

`import com.pantrixui.foundation.adaptive.rememberVerticalBarInNode`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberVerticalBarInNode(): VerticalBarInNode
```

Pencerenin, `VerticalBarInNode.modifier`'ın konduğu düğümün yanındaki dikey bar'ı.

Belgelendiği sayfalar: [Pencere sınıfları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-window.md)

## Paket com.pantrixui.foundation.analytics

### PantrixUiEvent

`import com.pantrixui.foundation.analytics.PantrixUiEvent`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixUiEvent(
    public val component: String,
    public val action: String,
    public val testTag: String?,
    public val screen: String?,
    public val props: Map<String, String> = emptyMap()
)
```

Arayüzdeki bir etkileşim, içeriğiyle değil kimliğiyle tarif edilir: hangi bileşen olduğu, ne olduğu ve hangi ekranda olduğu.

**Kullanıcının yazdığı ya da okuduğu metin buraya asla girmez.** Bir alan odağı aldığını ya da temizlendiğini bildirir, içinde ne olduğunu asla; metin alan her bileşenin bir testi bunu tutar. Kapalı bir kümeden gelen bir değer girer: bir seçim, seçilenin anahtarıyla, bir sayfa numarasıyla bildirilir. `props`'un bir kısmı uygulamanın kendi anahtarlarıdır; anahtarları kişisel veri olan bir uygulama o veriyi onlarla gönderir: onları bildiren bileşenleri `docs/guide/analytics/ANALYTICS_GUIDE.md` sayar.

Parametreler:

- `component: String`: Bileşenin adı, örneğin `Button`.
- `action: String`: Ne olduğu, bileşenin kendi sözcüğüyle: `click`, `toggle`, `select`, `open`, `dismiss`, `focus`, `expand` ve rehberin bileşen bileşen saydığı ötekiler.
- `testTag: String?`: Bileşenin otomasyon etiketi, yani testlerin bağlandığı kimliğin aynısı, `TestTagPolicy` ne olursa olsun: `tagKey`'inden, yoksa çağrıldığı yerden kurulur; o yer de çevresindeki kodla değişir. Bir uygulamanın etiketsiz bildirdiği bir olayda null.
- `screen: String?`: Çevresindeki `TestScope` zinciri, örneğin `Checkout.PaymentForm`. Bir `TestScope`'un dışındaysa null.
- `props: Map<String, String>`: Olayın değerleri, üç türde: Pantrix'in kendi sözcükleri ve evet ya da hayır değerleri, `variant`, `via` ve `state` gibi; sayılar, `index`, `page` ve `count` gibi; uygulamanın bileşene verdiği anahtarlar, `row`, `option` ve `destination` gibi.

Belgelendiği sayfalar: [İç içe tema](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md), [Olaylar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/analytics.md)

### PantrixAnalytics

`import com.pantrixui.foundation.analytics.PantrixAnalytics`, `com.pantrixui:foundation` içinden

```kotlin
fun interface PantrixAnalytics
```

`PantrixUiEvent`'lerin gittiği yer.

Varsayılanı hiçbir şey yapmaz. Böylece bileşenlerin olaylarını koşulsuz bildirmesinin maliyeti, boş bir gövdeye yapılan tek bir sanal çağrıdır. Ürünler kendi SDK'larını `PantrixTheme(analytics = ...)` ile bağlar. Pantrix'in kendisi hiçbir analitik sağlayıcısına bağımlı değildir.

Bir Pantrix kontrolünün üstüne kurulan bir bileşen, iki metin alanı üstüne kurulan bir tarih alanı gibi, o kontrolün olaylarını kendi olaylarının yanında duyar ve tek bir basış iki kez sayılır. Bileşen kontrole `LocalPantrixAnalytics` ile kendi alıcısını verir: bu alıcı bileşenin kendi bildirdiğini atar, kalanını bileşenin adıyla iletir. `PantrixPageSize`, üstüne kurulduğu select ile böyle yapar.

Üyeleri:

- `fun track(event: PantrixUiEvent)`: Bir bileşenin bildirdiği her `event` ile, bildirildiği anda ve UI thread'inde çağrılır. Olayların gittiği yer olayı iletir ve döner: zaman alan iş, en başta göndermek, bu thread'in dışında yapılır.

Tipin kendisinde:

- `PantrixAnalytics.NoOp: PantrixAnalytics`: Her olayı bırakan alıcı: kendisine bir alıcı verilmeyen bir temanın bildirdiği yer.

Belgelendiği sayfalar: [İç içe tema](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md), [Olaylar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/analytics.md), [Analitik bağlayıcı](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/analytics-connector.md)

### LocalPantrixAnalytics

`import com.pantrixui.foundation.analytics.LocalPantrixAnalytics`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixAnalytics: ProvidableCompositionLocal<PantrixAnalytics>
```

Buradaki bileşenlerin olaylarını bildirdiği yer: `PantrixTheme(analytics = …)`. Uygulamanın kendi kodu da kendi olaylarını aynı yere bildirmek için onu okur.

Belgelendiği sayfalar: [Olaylar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/analytics.md)

## Paket com.pantrixui.foundation.date

### PantrixClock

`import com.pantrixui.foundation.date.PantrixClock`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixClock(
    public val clock: Clock,
    public val utcOffset: (Instant) -> Duration
)
```

Bir ekranın zamanı okuduğu yer: şu anki an ve ekranın gösterildiği saatin bir anda UTC'den ne kadar ileride olduğu. `rememberToday` günü, saat alanı seçicisinin açıldığı saati, elastic date picker aralıklarını ve bir grafik anlarını ondan okur. `System` cihazınkidir; bir test ya da önizleme, bir ekranı seçtiği bir günde ve bir saatte görmek için `LocalPantrixClock` ile kendi saatini verir.

Parametreler:

- `clock: Clock`: şu anki anın ne olduğu.
- `utcOffset: (Instant) -> Duration`: saatin bir anda UTC'den ne kadar ileride olduğu: İstanbul'da üç saat, Greenwich'in batısında sıfırdan az; yaz saatinin uygulandığı yerde yaz saati dahil.

Üyeleri:

- `fun today(): PantrixDate`: Bu saatin şu an gösterdiği gün.
- `fun time(): PantrixTime`: Bu saatin şu an gösterdiği saat, saniyesiyle.

Tipin kendisinde:

- `PantrixClock.System: PantrixClock`: Cihazın saati, cihazın saat diliminde.

Belgelendiği sayfalar: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

### LocalPantrixClock

`import com.pantrixui.foundation.date.LocalPantrixClock`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixClock: ProvidableCompositionLocal<PantrixClock>
```

Ekranın okunduğu saat: bir test ya da önizleme başkasını vermedikçe `PantrixClock.System`.

Belgelendiği sayfalar: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

### PantrixDate

`import com.pantrixui.foundation.date.PantrixDate`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixDate(
    public val year: Int,
    public val month: Int,
    public val day: Int
) : Comparable<PantrixDate>
```

Takvimde bir gün: bir yıl, bir ay ve ayın bir günü; günün saati de saat dilimi de yoktur.

Pantrix bir tarih kütüphanesi almaz. Birini kullanan bir bileşen, onu tarih gösteren her uygulamanın API'sine sokardı; bir uygulamanın hangisini kullandığına bir tasarım sistemi karar vermez. Bu tür üç sayıdır, uygulama onu tek satırla kendi türüne çevirir ve geri alır: `kotlinx-datetime`'ın `LocalDate`'inden `PantrixDate(date.year, date.month.number, date.day)`, `java.time`'ınkinden de aynısı. Her biri için satırlar docs/guide/date-time/DATE_TIME_GUIDE.md'de.

Takvim bugün kullanılan miladi takvimdir; başlangıcından öncesine de ileriye uzandığı gibi uzanır: birinci yıldan önceki yıl sıfır, ondan öncekiler sıfırdan küçük yazılır.

Parametreler:

- `year: Int`: Yıl, yazıldığı gibi.
- `month: Int`: Ay: Ocak için 1, Aralık için 12.
- `day: Int`: Ayın günü: 1'den ayın son gününe.

Üyeleri:

- `dayOfWeek: Int`: Bu günün haftanın hangi gününe düştüğü, ISO 8601'in numaralarıyla: 1 Pazartesi, 7 Pazar.
- `epochDays: Long`: 1 Ocak 1970'ten bu güne kadar geçen gün sayısı: o gün sıfır, öncesinde sıfırdan küçük.
- `fun plusDays(days: Int): PantrixDate`: Bu günden `days` gün sonraki gün; `days` sıfırdan küçükse önceki.
- `fun plusMonths(months: Int): PantrixDate`: `months` ay sonraki aynı gün; `months` sıfırdan küçükse önceki. O ay daha kısaysa ayın son günü: 31 Ocak'tan bir ay sonrası Şubat'ın son günüdür.
- `fun plusYears(years: Int): PantrixDate`: `years` yıl sonraki ya da önceki aynı gün: 29 Şubat, artık olmayan bir yılda 28 Şubat olur.
- `fun at(time: PantrixTime, offsetAt: (Instant) -> Duration = ::systemUtcOffset): Instant`: Bir saatin bu gün `time`'ı gösterdiği an: varsayılan cihazın kendi saatidir; UTC'den farkını her an için `offsetAt` söyler, `systemUtcOffset`'in yaz saatiyle birlikte söylediği gibi.

  Saat geri alınıp o saati iki kez gösteriyorsa, `java.time`'ın aldığı gibi ikisinden ilkidir. İleri alınıp o saati hiç göstermiyorsa, atladığı saatin o kadar ötesidir: ikiden üçe geçilen bir gecede iki buçuk, üç buçuktur.

Tipin kendisinde:

- `PantrixDate.ofEpochDays(days: Long): PantrixDate`: 1 Ocak 1970'ten `days` gün sonraki gün; `days` sıfırdan küçükse önceki.
- `PantrixDate.of(moment: Instant, offset: Duration = systemUtcOffset(moment)): PantrixDate`: UTC'den `offset` ileride olan bir saatin `moment` anında gösterdiği gün: varsayılanı cihazın kendi saati, `systemUtcOffset`'in söylediği gibi.
- `PantrixDate.today(): PantrixDate`: Cihazın saatinin şu an gösterdiği gün. Bir ekran bunun yerine `rememberToday`'i okur: ekranın saatinin gösterdiği gün, her gece yarısı yeniden sorulur.
- `PantrixDate.parse(text: String): PantrixDate`: ISO 8601'in `text` olarak yazdığı gün: `2026-10-17`; yıl en az dört haneli, sıfırdan küçük bir yılın önünde işaretiyle, `toString`'in yazdığı gibi.
- `PantrixDate.daysInMonth(year: Int, month: Int): Int`: `year` yılının `month` ayının kaç gün olduğu: 28'den 31'e; artık yılda Şubat'ın 29'u da vardır.
- `PantrixDate.isLeapYear(year: Int): Boolean`: `year` yılında 29 Şubat olup olmadığı: her dört yılda bir, ama her yüz yılda bir değil, ama her dört yüz yılda bir.

Belgelendiği sayfalar: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

### PantrixDateRange

`import com.pantrixui.foundation.date.PantrixDateRange`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixDateRange(
    public val start: PantrixDate,
    public val end: PantrixDate
)
```

`start`'tan `end`'e bir gün aralığı, ikisi de içinde: bir konaklama, bir izin, bir raporun kapsadığı günler. Tek günlük bir aralık o günde başlar ve biter.

Parametreler:

- `start: PantrixDate`
- `end: PantrixDate`

Üyeleri:

- `operator fun contains(date: PantrixDate): Boolean`: `date`'in aralığın günlerinden biri olup olmadığı; ilk ve son günü de bunlara dahildir.

Belgelendiği sayfalar: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

### PantrixTime

`import com.pantrixui.foundation.date.PantrixTime`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixTime(
    public val hour: Int,
    public val minute: Int,
    public val second: Int = 0
) : Comparable<PantrixTime>
```

Günün bir saati: 24 saatlik bir saatte bir saat, bir dakika ve bir saniye; günü ve saat dilimi yok.

`PantrixDate` gibi üç sayıdır; bir uygulama onu tek satırda kendi türüne ve geri çevirir: `kotlinx-datetime`'ın `LocalTime`'ından `PantrixTime(time.hour, time.minute, time.second)`, `java.time`'ınkinden de aynısı. Bir gün ve bir saat `PantrixDate.at` ile cihazın saatinde bir an olur; her biri için satırlar docs/guide/date-time/DATE_TIME_GUIDE.md'de.

Bir saat dil ne olursa olsun 24 saatle yazılır: saklanan ve gönderilen `toString`'dir. Ekranın gösterdiği dilin yazımıdır, `PantrixStrings.time`; İngilizcede 12 saatle.

Parametreler:

- `hour: Int`: Saat: gece yarısından sonraki için 0'dan 23'e.
- `minute: Int`: Saatin dakikası, 0 ile 59.
- `second: Int`: Dakikanın saniyesi, 0 ile 59: bir saatin kendi saniyeleri, artık saniye yok.

Üyeleri:

- `secondOfDay: Int`: Gece yarısından bu saate kadarki saniyeler: gece yarısında sıfır, günün son saniyesinde 86 399.

Tipin kendisinde:

- `PantrixTime.ofSecondOfDay(seconds: Int): PantrixTime`: Gece yarısından `seconds` saniye sonraki saat, 0 ile 86 399.
- `PantrixTime.of(moment: Instant, offset: Duration = systemUtcOffset(moment)): PantrixTime`: UTC'den `offset` ileride olan bir saatin `moment` anında saniyesine kadar gösterdiği saat: varsayılan cihazın kendi saatidir, `systemUtcOffset`'in söylediği gibi.
- `PantrixTime.now(): PantrixTime`: Cihazın saatinin şu an saniyesine kadar gösterdiği saat.
- `PantrixTime.parse(text: String): PantrixTime`: ISO 8601'in `text` olarak yazdığı saat: `14:05` ya da saniyesiyle `14:05:30`, her parçası iki rakam, `toString`'in yazdığı gibi.

Belgelendiği sayfalar: [Time Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/time-picker.md)

### PantrixTimePoint

`import com.pantrixui.foundation.date.PantrixTimePoint`, `com.pantrixui:foundation` içinden

```kotlin
sealed interface PantrixTimePoint
```

Saatle birlikte kayabilen bir zaman noktası: şimdi, şimdiden bir süre ya da bir an.

"Son 15 dakika" bir sonraki yenilemede yine son 15 dakikadır; bu yüzden bir ekranı süzen aralık noktalarını bu biçimde tutar ve her okunuşta `resolve` eder. Elasticsearch ve Kibana'nın yazdığı tarih matematiği onların sınırıdır: `toDateMath` bir noktayı bir adresin ya da sorgunun tuttuğu gibi yazar, `now-15m`; `parseDateMath` geri okur.

Üyeleri:

- `fun resolve(now: Instant = Clock.System.now(), asEnd: Boolean = false, firstDayOfWeek: Int = 1, offsetAt: (Instant) -> Duration = ::systemUtcOffset): Instant`: Bu noktanın düştüğü an; `now` şimdi, UTC'den farkını her an için `offsetAt`'in söylediği saatte: varsayılan, `systemUtcOffset`'in söylediği cihazın saati.

  Saniyeler, dakikalar ve saatler geçen zamandır; günler ve daha uzunları takvimindir, o saatte: öğleden bir gün geri öğledir. Bir birime yuvarlanan nokta birimin başındadır, bir aralığı bitiriyorsa (`asEnd`) son milisaniyesinde; bir aralık sorgusunun `gte` ve `lte`'yi okuduğu gibi: `now/d`'den `now/d`'ye bugünün tamamıdır. Bir hafta `firstDayOfWeek`'te başlar; günleri ISO 8601 sayar: 1 pazartesidir.
- `fun toDateMath(offsetAt: (Instant) -> Duration = ::systemUtcOffset): String`: Bu nokta tarih matematiği olarak: `now`, `now-15m`, `now-15m/m`, `now/d`; bir an ise ISO 8601'in yazdığı gibi, `offsetAt`'in söylediği saatte, `2026-10-17T14:15:00+03:00`: varsayılan cihazınki.

Tipin kendisinde:

- `PantrixTimePoint.parseDateMath(text: String): PantrixTimePoint?`: Tarih matematiği `text`'in yazdığı nokta; bu noktaların tuttuğu bir tarih matematiği değilse null.

  - `now` ve ardından bir işlem: `now-15m` ve `now+2h`; Kibana'nın izin verdiği gibi sayı yazılmayabilir, `now-d` `now-1d`'dir; sonra bir yuvarlama: `now-1d/d`, `now/w`, Elasticsearch'ün izin verdiği gibi `/1d`.

  - Birimler `y M w d h m s`, Elasticsearch'ün yazdığı gibi saatler için `H` de. Milisaniyeler okunmaz.

  - ISO 8601'in UTC'den farkıyla ya da bir `Z` ile yazdığı bir an: `2026-10-17T14:15:00+03:00`.

  Bu noktaların tutmadığı tarih matematiği, iki işlem (`now-1d/d+8h`) ya da `||`'den önce bir tarih, null'dır.

#### PantrixTimePoint.Now

```kotlin
data object Now : PantrixTimePoint
```

Noktanın okunduğu an.

#### PantrixTimePoint.Relative

```kotlin
class Relative(
    public val amount: Int,
    public val unit: PantrixTimeUnit,
    public val roundTo: PantrixTimeUnit? = null
) : PantrixTimePoint
```

Şimdiden `amount` `unit`, sıfırdan küçükse önce; sonra `roundTo`'nun başına, nokta bir aralığı bitiriyorsa sonuna yuvarlanır: `Relative(-15, Minutes)` `now-15m`'dir, `Relative(-1, Days, roundTo = Days)` `now-1d/d`, yani dün. Miktar sıfırken birim bir şey söylemez: `Relative(0, Days, Days)` `now/d`'dir, bugün; yuvarlama da yoksa nokta şimdidir.

Parametreler:

- `amount: Int`: Şimdiden kaç birim: önceyse sıfırdan küçük.
- `unit: PantrixTimeUnit`: `amount`'un saydığı.
- `roundTo: PantrixTimeUnit?`: Noktanın yuvarlandığı birim; yuvarlama yoksa null.

#### PantrixTimePoint.Absolute

```kotlin
class Absolute(
    public val moment: Instant
) : PantrixTimePoint
```

Bir an; nerede okunursa okunsun aynıdır: başka bir saat dilimindeki okur onu kendi saatinde görür.

Parametreler:

- `moment: Instant`: An.

Belgelendiği sayfalar: [Elastic Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elastic-date-picker.md)

### PantrixTimeRange

`import com.pantrixui.foundation.date.PantrixTimeRange`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixTimeRange(
    public val start: PantrixTimePoint,
    public val end: PantrixTimePoint
)
```

Uçları saatle birlikte kayabilen bir zaman aralığı: `now-15m`'den `now`'a, ne zaman okunursa okunsun son 15 dakikadır. Uçları arasında bir sıra tutmaz, çünkü kayan bir noktanın okunana kadar sırası yoktur: bir anda sırada olup olmadıklarını `resolve` söyler.

Parametreler:

- `start: PantrixTimePoint`: Aralığın başladığı yer.
- `end: PantrixTimePoint`: Bittiği yer.

Üyeleri:

- `fun resolve(now: Instant = Clock.System.now(), firstDayOfWeek: Int = 1, offsetAt: (Instant) -> Duration = ::systemUtcOffset): ClosedRange<Instant>?`: Aralığın arasında geçtiği anlar; `now` şimdi, başlangıcı aşağı, sonu yukarı yuvarlanmış, `offsetAt`'in söylediği saatte, haftaları `firstDayOfWeek`'te başlayarak; sonu başlangıcından önce düşüyorsa null.
- `fun toDateMath(offsetAt: (Instant) -> Duration = ::systemUtcOffset): Pair<String, String>`: İki uç tarih matematiği olarak: bir adresin tuttuğu ve bir aralık sorgusunun `gte` ve `lte` olarak gönderdiği.

  `offsetAt`: saatin her andaki UTC farkını söyler; bir an olarak yazılan bir uç için. Varsayılanı, `systemUtcOffset`'in söylediği gibi cihazınki.

Belgelendiği sayfalar: [Elastic Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elastic-date-picker.md)

### PantrixTimeUnit

`import com.pantrixui.foundation.date.PantrixTimeUnit`, `com.pantrixui:foundation` içinden

```kotlin
enum class PantrixTimeUnit(
    internal val letter: Char
)
```

Zamanın sayıldığı bir birim: bir noktanın şimdiye uzaklığı ve neye yuvarlandığı.

Saniyeler, dakikalar ve saatler geçen zamandır, her gün aynı uzunlukta. Günler ve daha uzunları takvimindir, noktanın okunduğu saatte: öğleden bir gün geri öğledir, saatin ileri alındığı bir günde de; 31 Ocak'tan bir ay ötesi Şubat'ın son günüdür.

Her biri tarih matematiğinde Elasticsearch ve Kibana'nın yazdığı harfle yazılır: `s`, `m`, `h`, `d`, `w`, `M` ve `y`.

Değerleri:

- `Seconds`: Saniyeler: `s`.
- `Minutes`: Dakikalar: `m`.
- `Hours`: Saatler: `h`.
- `Days`: Takvimin günleri: `d`.
- `Weeks`: Takvimin haftaları, haftanın başladığı günden: `w`.
- `Months`: Takvimin ayları: `M`.
- `Years`: Takvimin yılları: `y`.

Belgelendiği sayfalar: [Elastic Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elastic-date-picker.md)

### rememberToday

`import com.pantrixui.foundation.date.rememberToday`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberToday(): PantrixDate
```

Ekranın saatinin gösterdiği gün, gece yarısından sonra da açık kalan bir ekranın gördüğü gibi: saat ertesi güne geçince o da geçer, onu okuyan yeniden çizilir. Bir takvim bugünü onunla işaretler. Saat `LocalPantrixClock`'unkidir: bir test ya da önizleme başkasını vermedikçe cihazınki.

Saate, saatin kendi zamanıyla her gece yarısı yeniden bakar, arada bakmaz: elle kurulan bir saat ya da başka bir saat dilimine yapılan bir yolculuk, ekran yeniden kurulunca ya da bir sonraki gece yarısında görünür.

Belgelendiği sayfalar: [Date Picker](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/date-picker.md)

## Paket com.pantrixui.foundation.diagnostics

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### LocalPantrixDiagnostics

`import com.pantrixui.foundation.diagnostics.LocalPantrixDiagnostics`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixDiagnostics: ProvidableCompositionLocal<PantrixDiagnostics>
```

Bir temanın içindeki bileşenlerin denetimlerinin bulduğunu gönderdiği yer: temanın `diagnostics`'i.

İçeriği gösterilirken tanılaması değişen bir tema, o içeriğin denetimlerini hemen açar ya da kapatır.

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

## Paket com.pantrixui.foundation.files

### PantrixFile.uri

`import com.pantrixui.foundation.files.uri`, `com.pantrixui:foundation` içinden, yalnızca android hedefinde

```kotlin
val PantrixFile.uri: Uri?
```

The content address this file is read from, or null for one made in memory.

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

Belgelendiği sayfalar: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

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

Belgelendiği sayfalar: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

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

Belgelendiği sayfalar: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### rememberFilePicker

`import com.pantrixui.foundation.files.rememberFilePicker`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFilePicker(): FilePicker
```

Platformun kendi dosya seçicisi: bkz. `FilePicker`. Android'de sonuç tutan bir etkinlik ister, bir `ComponentActivity`; her Compose etkinliği öyledir. `LocalFilePicker` bir seçici verdiğinde o seçicidir.

Belgelendiği sayfalar: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### LocalFilePicker

`import com.pantrixui.foundation.files.LocalFilePicker`, `com.pantrixui:foundation` içinden

```kotlin
val LocalFilePicker: ProvidableCompositionLocal<FilePicker?>
```

`rememberFilePicker`'ın içinde verdiği seçici: bir testin ya da önizlemenin, bir ekranın bütün dosya bırakma bölgeleri için bir kerede platformunkinin yerine koyduğu seçici. Varsayılan null, platformunkini bırakır.

Belgelendiği sayfalar: [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

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

Belgelendiği sayfalar: [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

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

Belgelendiği sayfalar: [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### rememberFileSaver

`import com.pantrixui.foundation.files.rememberFileSaver`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberFileSaver(): FileSaver
```

Platformun dosya kaydetmek için kendi penceresi: bkz. `FileSaver`. Android'de sonuç tutan bir activity ister, her Compose activity'si gibi bir `ComponentActivity`. `LocalFileSaver` bir kaydedici veriyorsa o olur.

Belgelendiği sayfalar: [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### LocalFileSaver

`import com.pantrixui.foundation.files.LocalFileSaver`, `com.pantrixui:foundation` içinden

```kotlin
val LocalFileSaver: ProvidableCompositionLocal<FileSaver?>
```

`rememberFileSaver`'ın içinde verdiği kaydedici: bir testin ya da bir önizlemenin platformunkinin yerine koyduğu. Varsayılan null platformunkini bırakır.

Belgelendiği sayfalar: [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

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

Belgelendiği sayfalar: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

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

Belgelendiği sayfalar: [File Drop](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/file-drop.md), [Dosyalar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/files.md)

### PantrixFile.url

`import com.pantrixui.foundation.files.url`, `com.pantrixui:foundation` içinden, yalnızca ios hedefinde

```kotlin
val PantrixFile.url: NSURL?
```

The file in the app's own folders this one is, or null for one made in memory.

### PantrixFile.file

`import com.pantrixui.foundation.files.file`, `com.pantrixui:foundation` içinden, yalnızca jvm hedefinde

```kotlin
val PantrixFile.file: File?
```

The file on the disk this one is, or null for one made in memory.

### PantrixFile.domFile

`import com.pantrixui.foundation.files.domFile`, `com.pantrixui:foundation` içinden, yalnızca web hedefinde

```kotlin
val PantrixFile.domFile: File?
```

The browser's own file this one is, or null for one made in memory.

## Paket com.pantrixui.foundation.icons

### PantrixIcons

`import com.pantrixui.foundation.icons.PantrixIcons`, `com.pantrixui:foundation` içinden

```kotlin
object PantrixIcons
```

Bir bileşen kütüphanesinin onlarsız yapamayacağı ikonlar, `ImageVector` olarak: bir select'in oku, bir dialog'un kapatma ikonu, bir alert'in durum işaretleri. Onlar olmadan bu bileşenler stilsiz değil bozuktur, tonunu yalnızca rengi söyleyen bir alert de rengi göremeyene hiçbir şey söylemez (WCAG 1.4.1). Birkaçı da bir uygulamanın kendi ekranları içindir: `Inbox`, `Star`, `Folder`, `Person`, `Search` ve `Copy`. `Eye` ve `EyeOff` güvenli metin alanınındır: yazılanı gösteren ve yeniden gizleyen düğme. `Pause` ve `Play` carousel'indir: kendiliğinden ilerleyeni durduran ve yeniden ilerleten düğme. `Download` grafiğindir: onu uygulamadan dosya olarak çıkaran düğme. `Upload` ve `File` bırakma bölgesinindir: uygulamaya dosya alan bölge ve aldığı bir dosya. `Calendar` ve `Clock` bir tarihin ve bir saatindir: bir takvimi ve bir saat seçiciyi açan alanlar ve düğmeler.

24 birimlik ızgarada, 2 birimlik, uçları ve köşeleri yuvarlak bir çizgiyle çizilir. Çoğu ikon setinin kullandığı geometri budur: bir uygulamanın kendi ikonları bunların yanında farklı bir ağırlıkta görünmeden durur. Her yol siyahtır: `PantrixIcon` ikonun tamamını bulduğu renge boyar. Bu renk, ikona renk verilmedikçe durduğu yerin içerik rengidir.

Geriyi ya da ileriyi gösteren altı ikon `ImageVector.autoMirror`'ı açar ve sağdan sola düzende aynalanır: `ChevronForward`, `ChevronBack`, `FirstPage`, `LastPage`, `ArrowBack` ve `ArrowForward`. Ötekiler hiç aynalanmaz: bir onay işareti, bir mercek ya da sağa doğru bir dönüş her dilde aynı okunur. `Play` de öyledir: bir oynatıcının düğmesi her yerde nasıl çiziliyorsa öyle çizilir.

Üyeleri:

- `Check: ImageVector`: Onay. Anlamı simetriktir, bu yüzden hiç aynalanmaz.
- `Close: ImageVector`: Kapatmak ya da kaldırmak: bir dialog'u, bir sheet'i, bir chip'i.
- `ChevronDown: ImageVector`: Aşağıya açılan: bir select'in ya da bir accordion'ın oku. Hiç aynalanmaz.
- `ChevronForward: ImageVector`: Okuma yönüne bakar, bu yüzden sağdan sola düzende aynalanır.
- `ChevronBack: ImageVector`: Okuma yönünün tersine bakar, bu yüzden sağdan sola düzende aynalanır: bir sayfalamanın önceki sayfası.
- `FirstPage: ImageVector`: Bir sayfa satırının başladığı yere geri: bir çizgiye dayanmış `ChevronBack`, bir sayfalamanın ilk sayfası. Sağdan sola düzende aynalanır.
- `LastPage: ImageVector`: Bir sayfa satırının bittiği yere ileri: bir çizgiye dayanmış `ChevronForward`, bir sayfalamanın son sayfası. Sağdan sola düzende aynalanır.
- `ArrowBack: ImageVector`: Önceki ekrana dönüş, Android'in ve web'in çizdiği gibi. Sağdan sola düzende aynalanır.
- `ArrowForward: ImageVector`: `ArrowBack` nasıl geri dönüyorsa bu da sıradakine ilerler: bir aralığın iki ucu arasındaki ok. Sağdan sola düzende aynalanır.
- `Calendar: ImageVector`: Bir takvim yaprağı: bir tarih seçicinin alanı. Hiç aynalanmaz.
- `Clock: ImageVector`: Bir saatin kadranı, akrebi saatte, yelkovanı biraz ötesinde: bir saat seçicinin alanı. Saat her dilde aynı yöne döner, bu yüzden hiç aynalanmaz.
- `Refresh: ImageVector`: Yeniden yapmak: dörtte üçlük bir dönüş, sağdan başlayıp saat yönünde döner ve sağ üstteki ok ucuna varır. Sağa doğru bir dönüş her dilde aynı okunur, bu yüzden hiç aynalanmaz.
- `ZoomOut: ImageVector`: Daha fazlasını göstermek: içinde eksi olan bir mercek, bir aralığı genişletir. Mercek her dilde aynı şekilde tutulur, bu yüzden hiç aynalanmaz.
- `ZoomIn: ImageVector`: Daha azını göstermek: `ZoomOut`'un merceği, içinde artıyla. Aralığı daraltır. Hiç aynalanmaz.
- `MoreHorizontal: ImageVector`: Katlanıp gizlenen bir şey: bir breadcrumb izinin ya da bir sayfalamanın göstermediği sayfalar. Hiç aynalanmaz.
- `Minus: ImageVector`: Belirsiz ya da kısmen seçili.
- `Menu: ImageVector`: Bir çekmecenin açtığı menü: üç çizgi, her platformun bunun için kullandığı işaret.
- `Plus: ImageVector`: Ekle. `Minus` çizgisi ve onda eksik olan dikey çizgi.
- `Info: ImageVector`: Bilgi: daire içinde bir "i", noktası üstte. `Error` bu işareti baş aşağı çevirir.
- `Success: ImageVector`: Başarı: daire içinde bir onay işareti.
- `Warning: ImageVector`: Uyarı: üçgen içinde bir ünlem işareti. Dış çizgisi farklı olan tek durum ikonudur.
- `Error: ImageVector`: Hata: daire içinde bir ünlem işareti, noktası altta.
- `Inbox: ImageVector`: Kenarında çentik olan bir tepsi: gelen kutusu.
- `Star: ImageVector`: Beş köşeli bir yıldız: favori olarak işaretlenmiş bir şey.
- `Folder: ImageVector`: Bir klasör.
- `Person: ImageVector`: Bir baş ve omuzlar: bir kişi, bir hesap.
- `Search: ImageVector`: Bir mercek ve sapı: arama. Mercek her dilde aynı şekilde tutulur, bu yüzden hiç aynalanmaz.
- `Download: ImageVector`: Bir çizginin üstüne inen bir ok: bir şeyi uygulamadan dosya olarak çıkarmak. Hiç aynalanmaz.
- `Upload: ImageVector`: Bir çizgiden yukarı çıkan bir ok: uygulamaya bir dosya almak. Hiç aynalanmaz.
- `File: ImageVector`: Üst köşesi kıvrık bir sayfa: bir dosya. Kıvrım, bir dosya yöneticisindeki sayfanınki gibi her dilde sağ üsttedir, bu yüzden hiç aynalanmaz.
- `Copy: ImageVector`: Arka arkaya iki sayfa: kopyalama, bir kod bloğunun ya da bir bağlantının. Arkadaki sayfa her dilde sol üstte görünür, bu yüzden hiç aynalanmaz.
- `Eye: ImageVector`: Bir göz: gizli olanı, bir güvenli metin alanının metnini göstermek. Her dilde aynı gözdür.
- `EyeOff: ImageVector`: Üstünden bir çizgi geçen `Eye`: metni yeniden gizlemek. Göz, çizginin iki yanında çizgiye varmadan biter. Böylece çizgi gözün bir parçası gibi değil, gözün üstüne çekilmiş bir çizgi gibi okunur.
- `Pause: ImageVector`: İki dikey çubuk: kendiliğinden hareket edeni bir süreliğine durdurmak.
- `Play: ImageVector`: Sağı gösteren bir üçgen: durdurulanı yeniden hareket ettirmek. Bir oynatıcının düğmesi her dilde aynı yönü gösterir, bu yüzden hiç aynalanmaz.

Belgelendiği sayfalar: [Icon](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/icon.md)

## Paket com.pantrixui.foundation.keyboard

### Modifier.clearFocusOnTap

`import com.pantrixui.foundation.keyboard.clearFocusOnTap`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.clearFocusOnTap(): Modifier
```

Kullanıcı bu düğüme, altında dokunuşu kendisi alan bir şeyin olmadığı bir yerden dokununca odağı bırakır: metin alanı odağını bırakır ve yazılım klavyesi de onunla gider.

Bir ekran ya da uygulama onu, gösterdiği her şeyin altına, köküne koyar:

```kotlin
Column(Modifier.fillMaxSize().clearFocusOnTap()) {
    PantrixTextArea(state = comment, label = stringResource(Res.string.comment))
    PantrixButton(text = stringResource(Res.string.send), onClick = ::send)
}
```

iOS'ta birkaç satırlık bir alanın klavyesi, onu kapatan tuşu olmadığı için, bir sayı alanınınki de tuş takımında öyle bir tuş olmadığı için böyle kapatılır. Boş bir yere, bir yazıya ya da bir resme dokunmak odağı bırakır. Altındaki bir şeyin aldığı dokunuş ona bırakılır: düğme işini yapar, metin alanına basmak imlecini taşır. Kaydıran bir sürükleme dokunuş değildir ve odağı olduğu yerde bırakır.

Belgelendiği sayfalar: [Text Area](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/text-area.md)

### PantrixShortcut

`import com.pantrixui.foundation.keyboard.PantrixShortcut`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixShortcut(
    public val key: Key,
    public val command: Boolean = false,
    public val shift: Boolean = false,
    public val alt: Boolean = false
)
```

Bir tuş ve onunla birlikte basılı tutulan değiştiriciler: bir komutu klavyeden çalıştıran şey; Mac'te `⌘K`, başka yerde `Ctrl+K`.

`command`, bir sistemin kısayollarının başladığı tuştur: Apple'ın sistemlerinde Command, ötekilerde Control; böylece bir kısayol her platform için bir kez yazılır. Bir kısayol, tuşu değiştiricileri basılıyken ve başka hiçbiri basılı değilken indiğinde basılmış olur: `⌘K`'ya `⇧⌘K` basmaz, Mac'te `⌃K` de basmaz.

```kotlin
val search = PantrixShortcut(Key.K, command = true)
search.writtenOn(OperatingSystem.MacOs) // "⌘K"
search.writtenOn(OperatingSystem.Windows) // "Ctrl+K"
```

Harflerin, rakamların, okların, işlev tuşlarının, Enter'ın, Escape'in, Tab'ın, boşluğun, Backspace'in, Delete'in, Home'un, End'in, sayfa tuşlarının ve yaygın işaretlerin kendi adları vardır. Başka bir tuş numarasıyla yazılır.

Parametreler:

- `key: Key`: basılan tuş.
- `command: Boolean`: Apple'ın sistemlerinde Command'ın, ötekilerde Control'ün basılı olup olmadığı.
- `shift: Boolean`: Shift'in basılı olup olmadığı.
- `alt: Boolean`: Apple'ın sistemlerinde Option'ın, ötekilerde Alt'ın basılı olup olmadığı.

Üyeleri:

- `fun isPressedBy(event: KeyEvent, system: OperatingSystem): Boolean`: `event`'in bu kısayolu `system`'de basıp basmadığı: tuşunun inmesi, değiştiricileri basılıyken ve başka hiçbiri basılı değilken.
- `fun keysOn(system: OperatingSystem): List<String>`: Bu kısayolun tuşları, `system`'in yazdığı gibi, her biri bir tuş kapağına, onun sırasıyla: Apple'ın sistemlerinde Option, Shift, Command ve tuş (`⌥`, `⇧`, `⌘`, `K`); ötekilerde Control, Alt, Shift ve tuş.
- `fun writtenOn(system: OperatingSystem): String`: Bu kısayolun `system`'de yazılışı: Apple'ın sistemlerinde `⌥⇧⌘K`, ötekilerde `Ctrl+Alt+Shift+K`.

Belgelendiği sayfalar: [Command Palette](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/command-palette.md), [Klavye kısayolları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### Modifier.onShortcut

`import com.pantrixui.foundation.keyboard.onShortcut`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.onShortcut(
    shortcut: PantrixShortcut,
    enabled: Boolean = true,
    onTrigger: () -> Unit
): Modifier
```

Odak bu düğümdeyken ya da içindeyken `shortcut` basılınca `onTrigger`'ı çalıştırır; odaktaki kontrole tuş verilmeden önce: odaktaki bir alan, çalıştırdığı kısayolun harfini yazmaz.

Bir tuş yalnızca odaktaki kontrole ve çevresindeki düğümlere verilir. Bütün pencerenin bir kısayolu için bunu pencerenin köküne, `shortcutRoot` ile birlikte koy; o, başka hiçbir şey odakta değilken odağı tutar: o olmadan bir kısayol, bir şey odaklanana dek duyulmaz.

```kotlin
Box(Modifier.shortcutRoot().onShortcut(PantrixShortcut(Key.K, command = true)) { palette = true }) { … }
```

Bir tuşun bastığı iki kısayoldan dıştaki çalışır. Bir kısayol çalıştıktan sonra tuşun kalkışı da odaktaki kontrolden saklanır; öyle ki Enter ile basılan bir düğme onu kendi basışı sanmaz. Temanın tanılaması açıkken, bunun çevresindeki bir düğümün de duyduğu bir kısayol `PantrixCheck.ShadowedShortcut` olarak bildirilir: burada hiç çalışmaz.

Parametreler:

- `shortcut: PantrixShortcut`: onu çalıştıran tuş ve değiştiriciler.
- `enabled: Boolean`: çalışıp çalışmadığı: çalışmayan, tuşunu geçirir.
- `onTrigger: () -> Unit`: çalıştırdığı.

Belgelendiği sayfalar: [Command Palette](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/command-palette.md), [Klavye kısayolları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### Modifier.shortcutRoot

`import com.pantrixui.foundation.keyboard.shortcutRoot`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.shortcutRoot(): Modifier
```

İçinde hiçbir şey odakta değilken bu düğümün odağı tutmasını sağlar; böylece üstündeki ve çevresindeki kısayollara o sırada basılan tuşlar verilir.

Bir tuş, odaktaki kontrole ve o kontrolün çevresindeki düğümlere verilir. Hiçbir şey odakta değilken, başta, henüz hiçbir şey odaklanmadan ve odak kaldırıldıktan sonra, hiçbirine verilmez ve bir pencerenin kökündeki kısayol duyulmaz. Bu düğüm o zamanlarda odağı alır ve onu isteyen neyse ona bırakır. Hiçbir şey çizmez, ekran okuyucuya bir şey söylemez ve Tab için bir durak değildir: ondan Tab, tuttuklarının içine gider.

Bunu bir pencerenin köküne, pencerenin kısayollarıyla (`onShortcut`) birlikte bir kez koy. Pantrix'in bir modal'ı bunun üstünde kendi penceresidir; açıkken altındaki odak olduğu yerde kalır. Bir pencerede iki kök yan yana durduğunda, biri ötekine yerini bırakırken iki ekranın bir an durduğu gibi, odağı tutan onu bırakmaz.

Belgelendiği sayfalar: [Command Palette](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/command-palette.md), [Klavye kısayolları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

## Paket com.pantrixui.foundation.l10n

### PantrixLocale

`import com.pantrixui.foundation.l10n.PantrixLocale`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixLocale(
    public val languageTag: String,
    public val layoutDirection: LayoutDirection,
    public val firstDayOfWeek: Int = firstDayOfWeekOf(languageTag)
)
```

Bir dil, yazısının yönü ve takvimlerinin haftayı başlattığı gün. `forLanguageTag` yönü etiketten çıkarır.

Parametreler:

- `languageTag: String`: BCP 47 etiketi olarak dil, örneğin `tr`, `en-GB`, `ar`.
- `layoutDirection: LayoutDirection`: Dilin yazısının yönü: Arapça için sağdan sola.
- `firstDayOfWeek: Int`: Dilin takvimlerinde haftanın başladığı gün, ISO 8601'in numaralarıyla: 1 Pazartesi, 7 Pazar. Verilmezse Türkçede Pazartesi, Arapçada Cumartesi, İngilizcede ve öteki bütün dillerde Pazar. Kendi ilk günü verilmeyen bir tarih seçici haftalarını bu günden başlatır. `firstDayOfWeekOf`: `languageTag`'in takvimlerinin haftayı başlattığı gün: Türkçede Pazartesi, Arapçada Cumartesi, ötekilerde Pazar.

Üyeleri:

- `language: String`: Birincil alt etiket, küçük harfle: `en-GB` -> `en`.

Tipin kendisinde:

- `PantrixLocale.English: PantrixLocale`: İngilizce: soldan sağa yazılır, haftaları pazar günü başlar.
- `PantrixLocale.Turkish: PantrixLocale`: Türkçe: soldan sağa yazılır, haftaları pazartesi günü başlar.
- `PantrixLocale.Arabic: PantrixLocale`: Arapça: sağdan sola yazılır, haftaları cumartesi günü başlar.
- `PantrixLocale.forLanguageTag(tag: String): PantrixLocale`: Bir etiketten bir dil kurar; yazı yönünü etiketten çıkarır.

  `tag`: dil, bir BCP 47 etiketi olarak: `tr`, `en-GB` ya da `ar`. Birincil alt etiketi yönü ve haftanın başladığı günü belirler.

Belgelendiği sayfalar: [İç içe tema](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md), [Dil ve sözler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/language.md)

### LocalPantrixLocale

`import com.pantrixui.foundation.l10n.LocalPantrixLocale`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixLocale: ProvidableCompositionLocal<PantrixLocale>
```

Geçerli dil; `PantrixTheme` sağlar ve `PantrixTheme.locale` bunu okur. Bir temanın dışında İngilizce.

Belgelendiği sayfalar: [Dil ve sözler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/language.md)

### PantrixStrings

`import com.pantrixui.foundation.l10n.PantrixStrings`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixStrings(
    public val loading: String = "Loading",
    public val on: String = "On",
    public val off: String = "Off",
    public val indeterminate: String = "Partially selected",
    public val invalidInput: String = "Invalid input",
    public val required: String = "Required",
    public val close: String = "Close",
    public val clear: String = "Clear",
    public val characterCountTemplate: String = "Characters entered: {count} of {max}",
    public val showPassword: String = "Show password",
    public val hidePassword: String = "Hide password",
    public val removeTemplate: String = "Remove {label}",
    public val noOptions: String = "No options",
    public val noMatches: String = "No matches",
    public val search: String = "Search",
    public val back: String = "Back",
    public val expanded: String = "Expanded",
    public val collapsed: String = "Collapsed",
    public val breadcrumb: String = "Breadcrumb",
    public val currentPage: String = "Current page",
    public val showFullPath: String = "Show full path",
    public val previousSlide: String = "Previous slide",
    public val nextSlide: String = "Next slide",
    public val slidePositionTemplate: String = "Slide {position} of {count}",
    public val pauseSlides: String = "Pause slides",
    public val playSlides: String = "Play slides",
    public val itemCountTemplate: String = "Items: {count}",
    public val jsonUnreadableTemplate: String = "JSON could not be read: line {line}, column {column}",
    public val copy: String = "Copy",
    public val copied: String = "Copied",
    public val levelTemplate: String = "Level {level}",
    public val pagination: String = "Pagination",
    public val previousPage: String = "Previous page",
    public val nextPage: String = "Next page",
    public val pageTemplate: String = "Page {page}",
    public val pageOfTemplate: String = "Page {page} of {count}",
    public val firstPage: String = "First page",
    public val lastPage: String = "Last page",
    public val perPage: String = "Per page",
    public val goToPage: String = "Go to page",
    public val sortedAscending: String = "Sorted ascending",
    public val sortedDescending: String = "Sorted descending",
    public val notSorted: String = "Not sorted",
    public val sortOrderTemplate: String = "Sort order {position}",
    public val selectRow: String = "Select row",
    public val selectRowTemplate: String = "Select {label}",
    public val selectAllRows: String = "Select all rows",
    public val rowDetails: String = "Details",
    public val rowDetailsTemplate: String = "Details of {label}",
    public val noRows: String = "No rows",
    public val rowRangeTemplate: String = "{first}–{last} of {count}",
    public val selectedCountTemplate: String = "{count} selected",
    public val columnWidthTemplate: String = "Width of {label}",
    public val chart: String = "Chart",
    public val flowFromTemplate: String = "From {label}",
    public val flowToTemplate: String = "To {label}",
    public val openingValue: String = "Open",
    public val highestValue: String = "High",
    public val lowestValue: String = "Low",
    public val closingValue: String = "Close",
    public val zoomIn: String = "Zoom in",
    public val zoomOut: String = "Zoom out",
    public val resetZoom: String = "Reset zoom",
    public val scrollBack: String = "Scroll back",
    public val scrollForward: String = "Scroll forward",
    public val rangeInView: String = "Range in view",
    public val rangeTemplate: String = "{first} to {last}",
    public val exportChart: String = "Export",
    public val noData: String = "No data",
    public val total: String = "Total",
    public val moreTemplate: String = "+{count} more",
    public val monthNames: List<String> = ENGLISH_MONTHS,
    public val dayMonthTemplate: String = "{month} {day}",
    public val monthYearTemplate: String = "{month} {year}",
    public val dateTemplate: String = "{month} {day}, {year}",
    public val digits: String = "0123456789",
    public val decimalSeparator: String = ".",
    public val groupSeparator: String = ",",
    public val percentTemplate: String = "{number}%",
    public val thousandsTemplate: String = "{number}K",
    public val millionsTemplate: String = "{number}M",
    public val billionsTemplate: String = "{number}B",
    public val trillionsTemplate: String = "{number}T",
    public val shareOfFirstTemplate: String = "{label} of the first",
    public val shareOfPreviousTemplate: String = "{label} of the previous",
    public val others: String = "Other",
    public val today: String = "Today",
    public val commands: String = "Commands",
    public val searchCommands: String = "Search commands",
    public val dropFilesHere: String = "Drop files here",
    public val orChooseFiles: String = "or choose files",
    public val chooseFiles: String = "Choose files",
    public val orDropHere: String = "or drop them here",
    public val dropToAdd: String = "Drop to add",
    public val filesAddedTemplate: String = "Files added: {count}",
    public val filesRejectedTemplate: String = "Files not accepted: {count}",
    public val bytesTemplate: String = "{number} B",
    public val kilobytesTemplate: String = "{number} KB",
    public val megabytesTemplate: String = "{number} MB",
    public val gigabytesTemplate: String = "{number} GB",
    public val longMonthNames: List<String> = ENGLISH_LONG_MONTHS,
    public val weekdayNames: List<String> = ENGLISH_WEEKDAYS,
    public val shortWeekdayNames: List<String> = ENGLISH_SHORT_WEEKDAYS,
    public val longDateTemplate: String = "{weekday}, {month} {day}, {year}",
    public val longMonthYearTemplate: String = "{month} {year}",
    public val previousMonth: String = "Previous month",
    public val nextMonth: String = "Next month",
    public val chooseYear: String = "Choose year",
    public val rangeStart: String = "Range start",
    public val inRange: String = "In range",
    public val rangeEnd: String = "Range end",
    public val hour: String = "Hour",
    public val minute: String = "Minute",
    public val period: String = "AM/PM",
    public val am: String = "AM",
    public val pm: String = "PM",
    public val twelveHourTemplate: String = "{time} {period}",
    public val timeWords: PantrixTimeWords = PantrixTimeWords.English,
    public val quickSelect: String = "Quick select",
    public val dateQuickSelect: String = "Date quick select",
    public val commonlyUsed: String = "Commonly used",
    public val recentlyUsed: String = "Recently used",
    public val lastTime: String = "Last",
    public val nextTime: String = "Next",
    public val apply: String = "Apply",
    public val update: String = "Update",
    public val refresh: String = "Refresh",
    public val previousTimeWindow: String = "Previous time window",
    public val nextTimeWindow: String = "Next time window",
    public val absoluteTime: String = "Absolute",
    public val relativeTime: String = "Relative",
    public val nowTime: String = "Now",
    public val nowTimeExplained: String =
        "Setting the time to now means that on every refresh this time is set to the time of the refresh.",
    public val setStartToNow: String = "Set start date and time to now",
    public val setEndToNow: String = "Set end date and time to now",
    public val startDate: String = "Start date",
    public val endDate: String = "End date",
    public val needsUpdating: String = "Needs updating",
    public val invalidDate: String = "Invalid date",
    public val showDates: String = "Show dates",
    public val thisWeek: String = "This week",
    public val thisMonth: String = "This month",
    public val thisYear: String = "This year",
    public val yesterday: String = "Yesterday",
    public val weekToDate: String = "Week to date",
    public val monthToDate: String = "Month to date",
    public val yearToDate: String = "Year to date",
    public val timeTense: String = "Time tense",
    public val timeValue: String = "Time value",
    public val timeUnit: String = "Time unit",
    public val autoRefresh: String = "Auto refresh",
    public val refreshEvery: String = "Refresh every",
    public val timeZone: String = "Time zone",
    public val secondsShort: String = "s",
    public val minutesShort: String = "m",
    public val hoursShort: String = "h",
    public val dayLetters: String = "DD",
    public val monthLetters: String = "MM",
    public val yearLetters: String = "YYYY",
    public val day: String = "Day",
    public val month: String = "Month",
    public val year: String = "Year",
    public val openCalendar: String = "Open calendar",
    public val dateFormatTemplate: String = "Enter the date as {pattern}",
    public val noSuchDay: String = "There is no such day",
    public val dayNotAllowed: String = "This day cannot be chosen",
    public val dateBetweenTemplate: String = "Choose a day from {start} to {end}",
    public val dateFromTemplate: String = "Choose {start} or a later day",
    public val dateUntilTemplate: String = "Choose {end} or an earlier day",
    public val hourLetters: String = "HH",
    public val minuteLetters: String = "MM",
    public val chooseTime: String = "Choose time",
    public val timeFormatTemplate: String = "Enter the time as {pattern}",
    public val noSuchTime: String = "There is no such time",
    public val timeBetweenTemplate: String = "Choose a time from {start} to {end}",
    public val timeFromTemplate: String = "Choose {start} or a later time",
    public val timeUntilTemplate: String = "Choose {end} or an earlier time",
    public val listWidth: String = "List width",
    public val supportingPaneWidth: String = "Supporting pane width",
    public val diagnostics: String = "Diagnostics",
    public val findingCountTemplate: String = "Findings: {count}",
    public val notOnScreen: String = "Not on screen",
    public val moreActions: String = "More actions",
    public val overLimitTemplate: String = "{count} over the limit",
    public val tooLong: String = "Too long",
    public val saveFile: String = "Save file"
)
```

What components say or announce themselves, in one language. `forLocale` picks the pack for a locale, and English stands in for a language without one.

Every field's default is its English. An app's own pack names the fields it has words for, `PantrixStrings(loading = "Laden", close = "Schließen")`, and goes on compiling when a new component brings a new field: that one is said in English until the pack has words for it, which is heard and can be mended, where a build that broke could not ship.

Parametreler:

- `loading: String`: What a spinner, a skeleton and a loading button are announced as.
- `on: String`: A toggle's state when it is on, as a screen reader reads it out.
- `off: String`: A toggle's state when it is off, as a screen reader reads it out.
- `indeterminate: String`: A checkbox's state when some of what it stands for is chosen and some is not, as a screen reader reads it out.
- `invalidInput: String`: What a control in error is announced as where it has no message of its own: a checkbox, a radio button, a switch or a select.
- `required: String`: What a field that has to be filled in is said to be, "Required". No component of the library says it itself.
- `close: String`: What the button that closes something is called: a dialog's, a sheet's, an alert's and a snackbar's.
- `clear: String`: What the button that empties a text field is called, and the one that clears a diagnostics inspector's findings.
- `characterCountTemplate: String`: What a text field's counter is announced as, with `{count}` where the number of characters entered goes and `{max}` where the limit does. `characterCount` fills it in.
- `showPassword: String`: What the button in a secure text field is called while the text is hidden: pressing it shows what was typed.
- `hidePassword: String`: What the same button is called while the text is shown: pressing it hides the text again.
- `removeTemplate: String`: What the button that takes an item out is called, with `{label}` where the item's own name goes: a chip's remove button. `remove` fills it in.
- `noOptions: String`: What a list of choices says in place of its rows while it has none: a select with no options.
- `noMatches: String`: What a list that is being searched says while nothing in it matches what was typed.
- `search: String`: What a field that searches a list is called, and what it shows while it is empty, where its caller gives it no words of its own.
- `back: String`: What the button that goes back to the screen before is called: a top bar's back button.
- `expanded: String`: The state of what is open, as a screen reader reads it out where the reader does not tell it by itself: an accordion's section, a sidebar's.
- `collapsed: String`: The same of what is closed.
- `breadcrumb: String`: What a trail of the pages above the one on screen is called: a breadcrumb's row.
- `currentPage: String`: The state of the page on screen in such a trail, as a screen reader reads it out.
- `showFullPath: String`: What the button that shows the pages a long trail has folded away is called.
- `previousSlide: String`: What the button that turns a carousel back a slide is called.
- `nextSlide: String`: What the button that turns a carousel on a slide is called.
- `slidePositionTemplate: String`: Where a carousel is, as a screen reader reads it out, with `{position}` where the slide's number goes and `{count}` where the number of slides does. `slidePosition` fills it in.
- `pauseSlides: String`: What the button that stops a carousel from turning by itself is called.
- `playSlides: String`: What the same button is called while the carousel is stopped: it lets it turn again.
- `itemCountTemplate: String`: How many things a folded part holds, as a screen reader reads it out, with `{count}` where the number goes: a JSON view's closed object or array, which shows the number alone. `itemCount` fills it in.
- `jsonUnreadableTemplate: String`: What a JSON view says over a text that is not JSON, with `{line}` and `{column}` where the place it stopped reading at goes. `jsonUnreadable` fills it in.
- `copy: String`: What the button that puts something on the clipboard is called: a JSON view's.
- `copied: String`: What that button is called, and says, right after it has done so.
- `levelTemplate: String`: How deep a part of a tree is, as a screen reader reads it out, with `{level}` where the number goes: a line of a JSON view, which shows it by its indent alone. `level` fills it in.
- `pagination: String`: What the row that moves between the pages of a long list is called: a pagination's.
- `previousPage: String`: What the button that goes back a page in such a row is called.
- `nextPage: String`: What the button that goes on a page in such a row is called.
- `pageTemplate: String`: What a page's button in such a row is called, with `{page}` where its number goes: the button shows the number alone. `page` fills it in.
- `pageOfTemplate: String`: Where such a row is, as it is written between the two buttons of a row too narrow for the pages' numbers, with `{page}` where the page's number goes and `{count}` where the number of pages does. `pageOf` fills it in.
- `firstPage: String`: What the button that goes to the first page of such a row is called.
- `lastPage: String`: What the button that goes to its last page is called.
- `perPage: String`: What stands before the choice of how many things a page of a list shows, and names that choice.
- `goToPage: String`: What stands before the field a page's number is typed in to go to it, and names that field.
- `sortedAscending: String`: The state of a table's column the rows are in the order of, smallest first, as a screen reader reads it out: a data table's header shows it by an arrow alone.
- `sortedDescending: String`: The same of a column the rows are in the order of, largest first.
- `notSorted: String`: The same of a column that can be pressed for its order and is not the one the rows are in.
- `sortOrderTemplate: String`: Which place a column has among the columns a table is in the order of, as a screen reader reads it out, with `{position}` where the number goes: the header shows the number alone. `sortOrder` fills it in.
- `selectRow: String`: What the box that chooses a row of a table is called, where the row has no name of its own.
- `selectRowTemplate: String`: What that box is called where the row has a name, with `{label}` where the name goes. `selectRow` fills it in.
- `selectAllRows: String`: What the box in a table's header that chooses every row is called.
- `rowDetails: String`: What the button that opens what a row of a table has under it is called, where the row has no name of its own.
- `rowDetailsTemplate: String`: What that button is called where the row has a name, with `{label}` where the name goes. `rowDetails` fills it in.
- `noRows: String`: What a table says in place of its rows while it has none.
- `rowRangeTemplate: String`: Which rows of how many a page of a table shows, as a table's foot writes it, with `{first}` and `{last}` where the first and the last row's numbers go and `{count}` where the number of all the rows does. `rowRange` fills it in.
- `selectedCountTemplate: String`: How many rows of a table are chosen, as a bar over the table writes it, with `{count}` where the number goes. `selectedCount` fills it in.
- `columnWidthTemplate: String`: What the end of a table's header is called, which a keyboard and a screen reader make its column wider and narrower by, with `{label}` where the column's name goes. `columnWidth` fills it in.
- `chart: String`: What a chart is called where it is given no description of its own: a screen reader says it before the names of the chart's series.
- `flowFromTemplate: String`: What a flow into a node of a sankey is called, in the node's tooltip and to a screen reader, with `{label}` where the name of the node it comes from goes. `flowFrom` fills it in.
- `flowToTemplate: String`: What a flow out of a node of a sankey is called, with `{label}` where the name of the node it goes to goes. `flowTo` fills it in.
- `openingValue: String`: What the value a candle of a chart opened at is called, in the candle's tooltip and to a screen reader, before the value itself.
- `highestValue: String`: What the highest value a candle reached is called.
- `lowestValue: String`: What the lowest value a candle reached is called.
- `closingValue: String`: What the value a candle closed at is called.
- `zoomIn: String`: What the button that looks closer at a chart is called.
- `zoomOut: String`: What the button that looks at a chart from further off is called.
- `resetZoom: String`: What the button that shows all of a chart again is called.
- `scrollBack: String`: What the button that moves a chart that is looked at closer towards its start is called.
- `scrollForward: String`: What the button that moves it towards its end is called.
- `rangeInView: String`: What the strip under a chart is called on which the part of the chart that is in view is marked, and moved: a screen reader says it before that part.
- `rangeTemplate: String`: A stretch from one thing to another, with `{first}` and `{last}` where their names go: how the part of a chart that is in view is said, from its first place to its last. `range` fills it in.
- `exportChart: String`: What the button that takes a chart out of the app as a file is called.
- `noData: String`: What a chart says while it has no value to draw: written in its plot, and to a screen reader.
- `total: String`: What the sum of a chart's stack is called: the row a tooltip writes it in, after the stack's values.
- `moreTemplate: String`: What a list says in the place of the rows it has no room for, with `{count}` where their number goes: a chart's tooltip under the rows it shows. `more` fills it in.
- `monthNames: List<String>`: The twelve months by their short names, January first: what `month` names a month by, and so every date these words write.
- `dayMonthTemplate: String`: A day of a year without the year, with `{day}` and `{month}` where the day's number and the month's name go: what a chart's axis of time writes at a day. `dayMonth` fills it in.
- `monthYearTemplate: String`: A month of a year, with `{month}` and `{year}`. `monthYear` fills it in.
- `dateTemplate: String`: A day, with `{day}`, `{month}` and `{year}`. `date` fills it in.
- `digits: String`: The ten digits numbers are written in, from nought to nine: what `number` writes a number with, and so every number these words hold. The Arabic pack has the digits Arabic is written with; give it the English pack's `digits` to write them as English does.
- `decimalSeparator: String`: What stands between the whole of a quantity and its fraction: English's point, Turkish's comma. `decimal`, `compact` and `percent` write with it.
- `groupSeparator: String`: What stands between each three digits of a quantity's whole, counted from its end: English's comma, Turkish's point. Empty for a language that writes its digits in one run.
- `percentTemplate: String`: A share of a hundred, with `{number}` where the number goes: the sign after it in English, before it in Turkish. `percent` fills it in.
- `thousandsTemplate: String`: A quantity counted in thousands, written short, with `{number}` where the number of thousands goes: `{number}K`. `compact` fills it in, as it does the three after it.
- `millionsTemplate: String`: The same of a quantity counted in millions.
- `billionsTemplate: String`: The same of a quantity counted in thousands of millions.
- `trillionsTemplate: String`: The same of a quantity counted in millions of millions, and of every larger one.
- `shareOfFirstTemplate: String`: What a stage of a funnel is as a share of the first stage, in the stage's tooltip and to a screen reader, with `{label}` where the share, written, goes. `shareOfFirst` fills it in.
- `shareOfPreviousTemplate: String`: What it is as a share of the stage before it. `shareOfPrevious` fills it in.
- `others: String`: What the one slice a pie gathers its smallest slices into is called.
- `today: String`: What the moment a Gantt chart is read at is called, over its line and to a screen reader.
- `commands: String`: What a list of the app's commands is called, as a screen reader announces it when it opens: a command palette's.
- `searchCommands: String`: What the field that searches the app's commands shows while it is empty, where its caller gives it no words of its own.
- `dropFilesHere: String`: What a drop zone says first where files are dragged in: on the desktop and the web.
- `orChooseFiles: String`: What it says under that: the press that opens the picker.
- `chooseFiles: String`: What a drop zone says first where files are chosen rather than dragged in: on a phone. The title of the desktop's window for choosing files too.
- `orDropHere: String`: What it says under that: a tablet's drag, another app's beside it.
- `dropToAdd: String`: What a drop zone says while something is dragged over it.
- `filesAddedTemplate: String`: How many files a drop zone took, as a screen reader is told it, with `{count}` where the number goes. `filesAdded` fills it in.
- `filesRejectedTemplate: String`: How many it did not take, of a kind or a size it does not take. `filesRejected` fills it in.
- `bytesTemplate: String`: A file's size under a thousand bytes, with `{number}` where the number goes: `{number} B`. `fileSize` fills it in, as it does the three after it.
- `kilobytesTemplate: String`: The same counted in thousands of bytes: `{number} KB`.
- `megabytesTemplate: String`: The same counted in millions of bytes.
- `gigabytesTemplate: String`: The same counted in thousands of millions of bytes, and of every larger size.
- `longMonthNames: List<String>`: The twelve months by their full names, January first: what `longMonth` names a month by, and so a calendar's title and a day said in full.
- `weekdayNames: List<String>`: The seven days of the week by their full names, Monday first, as ISO 8601 numbers them: what `weekday` names a day by, and so a day said in full.
- `shortWeekdayNames: List<String>`: The same by the short names a calendar writes over its columns: `Mo`, and `Pt` in Turkish. `shortWeekday` gives them.
- `longDateTemplate: String`: A day said in full, with `{weekday}`, `{day}`, `{month}` and `{year}`: what a screen reader hears a calendar's day as. `longDate` fills it in.
- `longMonthYearTemplate: String`: A month of a year with the month's full name, with `{month}` and `{year}`: a calendar's title. `longMonthYear` fills it in.
- `previousMonth: String`: What the button that turns a calendar back a month is called.
- `nextMonth: String`: What the button that turns a calendar on a month is called.
- `chooseYear: String`: What pressing a calendar's title does, as a screen reader tells it: it shows the years to choose from in place of the days.
- `rangeStart: String`: The state of the first day of a stretch of days on a calendar, as a screen reader reads it out.
- `inRange: String`: The state of a day between its first day and its last.
- `rangeEnd: String`: The state of its last day.
- `hour: String`: What a time picker's column of hours is called, over it and to a screen reader.
- `minute: String`: What its column of minutes is called.
- `period: String`: What its column of the two halves of the day is called, where the clock has twelve hours: `AM/PM`, and `ÖÖ/ÖS` in Turkish.
- `am: String`: The half of the day before noon, as a clock of twelve hours writes it: `AM`.
- `pm: String`: The half after noon: `PM`.
- `twelveHourTemplate: String`: A time by a clock of twelve hours, with `{time}` where the hour and the minute go and `{period}` where the half of the day does: `{time} {period}`, `2:05 PM`. `time` fills it in.
- `timeWords: PantrixTimeWords`: The phrases that count time, a function for each: "Last 15 minutes", "~ 2 hours ago". `PantrixTimeWords.English`, `.Turkish` and `.Arabic` come with the packs.
- `quickSelect: String`: What an elastic date picker's choice of a range by an amount and a unit is called, over it.
- `dateQuickSelect: String`: What the button that opens an elastic date picker's quick menu is called, to a screen reader.
- `commonlyUsed: String`: The title over the ranges a quick menu offers by name.
- `recentlyUsed: String`: The title over the ranges a reader chose lately.
- `lastTime: String`: The choice of a range that ends now, beside an amount: Last 15 minutes.
- `nextTime: String`: The choice of a range that starts now: Next 15 minutes.
- `apply: String`: What the button that takes a choice is called.
- `update: String`: What the button that takes an edit of a range that waits is called.
- `refresh: String`: What the button that reads a range again is called.
- `previousTimeWindow: String`: What the button that moves a range back by its own length is called.
- `nextTimeWindow: String`: What the button that moves it on by its length is called.
- `absoluteTime: String`: The tab of an end of a range that is a moment on the calendar.
- `relativeTime: String`: The tab of an end that is an amount of time from now.
- `nowTime: String`: The tab of an end that is now.
- `nowTimeExplained: String`: What the tab of an end that is now says of it.
- `setStartToNow: String`: What the button that makes a range's start now is called.
- `setEndToNow: String`: What the button that makes a range's end now is called.
- `startDate: String`: What the start of a range is called, on its button and to a screen reader.
- `endDate: String`: What its end is called.
- `needsUpdating: String`: What a screen reader is told of an end whose edit waits.
- `invalidDate: String`: What it is told of an end that falls before the start.
- `showDates: String`: What a press on that button does, as a screen reader tells it.
- `thisWeek: String`: A range by its name: the week of now.
- `thisMonth: String`: The month of now.
- `thisYear: String`: The year of now.
- `yesterday: String`: The day before today.
- `weekToDate: String`: From the start of the week to now.
- `monthToDate: String`: From the start of the month to now.
- `yearToDate: String`: From the start of the year to now.
- `timeTense: String`: The name a screen reader hears of the choice between the last and the next amount of time.
- `timeValue: String`: The name of the field of an amount of time.
- `timeUnit: String`: The name of the choice of a unit of time.
- `autoRefresh: String`: What a picker's refresh by itself is called: on the field that sets nothing else.
- `refreshEvery: String`: The switch that turns the refresh by itself on, before its amount and unit.
- `timeZone: String`: What the line naming the time zone a picker's moments are in starts with.
- `secondsShort: String`: A second written short after a number, where the room is a word's: "5 s".
- `minutesShort: String`: A minute written short: "5 m".
- `hoursShort: String`: An hour written short: "5 h".
- `dayLetters: String`: What a date field's pattern writes a day's two digits as: "DD" in "DD/MM/YYYY", the pattern its box shows while it is empty and its error names.
- `monthLetters: String`: What it writes a month's two digits as.
- `yearLetters: String`: What it writes a year's four digits as.
- `day: String`: The name of a day's part of a date, as a screen reader is told the order a date field takes them in.
- `month: String`: The name of a month's part.
- `year: String`: The name of a year's part.
- `openCalendar: String`: What a date field's button that opens its calendar is called.
- `dateFormatTemplate: String`: What a date field says of a date that is not written whole, with `{pattern}` where its pattern goes.
- `noSuchDay: String`: What it says of a date the calendar has no such day for: the 31st of February.
- `dayNotAllowed: String`: What it says of a day that is there but cannot be chosen.
- `dateBetweenTemplate: String`: What it says of a day before its first or after its last, with `{start}` and `{end}` where they go.
- `dateFromTemplate: String`: What it says of a day before its first, where it has no last.
- `dateUntilTemplate: String`: What it says of a day after its last, where it has no first.
- `hourLetters: String`: What a time field's pattern writes an hour's two digits as: "HH" in "HH:MM", the pattern its box shows while it is empty and its error names.
- `minuteLetters: String`: What it writes a minute's two digits as.
- `chooseTime: String`: What a time field's button that opens its picker is called.
- `timeFormatTemplate: String`: What a time field says of a time that is not written whole, with `{pattern}` where its pattern goes.
- `noSuchTime: String`: What it says of a time the clock has not: 25 o'clock, or a 60th minute.
- `timeBetweenTemplate: String`: What it says of a time before its first or after its last, with `{start}` and `{end}` where they go.
- `timeFromTemplate: String`: What it says of a time before its first, where it has no last.
- `timeUntilTemplate: String`: What it says of a time after its last, where it has no first.
- `listWidth: String`: What the handle between a list and its detail is called, which a keyboard and a screen reader make the list wider and narrower by.
- `supportingPaneWidth: String`: What the handle between a screen's main content and its supporting pane is called, which a keyboard and a screen reader make the supporting pane wider and narrower by.
- `diagnostics: String`: What the list of what a theme's diagnostics have found is called: a diagnostics inspector's.
- `findingCountTemplate: String`: How many findings the diagnostics have, as the button that opens their list is read out, with `{count}` where the number goes. `findingCount` fills it in.
- `notOnScreen: String`: What a finding whose node is gone, or that has none, says in place of being shown on the screen.
- `moreActions: String`: What the button that opens the actions a page's bar has no room for is called.
- `overLimitTemplate: String`: What a text area's counter says once its text is past its limit, with `{count}` where the number of characters past it goes. `overLimit` fills it in.
- `tooLong: String`: What a text area bound to a form's field says is wrong with a text past its limit: the field's error, under which the counter says how far past it the text is.
- `saveFile: String`: What the desktop's window for keeping a file the app made is called, over the place the user chooses.

Üyeleri:

- `fun number(value: Int): String`: `value` in this language's digits: `12` as `12`, and as `١٢` where the digits are Arabic's. A sign before the number is kept as it is. What a component writes a number with where it shows one: a page's number, a count.
- `fun decimal(value: Number, fractionDigits: Int = 2, minFractionDigits: Int = 0, grouped: Boolean = true): String`: `value` as a quantity is written in this language: `1234.5` as `1,234.5`, as `1.234,5` in Turkish and as `١٬٢٣٤٫٥` in Arabic. What a chart writes beside its axis, and what any screen writes an amount or a measure with. A number that only counts or names, a page's or a year's, is `number`'s, which puts no mark between its digits.

  It is rounded to `fractionDigits` after the mark, a half away from nought, and the noughts that end a fraction are left out down to `minFractionDigits`: `2.50` is `2.5`, and `2.50` with two of both. A Double holds fifteen digits to be trusted, and what is asked for past them is not written.

  The same on every platform: it is worked out here, and asks no platform for its own format.

  `grouped`: whether each three digits of the whole are set apart by `groupSeparator`.
- `fun compact(value: Number, fractionDigits: Int = 1): String`: `value` written short, by the thousand: `1234` as `1.2K`, `2500000` as `2.5M`, and in Turkish as `1,2 B` and `2,5 Mn`. What stands where there is no room for every digit: beside a chart's axis, in a badge, on a card. Below a thousand it is `decimal`'s.

  It is rounded to `fractionDigits` after the mark and written without the noughts that end a fraction; a number that rounds up to a thousand of its kind is one of the next, `999950` being `1M` and not `1000K`.
- `fun percent(share: Number, fractionDigits: Int = 0): String`: `share` of a whole as a share of a hundred: `0.256` as `26%`, as `%26` in Turkish, and `1.0` as `100%`. `fractionDigits` are those of the number before the sign: `0.256` with one is `25.6%`.
- `fun characterCount(count: Int, max: Int): String`: `Characters entered: {count} of {max}` as `Characters entered: 12 of 40`: what a screen reader says for a text field's counter, which shows digits alone.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many characters the field holds.

  `max`: how many characters it may hold.
- `fun remove(label: String): String`: `Remove {label}` as `Remove Kotlin`: what a screen reader says for the button that takes `label` out, so that a row of such buttons can be told apart.

  The name goes in as it is written, with no ending added to it, which a template could not get right in a language that inflects.
- `fun slidePosition(position: Int, count: Int): String`: `Slide {position} of {count}` as `Slide 2 of 5`: what a screen reader says for where a carousel is, which shows dots alone. `position` counts from one.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many slides the carousel has.
- `fun itemCount(count: Int): String`: `Items: {count}` as `Items: 3`: what a screen reader says for how many things a folded object or array of a JSON view holds, which shows the number alone.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many items the folded object or array holds.
- `fun findingCount(count: Int): String`: `Findings: {count}` as `Findings: 3`: what a screen reader says for the button of a diagnostics inspector, which shows the number alone. Worded, as `itemCount` is, so that no language needs the number to agree with a noun.

  `count`: how many findings the inspector holds.
- `fun overLimit(count: Int): String`: `{count} over the limit` as `12 over the limit`: what a text area's counter says, and a screen reader is told, once its text is past its limit. Worded, as `itemCount` is, so that no language needs the number to agree with a noun.

  `count`: how many characters the text is past its limit.
- `fun jsonUnreadable(line: Int, column: Int): String`: `JSON could not be read: line {line}, column {column}` as `JSON could not be read: line 3, column 14`: what a JSON view says over a text it could not read, with the place it stopped at. Both count from one.

  `line`: the line the reading stopped at.

  `column`: the column the reading stopped at.
- `fun level(level: Int): String`: `Level {level}` as `Level 2`: what a screen reader says for how deep a part of a tree is, which the eye is told by an indent. `level` counts from one: the outermost part is at the first level.
- `fun page(page: Int): String`: `Page {page}` as `Page 4`: what a screen reader says for a page's button in a pagination, which shows the number alone. `page` counts from one.
- `fun pageOf(page: Int, count: Int): String`: `Page {page} of {count}` as `Page 3 of 10`: where a pagination is, written between its two buttons where the row is too narrow for the pages' numbers. `page` counts from one.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many pages there are.
- `fun sortOrder(position: Int): String`: `Sort order {position}` as `Sort order 2`: what a screen reader says for a column's place among the columns a table is in the order of, which the header shows as a number alone. `position` counts from one.
- `fun selectRow(label: String?): String`: `Select {label}` as `Select Order 4801`: what a screen reader says for the box that chooses the row named `label`, so that a column of such boxes can be told apart. A row without a name is `selectRow` alone.

  The name goes in as it is written, with no ending added to it, which a template could not get right in a language that inflects.
- `fun rowDetails(label: String?): String`: `Details of {label}` as `Details of Order 4801`: what a screen reader says for the button that opens what the row named `label` has under it. A row without a name is `rowDetails` alone.
- `fun rowRange(first: Int, last: Int, count: Int): String`: `{first}–{last} of {count}` as `11–20 of 48`: which rows of how many a page of a table shows, for a table's foot. `first` and `last` count from one.

  `count`: how many rows the table has in all.
- `fun selectedCount(count: Int): String`: `{count} selected` as `3 selected`: how many rows of a table are chosen, for a bar of what can be done with them.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.

  `count`: how many rows are chosen.
- `fun columnWidth(label: String): String`: `Width of {label}` as `Width of City`: what a screen reader says for the end of the header of the column named `label`, where the column's width is changed. The width itself is said after it, as a number.
- `fun flowFrom(label: String): String`: `From {label}` as `From Visits`: what a sankey calls a flow that comes into a node from the node named `label`.
- `fun flowTo(label: String): String`: `To {label}` as `To Sign-ups`: what a sankey calls a flow that goes out of a node to the node named `label`.
- `fun shareOfFirst(share: String): String`: `{label} of the first` as `41.3% of the first`: a stage of a funnel as `share`, written, of the first stage.
- `fun shareOfPrevious(share: String): String`: `{label} of the previous` as `52.1% of the previous`: a stage of a funnel as `share` of the stage before it.
- `fun more(count: Int): String`: `+{count} more` as `+3 more`: what a list says in the place of the `count` rows it has no room for, as a chart's tooltip does under those it shows.

  It is worded so that no language needs the number to agree with the noun, which a template cannot do.
- `fun dateFormat(pattern: String): String`: `Enter the date as {pattern}` as `Enter the date as MM/DD/YYYY`: a date field's error for a date not whole.

  `pattern`: the order the field takes a date in, as this language writes it: `MM/DD/YYYY`.
- `fun dateBetween(start: String, end: String): String`: `Choose a day from {start} to {end}` as `Choose a day from Oct 1, 2026 to Oct 31, 2026`: a date field's error for a day outside `start` and `end`, both written.
- `fun dateFrom(start: String): String`: `Choose {start} or a later day`: a date field's error for a day before `start`, written, which has no last.
- `fun dateUntil(end: String): String`: `Choose {end} or an earlier day`: a date field's error for a day after `end`, written, which has no first.
- `fun timeFormat(pattern: String): String`: `Enter the time as {pattern}` as `Enter the time as HH:MM`: a time field's error for a time not whole.

  `pattern`: how the field takes a time, as this language writes it: `HH:MM`.
- `fun timeBetween(start: String, end: String): String`: `Choose a time from {start} to {end}` as `Choose a time from 09:00 to 18:00`: a time field's error for a time outside `start` and `end`, both written.
- `fun timeFrom(start: String): String`: `Choose {start} or a later time`: a time field's error for a time before `start`, written, which has no last.
- `fun timeUntil(end: String): String`: `Choose {end} or an earlier time`: a time field's error for a time after `end`, written, which has no first.
- `fun filesAdded(count: Int): String`: `Files added: {count}` as `Files added: 2`: how many files a drop zone took, told to a screen reader.

  `count`: how many files the drop zone took.
- `fun filesRejected(count: Int): String`: `Files not accepted: {count}` as `Files not accepted: 1`: how many it did not take.

  `count`: how many files it did not take.
- `fun fileSize(bytes: Long): String`: `bytes` as a file's size: `512 B`, `1.2 KB`, `34 MB`, and `1,2 KB` in Turkish. A size is counted by the thousand, as Android's and Apple's systems count it, and written with one digit after the mark under ten of its kind and none from ten on; one that rounds up to a thousand of its kind is one of the next, `999999` being `1 MB`. Sizes past the gigabytes are written in gigabytes.
- `fun range(first: String, last: String): String`: `{first} to {last}` as `Mar to Jul`: a stretch from the thing named `first` to the one named `last`, as the part of a chart that is in view is said.
- `fun month(month: Int): String`: The short name of the month `month` of a year, counted from one for January: `Oct` for ten. A month before the first is taken for January and one past the twelfth for December.
- `fun dayMonth(day: Int, month: Int): String`: A day of a year without its year, in this language's order and digits: `Oct 13`, and `13 Eki` in Turkish.

  `day`: the day of the month, from 1.

  `month`: the month, from 1 for January.
- `fun monthYear(month: Int, year: Int): String`: A month of a year: `Oct 2026`.

  `month`: the month, from 1 for January.

  `year`: the year.
- `fun date(day: Int, month: Int, year: Int): String`: A day: `Oct 13, 2026`, and `13 Eki 2026` in Turkish.

  `day`: the day of the month, from 1.

  `month`: the month, from 1 for January.

  `year`: the year.
- `fun clock(hour: Int, minute: Int, second: Int? = null): String`: A time of day by a clock of twenty-four hours, each part in two digits of this language's: `09:05`, and `09:05:07` where `second` is given.

  `hour`: the hour, from 0 to 23.

  `minute`: the minute, from 0 to 59.
- `fun time(hour: Int, minute: Int, second: Int? = null, is24Hour: Boolean): String`: A time of day in this language's digits, the hour `hour` counted by a clock of twenty-four: by twenty-four hours where `is24Hour`, as `clock` writes it, `22:05`; by twelve where not, the hour in no more digits than it has and the half of the day after it or before it as `twelveHourTemplate` puts it, `10:05 PM`, and `ÖS 10:05` in Turkish. Which clock is the caller's to say: a time picker's `is24Hour`.

  `minute`: the minute, from 0 to 59.

  `second`: the second, from 0 to 59, written after the minute where it is given.
- `fun longMonth(month: Int): String`: The full name of the month `month` of a year, counted from one for January: `October` for ten. A month before the first is taken for January and one past the twelfth for December, as `month` takes them.
- `fun weekday(dayOfWeek: Int): String`: The full name of the day of the week `dayOfWeek`, as ISO 8601 numbers the days: `Monday` for one and `Sunday` for seven. The days go round as the weeks do: eight is a Monday again, and nought a Sunday.
- `fun shortWeekday(dayOfWeek: Int): String`: The short name a calendar writes over the column of the day of the week `dayOfWeek`: `Mo` for one.
- `fun longMonthYear(month: Int, year: Int): String`: A month of a year by the month's full name: `October 2026`, a calendar's title.

  `month`: the month, from 1 for January.

  `year`: the year.
- `fun longDate(day: Int, month: Int, year: Int): String`: A day said in full, with the day of the week it falls on: `Saturday, October 17, 2026`, and `17 Ekim 2026 Cumartesi` in Turkish. What a screen reader hears a calendar's day as.

  `day`: the day of the month, from 1.

  `month`: the month, from 1 for January.

  `year`: the year.

Tipin kendisinde:

- `PantrixStrings.forLocale(locale: PantrixLocale): PantrixStrings`: Falls back to English for any language without a pack.

  Falling back is deliberate: an untranslated screen reader announcement is recoverable, an empty one is not.

  `locale`: the locale whose language the pack is wanted for: its primary subtag alone counts.
- `PantrixStrings.Arabic: PantrixStrings`: Pantrix's words in Arabic.
- `PantrixStrings.Turkish: PantrixStrings`: Pantrix's words in Turkish.
- `PantrixStrings.English: PantrixStrings`: English: every field's own default. A pack of another language names each field, and one it leaves out is said in English.

### LocalPantrixStrings

`import com.pantrixui.foundation.l10n.LocalPantrixStrings`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixStrings: ProvidableCompositionLocal<PantrixStrings>
```

Bileşenlerin geçerli kendi sözleri; `PantrixTheme` sağlar ve `PantrixTheme.strings` bunları okur. Bir temanın dışında `PantrixStrings.English`.

Belgelendiği sayfalar: [Dil ve sözler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/language.md)

### PantrixTimeWords

`import com.pantrixui.foundation.l10n.PantrixTimeWords`, `com.pantrixui:foundation` içinden

```kotlin
interface PantrixTimeWords
```

Zamanı sayan sözler: "Son 15 dakika", "~ 2 saat önce", "3 gün sonra".

Her söz için bir kalıp değil bir işlev: diller sayıyı, birimi ve yönü kendi sıralarına koyar, bir adın biçimi sayıya her dilin çoğul kurallarıyla uyar ve Arapça ikiyi sayı almayan bir ikil ile söyler. Her işlev sayısını dilin kendi rakamlarıyla yazar.

`English`, `Turkish` ve `Arabic` paketleriyle gelir. Kendi sözleri olan ya da dördüncü bir dili olan bir uygulama birini yazar ve sözleriyle birlikte verir: `PantrixStrings.English.copy(timeWords = MyTimeWords)`. Bir miktar birimlerin sayısıdır ve hiçbir zaman sıfırdan küçük değildir; ne yöne gittiğini söz söyler.

Üyeleri:

- `now: String`: Bir sözün içindeki "şimdi": "~ 15 dakika önceden şimdiye"nin sonu.
- `fun unit(unit: PantrixTimeUnit, count: Int): String`: Birim tek başına, `count` ile giden biçimiyle: birimler arasında bir seçimde 15'in yanındaki "dakika".

  `unit`: adı söylenen zaman birimi.
- `fun unitAgo(unit: PantrixTimeUnit, count: Int): String`: Bir sayının yanında birim ve "önce": "dakika önce".

  `unit`: adı söylenen zaman birimi.

  `count`: birimin yanında durduğu sayı; birimin biçimini o seçer: İngilizcede 1'in yanında "minute", 15'in yanında "minutes".
- `fun unitFromNow(unit: PantrixTimeUnit, count: Int): String`: Bir sayının yanında birim ve "sonra": "dakika sonra".

  `unit`: adı söylenen zaman birimi.

  `count`: birimin yanında durduğu sayı; birimin biçimini o seçer: İngilizcede 1'in yanında "minute", 15'in yanında "minutes".
- `fun last(amount: Int, unit: PantrixTimeUnit): String`: Şimdi biten bir aralık: "Son 15 dakika".

  `amount`: aralığın şimdiden geriye kaç `unit` gittiği: "Son 15 dakika"daki 15.

  `unit`: aralığın sayıldığı birim.
- `fun next(amount: Int, unit: PantrixTimeUnit): String`: Şimdi başlayan bir aralık: "Sonraki 15 dakika".

  `amount`: aralığın şimdiden ileriye kaç `unit` gittiği: "Sonraki 15 dakika"daki 15.

  `unit`: aralığın sayıldığı birim.
- `fun ago(amount: Int, unit: PantrixTimeUnit, approximate: Boolean): String`: Şimdiden önce bir an: "15 dakika önce", `approximate` olduğunda "~ 2 saat önce".

  `amount`: anın şimdiden kaç `unit` önce olduğu.

  `unit`: anın sayıldığı birim.
- `fun fromNow(amount: Int, unit: PantrixTimeUnit, approximate: Boolean): String`: Şimdiden sonra bir an: "15 dakika sonra", `approximate` olduğunda "~ 2 saat sonra".

  `amount`: anın şimdiden kaç `unit` sonra olduğu.

  `unit`: anın sayıldığı birim.
- `fun roundTo(unit: PantrixTimeUnit): String`: Bir anı yuvarlayan anahtar: "Dakikaya yuvarla".

  `unit`: bir anın yuvarlandığı birim: "Dakikaya yuvarla"daki "dakika".
- `fun roundedTo(phrase: String, unit: PantrixTimeUnit): String`: Uçları `unit`'e yuvarlanmış bir `phrase`: "Son 15 dakika, dakikaya yuvarlanmış".
- `fun range(start: String, end: String): String`: Bir aralığın iki ucu, ikisi de söze dökülmüş: "~ 15 dakika önceden şimdiye".

  `start`: aralığın başı, sözle yazılmış hâliyle: "~ 15 dakika önce".

  `end`: aralığın sonu, sözle yazılmış hâliyle: "şimdi".

Tipin kendisinde:

- `PantrixTimeWords.English: PantrixTimeWords`: Bir ad, sayı bir olmadıkça s alır: "1 minute", "0 minutes", "15 minutes".
- `PantrixTimeWords.Turkish: PantrixTimeWords`: Sayıdan sonraki ad olduğu gibi kalır: "15 dakika önce".
- `PantrixTimeWords.Arabic: PantrixTimeWords`: Bir ve iki yalnızca adla söylenir, "دقيقة" ve "دقيقتين"; 3'ten 10'a çoğul alır, "٣ دقائق"; 11'den 99'a belirtme hâlinde tekil, "١٥ يومًا"; 100 ve fazlası tekil, "١٠٠ يوم". "Yaklaşık" bir sözcüktür, "حوالي": öteki dillerin tilde yazdığı yerde.

Belgelendiği sayfalar: [Dil ve sözler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/language.md)

### PantrixLocale.textOrder

`import com.pantrixui.foundation.l10n.textOrder`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixLocale.textOrder(): Comparator<String>
```

Bu dilde iki yazının nasıl karşılaştırıldığı: o dilin okurunun bir adı aradığı sıra.

```kotlin
names.sortedWith(PantrixLocale.Turkish.textOrder()) // cam, Çay, çilek, ılık, iğne, şeker, zeytin
names.sorted()                                      // cam, iğne, zeytin, Çay, çilek, ılık, şeker
```

Kotlin iki yazıyı Unicode'un harflerine verdiği sayılarla karşılaştırır. Bu her platformda aynıdır ve hiçbir dilin alfabesi değildir: her büyük harf her küçük harften önce gelir, `ç`, `ö` ve `ş` de `z`'den sonra. Bunun yerine her platformun kendi sıralaması gelir: Android'de ve masaüstünde `java.text.Collator`, iOS'ta `NSString`'in yerelleştirilmiş karşılaştırması, tarayıcıda `Intl.Collator`.

Yalnızca büyüklüğü küçüklüğü farklı olan harfler eşit sayılır; böylece `ada` ile `Ada` yan yana durur ve eşitleri oldukları gibi bırakan bir sıralama, `sortedWith` gibi, onları geldikleri sırada bırakır. Aksanlı bir harf aksansızından ayırt edilir. Rakamlar harfler gibi karşılaştırılır: `10`, `9`'dan önce gelir; sayılardan oluşan bir yazı bununla değil, sayılarıyla sıralanır.

Sıra platformundur, ve platformlar her dilin her harfinde anlaşmaz: burada sıralanan bir liste ile bir sunucunun sıraladığı bir iki harfte ayrılabilir. Tam da bir sunucunun sırasında olması gereken listeyi sunucu sıralar.

Dönen şeyi sakla: bir tane kurmak bedava değildir ve bir sıralama ona binlerce kez sorar. Bir bileşimde onu `rememberTextOrder` saklar.

Belgelendiği sayfalar: [Data Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/data-table.md)

### rememberTextOrder

`import com.pantrixui.foundation.l10n.rememberTextOrder`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberTextOrder(locale: PantrixLocale = PantrixTheme.locale): Comparator<String>
```

`locale`'in `textOrder`'ı, dil aynı kaldıkça saklanır: söylenmedikçe temanın kendi dili.

```kotlin
val order = rememberTextOrder()
val sorted = remember(names, order) { names.sortedWith(order) }
```

Parametreler:

- `locale: PantrixLocale`

Belgelendiği sayfalar: [Data Table](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/data-table.md)

## Paket com.pantrixui.foundation.overlay

### PantrixPortal

`import com.pantrixui.foundation.overlay.PantrixPortal`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixPortal(content: @Composable () -> Unit)
```

`content`'i bunun çağrıldığı yerde değil, pencerenin bir kökünde kurar: pencerenin üstünde kendi başına bir katman olarak gösterilenin yeri, bir `Popup` ya da bir `Dialog`.

Böyle bir katman pencere ölçülürken kompozisyondan çıkmamalıdır. Ölçerken kuran bir düzen, `BoxWithConstraints` ya da uyarlanabilir kutu, yeri bir eşiği geçince içeriğini bir ölçüm geçişinin ortasında atar. Compose Desktop ve web o zaman az önce kapattıkları bir katmanı ölçmeyi sürdürür ve uygulama `IllegalArgumentException: RootNodeOwner is already disposed` ile çöker. Bir portaldan geçen katmanı hiçbir ölçüm geçişinin kurmadığı kök kurar: çağıran atıldığında katman o kare için yine oradadır ve bir sonrakinin kompozisyonunda çıkar.

`content` çağıranın kompozisyon yerelleriyle kurulur, uygulamanınkinin içindeki bir tema da onlardan biridir, ve çağrı sürdükçe kurulu kalır. Hatırladığı ve sakladığı, yerinde olsa nasıl tutulacaksa öyle tutulur. Onu kök, kökün üst baş köşesinde yerleştirir: oraya yalnızca kendini pencerede yerleştiren, bir popup ve bir dialog gibi, aittir.

Kök en dıştaki `PantrixTheme`'inkidir. Bir katman açıldığı pencereye aittir; penceresinde böyle bir kök olmayan bir çağıran `content`'i bu yokmuş gibi yerinde kurar: çevresinde tema olmayan içerik, ve Android'de bir dialog'un ya da bir popup'ın tuttuğu, orada kendi başına bir pencere olan ve hiçbir ölçüm geçişinin zarar vermediği içerik.

Parametreler:

- `content: @Composable () -> Unit`

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### PantrixTransient

`import com.pantrixui.foundation.overlay.PantrixTransient`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixTransient(
    shown: Boolean,
    onDismiss: () -> Unit
)
```

Bir şeyin pencerenin üstünde kendiliğinden çıktığını söyler, bir tooltip gibi: kimsenin açmadığı, odak almayan ve geldiği kadar hafifçe gitmesi gereken bir şey. `shown` iken:

- **Escape onu kaldırır**, odak pencerenin neresinde olursa olsun. Tuş onun için basılmıştır ve öteye gitmez: ne bir kontrole ne onu geri diye duyacak bir sahibe. Bir işaretçinin ya da odağın çıkardığı şey ikisini de oynatmadan kapanır (WCAG 1.4.13).

- **Sonraki onu kaldırır.** Bir pencerede bir anda böyle bir şey gösterilir: işaretçi başka bir yerde dururken klavyenin odağının çıkardığı ikincisi birincinin yerini alır.

İki durumda da `onDismiss` çağrılır ve çağıran onu göstermeyi bırakır.

Escape pencerenin içeriğinin bir kökünde duyulur: en dıştaki `PantrixTheme`'inkinde, ve kendi başına bir pencere ya da katman olan bir katmanda `pantrixTransientsRoot` taşıyan öğede. Bir tuş, odak kökün altında neredeyse oradan köke ulaşır. Bir kökün altında hiçbir şey odakta değilken bir tuş orada hiçbir şeye ulaşmaz; kök, her platformun izin verdiği gibi, Escape'in o zaman da duyulmasını sağlar.

Parametreler:

- `shown: Boolean`: çıkıp çıkmadığı.
- `onDismiss: () -> Unit`: Escape için, ve pencerede kendiliğinden çıkan başka bir şey belirince çağrılır.

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### Modifier.pantrixTransientsRoot

`import com.pantrixui.foundation.overlay.pantrixTransientsRoot`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.pantrixTransientsRoot(): Modifier
```

Bu öğeyi pencerenin kendiliğinden çıkanları için Escape'in duyulduğu bir kök yapar: altında herhangi bir yerde basılan tuş, bu öğenin altındaki herhangi bir kontrol duymadan `PantrixTransient`'in gösterildiğini söylediğini kaldırır ve öteye gitmez. Gösterilen bir şey yokken tuş bu öğenin değildir ve bu yokmuş gibi yoluna devam eder.

En dıştaki `PantrixTheme` uygulamanın kendi içeriği için böyle bir köktür. Klavyeyi kendisine alan bir katman, bir dialog ya da bir popover, bunu gösterdiğini tutan öğeye koyar: içinde basılan bir tuş altındaki uygulamanın hiçbir şeyine ulaşmaz. Uygulamanın kendi katmanı o öğeye `com.pantrixui.foundation.testing.pantrixAutomationRoot`'u da koyar: Android'de kendi başına bir penceredir, temanın işareti oraya ulaşmaz; test etiketleri platformun otomasyonuna bu işaretle ulaşır.

Bir tuş odağı olan kontrole ve çevresindekilere ulaşır. Hiçbir kontrolün odakta olmadığı bir kökün altında, bir işaretçinin açtığı bir dialog'daki gibi, bir tuş hiçbir şeye ulaşmaz ve bir katman Escape'i kendisine alıp kapanır. Escape orada da önce çıkanı kaldırsın diye:

- masaüstünde, web'de ve iOS'ta bir şey çıkmışken ve altında hiçbir şey odakta değilken odağı kökün kendisi tutar. Kendi başına bir durak değildir ve bundan bir şey göstermez. Masaüstünde yalnızca sahnenin kendi bileşeni pencerenin klavyesini tutarken ister: pencerenin sahnenin yanında ya da içinde tuttuğu hiçbir Swing bileşeninden klavyeyi almaz. Web'de sayfada da dinler: sayfaya verilen ama tuvaline verilmeyen bir tuş için.

- Android'de kök, penceresinde hiçbir şeyin almadığı tuşları dinler. Orada bir katman kendi başına bir penceredir. Bir dialog'un penceresi Escape'i kendisine almadan önce dinleyicilerine sorar: çıkan gider, dialog kalır. Geri tuşunun kapattığı bir popover'ın penceresi Escape'i, gösterdiği hiçbir şeye sorulmadan önce alır: hemen kapanır ve içinde çıkan da onunla gider.

Kök aynı zamanda altından açılan katmanların kullanıcının nerede olduğunu duyduğu yerdir: altındaki son basış, ve o basıştan sonra bir tuşa basıldıysa altında odağı tutan denetim. Katlanabilir bir cihazda bir dialog kat yerinin açıldığı yarısında açılır (`OverlayWindow.openedFrom`). Kök her basışa ve her tuşa altındakilerden önce bakar, hiçbirini almaz.

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

## Paket com.pantrixui.foundation.platform

### HapticType

`import com.pantrixui.foundation.platform.HapticType`, `com.pantrixui:foundation` içinden

```kotlin
enum class HapticType
```

Bir dokunsalın ne söylediği, hangi motor deseninin çalınacağı değil.

Değerleri:

- `Selection`: Seçenekler arasında gezinmek: bir radyo grubu, bir kaydırıcının bir çentiği, bir segment kontrolü.
- `ToggleOn`: Açılan bir anahtar ya da işaretlenen bir onay kutusu.
- `ToggleOff`: Kapanan bir anahtar ya da işareti kaldırılan bir onay kutusu.
- `Success`: Başarılı olmuş bir eylem: gönderilen bir form, kaydedilen bir dosya.
- `Warning`: Ters gitmeden önce kullanıcının dikkatini isteyen bir şey.
- `Error`: Başarısız olmuş bir eylem ya da kabul edilmeyen bir değer.
- `Impact`: Biten bir sürükleme ya da bir yerine oturma için genel bir vuruş.
- `LongPress`: Kendi başına bir anlam taşıyacak kadar uzun tutulmuş bir basış: parmağın altında çıkan bir tooltip, tutulan bir basışın açtığı bir menü. Parmağa, kalkışının bir dokunuş olmayacağını söyler.

Belgelendiği sayfalar: [Dokunsal geri bildirim](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/haptics.md)

### PantrixHaptics

`import com.pantrixui.foundation.platform.PantrixHaptics`, `com.pantrixui:foundation` içinden

```kotlin
fun interface PantrixHaptics
```

Dokunsal geri bildirim, soyutlanmış: bileşenler platformun API çağrılarını değil, niyetlerini söyler.

Masaüstünün ve web'in dokunsalı yoktur ve `NoOp` alırlar; bu sonra doldurulacak bir boşluk değil, doğru davranıştır ve bileşenlerin bunu koşulsuz çağırabilmesi de bundandır.

Üyeleri:

- `fun perform(type: HapticType)`: Platformun `type` için desenini çalar; platformun deseni olmayan yerde bir şey çalmaz.

Tipin kendisinde:

- `PantrixHaptics.NoOp: PantrixHaptics`: Dokunsal geri bildirimi olmayan bir platformun dokunsal geri bildirimi: masaüstünün ve web'in aldığı.

Belgelendiği sayfalar: [Dokunsal geri bildirim](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/haptics.md)

### rememberPlatformHaptics

`import com.pantrixui.foundation.platform.rememberPlatformHaptics`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPlatformHaptics(): PantrixHaptics
```

Bu platformun dokunsalları: Android'de ve iOS'ta cihazın kendisi, masaüstünde ve web'de `PantrixHaptics.NoOp`.

Belgelendiği sayfalar: [Dokunsal geri bildirim](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/haptics.md)

### LocalPantrixHaptics

`import com.pantrixui.foundation.platform.LocalPantrixHaptics`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixHaptics: ProvidableCompositionLocal<PantrixHaptics>
```

Geçerli dokunsal geri bildirim; `PantrixTheme` sağlar ve `PantrixTheme.haptics` bunu okur. Bir temanın dışında `PantrixHaptics.NoOp`.

Belgelendiği sayfalar: [Dokunsal geri bildirim](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/haptics.md)

### numberKeyboardOptions

`import com.pantrixui.foundation.platform.numberKeyboardOptions`, `com.pantrixui:foundation` içinden

```kotlin
fun numberKeyboardOptions(
    imeAction: ImeAction = ImeAction.Default,
    decimal: Boolean = false
): KeyboardOptions
```

Sayı yazılan bir alanın klavyesi; `imeAction` klavyenin bir tuşundadır.

Sayı alanı `KeyboardType.Number` ister; sayı yazılınca yapacak bir şeyi varsa, bir sayfayı açmak ya da sonraki alana geçmek gibi, yanında bir `ImeAction` da ister. Android'de sayı klavyesinin eylem için bir tuşu vardır, tuşlu bir klavyede de Enter. iPhone'un sayı tuş takımında ikisi de yoktur: on rakam ve bir silme tuşu. Eylemin orada tuşu yoktur ve yazılan hiçbir zaman gönderilemez (simülatörde görüldü, Compose Multiplatform 1.12.1).

Bu yüzden iOS'ta eylemi olan bir sayı, sayılar ve noktalama klavyesinde yazılır: rakamlarıyla açılır ve eylemi gösteren bir return tuşu vardır. O klavye yazı yazmak içindir: düzeltme kapalı olarak istenir, bu da tuşlarının üstünde önerdiği sözcük çubuğunu kaldırır. İşaretleri ve, bir basış ötede, harfleri de yazılabilir; sayı olmayanı alanın kendisi dışarıda tutar, bir `InputTransformation` ile olduğu gibi. Eylemi olmayan bir sayının (`ImeAction.Default`, `ImeAction.None`) sayı tuş takımında bir eksiği yoktur ve iOS'ta da onu alır.

Başka her yerde seçenekler istenen tür ve istenen eylemdir, fazlası değil.

Bütünü docs/guide/number-keyboard/NUMBER_KEYBOARD_GUIDE.md'dedir; bu kütüphaneyi kullanmayan bir proje için aynısı da orada.

Parametreler:

- `imeAction: ImeAction`: Klavyenin eylem tuşunun yaptığı ve gösterdiği: `ImeAction.Go`, `ImeAction.Next`, `ImeAction.Done`.
- `decimal: Boolean`: Sayının kesirli olup olmadığı: `KeyboardType.Number` yerine `KeyboardType.Decimal`, bu da sayı tuş takımına bir ondalık ayırıcı koyar.

Belgelendiği sayfalar: [Text Field](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/text-field.md)

### OperatingSystem

`import com.pantrixui.foundation.platform.OperatingSystem`, `com.pantrixui:foundation` içinden

```kotlin
enum class OperatingSystem
```

`currentOperatingSystem`'in bildirdiği bir işletim sistemi. Platformun geometrisinin karar vermediğini belirler: bir kısayolun Command ile mi Control ile mi başladığı gibi.

Değerleri:

- `Android`: Android: bir telefonda, bir tablette ya da katlanabilir bir cihazda.
- `Ios`: iOS ve iPadOS.
- `MacOs`: macOS: klavye kısayollarının başında Command tuşu durur.
- `Windows`: Windows: klavye kısayollarının başında Control tuşu durur.
- `Linux`: Linux, ChromeOS ve burada sayılmayan her sistem.

Üyeleri:

- `isApple: Boolean`: Sistemin, klavye kısayollarının Command tuşuyla başladığı Apple sistemlerinden biri olup olmadığı.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md), [Klavye kısayolları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### LocalOperatingSystem

`import com.pantrixui.foundation.platform.LocalOperatingSystem`, `com.pantrixui:foundation` içinden

```kotlin
val LocalOperatingSystem: ProvidableCompositionLocal<OperatingSystem>
```

Bir kompozisyonun üstünde yazıldığı işletim sistemi: bir test ya da önizleme başkasını vermedikçe `currentOperatingSystem`. Klavye kısayollarının neyle başladığını, Command'la mı Control'le mi, ve nasıl yazıldıklarını o belirler.

Belgelendiği sayfalar: [Klavye kısayolları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### ClipboardTraits

`import com.pantrixui.foundation.platform.ClipboardTraits`, `com.pantrixui:foundation` içinden

```kotlin
data class ClipboardTraits(
    val writable: Boolean = true,
    val announcedBySystem: Boolean = false
)
```

Bir platformun panosunun, ona kopyalayan için nasıl olduğu: bir kopyalama düğmesi bir şey söylemeden önce sorar.

Parametreler:

- `writable: Boolean`: Yazılacak bir pano olup olmadığı. Güvenli bir bağlamda, makinenin kendisinden başka bir yerden düz http ile sunulmayan bir web sayfasının yoktur: tarayıcı böyle bir sayfaya pano vermez. Ekransız çalışan bir JVM'in de yoktur. Compose ikisine de bir yazmayı hatasız atlar.
- `announcedBySystem: Boolean`: Panoya konanı sistemin kendisinin gösterip göstermediği. Android 13. sürümden itibaren gösterir ve uygulamadan bunu ikinci kez söylememesini ister.

Belgelendiği sayfalar: [Pano](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### currentClipboardTraits

`import com.pantrixui.foundation.platform.currentClipboardTraits`, `com.pantrixui:foundation` içinden

```kotlin
fun currentClipboardTraits(): ClipboardTraits
```

Bu platformun panosu, sorulduğu andaki hâliyle: bir tarayıcınınki sayfasının nasıl sunulduğuna bağlıdır.

Belgelendiği sayfalar: [Pano](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### LocalClipboardTraits

`import com.pantrixui.foundation.platform.LocalClipboardTraits`, `com.pantrixui:foundation` içinden

```kotlin
val LocalClipboardTraits: ProvidableCompositionLocal<ClipboardTraits>
```

Bir `PantrixClipboard`'ın uyduğu huy. Başkası verilmedikçe platformun kendisininki: bir test burada başka bir platformunkini verir, `LocalClipboard` ile kendi panosunu verdiği gibi.

Belgelendiği sayfalar: [Pano](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### PantrixClipboard

`import com.pantrixui.foundation.platform.PantrixClipboard`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixClipboard
```

Pano, düz metin için.

Compose'un kendi panosu, `LocalClipboard`, üstüne konanı her platformun kendi türüyle alır: Android'de bir `ClipData`, masaüstünde bir `Transferable`, iOS'ta ve tarayıcıda Compose'un kendi bir biçimi. Bir metni kopyalamanın ortak bir yolu yoktur; bu öyle bir yoldur: platformun aldığını kurar, oraya koyar ve oraya varıp varmadığını söyler.

```kotlin
val clipboard = rememberPantrixClipboard()
val snackbars = LocalPantrixSnackbars.current
val scope = rememberCoroutineScope()
PantrixButton(
    text = stringResource(Res.string.copy_link),
    onClick = {
        scope.launch {
            val copied = clipboard.copyText(link, label = linkLabel)
            // A system that shows the copy itself is not echoed.
            if (!copied || !clipboard.traits.announcedBySystem) snackbars?.show(if (copied) done else failed)
        }
    }
)
```

Parametreler:

- `traits: ClipboardTraits`: Bu platformun panosunun nasıl olduğu: yazılıp yazılamadığı ve sistemin bir kopyayı kendisi gösterip göstermediği.

Üyeleri:

- `suspend fun copyText(text: String, label: String = ""): Boolean`: `text`'i panoya düz metin olarak, orada olanın yerine koyar.

  `text`: kopyalanan.

  `label`: metnin ne olduğu, uygulamanın dilinde: `"Bağlantı"`, `"Kod"`. Yalnızca Android taşır ve kopyanın sistemin kendi önizlemesinde gösterebilir.

  Döndürdüğü: metnin panoya konup konmadığı. Yazılacak bir pano olmayan yerde ve platformun yazmayı reddettiği yerde false'tur: okuyanın izin vermediği bir tarayıcı gibi.

Belgelendiği sayfalar: [Pano](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### rememberPantrixClipboard

`import com.pantrixui.foundation.platform.rememberPantrixClipboard`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixClipboard(): PantrixClipboard
```

Düz metin için pano, platformun kendisinin üstünde: `LocalClipboard`'ın verdiği, `LocalClipboardTraits`'in huyuyla.

Belgelendiği sayfalar: [Pano](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/clipboard.md)

### PantrixPointerIcons

`import com.pantrixui.foundation.platform.PantrixPointerIcons`, `com.pantrixui:foundation` içinden

```kotlin
object PantrixPointerIcons
```

Sürüklenince bir şeyi büyüten ya da küçülten bir denetimin imleç şekilleri: iki panelin arasındaki tutamaç, bir tablo kolonunun ucu, bir panelin kenarı. Compose'un kendi `PointerIcon`'unda her platformda dört şekil vardır, ok, artı imleci, metin imleci ve el; bunlar onların arasında yoktur. Her platformda kendi adlarıyla bulunurlar; bu nesne onları tek adla verir.

```kotlin
Box(Modifier.pointerHoverIcon(PantrixPointerIcons.ResizeHorizontal).draggable(…))
```

Android'de sistemin çift okudur, fareyle görünür; masaüstünde AWT'nin boyutlandırma imleci; tarayıcıda CSS'in `col-resize` ya da `row-resize` dediği imleç. Compose iOS'ta hiçbir imleci şekillendirmez, kendi dördünü bile; iPad'in imleci orada kendi şeklini korur. Parmağın altında şekillendirilecek bir imleç yoktur, bir şey değişmez.

Tamamı docs/guide/pointer-icons/POINTER_ICONS_GUIDE.md'dedir; bu kütüphane olmadan aynısı da oradadır.

Üyeleri:

- `ResizeHorizontal: PointerIcon`: Yana sürüklenip bir şeyi genişleten ya da daraltan bir denetimin üstünde: iki panelin arasındaki tutamaç.
- `ResizeVertical: PointerIcon`: Yukarı aşağı sürüklenip bir şeyi uzatan ya da kısaltan bir denetimin üstünde: bir panelin üstündeki tutamaç.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### PantrixWindowTitle

`import com.pantrixui.foundation.platform.PantrixWindowTitle`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixWindowTitle(title: String)
```

Pencereye, o ekran kompozisyonda kaldıkça, içinde gösterilen ekranın adını verir: web'de tarayıcı sekmesinin başlığı, masaüstünde başlık çubuğununki. Tek pencereli, çok ekranlı bir uygulama yoksa ne gösterilirse gösterilsin açıldığı adı taşır: tarayıcının her sekmesi uygulamanın adını söyler, geçmişinin her girdisi de.

```kotlin
PantrixWindowTitle(stringResource(Res.string.orders))
```

- **Nasıl yazılır.** `LocalPantrixWindowTitleFormat` `title`'ı pencereninki olarak yazar: bir uygulama onu bir kez, kökünde verir ve kendi adını her ekranınkinin ardına koyar, `Siparişler · Yönetim`.

- **Aynı anda birkaç.** Biri ötekinin üstüne kayarken iki ekran kompozisyonda birliktedir, yan yana bir liste ve ayrıntısı da: pencereye en son gelen ad verir. O çıkınca ondan öncesi yine ad verir; hiçbiri kalmayınca pencerenin kendi başlığı geri gelir, web'de sayfanın `<title>`'ı, masaüstünde `Window`'una verilen.

- **Android ve iOS.** İkisi de kullanıcısına bir pencere başlığı göstermez: orada bir şey yapmaz.

Tamamı docs/guide/window-title/WINDOW_TITLE_GUIDE.md'dedir; bu kütüphane olmadan aynısı da oradadır.

Parametreler:

- `title: String`: ekranın adı, kendi başlığının söylediği gibi: `Siparişler`.

Belgelendiği sayfalar: [Page Scaffold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/page-scaffold.md)

### PantrixWindowTitleFormat

`import com.pantrixui.foundation.platform.PantrixWindowTitleFormat`, `com.pantrixui:foundation` içinden

```kotlin
fun interface PantrixWindowTitleFormat
```

Bir ekranın başlığının penceresininki olarak nasıl yazıldığı: `PantrixWindowTitleFormat { "$it · Admin" }` uygulamanın adını ardına koyar. Bir uygulama onu `LocalPantrixWindowTitleFormat` ile verir.

Üyeleri:

- `fun format(title: String): String`: Adı `title` olan bir ekran için pencerenin başlığı.

Tipin kendisinde:

- `PantrixWindowTitleFormat.Plain: PantrixWindowTitleFormat`: Ekranın başlığı olduğu gibi: bir uygulama başka bir biçim vermedikçe pencerenin adı.

Belgelendiği sayfalar: [Page Scaffold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/page-scaffold.md)

### LocalPantrixWindowTitleFormat

`import com.pantrixui.foundation.platform.LocalPantrixWindowTitleFormat`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixWindowTitleFormat: ProvidableCompositionLocal<PantrixWindowTitleFormat>
```

`PantrixWindowTitle`'ın bir ekranın başlığını penceresininki olarak nasıl yazdığı: verilmezse `PantrixWindowTitleFormat.Plain`.

Belgelendiği sayfalar: [Page Scaffold](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/page-scaffold.md)

### currentPlatformType

`import com.pantrixui.foundation.platform.currentPlatformType`, `com.pantrixui:foundation` içinden

```kotlin
fun currentPlatformType(): PlatformType
```

Kodun gerçekte hangi platformda çalıştığı.

Bu yalnızca `PantrixTheme(platform = ...)`'nın *varsayılanıdır*. Onu ezmek desteklenen ve amaçlanan bir şeydir: bir önizleme masaüstünde iOS geometrisini böyle gösterir, bir ürün her yerde tek bir görünüşü böyle yayınlar.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### currentOperatingSystem

`import com.pantrixui.foundation.platform.currentOperatingSystem`, `com.pantrixui:foundation` içinden

```kotlin
fun currentOperatingSystem(): OperatingSystem
```

Kodun çalıştığı işletim sistemi; tarayıcıda, tarayıcının çalıştığı sistem.

`currentPlatformType` gibi bir tema varsayılanı değildir: masaüstündeki bir iOS geometrisi önizlemesi yine masaüstünün sisteminde çalışır ve masaüstünün klavyesiyle yazılır.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md), [Klavye kısayolları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shortcuts.md)

### systemIsInHighContrast

`import com.pantrixui.foundation.platform.systemIsInHighContrast`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemIsInHighContrast(): Boolean
```

İşletim sisteminin "karşıtlığı artır" erişilebilirlik ayarı.

Koyu tema bu dosyada bilerek yoktur: Compose Multiplatform ortak kodda `isSystemInDarkTheme()`'i zaten verir ve onu her platform için yeniden yazmak, kaynağında bakımı yapılan bir şeyin daha kötü bir kopyası olurdu.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### systemPointerIsTouch

`import com.pantrixui.foundation.platform.systemPointerIsTouch`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemPointerIsTouch(): Boolean
```

Sistemin dokunmayla kullanılıp kullanılmadığı: ana işaretçisi, fareden daha az kesin olan ve daha büyük bir hedef isteyen bir parmaktır.

Android'de ve iOS'ta her zaman true'dur, JVM'in dokunmatik bir ekrandan bir şey söylemediği masaüstünde her zaman false. Bir tarayıcı iki tür cihazda da çalışır: orada `pointer: coarse` ortam sorgusudur; bir telefonda ve bir tablette true, üstünde dokunmatik ekran olsun olmasın bir dizüstünde false'tur ve değiştikçe izlenir.

`rememberPantrixPlatform` aracılığıyla `PantrixPlatform.isTouch`'ı, onunla da bir tarayıcının aldığı dokunma alanını besler.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### systemReduceMotion

`import com.pantrixui.foundation.platform.systemReduceMotion`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemReduceMotion(): Boolean
```

İşletim sisteminin "hareketi azalt" ayarı.

Her süreyi sıfıra indiren `PantrixMotion.reduceMotion`'ı besler. Bileşenler bunu hiçbir zaman kendileri denetlemez; `motion.duration(...)`'a sorarlar; böylece ayara uymak, her bileşenin hatırlaması gereken bir kural değil tek bir karardır.

Belgelendiği sayfalar: [Hareket](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md), [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### systemDifferentiatesWithoutColor

`import com.pantrixui.foundation.platform.systemDifferentiatesWithoutColor`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemDifferentiatesWithoutColor(): Boolean
```

Sistemin şeyleri renklerinden fazlasıyla ayırmaya ayarlı olup olmadığı: iOS'un "Renksiz Ayırt Et"i ve Android'de renk körü bir kullanıcının açtığı renk düzeltmesi.

Böyle bir ayardan bir şey söylemeyen masaüstünde ve tarayıcıda her zaman false'tur. Stili onları sisteme bıraktığında bir grafiğin desenlerini besler: bir sonrakinden yalnızca rengiyle ayrılan bir seri bir dokuyla da ayrılır.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

### systemPantrixLocale

`import com.pantrixui.foundation.platform.systemPantrixLocale`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun systemPantrixLocale(): PantrixLocale
```

İşletim sisteminin dili, yazı yönüyle birlikte.

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

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

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md), [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md)

### systemUtcOffset

`import com.pantrixui.foundation.platform.systemUtcOffset`, `com.pantrixui:foundation` içinden

```kotlin
fun systemUtcOffset(moment: Instant): Duration
```

Cihazın saatinin `moment` anında UTC'den ne kadar ileride olduğu: İstanbul'da üç saat, Greenwich'in batısında sıfırdan az. Bir an için sorulur, çünkü saatlerin yaz için ileri alındığı yerlerde değişir.

Elde bir saat dilimi kütüphanesi yokken bir günün ve günün bir saatinin hesaplandığı şey: bir an ve bu, cihazın kendi saatinin gösterdiği günü ve saati verir. `PantrixClock.System`'in farkıdır; bir test ya da önizleme başkasını vermedikçe bir ekran o saatle okunur.

Parametreler:

- `moment: Instant`

Belgelendiği sayfalar: [Platform ve sistem](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/platform.md)

## Paket com.pantrixui.foundation.primitives

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

Belgelendiği sayfalar: [Göster ve gizle](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/adaptive-visibility.md)

### Modifier.thenIfElse

`import com.pantrixui.foundation.primitives.thenIfElse`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.thenIfElse(
    condition: Boolean,
    ifTrue: Modifier.() -> Modifier,
    ifFalse: Modifier.() -> Modifier
): Modifier
```

Bu değiştirici: `condition` tuttuğunda `ifTrue` uygulanmış, tutmadığında `ifFalse`.

Parametreler:

- `condition: Boolean`
- `ifTrue: Modifier.() -> Modifier`
- `ifFalse: Modifier.() -> Modifier`

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### PantrixPressIndication

`import com.pantrixui.foundation.primitives.PantrixPressIndication`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixPressIndication(
    private val pressColor: Color = Color.Black,
    private val pressAlpha: Float = 0.1f
) : IndicationNodeFactory
```

Bir kontrolün basışı aldığını kişiye söyleyen geri bildirim, dalga efektinin yerine: kontrol basılı kaldıkça `pressColor` ile örtülür ve bırakılınca örtü kaybolur.

Basış hemen görünür. Bırakış, örtü solmadan önce basışın bitmesini bekler; böylece en kısa dokunuş bile görülür. İptal edilen bir basış, yani kayıp giden bir parmak ya da hareketi bir kaydırmanın alması, hemen solar.

Parametreler:

- `pressColor: Color`: Kontrol basılıyken üstüne konan renk: verilmezse siyah.
- `pressAlpha: Float`: O rengin tam bir basıştaki gücü, 0 ile 1 arasında: verilmezse 0.1.

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### pantrixPressIndication

`import com.pantrixui.foundation.primitives.pantrixPressIndication`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun pantrixPressIndication(pressAlpha: Float = 0.1f): PantrixPressIndication
```

Geçerli temanın basış göstergesi: kontrolü açık bir zeminde koyulaştırır, koyu bir zeminde açar; böylece basış ikisinde de görülür.

Parametreler:

- `pressAlpha: Float`: Örtünün tam bir basıştaki gücü, 0 ile 1 arasında: verilmezse 0.1.

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### pantrixPressIndicationWithColor

`import com.pantrixui.foundation.primitives.pantrixPressIndicationWithColor`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun pantrixPressIndicationWithColor(
    pressColor: Color,
    pressAlpha: Float = 0.1f
): PantrixPressIndication
```

Temanın değil çağıranın seçtiği bir renkte basış göstergesi. `pantrixPressIndication` temayı izler.

Parametreler:

- `pressColor: Color`: Kontrol basılıyken üstüne konan renk.
- `pressAlpha: Float`: O rengin tam bir basıştaki gücü, 0 ile 1 arasında: verilmezse 0.1.

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

## Paket com.pantrixui.foundation.testing

### Modifier.pantrixAutomationRoot

`import com.pantrixui.foundation.testing.pantrixAutomationRoot`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.pantrixAutomationRoot(): Modifier
```

Altındaki test etiketlerini platformun arayüz otomasyonuna açar: bir Maestro akışı, UI Automator ya da XCUITest bir bileşeni her dilde etiketiyle, `Button_save` diye bulur.

Android'de bir etiket, ancak bunu söyleyen bir öğenin altında öğenin kaynak kimliği (resource id) olur ve her pencerenin kendi öğeleri vardır: uygulamanın penceresi için bunu en dıştaki `PantrixTheme` söyler, Pantrix'in kendi dialog'ları, sheet'leri, menüleri ve popover'ları da kendi pencereleri için. Uygulamanın kendi açtığı bir pencere, bir `Popup` ya da bir `Dialog`, ikisinin de erişiminin dışındadır: gösterdiği şey bunu kendi köküne koyar ve etiketleri otomasyona uygulamanınkiler gibi ulaşır. iOS'ta Compose bir etiketi otomasyona erişilebilirlik kimliği olarak kendisi verir; masaüstünde ve web'de bir test anlam ağacını okur: oralarda bu bir şey değiştirmez.

Altındaki her test etiketini açar, uygulamanın kendi `Modifier.testTag`'ini de. Temanın Pantrix'in etiketlerini anlam ağacının dışında tuttuğu yerde (`TestTagPolicy.Off`) açılacak öyle bir etiket yoktur.

Belgelendiği sayfalar: [Yapı taşları](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/building-blocks.md)

### TestTagPolicy

`import com.pantrixui.foundation.testing.TestTagPolicy`, `com.pantrixui:foundation` içinden

```kotlin
enum class TestTagPolicy
```

Bileşenlerin otomasyon etiketlerini, testlerin ve platformun arayüz otomasyonunun onları bulduğu semantik ağaca koyup koymadığı ve bir etiketi neyden kurdukları.

Değerleri:

- `Stable`: Anahtar: `tagKey`, ya da forma bağlı biçimlerde alanın kimliği; yoksa çağrının yerinin anahtarı.
- `Off`: Pantrix semantik ağaca hiçbir etiket koymaz. Bileşen etiketini yine bilir ve analitik olayları onu taşır: etiketlerini ağacın dışında tutan bir yayın sürümü olaylarını yine birbirinden ayırır. Uygulamanın kendisinin koyduğu bir `Modifier.testTag` etkilenmez: bir yayın sürümü, bir dış aracın dayandığı birkaç etiketi böyle korur.

Belgelendiği sayfalar: [Test etiketleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### LocalTestTagPolicy

`import com.pantrixui.foundation.testing.LocalTestTagPolicy`, `com.pantrixui:foundation` içinden

```kotlin
val LocalTestTagPolicy: ProvidableCompositionLocal<TestTagPolicy>
```

Buradaki bileşenlerin otomasyon etiketlerini semantik ağaca koyup koymadığı: `PantrixTheme(testTagPolicy = …)`. Okuyanlar onu izler: çevresindeki politika değişince bir etiketin düğümü etiketini ağaçtan çıkarır ya da geri koyar.

Belgelendiği sayfalar: [Test etiketleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### LocalTestScope

`import com.pantrixui.foundation.testing.LocalTestScope`, `com.pantrixui:foundation` içinden

```kotlin
val LocalTestScope: ProvidableCompositionLocal<String?>
```

Dıştaki `TestScope` zinciri, örneğin `Checkout.PaymentForm`.

Belgelendiği sayfalar: [Test etiketleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### TestScope

`import com.pantrixui.foundation.testing.TestScope`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun TestScope(
    name: String,
    content: @Composable () -> Unit
)
```

Bir ekranı ya da bölümü adlandırır, içindeki etiketler bu adla nitelenir: `TestScope("LoginScreen") { ... }`.

İç içe bölümler birleşir: bir test düştüğünde etiket, okuyanın bileşenin ağaçta nerede durduğunu bilmesine gerek kalmadan okunur.

Parametreler:

- `name: String`: ekranın ya da bölümün adı; içindeki etiketlerin önüne konur: `LoginScreen.Button_save`.
- `content: @Composable () -> Unit`: bileşenlerinin etiketlerini `name`'in nitelediği ekran ya da bölüm.

Belgelendiği sayfalar: [Test etiketleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### rememberPantrixTestTag

`import com.pantrixui.foundation.testing.rememberPantrixTestTag`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixTestTag(
    component: String,
    tagKey: String? = null
): String
```

Bir bileşenin otomasyon etiketini üretir: `Scope.Component_key`.

Anahtar `tagKey`'dir (forma bağlı biçimler alanlarının kimliğini verir); verilmezse çağrının yerinin anahtarı: `Scope.Component#1k3z9`. **Görünen yazı hiçbir zaman kaynak değildir**: çevrilen yazıdan türetilen bir etiket uygulama başka bir dilde çalışınca değişir ve ikinci bir dil yayınlandığı an her otomasyon takımını sessizce bozar.

Hazır bir etiket için bilerek bir parametre yoktur. Bir dış takımın zaten kullandığı bir kimliğe uyması gereken çağıran onu bileşenin `modifier`'ında Compose'un kendi `Modifier.testTag`'iyle verir; o, semantik ağaçta bu etiketin yerine geçer.

Etiket, `TestTagPolicy` ne olursa olsun kurulur: bileşenin analitik olayları onu iki durumda da taşır; `pantrixTestTag` onu semantik ağaca yalnızca politika `TestTagPolicy.Stable`'ken koyar.

Parametreler:

- `component: String`: bileşenin adı, örneğin `Button`
- `tagKey: String?`: dilden bağımsız bir geliştirici anahtarı, örneğin `save`: küçük harflerle ve rakamlarla yazılır, etiket ilk `MAX_TAG_KEY_LENGTH` karakterini taşır. Bunun üstüne kurulan bir kontrolün anahtarı `derivedTagKey` ile yapılır.

Belgelendiği sayfalar: [Test etiketleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### pantrixTestTagOf

`import com.pantrixui.foundation.testing.pantrixTestTagOf`, `com.pantrixui:foundation` içinden

```kotlin
fun pantrixTestTagOf(
    component: String,
    tagKey: String,
    scope: String? = null
): String
```

`tagKey` verilen bir bileşenin `scope` içinde taşıdığı otomasyon etiketi: bir testin ya da platformun arayüz otomasyonundaki bir akışın onu bulduğu şey. `save` verilen bir `Button` `Button_save`'dir, `TestScope("Checkout")` içinde `Checkout.Button_save`. `rememberPantrixTestTag` anahtarlı bir etiketi bununla kurar: burada kurulan etiket, bileşenin taşıdığı etikettir.

Parametreler:

- `component: String`: bileşenin adı, örneğin `Button`.
- `tagKey: String`: bileşene verilen anahtar, çağıranın yazdığı gibi: etiket onu, bileşenin yaptığı gibi küçük harflerle ve rakamlarla yazar.
- `scope: String?`: bileşenin içinde durduğu `TestScope` zinciri, örneğin `Checkout.PaymentForm`; birinin dışında null.

Belgelendiği sayfalar: [Test etiketleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### Modifier.pantrixTestTag

`import com.pantrixui.foundation.testing.pantrixTestTag`, `com.pantrixui:foundation` içinden

```kotlin
fun Modifier.pantrixTestTag(tag: String?): Modifier
```

`tag`'i, durduğu yerdeki `TestTagPolicy` `TestTagPolicy.Stable`'ken test etiketi olarak koyar; `TestTagPolicy.Off`'ken ya da null için hiçbir şey koymaz: semantik ağaca o zaman hiç düğüm eklenmez.

Temanın tanılaması açıkken, pencerenin iki düğümünün bir buçuk saniye boyunca taşıdığı bir etiket `PantrixCheck.DuplicateTestTag` olarak bildirilir: onu arayan bir test ikisini de bulur. Giden sayfayla gelen sayfayı aynı etiketlerle gösteren bir sayfa geçişi o zamana kadar biter.

Parametreler:

- `tag: String?`

Belgelendiği sayfalar: [Test etiketleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### derivedTagKey

`import com.pantrixui.foundation.testing.derivedTagKey`, `com.pantrixui:foundation` içinden

```kotlin
fun derivedTagKey(
    tagKey: String,
    part: String
): String
```

Başka bir kontrolün üstüne kurulan bir kontrolün anahtarı: bir sayfa boyunun select'i, bir breadcrumb'ın menüsü. Dıştaki kontrolün kendi `tagKey`'i ve ardından içtekinin adı `part`'tır: `orders` ve `page_size`, `orders_page_size` olur ve select `Select_orders_page_size` diye etiketlenir.

Bir etiket bir anahtarın ilk `MAX_TAG_KEY_LENGTH` karakterinden fazlasını taşımaz. Elle birleştirilen uzun bir anahtar parçanın adını bu kesimde yitirir ve bir kontrolün iki parçası aynı anahtara varırdı. Burada geri çekilen dıştaki anahtardır: `part`'ı bütün bırakacak kadar kısa kesilir.

Parametreler:

- `tagKey: String`: dıştaki kontrolün anahtarı, çağıranın yazdığı gibi.
- `part: String`: içteki kontrolün dıştakinde ne olduğu, bir anahtarın yazıldığı harflerle: `page_size`.

Belgelendiği sayfalar: [Test etiketleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/test-tags.md)

### MAX_TAG_KEY_LENGTH

`import com.pantrixui.foundation.testing.MAX_TAG_KEY_LENGTH`, `com.pantrixui:foundation` içinden

```kotlin
const val MAX_TAG_KEY_LENGTH: Int = 32
```

How many characters of a key a tag carries: a key is a name a person reads in a failing test, and not a sentence.

## Paket com.pantrixui.foundation.theme

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixTheme(
    preset: DesignPreset,
    colors: PantrixColors = rememberPantrixColors(preset, darkTheme = inheritedDarkThemeOrSystem()),
    typography: PantrixTypography = preset.typography(),
    density: PantrixDensity = inheritedOr(LocalPantrixDensity) { rememberPantrixDensity() },
    shapes: PantrixShapes = preset.shapes(),
    motion: PantrixMotion = inheritedOr(LocalPantrixMotion) { rememberSystemMotion() },
    spacing: PantrixSpacing = asGivenOr(ThemeAsGiven::spacing) { rememberPantrixSpacing() },
    elevation: PantrixElevation = inheritedOr(LocalPantrixElevation) { rememberPantrixElevation() },
    platform: PantrixPlatform = asGivenOr(ThemeAsGiven::platform) { rememberPantrixPlatform() },
    window: PantrixWindow = inheritedPantrixWindow() ?: rememberPantrixWindow(),
    layouts: PantrixLayouts = asGivenOr(ThemeAsGiven::layouts) { rememberPantrixLayouts() },
    componentOverrides: ComponentTokenOverrides = preset.componentOverrides(),
    styles: PantrixStyles = inheritedOr(LocalPantrixStyles) { PantrixStyles.None },
    locale: PantrixLocale = inheritedOr(LocalPantrixLocale) { systemPantrixLocale() },
    strings: PantrixStrings = inheritedStringsOr(locale),
    testTagPolicy: TestTagPolicy = inheritedOr(LocalTestTagPolicy) { TestTagPolicy.Stable },
    analytics: PantrixAnalytics = inheritedOr(LocalPantrixAnalytics) { PantrixAnalytics.NoOp },
    haptics: PantrixHaptics = inheritedOr(LocalPantrixHaptics) { rememberPlatformHaptics() },
    diagnostics: PantrixDiagnostics = inheritedOr(LocalPantrixDiagnostics) { PantrixDiagnostics.Off },
    followSystemBars: Boolean = true,
    content: @Composable () -> Unit
)
```

Bir markanın tek yerde toplanmış görünüşü olan `preset` üstüne kurulan tema: sistem nasılsa öyle açık ya da koyudur.

Preset veren çağrı buraya gelir. Öteki her çağrı, `PantrixTheme { … }` de içinde, `PantrixColors` alan biçimdir.

Tema, içeriğine içinde çizildiği pencereyi de söyler: `PantrixTheme.window`. Bu, `window` başka bir pencere vermedikçe Compose'un bildirdiği penceredir, başka bir temanın içindeyse o temanın penceresidir. `layouts`, o pencerenin her sınıfı için sayfanın kenar boşluğu ve sütun arasıdır. `PantrixTheme.layout` pencerenin bulunduğu sınıfınkileri verir.

**Başka bir temanın içinde**,  alan biçim gibi, kendisine verilmeyen her şeyi o temadan alır. Preset'e ait olanlar, yani renkler, tipografi, şekiller ve bileşen ayarları preset'indir. Tema çevresindeki tema kadar koyudur: sistem ne derse desin, koyu bir temada preset'in koyu renkleri kullanılır.

Parametreler:

- `preset: DesignPreset`
- `colors: PantrixColors`: renk rolleri: `preset`'inkiler; çevresindeki tema kadar koyu, çevresinde tema yoksa sistem kadar. `inheritedDarkThemeOrSystem`: Bu çağrının çevresindeki tema koyu mu, çevresinde tema yoksa sistem koyu mu: koyu bir temanın içindeki tema, sistem ne derse desin, aksi söylenmedikçe koyudur.
- `typography: PantrixTypography`: yazı ölçeği: `preset`'inki.
- `density: PantrixDensity`: bileşenlerin boşluğunu ölçekleyen arayüz yoğunluğu: dıştaki bir temanınki ya da `Comfortable`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `shapes: PantrixShapes`: köşe yarıçapları: `preset`'inkiler.
- `motion: PantrixMotion`: süreler ve yumuşatmalar: dıştaki bir temanınkiler ya da Pantrix'in kendileri; sistem daha az hareket isterken her süre sıfırdır. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `spacing: PantrixSpacing`: boşluk ölçeği, yoğunluk onu ölçeklemeden önceki hâliyle: dıştaki bir temaya verilen ya da Pantrix'in kendisi. `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `elevation: PantrixElevation`: gölgelerin derinlikleri: dıştaki bir temanınkiler ya da Pantrix'in kendileri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `platform: PantrixPlatform`: bileşenlerin geleneklerini izlediği platform; dokunma alanı, odak halkası ve ön ayarlarıyla: dıştaki bir temaya verilen ya da sistemin bildirdiği gibi uygulamanın çalıştığı platform. `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `window: PantrixWindow`: `inheritedPantrixWindow`: Bu çağrının çevresindeki bir temanın ya da bir sağlayıcının verdiği pencere, yoksa null. Başka bir temanın içindeki tema, kendisine pencere verilmediğinde bunu alır: böylece bir testin sabitlediği pencere içteki temada kaybolmaz.
- `layouts: PantrixLayouts`: `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `componentOverrides: ComponentTokenOverrides`: markanın tek tek bileşenlere token ayarları: `preset`'inkiler.
- `styles: PantrixStyles`: bileşenlerin, ön ayarlarının üstüne aldığı stil ayarları: dıştaki bir temanınkiler ya da hiçbiri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `locale: PantrixLocale`: bileşenlerin konuştuğu ve yerleştiği dil: dıştaki bir temanınki ya da sistemin dili. Temanın içindeki her şeyin yerleşme yönü yalnızca onun `layoutDirection`'ıdır, temanın çevresinde verilen bir `LocalLayoutDirection`'ın üstünde: sağdan sola bir yerleşim, sağdan sola yazılan bir dille istenir, örneğin `PantrixLocale("en", LayoutDirection.Rtl)`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `strings: PantrixStrings`: bileşenlerin kendi sözleri: `locale`'in dilini konuşuyorsa dıştaki bir temanınkiler, değilse Pantrix'in o dile ait paketi. `inheritedStringsOr`: Bu çağrının çevresindeki temanın dili `locale` ise o temanın metinleri; dili başkaysa ya da çevresinde tema yoksa `locale`'in kendi metinleri. Bir uygulamanın temasına verdiği metinler temanın içinde korunur, başka bir dil verilen tema ise o dilin metinlerini alır.
- `testTagPolicy: TestTagPolicy`: bileşenlerin otomasyon etiketlerini anlam ağacına koyup koymadığı: dıştaki bir temanınki ya da `TestTagPolicy.Stable`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `analytics: PantrixAnalytics`: bileşenlerin kullanıcının onlarla yaptığını bildirdiği yer: dıştaki bir temanınki ya da hiçbir yer (`PantrixAnalytics.NoOp`). `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `haptics: PantrixHaptics`: bileşenlerin dokunsal geri bildirimini çalan: dıştaki bir temanınki ya da cihazın kendisi. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `diagnostics: PantrixDiagnostics`: çalışan ekranın denetimlerinin bulgularını gönderdiği yer; okunmayan renkler ve fazla küçük dokunma alanları da bu bulgulardandır: dıştaki bir temanınki ya da kapalı. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `followSystemBars: Boolean`: En dıştaki temanın sistemin çizdiklerini sistemin koyu modu yerine kendi renklerine uydurup uydurmadığı: Android'in çubuklarının simgeleri, iOS'un durum çubuğu, klavyesi ve kontrolleri. Başka bir temanın içindeki tema buna dokunmaz. Bunları kendisi ayarlayan ya da çubukları renkli olan bir uygulama bunu kapatır. Tamamı docs/guide/system-bars/SYSTEM_BARS_GUIDE.md'dedir.
- `content: @Composable () -> Unit`: temanın geçerli olduğu içerik.

Belgelendiği sayfalar: [İç içe tema](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixTheme(
    darkTheme: Boolean = inheritedDarkThemeOrSystem(),
    colors: PantrixColors = inheritedColorsOrOwn(darkTheme),
    typography: PantrixTypography = inheritedOr(LocalPantrixTypography) { rememberPantrixTypography() },
    density: PantrixDensity = inheritedOr(LocalPantrixDensity) { rememberPantrixDensity() },
    shapes: PantrixShapes = inheritedOr(LocalPantrixShapes) { rememberPantrixShapes() },
    motion: PantrixMotion = inheritedOr(LocalPantrixMotion) { rememberSystemMotion() },
    spacing: PantrixSpacing = asGivenOr(ThemeAsGiven::spacing) { rememberPantrixSpacing() },
    elevation: PantrixElevation = inheritedOr(LocalPantrixElevation) { rememberPantrixElevation() },
    platform: PantrixPlatform = asGivenOr(ThemeAsGiven::platform) { rememberPantrixPlatform() },
    window: PantrixWindow = inheritedPantrixWindow() ?: rememberPantrixWindow(),
    layouts: PantrixLayouts = asGivenOr(ThemeAsGiven::layouts) { rememberPantrixLayouts() },
    componentOverrides: ComponentTokenOverrides =
        inheritedOr(LocalComponentTokenOverrides) { ComponentTokenOverrides.None },
    styles: PantrixStyles = inheritedOr(LocalPantrixStyles) { PantrixStyles.None },
    locale: PantrixLocale = inheritedOr(LocalPantrixLocale) { systemPantrixLocale() },
    strings: PantrixStrings = inheritedStringsOr(locale),
    testTagPolicy: TestTagPolicy = inheritedOr(LocalTestTagPolicy) { TestTagPolicy.Stable },
    analytics: PantrixAnalytics = inheritedOr(LocalPantrixAnalytics) { PantrixAnalytics.NoOp },
    haptics: PantrixHaptics = inheritedOr(LocalPantrixHaptics) { rememberPlatformHaptics() },
    diagnostics: PantrixDiagnostics = inheritedOr(LocalPantrixDiagnostics) { PantrixDiagnostics.Off },
    followSystemBars: Boolean = true,
    content: @Composable () -> Unit
)
```

Preset'i olmayan tema, Pantrix'in kendi görünüşünde: `darkTheme` ne diyorsa öyle açık ya da koyudur, verilmezse sistem nasılsa öyle.

`PantrixTheme { … }` buraya gelir, preset vermeyen her çağrı da. `DesignPreset` alan biçimde preset'in varsayılanı yoktur, bu yüzden hiçbir çağrı ikisine birden uymaz.

`window` ve `layouts`, `DesignPreset` alan biçimdeki gibidir.

**Başka bir temanın içinde**, kendisine verilmeyen her şeyi o temadan alır: açık bir ekranın koyu bölümü `PantrixTheme(darkTheme = true) { … }`'dir ve içinde renklerden başka hiçbir şey değişmez. Uygulamanın temasına söylediği platform, yoğunluk, dil ve metinleri, stiller, olayların bildirildiği yer ve bulguların gittiği yer içteki temada da dıştakinindir. Ona verilen ise kendisinindir. `darkTheme` aksini söylemedikçe çevresindeki tema kadar koyudur ve öyle olduğu sürece o temanın renklerini korur. Açık bir temanın içinde koyu olması söylenirse o temanın görünüşünün üstüne kurulduğu preset'in koyu renklerini, görünüş bir preset üstüne kurulmamışsa Pantrix'in kendi koyu setini ya da kendisine verilen `colors`'ı alır. Tema zemin çizmez: koyu bölümün zemini, içindeki bir yüzey ya da bir karttır. Tema bir düzen de değildir: içindekileri, temanın içinde durduğu şey yerleştirir, tema orada yokmuş gibi.

Parametreler:

- `darkTheme: Boolean`: `inheritedDarkThemeOrSystem`: Bu çağrının çevresindeki tema koyu mu, çevresinde tema yoksa sistem koyu mu: koyu bir temanın içindeki tema, sistem ne derse desin, aksi söylenmedikçe koyudur.
- `colors: PantrixColors`: `inheritedColorsOrOwn`: Bu çağrının çevresindeki temanın renkleri `darkTheme`'in istediği kadar koyuysa o renkler. Başka bir temanın içindeki tema, açık bir temada koyu ya da koyu bir temada açık olması söylenmedikçe renklerini korur. Bir markanın renkleri de buna dahildir.

  Öyle söylenirse o türden seti, çevresindeki görünüşün üstüne kurulduğu preset'ten alır: bir markanın açık temasındaki koyu bölüm markanın koyu renklerindedir. Görünüş bir preset üstüne kurulmamışsa ya da çağrının çevresinde tema yoksa set Pantrix'in kendi setidir.
- `typography: PantrixTypography`: yazı ölçeği: dıştaki bir temanınki ya da Pantrix'in kendisi. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `density: PantrixDensity`: bileşenlerin boşluğunu ölçekleyen arayüz yoğunluğu: dıştaki bir temanınki ya da `Comfortable`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `shapes: PantrixShapes`: köşe yarıçapları: dıştaki bir temanınkiler ya da Pantrix'in kendileri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `motion: PantrixMotion`: süreler ve yumuşatmalar: dıştaki bir temanınkiler ya da Pantrix'in kendileri; sistem daha az hareket isterken her süre sıfırdır. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `spacing: PantrixSpacing`: boşluk ölçeği, yoğunluk onu ölçeklemeden önceki hâliyle: dıştaki bir temaya verilen ya da Pantrix'in kendisi. `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `elevation: PantrixElevation`: gölgelerin derinlikleri: dıştaki bir temanınkiler ya da Pantrix'in kendileri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `platform: PantrixPlatform`: bileşenlerin geleneklerini izlediği platform; dokunma alanı, odak halkası ve ön ayarlarıyla: dıştaki bir temaya verilen ya da sistemin bildirdiği gibi uygulamanın çalıştığı platform. `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `window: PantrixWindow`: `inheritedPantrixWindow`: Bu çağrının çevresindeki bir temanın ya da bir sağlayıcının verdiği pencere, yoksa null. Başka bir temanın içindeki tema, kendisine pencere verilmediğinde bunu alır: böylece bir testin sabitlediği pencere içteki temada kaybolmaz.
- `layouts: PantrixLayouts`: `asGivenOr`: Bu çağrının çevresindeki temaya, ilk yazılan değer için, tema onu ölçeklemeden önce verilen; çağrının çevresinde tema yoksa süslü parantezin verdiği. Boşlukların, düzen ölçülerinin ve platformun varsayılanıdır: içteki tema bunları kendi yoğunluğuyla ölçekler.
- `componentOverrides: ComponentTokenOverrides`: markanın tek tek bileşenlere token ayarları: dıştaki bir temanınkiler ya da hiçbiri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `styles: PantrixStyles`: bileşenlerin, ön ayarlarının üstüne aldığı stil ayarları: dıştaki bir temanınkiler ya da hiçbiri. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `locale: PantrixLocale`: bileşenlerin konuştuğu ve yerleştiği dil: dıştaki bir temanınki ya da sistemin dili. Temanın içindeki her şeyin yerleşme yönü yalnızca onun `layoutDirection`'ıdır, temanın çevresinde verilen bir `LocalLayoutDirection`'ın üstünde: sağdan sola bir yerleşim, sağdan sola yazılan bir dille istenir, örneğin `PantrixLocale("en", LayoutDirection.Rtl)`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `strings: PantrixStrings`: bileşenlerin kendi sözleri: `locale`'in dilini konuşuyorsa dıştaki bir temanınkiler, değilse Pantrix'in o dile ait paketi. `inheritedStringsOr`: Bu çağrının çevresindeki temanın dili `locale` ise o temanın metinleri; dili başkaysa ya da çevresinde tema yoksa `locale`'in kendi metinleri. Bir uygulamanın temasına verdiği metinler temanın içinde korunur, başka bir dil verilen tema ise o dilin metinlerini alır.
- `testTagPolicy: TestTagPolicy`: bileşenlerin otomasyon etiketlerini anlam ağacına koyup koymadığı: dıştaki bir temanınki ya da `TestTagPolicy.Stable`. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `analytics: PantrixAnalytics`: bileşenlerin kullanıcının onlarla yaptığını bildirdiği yer: dıştaki bir temanınki ya da hiçbir yer (`PantrixAnalytics.NoOp`). `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `haptics: PantrixHaptics`: bileşenlerin dokunsal geri bildirimini çalan: dıştaki bir temanınki ya da cihazın kendisi. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `diagnostics: PantrixDiagnostics`: çalışan ekranın denetimlerinin bulgularını gönderdiği yer; okunmayan renkler ve fazla küçük dokunma alanları da bu bulgulardandır: dıştaki bir temanınki ya da kapalı. `inheritedOr`: Bu çağrının çevresindeki temanın değeri, ilk yazılan local'dan okunur; çağrının çevresinde tema yoksa süslü parantezin verdiği. Bir temanın kendisine verildiği gibi aktardığı bir değerin varsayılanıdır: başka bir temanın içindeki tema onu çevresindekinden alır, tek başına duran bir tema kendisininkini kurar.
- `followSystemBars: Boolean`: En dıştaki temanın sistemin çizdiklerini sistemin koyu modu yerine kendi renklerine uydurup uydurmadığı: Android'in çubuklarının simgeleri, iOS'un durum çubuğu, klavyesi ve kontrolleri. Başka bir temanın içindeki tema buna dokunmaz. Bunları kendisi ayarlayan ya da çubukları renkli olan bir uygulama bunu kapatır. Tamamı docs/guide/system-bars/SYSTEM_BARS_GUIDE.md'dedir.
- `content: @Composable () -> Unit`: temanın geçerli olduğu içerik.

Belgelendiği sayfalar: [İç içe tema](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

### PantrixTheme

`import com.pantrixui.foundation.theme.PantrixTheme`, `com.pantrixui:foundation` içinden

```kotlin
data object PantrixTheme
```

Temanın değerleri, bir composable'ın onları okuduğu yerde: `PantrixTheme.colors.primary` ya da `PantrixTheme.spacing.md`. Her biri, çevredeki en yakın `PantrixTheme { … }` ne sağlıyorsa odur.

Üyeleri:

- `colors: PantrixColors`: Geçerli renk rolleri: `PantrixTheme.colors.primary.color`, `PantrixTheme.colors.surface`.
- `typography: PantrixTypography`: Geçerli yazı ölçeği: `PantrixTheme.typography.body`.
- `density: PantrixDensity`: Bileşenlerin boşluğunu ölçekleyen geçerli arayüz yoğunluğu.
- `shapes: PantrixShapes`: Geçerli köşe yarıçapları: `PantrixTheme.shapes.md`.
- `motion: PantrixMotion`: Geçerli süreler ve yumuşatmalar; sistem daha az hareket isterken her süre sıfırdır.
- `spacing: PantrixSpacing`: Yoğunlukla ölçeklenmiş geçerli boşluk ölçeği: `PantrixTheme.spacing.md`.
- `elevation: PantrixElevation`: Gölgelerin geçerli derinlikleri.
- `platform: PantrixPlatform`: Gelenekleri geçerli olan platform: dokunma alanı, odak halkası ve bileşenlerin ön ayarları.
- `window: PantrixWindow`: İçeriğin çizildiği pencere: genişlik ve yükseklik sınıfı, boyutu ve cihazının nasıl katlandığı. Bir düzen ona göre seçer, `PantrixTheme.window.widthClass >= WindowWidthClass.Expanded`, ve sınıf değişince yeniden kurulur.
- `layout: PantrixLayout`: Geçerli pencerede bir sayfanın yerleştirildiği ölçüler: yanlardaki kenar boşluğu ve sütun arası, pencerenin genişlik sınıfına göre. Bir telefonun kenar boşluğu 16dp, bir masaüstü penceresininki 32dp'dir.

  ```kotlin
  Column(Modifier.padding(horizontal = PantrixTheme.layout.margin)) { … }
  ```

  Okuyan, sınıf değişince yeniden kurulur; pencere sınıfın içinde boyut değiştirirken kurulmaz. Ölçüler temanın `layouts`'ından gelir ve temanın yoğunluğu onları ölçekler.
- `@Composable fun layout(window: PantrixWindow): PantrixLayout`: Geçerli pencerenin değil `window`'un ölçüleri: bir bileşen bunu kendi kutusu için sorar, çünkü kutunun yeri pencereninki değildir.

  ```kotlin
  BoxWithPantrixWindow(modifier) { box ->
      Row(horizontalArrangement = Arrangement.spacedBy(PantrixTheme.layout(box).gutter)) { … }
  }
  ```
- `locale: PantrixLocale`: Geçerli dil: bileşenlerin konuştuğu ve yerleştiği dil.
- `strings: PantrixStrings`: Bileşenlerin geçerli kendi sözleri, `locale`'in dilinde.
- `analytics: PantrixAnalytics`: Bileşenlerin kullanıcının onlarla yaptığını bildirdiği yer.
- `haptics: PantrixHaptics`: Bileşenlerin dokunsal geri bildirimini çalan.
- `isUnderModal: Boolean`: Bunun okunduğu içeriğin üstünde modal bir katman gösteriliyor mu: bir dialog, bir sheet ya da uygulamanın bir `PantrixModalLayer` içindeki kendi katmanı. Böyle bir katmanın altında kalan, katman kapanana kadar ne tuş ne tıklama alır ve alıyormuş gibi de görünmemelidir. Odak katmanın altında olduğu yerde kalır, böylece katman kapanınca yine oradadır. O sırada orada odak halkası çizilmez.

  Bir katmanın içeriği o katmanın altında değildir, ondan sonra açılan bir katmanın ise altındadır.
- `componentOverrides: ComponentTokenOverrides`: Markanın geçerli bileşen ayarları. Bu temanın içindeki bir tema, kendisine başkaları verilmedikçe onları korur.
- `styles: PantrixStyles`: Geçerli stil ayarları: temanın `styles`'ı ve çevredeki her `ProvidePantrixStyles`'ın ayarları.
- `@Composable fun <S : PantrixStyle<S>> style(key: PantrixStyleKey<S>): S`: `key`'in etkin platformdaki stili, markanın, temanın ve çevredeki her `ProvidePantrixStyles`'ın ayarları uygulanmış hâliyle: `PantrixTheme.style(ButtonStyle).pressedScale`.
- `@Composable fun <S : PantrixStyle<S>> style(key: PantrixStyleKey<S>, override: S?): S`: `key`'in stili, `override` öteki her katmanın üstünde olmak üzere. Stilini parametre olarak alan bir bileşen bununla çizer, `PantrixButton(style = ButtonStyle(…))` gibi.

  Verilen stil, çağrının çevresindeki bir `ProvidePantrixStyles` onu nereye koyacaksa oraya konur: markanın, temanın ve çevredeki her birinin ayarlarını ezer. Yoğunluktan önce gelir: burada verilen bir yükseklik de ötekiler gibi ölçeklenir. Her platformda geçerlidir. Yalnızca verdiği alanlar değişir, `null` hiçbir şeyi değiştirmez.

Belgelendiği sayfalar: [İç içe tema](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

## Paket com.pantrixui.foundation.theme.preset

### DesignPreset

`import com.pantrixui.foundation.theme.preset.DesignPreset`, `com.pantrixui:foundation` içinden

```kotlin
interface DesignPreset
```

Bir markanın görünüşü, tek yerde: renkleri, tipografisi, şekilleri ve bileşen ayarları. `PantrixTheme(preset = …)` ondan bir tema kurar.

Üyeleri:

- `name: String`: Preset'in adı, bir seçicinin ya da bir log'un gösterdiği hâliyle.
- `fun colors(dark: Boolean = false): PantrixColors`: Renkler: `dark` ise koyu set.
- `@Composable fun typography(): PantrixTypography`: Yazı ölçeği, markanın yazı tipleriyle.
- `@Composable fun shapes(): PantrixShapes`: Şekil ölçeği.
- `fun componentOverrides(): ComponentTokenOverrides`: Her bileşenin token ayarları. Markanın ayarı yoksa hiçbiri.

Belgelendiği sayfalar: [İç içe tema](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

## Paket com.pantrixui.foundation.token.color

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

Belgelendiği sayfalar: [Tanılama](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/diagnostics.md)

### PantrixColorScale

`import com.pantrixui.foundation.token.color.PantrixColorScale`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixColorScale(
    val shade50: Color,
    val shade100: Color,
    val shade200: Color,
    val shade300: Color,
    val shade400: Color,
    val shade500: Color,
    val shade600: Color,
    val shade700: Color,
    val shade800: Color,
    val shade900: Color,
    val shade950: Color
)
```

On bir basamakta tek bir renk, neredeyse beyazdan neredeyse siyaha.

Varsayılan temalarda bir rolün rengi açık temada skalanın 600'ü ya da 700'üdür, koyuda 400'ü. Container'ı açık temada 100'ü, koyuda 900'üdür, `neutral` için Slate'in 800'ü.

Parametreler:

- `shade50: Color`: En açık basamak, neredeyse beyaz.
- `shade100: Color`: Soluk bir ton.
- `shade200: Color`: Açık bir ton.
- `shade300: Color`: Açık tonların sonuncusu.
- `shade400: Color`: Açık bir orta basamak.
- `shade500: Color`: Skalanın ortası.
- `shade600: Color`: Koyu bir orta basamak.
- `shade700: Color`: Koyu bir basamak.
- `shade800: Color`: Daha koyu bir basamak.
- `shade900: Color`: Skalanın sonuna yakın, derin bir basamak.
- `shade950: Color`: En koyu basamak, neredeyse siyah.

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### PantrixColors

`import com.pantrixui.foundation.token.color.PantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixColors(
    val primary: PantrixColor,
    val success: PantrixColor,
    val info: PantrixColor,
    val warning: PantrixColor,
    val danger: PantrixColor,
    val neutral: PantrixColor,
    val background: Color,
    val surface: Color,
    val onSurface: Color,
    val disabledContainer: Color,
    val disabledContent: Color,
    val textPrimary: Color,
    val textSecondary: Color,
    val textDisabled: Color,
    val textInverse: Color,
    val border: Color,
    val borderHover: Color,
    val borderStrong: Color,
    val divider: Color,
    val focusRing: Color,
    val scrim: Color,
    val chart: List<Color>
)
```

Bir Pantrix temasının renkleri: altı rol, arka zemin ve yüzeyler, onların üstüne çizilen yazı, çizgiler ve işaretler, ve bir grafiğin serilerini birbirinden ayırdığı renkler. Her rol bir `PantrixColor`'dır ve `roles()` onları listeler.

Parametreler:

- `primary: PantrixColor`: Markanın rolü: ana iş ve seçili olan.
- `success: PantrixColor`: İyi gidenin rolü: tamamlanan bir adım, kaydedilen bir değişiklik.
- `info: PantrixColor`: Nötr bilginin rolü: bir ipucu, bir duyuru.
- `warning: PantrixColor`: Soruna dönüşmeden önce dikkat isteyenin rolü.
- `danger: PantrixColor`: Ters gidenin ya da geri alınamayanın rolü: bir hata, geri alınamayan işin düğmesi.
- `neutral: PantrixColor`: Kendi rengi olmayan, göze batmaması gerekenin rolü.
- `background: Color`: Uygulamanın kendi arka zemini, her şeyin arkasında: bir scaffold'un doldurduğu zemin.
- `surface: Color`: Öne çıkan ya da gruplanan bir alan: bir kart, bir sheet, bir dialog, bir menü, bir sidebar, bir metin alanının kutusu.
- `onSurface: Color`: Temanın kendi zeminlerinde, `background`'da da `surface`'ta da, yazı olmayan her şeyin çizildiği renk: başka hiçbir şeyin renk vermediği bir ikon, bir checkbox'ın üstüne çizilen basış. Orada yazı `textPrimary`'dir. İki zeminin böyle tek bir ortak rengi vardır, tek bir asıl metin rengi olduğu gibi.
- `disabledContainer: Color`: Kullanılamayan bir kontrolün dolgusu: devre dışı bir düğme, devre dışı bir switch'in izi.
- `disabledContent: Color`: `disabledContainer`'ın üstüne çizilenler, ayrıca devre dışı olan her şeyin işaretleri ve kenarları: devre dışı bir düğmenin etiketi, devre dışı bir radio button'ın halkası, devre dışı bir alanın kenarı.
- `textPrimary: Color`: Asıl metin: bir yazı, kendisine renk verilmedikçe temanın kendi zeminlerinde, `background` ve `surface` üstünde, bu renkle yazılır. Bir dolgunun üstündeki yazı o dolguda okunan rengi alır.
- `textSecondary: Color`: Daha az ağırlıklı metin: yardım metni, bir ayırıcı çizginin etiketi.
- `textDisabled: Color`: Kullanılamayanın metni, bir dolgunun üstünde durmadığı yerde: devre dışı bir checkbox'ın etiketi, devre dışı bir bağlantı, devre dışı bir sekme. Varsayılan temalar ona `disabledContent`'in rengini verir.
- `textInverse: Color`: Temanın tersi tonda bir dolgunun üstündeki yazı: varsayılan açık temada beyaz, koyuda siyaha yakın.
- `border: Color`: Ne olduğunu içindekinin söylediği bir kutunun kenarı: bir metin alanı, bir chip. Bilerek yumuşak bir çizgidir: `divider`'dan güçlü, yazıdan çok daha sessiz. WCAG 1.4.11'in bir kontrolü tek başına belli eden kenardan istediği 3:1'in altındadır: alanları için bunu karşılaması gereken bir ürün burada daha güçlü bir renk verir.
- `borderHover: Color`: O kenarın imlecin altındaki hâli: `border`'dan bir basamak güçlü.
- `borderStrong: Color`: Yalnızca işaretinden ibaret bir kontrolün işareti: bir checkbox'ın kutusu, bir radio button'ın halkası, kapalı bir switch. Durduğu zemine karşı 3:1'dir (WCAG 1.4.11): kontrol seçilmeden önce de görünür.
- `divider: Color`: Öğelerin ya da bölümlerin arasındaki çizgi, `border`'dan açık: ayırır, bir kontrolün kenarını belli etmez.
- `focusRing: Color`: Klavye odağındakinin çevresindeki halka.
- `scrim: Color`: Bir modalın arkasında uygulamanın üstüne serilen yarı saydam renk: bir dialog'un, bir sheet'in, bir çekmecenin arkasında.
- `chart: List<Color>`: Bir grafiğin serilerini çizdiği renkler, onları dağıttığı sırayla: ilk seri ilkini alır, serisi renginden çok olan bir grafikte de `chartColor` baştan başlar. Bir rolün yaptığı gibi serinin ne olduğunu söylemezler: ters giden bir seri, kendi rengi olarak `danger` ile çizilir. Varsayılan setlerde on renk vardır: her biri setin zeminlerine karşı 3:1'dedir (WCAG 1.4.11), açık sette ve koyu sette aynı renk aileleridir, sıraları da yan yana gelenleri her tür renk görüşü için ayrı tutar. On seriyi yalnızca renk taşımaz, hiçbir göz için: çok serili bir grafik onları renklerinden fazlasıyla işaretler.

Üyeleri:

- `fun chartColor(index: Int): Color`: Bir grafiğin `index` sırasındaki serisinin rengi, sıfırdan sayılarak: `chart`'ın renkleri sırasıyla, sonuncudan sonra yine ilkinden.

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### PantrixColor

`import com.pantrixui.foundation.token.color.PantrixColor`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixColor(
    val color: Color,
    val onColor: Color,
    val container: Color,
    val onContainer: Color
)
```

Tek bir renk rolü: tam gücüyle renk, aynı rengin daha yumuşak bir container'ı ve her birinin üstüne çizilenler.

Parametreler:

- `color: Color`: Rolün tam gücü: dolu bir düğmenin dolgusu.
- `onColor: Color`: `color` üstündeki yazı ve ikonlar.
- `container: Color`: Rolün yumuşağı: yumuşak bir düğmenin dolgusu, renklendirilmiş bir alan.
- `onContainer: Color`: `container` üstündeki yazı ve ikonlar.

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixColors(darkTheme: Boolean): PantrixColors
```

Pantrix'in kendi renkleri: `darkTheme` ise koyu set, değilse açık set.

Parametreler:

- `darkTheme: Boolean`

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixColors(preset: DesignPreset): PantrixColors
```

`preset`'in renkleri: sistem koyuyken koyudur ve sistem değişince onu izler.

Parametreler:

- `preset: DesignPreset`

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### rememberPantrixColors

`import com.pantrixui.foundation.token.color.rememberPantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixColors(
    preset: DesignPreset,
    darkTheme: Boolean
): PantrixColors
```

`preset`'in renkleri, `darkTheme` ise koyu seti: okuruna açık ya da koyu temayı seçtiren bir uygulama için ve sistem kadar değil çevresindeki tema kadar koyu olan, bir başka temanın içindeki tema için.

```kotlin
val dark = settings.dark ?: isSystemInDarkTheme()
PantrixTheme(preset = Brand, colors = rememberPantrixColors(Brand, darkTheme = dark)) { App() }
```

Parametreler:

- `preset: DesignPreset`: Renklerin kimin olduğu.
- `darkTheme: Boolean`: Koyu setin verilip verilmediği.

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### LocalPantrixColors

`import com.pantrixui.foundation.token.color.LocalPantrixColors`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixColors: ProvidableCompositionLocal<PantrixColors>
```

The colour roles in effect, which `PantrixTheme` provides: what `PantrixTheme.colors` reads. Outside a theme, `PantrixColors.Light`.

### PantrixColors.Companion.Light

`import com.pantrixui.foundation.token.color.Light`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixColors.Companion.Light: PantrixColors
```

Pantrix's own light colours: what a theme given no preset is drawn in while it is light.

### PantrixColors.Companion.Dark

`import com.pantrixui.foundation.token.color.Dark`, `com.pantrixui:foundation` içinden

```kotlin
val PantrixColors.Companion.Dark: PantrixColors
```

Pantrix's own dark colours: what a theme given no preset is drawn in while it is dark.

### PantrixColors.contentColorFor

`import com.pantrixui.foundation.token.color.contentColorFor`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixColors.contentColorFor(container: Color): Color
```

`container` üstüne çizilen her şeyin aldığı tek renk: bir rolün renginin üstünde o rolün `onColor`'ı, container'ının üstünde `onContainer`'ı. Setin bunun için tek bir rengi olmadığı yerde `Color.Unspecified`: kendi zeminlerinde, yani arka zeminde ve yüzeyde, ve sette olmayan bir renkte.

Set, kendi zeminlerinde her tür içeriğe ayrı bir renk verir: yazı `textPrimary`'dir, ikon `onSurface`. Bu yüzden bir zeminle doldurulmuş kapsayıcı içindekilere içerik rengi vermez ve her bileşen orada kendi varsayılanıyla çizilir. Bir dolguda ise hepsi, o dolguda okunan tek rengi alır.

Yalnızca renge bakar ve bir tema aynı rengi iki kez kullanabilir: koyu tema devre dışı bir kontrolü nötr rolün container'ının rengiyle doldurur. Bu yüzden devre dışı çifte en son bakılır. Bir rolün dolgusu, üstünde okunan rengi, yani o rolün içerik rengini alır. Devre dışı içerik rengi ise yalnızca devre dışı container'dan başka bir şey olmayan dolgunun cevabıdır. Devre dışı olan, `disabledContent`'i kendisi ister.

Parametreler:

- `container: Color`

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md), [Surface](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/surface.md)

### PantrixColors.contentOn

`import com.pantrixui.foundation.token.color.contentOn`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixColors.contentOn(
    given: Color,
    usual: Color,
    otherwise: Color
): Color
```

Bir bileşene bir dolgu verilip üstüne çizilecekler için renk verilmediğinde o dolgunun üstüne çizilecek renk. `given` bir rolün rengiyse bu setin onunla eşlediği renktir, `contentColorFor` onu bulur. Setin zeminlerinden biriyse `textPrimary`'dir. İkisi de değilse `otherwise`.

Bir chip'i bir rolün rengiyle doldurup başka bir şey söylemeyen çağıran, rolün içerik rengini de kasteder; bir yüzey de onu böyle alır. Bileşenin her zamanki içerik rengi o dolguda okunamazdı. Setin arka zemininde ya da yüzeyinde bir bileşenin çizdiği, orada bir yazı nasıl yazılıyorsa öyle yazılır. Sette olmayan bir dolgu, üstünde neyin okunduğunu söylemez: içerik rengini çağıran verir.

Parametreler:

- `given: Color`: Çağıranın verdiği dolgu, vermediyse `Color.Unspecified`.
- `usual: Color`: Dolgu verilmediğinde bileşenin kendiliğinden aldığı dolgu. Yeniden verilirse hiçbir şeyi değiştirmez: bir bileşenin her zamanki dolgusunun üstüne çizdiği, her zaman o dolgunun eşi değildir. Bir segment düğmesinin hapının üstündeki etiket de değildir.
- `otherwise: Color`: Bileşenin her zamanki dolgusunun üstüne ve bu sette eşi olmayan bir dolgunun üstüne çizdiği renk.

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### PantrixColors.roles

`import com.pantrixui.foundation.token.color.roles`, `com.pantrixui:foundation` içinden

```kotlin
fun PantrixColors.roles(): List<PantrixColor>
```

Bu setteki her rol, tanımlandıkları sırayla.

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

### PantrixPalette

`import com.pantrixui.foundation.token.color.PantrixPalette`, `com.pantrixui:foundation` içinden

```kotlin
data object PantrixPalette
```

Renk setlerinin seçildiği ham renk skalaları. Bir setin rolleri basamaklarını buradan seçer. Bileşenler rolleri okur, bunları asla.

Üyeleri:

- `Slate: PantrixColorScale`: Maviye çalan soğuk bir gri: varsayılan `neutral`, ayrıca yüzeyler, yazı ve çizgiler.
- `Zinc: PantrixColorScale`: Hafifçe sıcağa çalan nötr bir gri.
- `Neutral: PantrixColorScale`: Renksiz, saf gri.
- `Red: PantrixColorScale`: Varsayılan `danger`.
- `Orange: PantrixColorScale`: Turuncu, kırmızı ile kehribar arasında: grafiğin ikinci rengi.
- `Amber: PantrixColorScale`: Varsayılan `warning`.
- `Yellow: PantrixColorScale`: Sarı, kehribardan açık. Varsayılan olarak hiçbir rol ve hiçbir grafik rengi onu almaz.
- `Green: PantrixColorScale`: Varsayılan `success`.
- `Emerald: PantrixColorScale`: Mavimsi bir yeşil: grafiğin üçüncü rengi.
- `Teal: PantrixColorScale`: Zümrüt ile camgöbeği arasında bir mavi yeşil: grafiğin renklerinden biri.
- `Cyan: PantrixColorScale`: Varsayılan `info`.
- `Sky: PantrixColorScale`: Camgöbeği ile mavi arasında açık bir mavi: grafiğin son rengi.
- `Blue: PantrixColorScale`: Varsayılan `primary` ve `focusRing`.
- `Indigo: PantrixColorScale`: Mora çalan koyu bir mavi: grafiğin renklerinden biri.
- `Violet: PantrixColorScale`: Mavimsi bir mor. Varsayılan olarak hiçbir rol ve hiçbir grafik rengi onu almaz.
- `Purple: PantrixColorScale`: Menekşe ile pembe arasında bir mor. Varsayılan olarak hiçbir rol ve hiçbir grafik rengi onu almaz.
- `Pink: PantrixColorScale`: Pembe: grafiğin renklerinden biri.
- `Rose: PantrixColorScale`: Pembe bir kırmızı: grafiğin renklerinden biri.
- `all: Map<String, PantrixColorScale>`: Burada tanımlı her skala, özelliğinin adıyla: bir katalog ve testler için.

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

## Paket com.pantrixui.foundation.token.contentcolor

### LocalPantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.LocalPantrixContentColor`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixContentColor: ProvidableCompositionLocal<Color>
```

Yazının ve ikonların, kendilerine renk verilmediğinde çizildiği renk. Onu sağlayanın içindeki her şey için geçerlidir. Bir dolgu boyayan bileşen, o dolguda okunan rengi sağlar: dolu bir düğme rolünün `onColor`'ını, bir rolün rengiyle doldurulmuş bir yüzey o renkle eşlenen rengi.

Temanın başlangıç değeri olan `Color.Unspecified`, çevrede hiçbir şeyin renk sağlamadığı anlamına gelir. Temanın kendi zeminleri de bunu sağlar: arka zemindeki bir scaffold, bir yüzey, bir kart. Onların üstünde her bileşen kendi varsayılanıyla çizilir: `PantrixText` `textPrimary` ile, `PantrixIcon` `onSurface` ile, `PantrixSpinner` markanın rengiyle.

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md), [Surface](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/surface.md)

### ProvidePantrixContentColor

`import com.pantrixui.foundation.token.contentcolor.ProvidePantrixContentColor`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun ProvidePantrixContentColor(
    color: Color,
    content: @Composable () -> Unit
)
```

`content`'i `color` rengiyle çizer. Bir bileşen yuvalarını bununla sarar.

Parametreler:

- `color: Color`
- `content: @Composable () -> Unit`

Belgelendiği sayfalar: [Renkler](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/colors.md)

## Paket com.pantrixui.foundation.token.density

### PantrixDensity

`import com.pantrixui.foundation.token.density.PantrixDensity`, `com.pantrixui:foundation` içinden

```kotlin
enum class PantrixDensity(public val scale: Float)
```

Arayüzün yoğunluğu: uygulama `PantrixTheme`'e başkasını vermedikçe `Comfortable`. `Compact` imleçle kullanıma uygundur, çünkü imleç daha küçük hedeflere isabet edebilir; `Spacious` ise dokunduğunun çevresinde daha çok yer isteyen bir okura.

Parametreler:

- `scale: Float`: Yoğunluğun bir stilin havasını çarptığı sayı: yüksekliklerini, iç boşluklarını, aralıklarını ve kenar boşluklarını. Çizgi kalınlıkları, kenarlar ve ikon boyutları olduğu gibi kalır.

Değerleri:

- `Compact`: Daha az boşluk, 0,85'i: daha küçük hedeflere isabet eden imleçle kullanım için. Bir dokunma alanı platformunkinin altına hiç inmez.
- `Comfortable`: Varsayılan: her stil olduğu gibi.
- `Spacious`: Daha çok boşluk, 1,15'i; dokunma alanları da o kadar büyür.

Belgelendiği sayfalar: [Yoğunluk](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/density.md), [İç içe tema](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/theme-inside-another.md)

### LocalPantrixDensity

`import com.pantrixui.foundation.token.density.LocalPantrixDensity`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixDensity: ProvidableCompositionLocal<PantrixDensity>
```

Geçerli arayüz yoğunluğu; `PantrixTheme` sağlar ve `PantrixTheme.density` bunu okur. Bir temanın dışında `PantrixDensity.Comfortable`.

Belgelendiği sayfalar: [Yoğunluk](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/density.md)

### rememberPantrixDensity

`import com.pantrixui.foundation.token.density.rememberPantrixDensity`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixDensity(): PantrixDensity
```

Varsayılan yoğunluk, `PantrixDensity.Comfortable`.

Belgelendiği sayfalar: [Yoğunluk](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/density.md)

## Paket com.pantrixui.foundation.token.elevation

### PantrixElevation

`import com.pantrixui.foundation.token.elevation.PantrixElevation`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixElevation(
    val none: Dp = 0.dp,
    val sm: Dp = 1.dp,
    val md: Dp = 2.dp,
    val lg: Dp = 4.dp,
    val xl: Dp = 8.dp
)
```

Yükselti ölçeği: bir yüzeyin altındakinden ne kadar ayrıldığı.

Parametreler:

- `none: Dp`: Altındakinin üstünde düz.
- `sm: Dp`: Varsayılanı 1dp.
- `md: Dp`: Varsayılanı 2dp.
- `lg: Dp`: Varsayılanı 4dp.
- `xl: Dp`: Varsayılanı 8dp, en yüksek adım.

Belgelendiği sayfalar: [Yükselti](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elevation.md)

### LocalPantrixElevation

`import com.pantrixui.foundation.token.elevation.LocalPantrixElevation`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixElevation: ProvidableCompositionLocal<PantrixElevation>
```

Gölgelerin geçerli derinlikleri; `PantrixTheme` sağlar ve `PantrixTheme.elevation` bunları okur. Bir temanın dışında Pantrix'in kendileri.

Belgelendiği sayfalar: [Yükselti](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elevation.md)

### rememberPantrixElevation

`import com.pantrixui.foundation.token.elevation.rememberPantrixElevation`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixElevation(): PantrixElevation
```

Pantrix'in yükselti ölçeği.

Belgelendiği sayfalar: [Yükselti](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/elevation.md)

## Paket com.pantrixui.foundation.token.motion

### PantrixMotion

`import com.pantrixui.foundation.token.motion.PantrixMotion`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixMotion(
    public val fast: Int = 100,
    public val normal: Int = 200,
    public val slow: Int = 350,
    public val standardEasing: PantrixEasing = PantrixEasing.Standard,
    public val emphasizedEasing: PantrixEasing = PantrixEasing.Emphasized,
    public val reduceMotion: Boolean = false
)
```

Süreler ve eğriler.

`EnterTransition`/`ExitTransition` bilerek yoktur: `@Immutable` sözleşmesinin eşitlik koşulunu karşılayamazlar ve onları buraya koymak kütüphanenin başka yerlerde uyguladığı kararlılık disiplinini bozardı.

Parametreler:

- `fast: Int`: Hızlı bir geçiş, milisaniyeyle: bir düğmenin basılışı.
- `normal: Int`: Olağan geçiş, milisaniyeyle.
- `slow: Int`: Uzun bir geçiş, milisaniyeyle.
- `standardEasing: PantrixEasing`: Çoğu geçişin izlediği eğri: bir düğmenin basılışı.
- `emphasizedEasing: PantrixEasing`: Fark edilmesi istenen bir geçişin eğrisi.
- `reduceMotion: Boolean`: Sistemin erişilebilirlik ayarının, `rememberSystemMotion`'ın okuduğu gibi, daha az hareket isteyip istemediği. O zaman `duration` 0'dır, bir spinner ya da bir iskelet durur.

Üyeleri:

- `fun duration(ms: Int): Int`: Kütüphanedeki her animasyon süresini buradan alır; böylece "hareketi azalt"a uymak, her bileşenin hatırlaması gereken bir kural değil tek bir dal olur.

  `ms`: bir animasyonun yazıldığı süre, milisaniye olarak.

Belgelendiği sayfalar: [Hareket](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md)

### PantrixEasing

`import com.pantrixui.foundation.token.motion.PantrixEasing`, `com.pantrixui:foundation` içinden

```kotlin
enum class PantrixEasing(public val curve: Easing)
```

Compose'un `Easing`'i bir `fun interface`'tir; kararlı bir kimliği yoktur ve bir `@Immutable` veri sınıfında duramaz. Eğrileri bir enum'a bağlamak eşitliği geri getirir; çağıranlar `curve`'ü kullanır.

Parametreler:

- `curve: Easing`: Girdinin karşılığı olan Compose eğrisi.

Değerleri:

- `Standard`: Geçişlerin çoğunun izlediği eğri: başlarken çabuk, dururken yumuşak.
- `Emphasized`: Fark edilmesi istenen bir geçişin eğrisi.
- `Linear`: Baştan sona eşit bir hız: bir ilerleme çubuğu gibi başka bir şeyle birlikte ilerleyenler için.

Belgelendiği sayfalar: [Hareket](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md)

### LocalPantrixMotion

`import com.pantrixui.foundation.token.motion.LocalPantrixMotion`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixMotion: ProvidableCompositionLocal<PantrixMotion>
```

Geçerli süreler ve yumuşatmalar; `PantrixTheme` sağlar ve `PantrixTheme.motion` bunları okur. Bir temanın dışında Pantrix'in kendileri.

Belgelendiği sayfalar: [Hareket](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md)

### rememberSystemMotion

`import com.pantrixui.foundation.token.motion.rememberSystemMotion`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberSystemMotion(): PantrixMotion
```

Pantrix'in hareketi: sistem daha az hareket isterken her süre sıfıra iner.

Belgelendiği sayfalar: [Hareket](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/motion.md)

## Paket com.pantrixui.foundation.token.shape

### PantrixShapes

`import com.pantrixui.foundation.token.shape.PantrixShapes`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixShapes(
    val xs: Shape = RoundedCornerShape(2.dp),
    val sm: Shape = RoundedCornerShape(4.dp),
    val md: Shape = RoundedCornerShape(8.dp),
    val lg: Shape = RoundedCornerShape(12.dp),
    val xl: Shape = RoundedCornerShape(16.dp)
)
```

Markanın köşe yarıçapları, kareden tam yuvarlağa. Bir bileşen stili bir adımı bir `ShapeRole` ile adlandırır; o adımın ne kadar yuvarlak olduğuna marka karar verir: `Sharp` her adımı kareler, `Pill` her adımı tam yuvarlak yapar.

Ölçeğin iki ucu, `none` ve `full`, her markada aynıdır. Parametre değildirler; onları ne bir marka ne de `copy` oynatabilir.

Parametreler:

- `xs: Shape`: En küçük yuvarlaklık, varsayılanı 2dp: `ShapeRole.ExtraSmall`.
- `sm: Shape`: Varsayılanı 4dp: `ShapeRole.Small`.
- `md: Shape`: Varsayılanı 8dp: `ShapeRole.Medium`, iOS'ta bir düğmenin şekli.
- `lg: Shape`: Varsayılanı 12dp: `ShapeRole.Large`.
- `xl: Shape`: Varsayılanı 16dp.

Üyeleri:

- `none: Shape`: Kare köşeler, her markada.
- `full: Shape`: Tam yuvarlak uçlar, her markada: `ShapeRole.Full`, Android'de, masaüstünde ve web'de bir düğmenin şekli.

Tipin kendisinde:

- `PantrixShapes.Sharp: PantrixShapes`: Her adım karelenmiş. `full` her markada olduğu gibi yuvarlak kalır.
- `PantrixShapes.Pill: PantrixShapes`: Her adım tam yuvarlak: hap biçimli düğmeler, yuvarlak avatarlar.

Belgelendiği sayfalar: [Şekiller](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

### LocalPantrixShapes

`import com.pantrixui.foundation.token.shape.LocalPantrixShapes`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixShapes: ProvidableCompositionLocal<PantrixShapes>
```

Geçerli köşe yarıçapları; `PantrixTheme` sağlar ve `PantrixTheme.shapes` bunları okur. Bir temanın dışında Pantrix'in kendileri.

Belgelendiği sayfalar: [Şekiller](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

### rememberPantrixShapes

`import com.pantrixui.foundation.token.shape.rememberPantrixShapes`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixShapes(): PantrixShapes
```

Pantrix'in kendi şekil ölçeği: varsayılanlarıyla `PantrixShapes`.

Belgelendiği sayfalar: [Şekiller](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

### ShapeSpec

`import com.pantrixui.foundation.token.shape.ShapeSpec`, `com.pantrixui:foundation` içinden

```kotlin
sealed interface ShapeSpec
```

Bir bileşen stilinin istediği şekil: markanın şekil ölçeğinin bir adımı ya da sabit bir şekil.

Platform hazır ayarları bir `ShapeRole` kullanır: bir hazır ayar her markaya hizmet eder ve her adımın ne kadar yuvarlak olduğuna marka karar verir. Ölçeğin dışında bir şekil isteyen bir uygulama, yalnızca iOS düğmelerinde 10dp'lik bir köşe gibi, `Fixed` verir.

Üyeleri:

- `fun resolve(shapes: PantrixShapes): Shape`: Etkin markanın ölçeği `shapes` üstündeki somut şekil.

#### ShapeSpec.Fixed

```kotlin
class Fixed(public val shape: Shape) : ShapeSpec
```

Markanın ölçeğine uymayan bir şekil.

Parametreler:

- `shape: Shape`: Şekil, her markada aynı.

#### ShapeSpec.Unspecified

```kotlin
data object Unspecified : ShapeSpec
```

Şekil yok. Ezme olarak kullanılan bir stilde alanı alttaki stile bırakır. Hazır ayarlar onu hiç kullanmaz; tek başına çözülünce kare köşeler verir.

Belgelendiği sayfalar: [Şekiller](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

### ShapeSpec.takeOrElse

`import com.pantrixui.foundation.token.shape.takeOrElse`, `com.pantrixui:foundation` içinden

```kotlin
inline fun ShapeSpec.takeOrElse(block: () -> ShapeSpec): ShapeSpec
```

This shape, or `block`'s when this one is `ShapeSpec.Unspecified`.

Parametreler:

- `block: () -> ShapeSpec`

### ShapeRole

`import com.pantrixui.foundation.token.shape.ShapeRole`, `com.pantrixui:foundation` içinden

```kotlin
enum class ShapeRole : ShapeSpec
```

`PantrixShapes`'in, markanın şekil ölçeğinin bir adımı.

Bir bileşenin hazır ayarı somut bir `Shape` değil, adımı saklar; böylece tek bir hazır ayar her markaya yeter: Pantrix'in `lg`'si kendisinin, nötr markanınki de onunkidir.

Değerleri:

- `ExtraSmall`: Markanın en küçük yuvarlaklığı, `xs`: Pantrix'in kendi ölçeğinde 2dp.
- `Small`: Markanın `sm`'i: Pantrix'in kendi ölçeğinde 4dp.
- `Medium`: Markanın `md`'si: Pantrix'in kendi ölçeğinde 8dp.
- `Large`: Markanın `lg`'si: Pantrix'in kendi ölçeğinde 12dp.
- `Full`: Tam yuvarlak uçlar, `full`: her markada aynı.

Belgelendiği sayfalar: [Şekiller](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

## Paket com.pantrixui.foundation.token.spacing

### PantrixSpacing

`import com.pantrixui.foundation.token.spacing.PantrixSpacing`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixSpacing(
    val none: Dp = 0.dp,
    val xs: Dp = 4.dp,
    val sm: Dp = 8.dp,
    val md: Dp = 12.dp,
    val lg: Dp = 16.dp,
    val xl: Dp = 24.dp,
    val xxl: Dp = 32.dp
)
```

Boşluk ölçeği: düzenlerin kurulduğu aralıklar ve iç boşluklar. `scaled` arayüz yoğunluğunu `none` dışındaki her adıma uygular.

Parametreler:

- `none: Dp`: Boşluk yok.
- `xs: Dp`: Varsayılanı 4dp.
- `sm: Dp`: Varsayılanı 8dp: bir düğmenin ikonuyla etiketi arasındaki boşluk.
- `md: Dp`: Varsayılanı 12dp.
- `lg: Dp`: Varsayılanı 16dp.
- `xl: Dp`: Varsayılanı 24dp.
- `xxl: Dp`: Varsayılanı 32dp, en geniş adım.

Üyeleri:

- `fun scaled(factor: Float): PantrixSpacing`: Yoğunluk burada uygulanır, her çağrıda değil; böylece tek bir ayar bütün sistemi yeniden ölçekler.

  `factor`: arayüz yoğunluğunun ölçeği: her basamak onunla çarpılır.

Belgelendiği sayfalar: [Boşluklar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/spacing.md)

### LocalPantrixSpacing

`import com.pantrixui.foundation.token.spacing.LocalPantrixSpacing`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixSpacing: ProvidableCompositionLocal<PantrixSpacing>
```

Geçerli boşluk ölçeği; `PantrixTheme` sağlar ve `PantrixTheme.spacing` bunu okur. Bir temanın dışında Pantrix'in kendisi.

Belgelendiği sayfalar: [Boşluklar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/spacing.md)

### rememberPantrixSpacing

`import com.pantrixui.foundation.token.spacing.rememberPantrixSpacing`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixSpacing(): PantrixSpacing
```

Pantrix'in boşluk ölçeği.

Belgelendiği sayfalar: [Boşluklar](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/spacing.md)

## Paket com.pantrixui.foundation.token.style

### ComponentTokenOverrides

`import com.pantrixui.foundation.token.style.ComponentTokenOverrides`, `com.pantrixui:foundation` içinden

```kotlin
class ComponentTokenOverrides(
    public val shapes: Map<String, ShapeRole> = emptyMap(),
    public val dimensions: Map<String, Dp> = emptyMap()
)
```

Bir markanın bileşen stillerindeki değişiklikleri, yollarıyla: ilk parça stili, gerisi alanı adlandırır, `"button.shape"` ya da `"icon.size"` gibi. Her stil kendininkileri `PantrixStyleKey.brandOverride`'da okur; hiçbir stilin okumadığı bir yol bir şey değiştirmez.

Parametreler:

- `shapes: Map<String, ShapeRole>`: Markanın verdiği şekiller, şekil ölçeğinin adımları olarak.
- `dimensions: Map<String, Dp>`: Markanın verdiği ölçüler: yükseklikler, iç boşluklar, ikon boyları.

Üyeleri:

- `fun hasOverridesFor(component: String): Boolean`: Bir yolun `component`'e, `"button"` gibi bir stil adına, ait olup olmadığı.
- `fun shape(path: String): ShapeSpec`: `path`'te verilen şekil, ya da hazır ayarınkini bırakan `ShapeSpec.Unspecified`.
- `fun dimension(path: String): Dp`: `path`'te verilen ölçü, ya da hazır ayarınkini bırakan `Dp.Unspecified`.

Tipin kendisinde:

- `ComponentTokenOverrides.None: ComponentTokenOverrides`: Ezme yok: her stil platform hazır ayarını korur.

Belgelendiği sayfalar: [Bileşen stilleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### PantrixStyle

`import com.pantrixui.foundation.token.style.PantrixStyle`, `com.pantrixui:foundation` içinden

```kotlin
interface PantrixStyle<S>
```

Bir bileşenin stili: bir platform hazır ayarının belirlediği, bir markanın, bir temanın ya da ağacın bir bölümünün değiştirebileceği geometri ve görünüş.

Her alanın bir "verilmedi" değeri vardır (`Dp.Unspecified`, `Float.NaN`, `ShapeSpec.Unspecified`, `null`); böylece tek bir tür, `TextStyle` gibi, hem eksiksiz bir hazır ayar hem kısmi bir ezmedir: `ButtonStyle(shape = ShapeRole.Medium)` şekli değiştirir, öteki alanları alttaki stile bırakır.

Üyeleri:

- `fun merge(other: S?): S`: Bu stil, `other`'ın verdiği her alan `other`'dan alınarak; `null` bunu döndürür.
- `fun scaled(scale: Float): S`: Bu stil, **havası** arayüz yoğunluğuyla çarpılmış olarak; başka hiçbir şeyi değil.

  Yükseklikler, iç boşluklar, aralıklar ve kenarlar ölçeklenir; çizgiler, kenarlıklar, ayırıcılar, yükseltiler, ikon boyları ve noktalar ölçeklenmez. Sıkı bir ekran içinde daha az hava olan bir ekrandır; ince çizgileri bir ince çizginin 0,85'i olan, ikonları bulanık ve gölgeleri sığ bir ekran değil. Bu ayrım genel olarak yapılamaz; bu yüzden her stil onu kendisi yapar.

  `1f` ölçeği bununla eşit bir stil döndürmelidir: `PantrixDensity.Comfortable` varsayılandır ve onda kaydedilmiş bir ekran görüntüsü tabanı bu geldiğinde kımıldamamalıdır.

  `scaledForDensity` kullan: verilmemiş bir ölçüyü verilmemiş bırakır. Kısmi bir ezme ölçeklendikten sonra da kısmi kalmalıdır; yoksa ezme olmaktan çıkar, bir değer olur.

  `scale`: arayüz yoğunluğunun ölçeği, `PantrixDensity.scale`.

Belgelendiği sayfalar: [Bileşen stilleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### Dp.scaledForDensity

`import com.pantrixui.foundation.token.style.scaledForDensity`, `com.pantrixui:foundation` içinden

```kotlin
fun Dp.scaledForDensity(scale: Float): Dp
```

Arayüz yoğunluğuyla ölçeklenmiş bir ölçü.

`Dp.Unspecified` NaN'dır ve NaN çarpı herhangi bir şey NaN'dır; yani bu, denetim olmadan da çalışırdı. Denetim burada, çünkü "verilmemiş verilmemiş kalır" kısmi bir stili kısmi tutan kuraldır ve yalnızca rastlantıyla tutan bir kural, tutmamayı bekleyen bir kuraldır.

Parametreler:

- `scale: Float`: arayüz yoğunluğunun ölçeği, `PantrixDensity.scale`.

Belgelendiği sayfalar: [Yoğunluk](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/density.md)

### PantrixStyleKey

`import com.pantrixui.foundation.token.style.PantrixStyleKey`, `com.pantrixui:foundation` içinden

```kotlin
abstract class PantrixStyleKey<S : PantrixStyle<S>>(public val name: String)
```

Bir bileşenin stilini adlandırır ve platform hazır ayarlarını tutar.

Bir stil anahtarını eşlik eden nesnesi olarak bildirir; böylece stil türü kendini adlandırır: `PantrixTheme.style(ButtonStyle)` onu okur, `ButtonStyle.override(ios = …)` onu ezer. Anahtar bileşeniyle birlikte durur; çekirdekte bileşenleri sayan bir şey yoktur.

Parametreler:

- `name: String`: Stilin adı, ve bir markanın onu ezdiği yolların ilk parçası: `"button.shape"`'teki `"button"`.

Üyeleri:

- `presets: PlatformPresets<S>`: Her platformdaki stil. Eksiksizdir: her alanı verilmiştir.
- `open fun brandOverride(overrides: ComponentTokenOverrides): S?`: `overrides`'ın bu stil için verdiği alanlar, ya da hiç vermiyorsa null.
- `fun override(all: S? = null, android: S? = null, ios: S? = null, desktop: S? = null, web: S? = null): PantrixStyleOverride<S>`: `PantrixStyle` için bu stilin bir ezmesi. `all` her platformda geçerlidir, bir platformun kendi argümanı onun üstüne gelir; her biri yalnızca değiştirdiği alanları söyler.

  `android`: Android'de değişen alanlar, `all`'ınkilerin üstünde.

  `ios`: iOS'ta değişen alanlar, `all`'ınkilerin üstünde.

  `desktop`: masaüstünde değişen alanlar, `all`'ınkilerin üstünde.

  `web`: bir tarayıcıda değişen alanlar, `all`'ınkilerin üstünde.
- `fun resolve(platform: PlatformType, componentOverrides: ComponentTokenOverrides = ComponentTokenOverrides.None, styles: PantrixStyles = PantrixStyles.None, density: PantrixDensity = PantrixDensity.Comfortable): S`: `platform`'da geçerli stil: hazır ayarı, markanın `componentOverrides`'ı, temanın ve alt ağacın `styles`'ı, en son da `density`. Kompozisyonu olmayan kod için `PantrixTheme.style`'ın verdiği.

  Yoğunluk ilk değil en son gelir: bir yükseklik veren uygulama ölçeklenmemiş değil ölçeklenmiş bir yükseklik alır. Ayar ekranı kullanan kişinindir ve ekranın ne karar verdiyse ona uygulanır.

Belgelendiği sayfalar: [Bileşen stilleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### PlatformPresets

`import com.pantrixui.foundation.token.style.PlatformPresets`, `com.pantrixui:foundation` içinden

```kotlin
class PlatformPresets<S : PantrixStyle<S>>(
    public val android: S,
    public val ios: S,
    public val desktop: S,
    public val web: S
)
```

Her platform için bir stil.

Parametreler:

- `android: S`: Android'deki stil.
- `ios: S`: iOS'taki stil.
- `desktop: S`: Masaüstündeki stil.
- `web: S`: Web'deki stil.

Üyeleri:

- `operator fun get(platform: PlatformType): S`: `platform`'un stili: `presets[PlatformType.Ios]`.

Belgelendiği sayfalar: [Bileşen stilleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### PantrixStyles

`import com.pantrixui.foundation.token.style.PantrixStyles`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixStyles
```

İstenen sayıda bileşen için, platform platform stil ezmeleri.

Uygulamanın tamamı için `PantrixTheme(styles = …)`'a, bir bölümü için `ProvidePantrixStyles`'a verilir. Bir bileşenin stili platform hazır ayarıdır; üstüne markanın ezmeleri, sonra temanınkiler, sonra dıştan içe her `ProvidePantrixStyles` gelir. `PantrixButton(shape = …)` gibi bir parametre yine hepsinden önce gelir.

```kotlin
PantrixTheme(
    styles = pantrixStyles(
        ButtonStyle.override(ios = ButtonStyle(shape = ShapeRole.Medium)),
        IconStyle.override(all = IconStyle(size = 20.dp))
    )
) { App() }
```

Üyeleri:

- `fun <S : PantrixStyle<S>> overrideFor(key: PantrixStyleKey<S>, platform: PlatformType): S?`: `key`'in `platform`'daki ezmesi, ya da bu ezmeler ona dokunmuyorsa null.
- `operator fun plus(other: PantrixStyles): PantrixStyles`: Bu ezmeler, `other`'ınkiler üstlerinde: ikisi de bir alanı veriyorsa `other` kazanır.

Tipin kendisinde:

- `PantrixStyles.None: PantrixStyles`: Ezme yok: her bileşen hazır ayarını ve markasının ezmelerini korur.

Belgelendiği sayfalar: [Bileşen stilleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### PantrixStyleOverride

`import com.pantrixui.foundation.token.style.PantrixStyleOverride`, `com.pantrixui:foundation` içinden

```kotlin
class PantrixStyleOverride<S : PantrixStyle<S>>
```

One component's style override, per platform, as `PantrixStyleKey.override` builds it.

Parametreler:

- `key: PantrixStyleKey<S>`: The style it overrides.

### pantrixStyles

`import com.pantrixui.foundation.token.style.pantrixStyles`, `com.pantrixui:foundation` içinden

```kotlin
fun pantrixStyles(vararg overrides: PantrixStyleOverride<*>): PantrixStyles
```

Bileşen başına bir stil ezmesi. İki kez verilen bir bileşen sonraki ezmeyi öncekinin üstüne alır.

Parametreler:

- `vararg overrides: PantrixStyleOverride<*>`: ezmeler; her biri bir stilin `override`'ıyla yapılır: `ButtonStyle.override(ios = ButtonStyle(shape = ShapeRole.Medium))`.

Belgelendiği sayfalar: [Bileşen stilleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### ProvidePantrixStyles

`import com.pantrixui.foundation.token.style.ProvidePantrixStyles`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun ProvidePantrixStyles(
    styles: PantrixStyles,
    content: @Composable () -> Unit
)
```

Stilleri yalnızca `content` için ezer: bir ayarlar ekranında daha sık satırlar, bir dialog'da hap biçimli düğmeler. Ezmeler zaten geçerli olanlara, temanınkilere ve dıştaki her çağrınınkilere eklenir; ikisi de bir alanı veriyorsa kazanır.

Parametreler:

- `styles: PantrixStyles`: `content` için ezmeler; `pantrixStyles` ile yapılır.
- `content: @Composable () -> Unit`

Belgelendiği sayfalar: [Bileşen stilleri](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/component-styles.md)

### ShapeSpec.toShape

`import com.pantrixui.foundation.token.style.toShape`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun ShapeSpec.toShape(): Shape
```

Bu şekil, etkin markanın ölçeğinde.

Belgelendiği sayfalar: [Şekiller](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/shapes.md)

## Paket com.pantrixui.foundation.token.typography

### LocalPantrixTextStyle

`import com.pantrixui.foundation.token.typography.LocalPantrixTextStyle`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixTextStyle: ProvidableCompositionLocal<TextStyle>
```

Stil verilmeyen yazının yazıldığı stil, onu sağlayanın içindeki her şey için: `PantrixText`, `PantrixLink` ve `PantrixAutoText`'e stil verilmediğinde aldıkları. Tema onu ölçeğinin `PantrixTypography.label`'ıyla başlatır: her platformda temel yazı. Bir ekranın başka bir rolde okunan bir bölümü, body ile yazılan bir düz yazı sayfası gibi, onu `ProvidePantrixTextStyle` ile verir.

Compose Foundation'ın kendi `BasicText`'i böyle bir değer okumaz: stil verilmediğinde metnini `TextStyle.Default` ile, sistemin yazı tipiyle 14sp yazar. Uygulamanın Pantrix'in olmayan kendi bir yazısı bunu kendisi alır: `BasicText(text, style = LocalPantrixTextStyle.current)`. Bir `PantrixTheme`'in dışında bunun tuttuğu da `TextStyle.Default`'tur.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### ProvidePantrixTextStyle

`import com.pantrixui.foundation.token.typography.ProvidePantrixTextStyle`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun ProvidePantrixTextStyle(
    style: TextStyle,
    content: @Composable () -> Unit
)
```

`content`'teki stil verilmeyen yazıyı, çevresindekinin üstüne `style` ile yazdırır: `style`'ın verdiği kazanır, vermediği olduğu gibi kalır; böylece `TextStyle(fontWeight = FontWeight.SemiBold)` çevresindeki yazıyı kalınlaştırır ve boyutunu korur.

Parametreler:

- `style: TextStyle`
- `content: @Composable () -> Unit`

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixFont

`import com.pantrixui.foundation.token.typography.PantrixFont`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixFont(
    val resource: FontResource,
    val weight: FontWeight = FontWeight.Normal,
    val style: FontStyle = FontStyle.Normal,
    val variationSettings: FontVariation.Settings = FontVariation.Settings(weight, style)
)
```

Bir yazı tipinin bir fontu: uygulamanın kaynaklarından bir dosya, ve bir ailenin onu kaydettiği ağırlık ile stil.

Compose kaynaklarının `Font(resource, weight, style)` fonksiyonunun aldığı şeydir, bir değer olarak tutulur: böylece tek bir font listesi hem aileyi kurar hem de okunup okunmadığı sorulur, ikisi birbirinden ayrılamaz. Değişken bir font tek dosyadır ve çizileceği her ağırlık için bir kez verilir.

Parametreler:

- `resource: FontResource`: Font dosyası, uygulamanın üretilen `Res.font`'unun verdiği adla.
- `weight: FontWeight`: Dosyanın çizildiği ağırlık.
- `style: FontStyle`: Dik ya da italik.
- `variationSettings: FontVariation.Settings`: Fontun, değişken bir fontun eksenlerinde nerede çizildiği. Verilmezse `weight` ve `style` ne diyorsa odur; başka eksenleri olan bir fonta (bir genişlik, bir optik boyut) onlar burada verilir.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixTypeface

`import com.pantrixui.foundation.token.typography.PantrixTypeface`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixTypeface(
    val fonts: List<PantrixFont>,
    val fallbacks: List<PantrixFont> = emptyList()
)
```

Bir yazı tipi, onu oluşturan font dosyalarıyla ve bir tarayıcının onlarda olmayan karakterleri çizdiği fontlarla.

```kotlin
val Brand = PantrixTypeface(
    PantrixFont(Res.font.brand_regular),
    PantrixFont(Res.font.brand_bold, FontWeight.Bold)
)
```

`rememberPantrixTypography(Brand)` Pantrix'in yazı ölçeğini o yazı tipiyle verir, `rememberPantrixFontFamily` yalnızca ailesini. Android, iOS ve masaüstü dosyalarını istendikleri yerde okur. Tarayıcı onları indirir ve gelene dek yedek bir yazı tipiyle çizer: geldiklerini `areTypefacesLoaded` söyler, `PantrixTypefaceGate` de bir ekranı o zamana dek bekletir.

Tarayıcıda Compose, uygulamanın hiçbir fontunda olmayan bir karakteri Google'ın sunucularından indirdiği bir Noto fontuyla çizer: her ziyaretçinin tarayıcısı onu Google'dan ister, çevrimdışı bir sayfada karakter boş kalır ve bir içerik güvenliği politikası sayfanın Google'a ulaşmasına izin vermek zorunda kalır. `fallbacks`'te verilen ve karakteri taşıyan bir font bunun yerine yazı tipiyle birlikte okunur ve onun için hiçbir şey indirilmez. Mac tuşlarının işaretlerini yazan bir marka Pantrix'inkini verir:

```kotlin
val Brand = PantrixTypeface(
    fonts = listOf(PantrixFont(Res.font.brand_regular), PantrixFont(Res.font.brand_bold, FontWeight.Bold)),
    fallbacks = PantrixTypeface.Default.fallbacks
)
```

Parametreler:

- `fonts: List<PantrixFont>`: Fontları: her biri ağırlığı ve stiliyle bir dosya. En az bir tane.
- `fallbacks: List<PantrixFont>`: Bir tarayıcının, `fonts`'un hiçbirinde olmayan bir karakteri çizdiği fontlar; onlarla birlikte okunur: yazı tipinin kapsamadığı bir yazı, Arapça gibi, ya da işaretler, Mac tuşlarınınki gibi. Her biri, metnin ağırlığı ne olursa olsun, olduğu gibi çizilir. Android'de, iOS'ta ve masaüstünde böyle bir karakteri sistemin fontları çizer ve bunlar okunmaz.

Başka bir kurucu:

```kotlin
constructor(vararg fonts: PantrixFont)
```

Parametreleri:

- `vararg fonts: PantrixFont`

Tipin kendisinde:

- `PantrixTypeface.Default: PantrixTypeface`: Pantrix'in kendi yazı tipi, Plus Jakarta Sans, kütüphanenin kaynaklarından: tipografi verilmeyen bir temanın çizdiği yazı tipi. Yedeği Pantrix Symbols, Noto'nunkilerden kesilmiş birkaç kilobaytlık bir font, bir kısayolun Apple'ın sistemlerinde yazıldığı ve Plus Jakarta Sans'ta olmayan işaretleri taşır: `⌘ ⇧ ⌥ ⌫ ⌦ ⇥ ⇞ ⇟ ⎋`.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### rememberPantrixFontFamily

`import com.pantrixui.foundation.token.typography.rememberPantrixFontFamily`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixFontFamily(typeface: PantrixTypeface): FontFamily
```

`typeface`'in ailesi: fontlarının her biri, dosyasından okunmuş olarak.

Tarayıcıda henüz gelmemiş bir font yedek yazı tipidir ve aile, fontları geldikçe değişir. `rememberPantrixTypography(typeface)` bir ekranın bunu göstermesini önler.

Parametreler:

- `typeface: PantrixTypeface`

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### areTypefacesLoaded

`import com.pantrixui.foundation.token.typography.areTypefacesLoaded`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun areTypefacesLoaded(vararg typefaces: PantrixTypeface): Boolean
```

`typefaces`'in her fontu, yedekleri de, okundu mu.

Android, iOS ve masaüstü bir fontu istendiği yerde okur ve bu, ilk kareden itibaren doğrudur. Tarayıcı dosyaları indirir: gelene dek onlarla yazılan her metin çizicinin taşıdığı yedek yazı tipiyle çizilir ve geldiklerinde yeniden yerleştirilir. Bir yazı tipinin yedekleri fontlarının yanında okunur ve okununca Compose'un metnine verilir; böylece yalnızca onlarda olan bir karakter ilk kareden onlarla çizilir.

Okumayı başlatan sormaktır ve her font birlikte istenir. Bu yüzden bir ekranın gerek duyduğu yazı tipleri tek çağrıda verilir: `&&` ile bağlanan iki çağrı, ilki gelmeden ikinci yazı tipini istemezdi. Bir dosyanın okunamadığı yerde yanlış kalır; bu yüzden ona bakarak bekleyen bir süre bekler, daha fazla değil.

Parametreler:

- `vararg typefaces: PantrixTypeface`

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### areTypefacesLoaded

`import com.pantrixui.foundation.token.typography.areTypefacesLoaded`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun areTypefacesLoaded(typefaces: List<PantrixTypeface>): Boolean
```

`typefaces`'in her fontunun okunup okunmadığı: bir uygulamanın ilk karesinin beklediği şeylerin listesi için, onu bir diziye yaymadan `areTypefacesLoaded`.

```kotlin
PantrixTypefaceGate(loaded = areTypefacesLoaded(AppTypefaces.all)) { App() }
```

Parametreler:

- `typefaces: List<PantrixTypeface>`

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### isPantrixTypefaceLoaded

`import com.pantrixui.foundation.token.typography.isPantrixTypefaceLoaded`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun isPantrixTypefaceLoaded(): Boolean
```

Pantrix'in kendi yazı tipi okundu mu: okunduysa `rememberPantrixTypography` onunla çizer.

Android, iOS ve masaüstü bir yazı tipini istendiği yerde okur ve bu, ilk kareden itibaren doğrudur. Tarayıcı dosyayı indirir: gelene dek her metin çizicinin taşıdığı yedek yazı tipiyle çizilir ve yazı tipi geldiğinde onunla yeniden yerleştirilir; okuyan bunu, sayfa açıldıktan bir an sonra harflerin değişmesi olarak görür. Bunu göstermek istemeyen bir web uygulaması ekranını bu doğru olunca çizer, o zamana dek de dilediğini:

```kotlin
if (isPantrixTypefaceLoaded()) App() else Splash()
```

Okumayı başlatan sormaktır; temanın yazı tipini sonradan hemen bulmasını sağlayan da odur: ilk kompozisyonda, bekleyecek ekrandan önce sorulur. Dosyanın okunamadığı yerde yanlış kalır; bu yüzden ona bakarak bekleyen bir uygulama bir süre bekler, daha fazla değil.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixTypefaceGate

`import com.pantrixui.foundation.token.typography.PantrixTypefaceGate`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun PantrixTypefaceGate(
    loaded: Boolean = isPantrixTypefaceLoaded(),
    timeoutMillis: Int = 3000,
    onShown: () -> Unit = {},
    content: @Composable () -> Unit
)
```

`content`'i, çizileceği yazı tipi okunduktan sonra çizer; o zamana dek hiçbir şey çizmez.

Tarayıcıdaki bir uygulama içindir ve uygulamanın tamamını sarar. Android, iOS ve masaüstü bir fontu istendiği yerde okur; orada `content` ilk karede çizilir. Tarayıcı fontu indirir ve gelene dek yedek bir yazı tipiyle çizer: o arada çizilen bir uygulamanın harfleri, açıldıktan bir an sonra değişir ve her metin yeniden yerleşir. Burada uygulama bir kez, kendi harfleriyle çizilir; beklerken sayfa uygulamadan önce gösterdiğini, kendi yükleme işaretini gösterir.

Hiç gelmeyen bir yazı tipi (dosya yok, ağ kesik) `timeoutMillis` kadar beklenir, daha fazla değil: uygulama o zaman yedek yazı tipiyle çizilir, çünkü boş bir sayfa yanlış harflerden kötüdür. Bir kez çizilen `content` yerinde kalır: sonradan değişen hiçbir şey onu kaldırmaz.

Parametreler:

- `loaded: Boolean`: Yazı tipi okundu mu: verilmezse Pantrix'in kendi yazı tipi için, bir uygulamanınki için `areTypefacesLoaded(…)`. Okumayı başlatan sormaktır.
- `timeoutMillis: Int`: Yazı tipi için beklenen en uzun süre.
- `onShown: () -> Unit`: `content`'i taşıyan kare çizildiğinde bir kez çağrılır: sayfa yükleme işaretini burada kaldırır ve altında boş bir sayfa değil, uygulama vardır.
- `content: @Composable () -> Unit`: Yazı tipini bekleyen: uygulamanın kendisi.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixTypography

`import com.pantrixui.foundation.token.typography.PantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
data class PantrixTypography(
    val display: TextStyle,
    val headline: TextStyle,
    val title: TextStyle,
    val callout: TextStyle,
    val body: TextStyle,
    val label: TextStyle,
    val footnote: TextStyle,
    val caption: TextStyle,
    val code: TextStyle
)
```

Dokuz yazı stili: büyükten küçüğe sekizi, `display > headline > title > callout > body > label > footnote > caption`, ve yanlarında `code`: label boyutunda, eş aralıklı bir ailede.

Parametreler:

- `display: TextStyle`: Sayfa başlığı. Çoğunlukla ekranda bir tane olur.
- `headline: TextStyle`: Bölüm başlığı.
- `title: TextStyle`: Kart, panel ya da dialog başlığı.
- `callout: TextStyle`: Öne çıkan gövde: bir giriş paragrafı, boş bir ekranın açıklaması.
- `body: TextStyle`: Gövde metni: bir paragraf, bir açıklama, Android'de ve iOS'ta bir alana yazılan.
- `label: TextStyle`: Kontrol etiketi: düğme, gezinme öğesi, form alanının etiketi, sekme; masaüstünde ve web'de bir alana yazılan. Temel yazı: tema `LocalPantrixTextStyle`'ı bununla başlatır, bu yüzden stil verilmeyen bir `PantrixText` bununla yazılır.
- `footnote: TextStyle`: Yardım metni: form yardımı, hata açıklaması, ikincil yönlendirme.
- `caption: TextStyle`: Üst veri: zaman damgası, sayaç, tablo hücresinin ayrıntısı.
- `code: TextStyle`: Kimlik taşıyan metin: ID'ler, olay adları, kod parçaları; bir kod bloğunun ve bir JSON görünümünün yazıldığı stil.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md), [Text](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/text.md)

### LocalPantrixTypography

`import com.pantrixui.foundation.token.typography.LocalPantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
val LocalPantrixTypography: ProvidableCompositionLocal<PantrixTypography>
```

The type scale in effect, which `PantrixTheme` provides: what `PantrixTheme.typography` reads. Outside a theme, Pantrix's own in the system's typeface.

### rememberPantrixTypography

`import com.pantrixui.foundation.token.typography.rememberPantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixTypography(): PantrixTypography
```

Pantrix'in yazı ölçeği, kendi yazı tipi Plus Jakarta Sans ile. Yazı tipi kütüphanenin kaynaklarından yüklenir.

Tarayıcı yazı tipini indirir ve gelene dek yedek bir yazı tipiyle çizer: geldiğini `isPantrixTypefaceLoaded` söyler.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### rememberPantrixTypography

`import com.pantrixui.foundation.token.typography.rememberPantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
@Composable
fun rememberPantrixTypography(
    typeface: PantrixTypeface,
    codeTypeface: PantrixTypeface? = null
): PantrixTypography
```

Pantrix'in yazı ölçeği, bir uygulamanın kendi `typeface`'iyle: ölçeğin boyutları ve ağırlıkları, yazı tipinin adını verdiği fontlarda; `codeTypeface` verilirse `code`'u onda.

Değişen bir yazı tipi gelince değişir. Tarayıcı bir yazı tipinin dosyalarını indirir ve onlar okunana kadar o yazı tipindeki metin yedek bir yazı tipiyle çizilir: bu yüzden `typeface` ya da `codeTypeface` yoldayken bu, ölçeği önceden verdiği yazı tiplerinde vermeyi sürdürür ve hepsi okununca bir kez yenilerinde verir. Önceden bir şey verilmediyse, bir uygulamanın ilk karesinde, yedek yazı tipinde verilir: `PantrixTypefaceGate` yazı tipleri gelene kadar ekranı bekletir.

```kotlin
val typography = rememberPantrixTypography(Brand, codeTypeface = BrandMono)
PantrixTheme(typography = typography) { App() }
```

Parametreler:

- `typeface: PantrixTypeface`: `code` dışındaki her rolün yazıldığı yazı tipi.
- `codeTypeface: PantrixTypeface?`: `code`'un yazıldığı yazı tipi: kimlikler, değerler, bir kod bloğunun satırları. Verilmezse platformun eş aralıklı ailesi; tarayıcıda ise böyle bir aile yoktur: Compose web'de sistemin yazı tiplerine ulaşmaz ve `code` orada sütunları hizalanmayan orantılı bir yedekle çizilir. Web için bir uygulama bir tane verir.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### buildPantrixTypography

`import com.pantrixui.foundation.token.typography.buildPantrixTypography`, `com.pantrixui:foundation` içinden

```kotlin
fun buildPantrixTypography(
    fontFamily: FontFamily = FontFamily.Default,
    headingFontFamily: FontFamily = fontFamily,
    monoFamily: FontFamily = FontFamily.Monospace
): PantrixTypography
```

Pantrix'in yazı ölçeği, `fontFamily` ile yazılmış hâliyle. Display, headline ve title için `headingFontFamily`, code için `monoFamily` kullanılır. Ölçeği koruyup yazı tipini değiştirmek için bir markanın aileleri verilir.

Parametreler:

- `fontFamily: FontFamily`
- `headingFontFamily: FontFamily`
- `monoFamily: FontFamily`

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### TypeRole

`import com.pantrixui.foundation.token.typography.TypeRole`, `com.pantrixui:foundation` içinden

```kotlin
enum class TypeRole
```

Yazı ölçeğinin bir rolü, işine göre: bir bileşenin stilinin, yazılarından birinin hangi türde yazıldığını yazı tipi tutmadan söylediği ad. Her birinin ne olduğunu temanın `PantrixTypography`'si söyler: `typography[TypeRole.Body]`.

Değerleri:

- `Display`: `PantrixTypography.display`.
- `Headline`: `PantrixTypography.headline`.
- `Title`: `PantrixTypography.title`.
- `Callout`: `PantrixTypography.callout`.
- `Body`: `PantrixTypography.body`.
- `Label`: `PantrixTypography.label`.
- `Footnote`: `PantrixTypography.footnote`.
- `Caption`: `PantrixTypography.caption`.
- `Code`: `PantrixTypography.code`.

Belgelendiği sayfalar: [Tipografi](https://develappsancho.github.io/pantrix-ui-cmp-package/pages/typography.md)

### PantrixTypography.get

`import com.pantrixui.foundation.token.typography.get`, `com.pantrixui:foundation` içinden

```kotlin
operator fun PantrixTypography.get(role: TypeRole): TextStyle
```

The style of `role` on this scale.

Parametreler:

- `role: TypeRole`
