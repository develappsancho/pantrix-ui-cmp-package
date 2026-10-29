# Değişiklik Günlüğü

English: [CHANGELOG.md](./CHANGELOG.md)

Pantrix UI'da nelerin değiştiği, kütüphaneyi kullanan biri için.

*   **Biçim:** bu dosya [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)'u, sürümler de [Semantic Versioning](https://semver.org/spec/v2.0.0.html)'i izler.
*   **Kırıcı değişiklikler:** 1.0.0'a kadar bir minor sürüm API'yi bozabilir. Bozan bir değişiklik **Kırıcı** diye işaretlenir.
*   **Hangi değişiklik satır alır:** hangilerinin aldığını ve satırın nasıl yazıldığını CONTRIBUTING.tr.md anlatır.

## [0.1.0-alpha01] - 2026-10-29

Kütüphanenin ilk sürümü 0.1.0'ın ilk önizlemesi: API'si 0.1.0'a kadar değişebilen bir alfa. Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlenir.

Hedefleri:

*   Android, API 30 ve üstü;
*   iOS: cihazlar ve Apple silikonlu Mac'te simülatör;
*   JVM;
*   JS ve Wasm.

Şunları taşır; her modül yayınlandığı adın altında.

### Eklenenler

#### Foundation

`com.pantrixui:foundation`

*   **Tema:** `PantrixTheme`, bir markanın görünüşünü tek bir yerde toplayan `DesignPreset`, iç içe temalar, uygulamanın okurunun seçtiği koyuluk için bir preset'in renkleri (`rememberPantrixColors(preset, darkTheme)`) ve Android'de ve iOS'ta sistem çubuklarının, klavyenin ve sistem kontrollerinin sistemin koyu modunu değil temayı izlemesi (`followSystemBars`).
*   **Tokenlar:**
    *   renk rolleri, palet ve içerik rengi;
    *   tip ölçeği, yazı tipleri, kod için bir yazı tipi (`rememberPantrixTypography(typeface, codeTypeface)`) ve web'de yazı tiplerini tek tek ya da bir liste olarak bekleyen bir kapı;
    *   boşluklar, şekiller, yükseklik, yoğunluk ve platforma göre bileşen stilleri;
    *   sistemin azaltılmış hareket ayarına uyan hareket.
*   **Erişilebilirlik:** odak halkaları, dokunma alanları, modal katmanlar, odaktaki alanı barların altında bırakmamak ve her platformun kendi alışkanlıkları.
*   **Uyarlanabilir yerleşim:**
    *   pencere boyut sınıfları, kırılma noktaları, sayfa kenar boşlukları, yerleşim sütunları ve en fazla içerik genişliği;
    *   Android'de ve iOS'ta katlanabilir cihazların duruşları ve kat yerinin bir yanında kalan overlay'ler;
    *   iOS'un katlanabilir bir iPhone'un dış ekranında gösterdiği dikey bar.
*   **Yerelleştirme:** Türkçe, İngilizce ve Arapça metinler, sağdan sola yerleşim, haftanın başladığı gün, her dilin kendi rakamlarıyla sayılar ve dile göre alfabetik sıralama.
*   **Platform hizmetleri:** dokunsal geri bildirim, pano, dosya seçme, bırakma ve kaydettirme (`FileSaver`), klavye kısayolları, alanın dışına dokununca klavyenin kapanması (`Modifier.clearFocusOnTap`), yeniden boyutlandırma işaretçileri, sistem ayarları, pencerenin gösterilen ekranın adıyla anılması ve bir tarih kütüphanesi olmadan tarihler ve saatler.
*   **Testler ve ürünler için:** otomasyon etiketleri (`TestScope`; bir testin aradığı etiket için `pantrixTestTagOf`; uygulamanın kendi açtığı bir penceredeki etiketlerin Android'in otomasyonuna ulaşması için `Modifier.pantrixAutomationRoot`), bir testin ya da önizlemenin verdiği ekran saati, dosya seçici ve dosya kaydedici (`LocalPantrixClock`, `LocalFilePicker`, `LocalFileSaver`) ve analitik için arayüz olayları; olaylar, etiketlerini semantik ağacın dışında tutan bir derlemede de (`TestTagPolicy.Off`) her bileşenin etiketini taşır.
*   **Tanılama:** temasına `diagnostics` verilen, çalışan bir ekranın denetimleri: iki düğümde aynı etiket, okunmayan renkler, sıkışan bir dokunma hedefi, boş bir ad, kendi sözleri olmayan bir dil ve gölgede kalan bir kısayol. Bulguları günlüğe gider ya da bir test için saklanır; `contrastRatio` iki rengi WCAG 2.2'nin ölçtüğü gibi ölçer.

#### Bileşenler

`com.pantrixui:components`

Her biri `Pantrix…` adını taşıyan 100 bileşen:

*   **Öğeler:**
    *   metin, ikonlar ve görseller;
    *   düğmeler, ikon düğmeleri, düğme grupları, etiketleri kendi yazı stiliyle yazılabilen segment düğmeleri, altı hep ya da yalnızca işaretçinin altında çizili bağlantılar (`LinkUnderline`) ve chip'ler;
    *   rozetler, avatarlar, ayırıcılar, iskeletler ve dönen yükleme işaretleri;
    *   onay kutuları, radyo düğmeleri ve radyo grupları, etiketi kendi yazı stiliyle yazılabilen anahtarlar; her birinin denetimi etiketinin önünde ya da satırın sonunda (`ControlPosition`);
    *   bir dosya bırakma alanı ve dosya satırları;
    *   bir ekranın kendi içeriği için bir kaydırma çubuğu: onunla kayan bir sütun (`Modifier.pantrixVerticalScroll`) ve tembel bir liste (`Modifier.pantrixScrollBar`).
*   **Girdiler:** metin alanları (dolgulu ve şifreli halleriyle; birkaç satırlık kutuları metnin ne kadar kaydığını gösterir), metinle birlikte uzayan alanlar ve metin kutuları (çerçeveli ve dolgulu): bir tutamaçla boyutlanır, metinleri sınırı geçebilir (`TextLimit`) ve Ctrl ya da Cmd ile Enter gönderir.
*   **Tarih ve saat:** bir tarih seçici, bir saat seçici, maskeli tarih ve saat alanları ve aralıklar için esnek bir tarih seçici.
*   **Kapsayıcılar:** bir yüzey, gövdesi verilen yüksekliği dolduran ve eylemleri altta duran bir kart, bir akordeon, iletisinde kod ve bağlantı da olabilen, uygulama verdiğinde kendi yazısıyla yazılan, kenarı kendi renginde çizilebilen ve yatay ile dikey iç boşluğu ayrı verilebilen bir uyarı, sekmeler, geri düğmesiyle bir üst bar, bir scaffold, onun içinde bar'ı ya da başlığı, yere göre dizilen eylemleri ve bir liste biçimiyle bir sayfa ve onun dışında formunun yanında bir vitrinle, dar bir yerde yalnızca formuyla bir ekran; uyarlanabilir liste-ayrıntı, destek paneli, masa duruşu ve iki panel yerleşimleriyle.
*   **Gezinme:** bir metin satırı kadar alçak durabilen bir breadcrumb, bir gezinme barı, bir gezinme rayı ve grupları bir başlık taşıyabilen, satırları ve başlıkları kendi yazı stiliyle yazılabilen ve sığmayan satırlarında bir kaydırma çubuğu olan bir kenar çubuğu.
*   **Katmanlar:** uygulamanın kendi modal katmanı (`PantrixModal`), bir dialog, alt, son ya da baş kenar boyunca bir sheet, bir popover, seçili satırında bir işaret ve bir satırın etiketinin altında, kendi yazı stiliyle de yazılabilen ikinci bir satırla bir menü, bir tooltip, bir snackbar, bir seçim, çoklu bir seçim, komutları ikinci bir satır taşıyabilen bir komut paleti ve bir uygulamanın üstünde temasının tanılamasının bulduğunu gösteren bir inspector.
*   **Veri:** bir başlık, üstündeki ve altındaki satırlar, onu başlatan ve bitiren şey, bir ok başı ve altında bir çizgiyle liste satırları (`PantrixListItem`), bir veri tablosu, bir ağaç görünümü, bir carousel, başlığının başında sekmeleri, kendi yazı stili ve satırları kurulmadan bir satırın ondan isteyebildiği bir yüksekliğiyle bir kod bloğu, bir JSON görünümü, uygulamanın verdiği bir yazı stiliyle de yazılabilen etiketler ve sayfaya atlama ile sayfa boyutuyla birlikte sayfalama.
*   **Grafikler:**
    *   çizgi, alan, aralık, sütun, şelale ve mum grafikleri ve serilerini bir araya getiren bir grafik;
    *   pasta ve polar grafikler, bir gösterge, bir ilerleme halkası, bir ölçü grubu, bir durum izleyici ve bir sparkline;
    *   dağılım ve radar grafikleri, bir ısı haritası ve bir ağaç haritası;
    *   huni, Sankey ve Gantt grafikleri.

    Yakınlaştırma, bir gezinme şeridi ve PNG, SVG ve PDF olarak dışa aktarmayla birlikte gelirler.
*   **Formlar:** `FormState` ve alanları; kurallarıyla, hatalarıyla ve gönderimle. Metin alanları, metin kutuları, onay kutusu, radyo grubu, anahtar, seçimler ve tarih ve saat alanları bir alana doğrudan bağlanır.

#### Açıklamalar

`com.pantrixui:annotations`

*   Her bileşeni araçlar için tarif eden `@PantrixComponent` ve `@PantrixExample`: adı, grubu, açıklaması ve anahtar sözcükleri, kısa örnekleri. `@PantrixComponentPart` bir bileşenin parçasını işaretler.

#### Material 3

`com.pantrixui:material3`

*   Pantrix'in temasıyla Material 3'ünkü arasında iki yönlü bir köprü: `PantrixThemeFromMaterial` bir Material temasının içindeki Pantrix bileşenlerine onun renklerini, yazılarını ve şekillerini, `followSystemBars = false` denmedikçe sistemin çubuklarına da onun koyuluğunu verir; `MaterialThemeFromPantrix` bir Pantrix temasının içindeki Material bileşenlerine Pantrix'inkileri. `toPantrixColors`, `toColorScheme`, `toPantrixTypography`, `toMaterialTypography`, `toPantrixShapes` ve `toMaterialShapes` bir temanın değerlerini ötekininkine çevirir; `PantrixContentFromMaterial` ve `MaterialContentFromPantrix`, karışık bir ekranda bir sistemin içerik rengini ve yazı stilini ötekinin bileşenlerine geçirir. Material 3 1.9.0'a göre derlenir; uygulamanın daha yeni Material 3'ü kullanılan olur.

#### Test

`com.pantrixui:testing`

*   Bir uygulamanın testleri için, her hedefte: bir bileşeni etiketiyle bulmak (`onPantrixNode`, `hasPantrixTag`, `pantrixTags`), sabit varsayılanlı bir tema (`PantrixTestTheme`, `onEachPlatform`), pano, dosya seçici, dosya kaydedici, analitik, dokunsal geri bildirim ve saat için test çiftleri; tanılamanın bulguları, adlar, dokunma hedefleri, kısayollar ve yazı için doğrulamalar. Android'de bir Compose testinin başlattığı etkinliği de getirir.

#### Araçlar

`com.pantrixui:detekt-rules`, `com.pantrixui:mcp`

*   Kütüphaneyi kullanan bir uygulama için detekt kuralları: okuma yönünü izleyen yerleşim (`FixedSideLayout`), ne gösterdiğini söyleyen görseller (`ImageWithoutDescription`) ve `tagKey` taşıyan kontroller (`UntaggedControl`); bu üçü kendiliğinden açık. Kütüphanenin kendi kuralları da bir uygulamanın açabileceği kurallar olarak gelir.
*   Kodlama asistanları için `com.pantrixui:mcp`: kütüphanenin kaynaklarından yazılan belgeleri (`llms.txt`, `llms-full.txt`, demo'nun her sayfası için bir sayfa, her modülün API'si, uygulamalara dönük rehberler ve şemasıyla `pantrix-ui.json`), demo sayfalarının, rehberlerin ve değişiklik günlüğünün Türkçesini de, `pantrix-ui` skill'i ve onlardan on iki araç, dokuz kaynak ve üç prompt'la cevap veren bir MCP sunucusu. `all` sınıflandırıcılı jar'ı sunucuyu kendi başına çalıştırır ve paketlediklerinin lisanslarını taşır.
