# Değişiklik Günlüğü

English: [CHANGELOG.md](./CHANGELOG.md)

Pantrix UI'da nelerin değiştiği, kütüphaneyi kullanan biri için.

*   **Biçim:** bu dosya [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)'u, sürümler de [Semantic Versioning](https://semver.org/spec/v2.0.0.html)'i izler.
*   **Kırıcı değişiklikler:** 1.0.0'a kadar bir minor sürüm API'yi bozabilir. Bozan bir değişiklik **Kırıcı** diye işaretlenir.
*   **Hangi değişiklik satır alır:** hangilerinin aldığını ve satırın nasıl yazıldığını CONTRIBUTING.tr.md anlatır.

## [0.2.1] - 2026-11-11

0.2.1, 0.2.0'dan sonra bulunan iki şeyi düzeltir. Bir fare uzun bir listenin kaydırma başparmağını uzağa sürüklediğinde liste doğrudan oraya konur: `PantrixCodeEditor`'daki elli bin satırlık bir belge böyle bir sürüklemenin her adımında takılıyordu, Pantrix'in kaydırma çubuğu olan her uzun liste de öyle. Kodlama asistanları için belgeler de kod editörünün örneklerinin kodunu bütün taşır; yedisi ham bir dizgi olarak yazılmış bir yardımcının ilk satırında duruyordu. Genel API değişmez.

### Düzeltilenler

#### Bileşenler

`com.pantrixui:components`

*   Bir fare, uzun bir listenin kaydırma çubuğunun başparmağını bir ekrandan uzağa sürüklediğinde liste doğrudan oraya konur; `PantrixCodeEditor`, `PantrixCodeBlock`, `PantrixJsonView`, `PantrixLazyTreeView`, `PantrixDiffView`, `PantrixDataTable` ve `Modifier.pantrixScrollBar` verilen bir `LazyColumn`'da: liste piksel piksel kaydırılıyor ve geçtiği her satırı kuruyordu, elli bin satırlık bir belgenin sürüklenmesi her adımda neredeyse bir saniye takılıyordu.

#### Araçlar

`com.pantrixui:mcp`

*   MCP sunucusunun belgeleri, web demosunun yanındaki `llms-full.txt` ve `pantrix-ui.json` da, yardımcısı ilk kolonda kapanan ham bir dizgi olan bir örneğin kodunu bütün taşır: `PantrixCodeEditor`'ın yedi örneği yardımcının ilk satırında, `private val TASKS = """`'ta duruyordu ve derlenmiyordu.

## [0.2.0] - 2026-11-11

0.2.0, belgelerle ve kodla çalışan bir uygulama için sekiz bileşen ekler: `PantrixCodeEditor`, `PantrixLazyTreeView`, `PantrixKeycaps`, `PantrixGraph`, `PantrixToolbar`, `PantrixStatusBar`, `PantrixDiffView` ve `PantrixEmptyState`; hepsi 108. Çevrelerinde bir paylaşım sayfası, panodaki metin ve bir düğümün duyduğu yapıştırma, önizlemeler için bir tema, bir dilin aramadaki küçük harfleri ve listeleri, kapanan ve henüz kaydedilmemiş sekmeler, `PantrixDataTable`'da seçili bir hücre ve içerik genişliğinde, ortada duran bir sayfa gelir. İki değişiklik bir çağrıyı bozar: `tagKey` her bileşenin son parametresidir, bütün argümanları konumla verilen bir `DataTableColumn` da sonuncusunu adıyla verir. iOS'ta bir tablonun semantik ağacı üçte bir kadar küçülür, bir listenin sayfası da odağı alttaki bar'ın üstünde tutar.

### Eklenenler

#### Bileşenler

`com.pantrixui:components`

*   `CodeTokenKind.Property` ve `CodeTokenKind.Tag`: bir üyenin ya da bir ayarın adı (bir JSON nesnesinin anahtarı, bir XML öğesinin niteliği) ve bir işaretleme dilinde bir öğenin adı; onları renklendirmek için `CodeBlockColors.property` ve `CodeBlockColors.tag`. `PantrixCodeBlock`, kendi renkleri verilene kadar bir niteliği tipin, bir etiketi anahtar sözcüğün renginde çizer: birine sahip diller ötekine pek sahip değildir.
*   `PantrixCodeEditor`, 101. bileşen: yazılan ve değiştirilen kod; her uzunlukta, satır satır bir `CodeEditorState`'te tutulur (`rememberCodeEditorState`; uygulama onu `replace`, `setText` ve `edit` ile değiştirir), uygulamanın kendi `CodeHighlighter`'ıyla renklendirilir, satırları numaralıdır. Bir editörün tuşları vardır: seçimin satırlarında Tab ve Shift+Tab, girintiyi koruyan satır besleme, bir sözcüklük geri alma, satırları taşıma, kopyalama ve silme, yorumlar ve eşleşen parantez; dilin `CodeSyntax`'ına göre yazıldıkça kapanan parantez ve tırnaklar; satırlarda, imleç üstündeyken de bantlarını koruyan, ve metnin parçalarında, altı çizili ya da vurgulu (`CodeRangeStyle`), işaretler (`CodeRangeMark`), imlecin satırının bandının üstünde; o bant yalnızca editör odaktayken çizilir; imleci taşımadan ekrana getirilen satırlar (`CodeEditorState.revealLines`); yana kaymak yerine sıra sıra alttan devam eden uzun satırlar (`softWrap`); bir bul ve değiştir çubuğu, aynısı durumda da (`CodeSearch`, `findNext`, `findAll`, `replaceNext`, `replaceAll`, `CodeFind`); telefonun klavyesinin üstünde bir tuş satırı (`CodeKey`); `CodeEditorStyle` ve `CodeEditorColors`. Sekme masaüstünde, iOS'ta ve web'de dört boşluk genişliğindedir; tarayıcıda editörün tuşları yalnızca onundur; Android'in klavyesinden sözcük önerisi istenmez; Ctrl+/ klavyenin yerleşiminde "/" yazan tuştur da, Türkçe ya da Almanca klavyede Ctrl+Shift+7.
*   `PantrixGraph`, 104. bileşen: sürüklenen, tekerlekle kayan ve yakınlaştırılan bir zeminde düğümler ve aralarındaki bağlar (`GraphState`, `rememberGraphState`: `zoomIn`, `zoomOut`, `zoomTo`, `fit` ve `bringIntoView`); grafik onları `GraphDirection`'ın yönünde bir ağaç olarak, bir düğümün iki ebeveyni olduğunda katmanlara dizer; bir döngüyü kapatan bağ geriye çizilir. Her kart, grafiğin çizdiği bir çerçevenin içinde uygulamanın içeriğidir (`GraphNodeScope`); `GraphNode`'unun boyutu verildiğinde yalnızca görünürken kompoze edilir. Seçili kart ve açık kartlar uygulamanındır; `expandedToLevel` onları bir derinliğe kadar açar. Oklar kartlar arasında grafiğin yönünde gezinir; ekran okuyucu her kartın yerini ve düzeyini duyar. `GraphFoldButton`, `PantrixGraphZoom`, `GraphLink`, `GraphGround`, `GraphLinkShape`, `GraphStyle` ve `GraphColors` ile birlikte.
*   `PantrixKeycaps`, 103. bileşen: bir `PantrixShortcut`'ın tuşları, her biri kendi kapağında, uygulamanın çalıştığı sistemin sırasıyla ve adlarıyla; ekran okuyucu kısayolu bir kez, sistemin yazdığı gibi okur; kapaklar yanlarındaki yazının çizgisinde durur. İki boyutu (`KeycapsSize`) ve `KeycapsStyle`, `KeycapSizeStyle` ile `KeycapsColors`'ı vardır.
*   `PantrixLazyTreeView`, 102. bileşen: kendi alanında kayan ve yalnızca görünen satırlarını kompoze eden çok satırlı bir ağaç; satırları, seçimi, açınca yüklemesi ve süzmesi `PantrixTreeView`'ünkilerdir. `TreeViewState`'i (`rememberTreeViewState`) satırların nereye kaydığını tutar; `scrollToKey` görünen bir satırı en kısa yoldan görünüme getirir; ağaç yerleşmeden istenirse yerleşimi bekler ve o zaman görünürde olan satır yerinde kalır. Tuşlar vardıkları satıra kaydırır, Tab görünürdeki bir satıra gelir.
*   `TreeNode.styledLabel`: bir düğümün etiketini kendi biçimleriyle, bir belgenin sözdizimi renkleri gibi, süzmenin işaretlerinin altında çizer; seçili satırda ve seçilemeyen satırda öteki biçimleri kalır, rengi satırın kendi rengidir; kendi dolgusu olan bir parça kendi rengini korur. `TreeViewStyle.labelRole`: etiketlerin yazıldığı yazı, kodunki gibi. `PantrixTreeView`'ün ve `PantrixLazyTreeView`'ün `trailing`'i: her satırın sonuna düğümü için bir şey çizer.
*   `TreeRowAction` ve `PantrixTreeView` ile `PantrixLazyTreeView`'ün `rowAction`'ı: bir satırın seçilmekten başka yaptığı iş, bir değerin bağlantısını açmak gibi; satırın sonunda bir simge düğmesi olarak çizilir, simgesi öteki satırların sonundaki şeylerle aynı çizgide biter ve çevresinde platformun dokunma hedefi kadar yerde basılır. Ona basmak eylemi satırı seçmeden çalıştırır, odaktaki satırda Shift+Enter da çalıştırır, ekran okuyucuya satırın eylemleri arasında sunulur.
*   `PantrixCodeBlock`'ta ve `PantrixCodeEditor`'da `CodeMark.bar`, `CodeMark.showBar` ve `CodeMark.gutter`: işaretli bir satırın çubuğunun, bandınki değilse tonu, bir karşılaştırmanın gösterdiği fark için olduğu gibi, ya da hiç çubuk olmaması, yalnızca bant; ve satırın numarasının önünde bir işaret, bir karşılaştırmanın eklediği, çıkardığı ve değiştirdiği satırlar için `+`, `−` ve `~` gibi. Kurucunun ve `copy`'nin eski hâlleri, onlarla derlenmiş kod için durur.
*   `PantrixTwoPane`'in `onFirstSizeChange`'i: panellerin arasındaki boşluğa bir tutamak koyar; parmak, işaretçi, ok tuşları ve ekran okuyucu birinci paneli onunla, ikincinin yanında ya da üstünde, büyütür ve küçültür. Boyut, `firstSize` hangi türle verildiyse o türle bildirilir. Bir kat yeri yeri ikiye ayırıyorsa tutamak yoktur.
*   `PaneHandleColors`: iki panelin arasındaki tutamağın çubuğunun renkleri; dururken, işaretçinin altında ve sürüklenirken, odakta. `PantrixTwoPane`'e, `PantrixListDetailScaffold`'a ve `PantrixSupportingPaneScaffold`'a `handleColors` olarak verilir; verilmeyen renk temanınki kalır.
*   `DataTableColumn`'un ve `DataTableColumn.text`'in `subtitle`'ı: tabloda bir kolonun başlığının altında, daha küçük yazılan ikinci bir satır; kolonun değerlerinin türü. Ekran okuyucu onu başlıktan sonra okur. Kurucunun ve fonksiyonun eski hâlleri, onlarla derlenmiş kod için durur.

*   `PantrixJsonView`'in iki biçiminde de `selectedPath`, `onSelect` ve `state`: bir değerin başladığı satır, bir ağacın satırı gibi, basışla ve Enter ile seçilir; oku ve boşluk onu katlar. Seçili satır baştan sona doldurulur (`JsonViewColors.selectedContainer` ve `selectedContent`) ve Tab ona gelir. `JsonViewState` (`rememberJsonViewState`) bir yolun satırını, ona giden yolu açarak, `scrollToPath` ile kısa yoldan ekrana getirir. `JsonViewColors`'un kurucusunun ve `copy`'sinin eski hâlleri, onlarla derlenmiş kod için durur.

*   `PantrixFileDrop`'un `actionLabel`'ı ve `dragOverLabel`'ı: temanın sözleri uygulamanınki olmadığında, tek dosya alan bir alanda olduğu gibi, alanın etiketinin altındaki satır, öteki yol, ve üstüne bir şey sürüklenirken söylediği için kendi sözleri. İkisi de verilmezse alan eskiden söylediğini söyler.

*   `PantrixToolbar`, 105. bileşen: bir ekranın ya da bir bölmenin yapabildiklerinden bir satır; `start`'ında ve `end`'inde `ToolbarItem`'lar (`Button`, `IconButton`, `Menu` ve `Divider`). Yeri yetmeyince öğeleri en düşük `priority`'den başlayarak birer birer yer açar: simgeli bir düğme önce simgesiyle çizilir, yine sığmazsa bir sonraki bir şey bırakmadan kendi "…" menüsüne katlanır; orada her biri aynı etiketle bir satırdır, altında menünün her zaman tuttuğu `menuItems` (`ToolbarMenuItem`); katlanan bir `Menu` satırlarını menünün yerinde açar. Bar tek bir Tab durağıdır, oklarla, Home ve End ile gezilir; `ToolbarStyle` ve `ToolbarColors` ile birlikte.
*   `PantrixDiffView`, 107. bileşen: iki metnin satır satır karşılaştırması (`diffLines`, Myers'ın en kısa düzenlemesi), görünümün genişliğine göre yan yana ya da tek sütunda (`DiffLayout`). Çıkan satır danger rolünün yumuşak dolgusunda ve önünde −, eklenen success rolününkinde ve önünde +; başka yazılan satırın değişen sözcükleri daha koyu bir payla, en çok benzeyen satırlar karşı karşıya. `context` satırdan uzaktaki değişmeyen satırlar basınca açılan bir satıra katlanır; uzun satırlar kendi altında sürer ya da iki sütun yana birlikte kayar; isteğe bağlı başlıklar kaç satırın değiştiğini söyler. `DiffViewState` (`rememberDiffViewState`) değişiklikleri (`changes`, `DiffChange`) tutar, `scrollToChange` ile birini ekrana getirir ve gösterileni bir çubukla işaretler; Alt ve oklar onu taşır. Uygulamanın kendi karşılaştırması `DiffLine` olarak verilir; uzun metinler ana iş parçacığının dışında karşılaştırılır; `ignoreWhitespace` satırları boşlukları olmadan karşılaştırır. `DiffViewStyle`, `DiffViewColors` ve ekran okuyucuya söylenenler için `PantrixStrings`'in sözleriyle.
*   `PantrixStatusBar`, 106. bileşen: bir pencerenin ya da bir bölmenin altında işlerin nasıl durduğunu söyleyen kısa bar; `start`'ında ve `end`'inde `text`, `button` ve uygulamanın kendi `item`'ı (`StatusBarScope`). İşaretçinin altında 28dp, telefonda ve tablette 32dp'dir; 24dp'lik düğmeleri uzatılmaz, platformun dokunma hedefine kadar barın dışından basılır, "…" düğmesi de dokunmada ona yetecek genişlikte çizilir; yeri olmayan `priority`'ye göre "…" menüsüne katlanır; `live` verilen sözcükler değişince söylenir. `StatusBarStyle` ve `StatusBarColors` ile birlikte.

*   `PantrixEmptyState`, 108. bileşen: bir yerin gösterecek bir şeyi yokken gösterdiği, ilk öğesinden önceki bir liste, hiçbir şey bulamayan bir arama, bir belge bekleyen bir bölme: nötr dolguda bir dairede bir `icon`, bir `title`, callout'un yazısında bir `description` ve altlarında uygulamanın kendi `action`'ı; verilen genişliğin ortasında, sözleri 360dp'den geniş akmadan; başlık ve açıklama tek parça okunur. `EmptyStateStyle` ve `EmptyStateColors` ile.
*   `PantrixLazyTreeView(source)` ve `TreeSource`, bir liste olarak verilemeyecek kadar büyük bir ağaç için: ağaç her açık dalın kaç çocuğu olduğunu sorar, bir düğümü de yalnızca satırı görünmek üzereyken ister; yüz bin çocuklu bir dal ekrandaki satırlar kadar tutar. `TreeSource.indexOf` henüz gösterilmemiş bir anahtarı, açık bir dal ve `scrollToKey` için bulur. Satırlarını birer birer seçer ya da hiç seçmez, süzgeci yoktur.
*   `TreeNode.childCount`: çocukları henüz gelmemiş bir dalın kaç çocuğu olacağı; ekran okuyucuya kapalı satırda söylenir.
*   `PantrixDataTable(selectedCell)` ve `DataTableCell`: satırının ve kolonunun anahtarıyla seçili tek hücre, temanın birincil renginde, satırı kadar yüksek bir çerçeveyle; listede kaydın o kolonun satırı, hücrenin `Cell_<row>/<column>` etiketiyle. Ekran okuyucuya seçili olan olduğu söylenir; satırı tek bir düğme olan yerde onu ayrı okur.
*   `PageTitlePlacement.Content`: sayfanın başlığı her genişlikte içeriğinde bir başlıktır ve sayfanın barı yoktur; kendi barını çizen bir kabuğun içindeki sayfa için; `PantrixPageScaffold(titleStyle, subtitleStyle)` ve `PantrixLazyPageScaffold`'taki aynıları o başlığın yazısını verir, bir açılış ekranının büyük başlığı; `PageScaffoldStyle.headingGap` ve `subtitleMaxWidth`, o başlığın başlığıyla satırı arasındaki boşluk ve satırın ne kadar geniş olduğu; ve `PageWidth.Centered`, içerik genişliğinde, başlığıyla birlikte sayfanın ortasında duran bir sayfa.
*   `TabItem.onClose` ve `PantrixTabs(trailing)`: sonundaki bir çarpıyla, Delete ile ve ekran okuyucunun eylemiyle kapanan bir sekme; son sekmenin hemen ardında, yenisini açan bir "+" düğmesi; `TabItem.unsaved`, çarpının yerinde, işaretçinin altında ve odakta çarpıya dönen bir nokta, ekran okuyucuya kaydedilmedi diye söylenir.
*   `TabsStyle.dividerWidth`: satırın altındaki ince çizginin kalınlığı, hiç çizgi için sıfır.
*   `PantrixMenu(title)`, panelde satırların üstünde bir satır ve dar bir pencerede sheet'in başlığı, ekran okuyucu onu menünün adı olarak duyar; `PantrixMenuItem(trailingText, trailingTextStyle)`, bir satırın sonunda, dokunmayla kullanılan platformda da yazılan bir iki sözcük.
*   `PantrixTag(onClick, trailingIcon)`: bir şeyin nasıl durduğunu söyleyen ve onu değiştireni açan bir etiket, sonunda bir okla bir düğme; sıkışık bir satırda kendi yüksekliğini korur ve çevresinden, platformun dokunma hedefi kadar basılır.
*   `CodeMark.actions` ve `CodeMarkAction`: bir kod düzenleyicinin gösterdiği mesajın altında bir ya da iki düğme; Ctrl+. ya da Cmd+. odağı onlara götürür, fare ya da odak içindeyken not yerinde kalır. `CodeMark.description`: ekranda hiçbir şeyin söylemediği yerde ekran okuyucuya işaretli bir satırın ya da parçanın söylenen adı, kod düzenleyicide ve kod bloğunda.
*   `CodeRangeStyle.Current`: tonunun renginde bir çerçeveyle vurgulanan bir parça, uygulamanın üstünde olduğu.
*   `PantrixSegmentButton`'a grubun adı, `ToolbarItem.Button`'a ve `ToolbarItem.Menu`'ye ekran okuyucunun düğmeye bar'da ve "…" menüsünde dediği ad olarak `contentDescription`; `ToolbarItem.Button.selected`, geçerli görünümün düğmesi: Soft düğmenin dolgusuyla çizilir, seçili diye söylenir ve "…" menüsünde işaretlidir.

#### Foundation

`com.pantrixui:foundation`

*   `PantrixIcons.Image`, çerçeveli bir resim, ve `PantrixIcons.ExternalLink`, uygulamanın dışında açılan bir bağlantı; sağdan sola düzende aynalanmaz.
*   `PantrixStrings`, kod editörünün sözcüklerini İngilizce, Türkçe ve Arapça taşır: bul çubuğununkileri (`replace`, `replaceAll`, `matchCase`, `wholeWord`, `regularExpression`, `previousMatch`, `nextMatch`, `matchPosition`, `matchCount`, `invalidRegularExpression`), tuş satırınınkileri (`indent`, `undo`, `redo`, `caretLeft`, `caretRight`, `caretUp`, `caretDown`) ve adınınkileri (`codeEditor`, `codeEditorKeys`).
*   `Modifier.keepFromBrowser(shortcuts)`: odak bir düğümdeyken ya da içindeyken, o düğümün kendi karşıladığı tuşlar üzerine tarayıcının bir şey yapmasını önler: web'de bir metin alanında basılan Cmd+F uygulamanın kendi aramasını açar, tarayıcının bul çubuğunu da açmaz. Öteki platformlarda bir şey yapmaz.
*   `PantrixStrings.paneSize`: klavyenin ve ekran okuyucunun iki panelin arasındaki tutamağı tanıdığı ad; İngilizce, Türkçe ve Arapça.
*   `PantrixCheck.GraphCycle`: tanılama, bir grafiğin bağları bir döngüye girdiğinde bunu bildirir; `Modifier.checkGraphCycles` uygulamanın kendi grafiğinin döngüyü kapatan bağlarını ona söyler.
*   `PantrixIcons.FitScreen`, bir çerçevenin çevresinde dört köşe, bir şeyin hepsini bir arada göstermek için; sağdan sola düzende aynalanmaz. `PantrixStrings.fitToView`, onun düğmesinin adı, ve `PantrixStrings.itemPosition`, bir öğenin yanındakiler arasındaki yeri, ekran okuyucunun söylediği gibi; İngilizce, Türkçe ve Arapça.
*   `PantrixClipboard.readText()`: panodaki düz metni okur, panoda metin yoksa ya da okunamıyorsa `null` verir. `ClipboardTraits.readable` okunacak bir pano olup olmadığını söyler: tarayıcı onu yalnızca güvenli bir bağlamdaki ve `navigator.clipboard.read`'i olan bir sayfaya verir, ekransız bir JVM'in de panosu yoktur.
*   `Modifier.onPaste`: odak düğümündeyken ya da içindeyken, oradaki bir metin alanı almadıkça okuyucunun yapıştırmasını, Cmd+V'yi ya da Ctrl+V'yi duyar. Web'de tarayıcının kendi yapıştırmasını duyar; tarayıcı metni okuyucuya sormadan verir. Tarayıcının menülerinden, tuşsuz gelen yapıştırmayı da duyar: odağın içinde olduğu en içteki düğüm alır, ya da odağı kendisi tutan bir pencere kökünün altındaki en dıştaki. iOS'ta odakta UIKit'in bir metin girişi varken tuşu UIKit'e bırakır.
*   `PantrixPreviewTheme`: bir önizlemenin bir ekranı çizdiği tema; makine ne olursa olsun verilen platformda, koyu ya da açık, verilen pencerede ve anda, içindeki uygulama teması da bunları koruyarak; böylece `commonMain`'deki bir önizleme bir hâli, onun `PantrixTestTheme`'deki ekran görüntüsü testinin gösterdiği gibi gösterir.

*   `PantrixIcons.ChevronUp`, `Code`, `Settings`, `Sun`, `Moon`, `Clipboard`, `History`, `Delete` ve `Share`, bir uygulamanın kendi ekranları için: bir aramanın önceki eşleşmesi, bir dilde yazılan, ayarları, açık ve koyu görünüm, yapıştırma, önceden açılanlar, atma ve başka yere gönderme. Hiçbiri sağdan sola düzende aynalanmaz.

*   `Modifier.checkTouchTarget(min, beyond)`: basışı çizdiğinin dışına taşan bir denetimin basıldığı alanı tanılamaya söyler, bu alan hedeften küçükse `PantrixCheck.SmallTouchTarget` bildirir; ve `PantrixStrings.statusBar`, ekran okuyucunun bir durum barına verdiği ad, İngilizce, Türkçe ve Arapça.

*   `PantrixTheme.isDark`: en yakın temanın koyu olup olmadığı; renklerini buna göre kendisi seçen bir uygulama teması için.
*   `PantrixLocale.fold(text)` ve `PantrixLocale.contains(text, part)`: bir metin, bu dilin küçük harfleriyle, noktalı ve noktasız I Türkçede ve Azericede olduğu gibi, metin kadar uzun; onunla bir arama.
*   `PantrixStrings.fullDate(day, month, year)`, ayının adıyla ve haftanın günü olmadan bir tarih (`fullDateTemplate`), ve `PantrixStrings.list(items, conjunction)`, dilin "ve"siyle ya da, `ListConjunction.Or` ile, "veya"sıyla bir cümlede birleşen adlar (`listPairTemplate`, `listSeparator`, `listEndTemplate`, `listOrPairTemplate`, `listOrEndTemplate`), ve `PantrixStrings.listWithMore(items, more)`, söylenmeyen adları sonda sayan liste (`othersTemplate`); İngilizce, Türkçe ve Arapça; `PantrixStrings.unsaved`, kaydedilmemiş bir sekmeden ekran okuyucunun duyduğu.
*   `ShareSheet`, `rememberShareSheet()`, `LocalShareSheet` ve `ShareResult`: bir metni ya da bir bağlantıyı başka bir uygulamaya göndermek için platformun sayfası, Android'in seçicisi, iOS'un `UIActivityViewController`'ı ve tarayıcının `navigator.share`'i; masaüstünde ve olmayan tarayıcıda null.

#### Test

`com.pantrixui:testing`

*   `TestClipboard.putText(text)`: testin panosuna, başka bir uygulamanın kopyaladığı gibi bir metin koyar; ekran onu `readText()` ile okur, web dışında Cmd+V ya da Ctrl+V ile de yapıştırır.
*   `SemanticsNodeInteraction.performPaste(text, clipboard, system)`: bir düğümde yapıştırma tuşuyla bir metin yapıştırır, `Modifier.onPaste` onu her platformda duyar; web'de sayfaya tarayıcının yapıştırmasını da gönderir.

*   `TestShareSheet` ve `SharedText`: testin kendi paylaşım sayfası; verilen her metni tutar, testin dediğini yanıtlar. `PantrixTestTheme` ekrana bir tane verir, hiçbir sistem sayfası açılmaz.

#### Araçlar

`com.pantrixui:mcp`

*   MCP sunucusu hangi derleme olduğunu söyler: `initialize`'ın verdiği sürümü, derlendiği commit'i ve jar'ının ne zaman yazıldığını taşır (`0.1.2-SNAPSHOT+7f42363d.20261110T1231Z`), `get_changelog` da bunu söyleyerek başlar. Başlatıldığı jar diskte daha yeniyken her cevap, yeni bir oturumun yenisinden cevap alacağını söyleyen bir notla biter: asistan başlattığı sunucuyu bütün bir oturum boyunca tutar.

### Değişenler

#### Bileşenler

`com.pantrixui:components`

*   `PantrixCommandPalette`, komutlarının kısayollarını `PantrixKeycaps` ile çizer: her kapak temanın `background`'uyla dolar, biraz daha geniş ve bir sonrakinden biraz daha uzaktır.
*   **Kırıcı:** Bütün argümanları konumla verilen `DataTableColumn(…)` ve `DataTableColumn.text(…)` çağrıları sonuncusunu, `cell`'i ya da `text`'i, artık adıyla verir: `subtitle` ondan önce durur. Onu sondaki lambda olarak ya da adıyla veren çağrı, ve kütüphanenin önceki hâliyle derlenmiş kod, olduğu gibi kalır.
*   **Kırıcı:** `tagKey` her bileşenin, `TabItem`'ın, `PantrixCommand`'ın ve `AccordionSection`'ın son parametresidir; ondan sonra yalnızca bileşenin çizdiği içerik lambdası gelir: ondan sonra duranlar artık hemen önünde durur, örneğin `interactionSource`, `controlPosition`, bir bileşenin metinlerinin stilleri (`textStyle`, `labelStyle`, `headlineStyle`…), `presentation`, grafiklerin `export`'u ve onunla aldıkları ayarlar, `PantrixMenuItem`'ın `selected`'ı ve `supportingText`'i, `PantrixElasticDatePicker`'ın `autoRefresh`'ten sonraki ayarları, `TabItem.badge`, `PantrixCommand.supportingText` ve `AccordionSection.trailing`. Bunları adıyla veren çağrı olduğu gibidir; `tagKey`'i konumla veren onu adıyla verir, kütüphanenin önceki hâline karşı derlenmiş kod da yeniden derlenir.
*   Ekran okuyucu bir `PantrixDataTable`'ın her hücresini, ve dar bir tablonun dönüştüğü listede bir kaydın her satırını, tek bir düğüm olarak okur: bir satırın kolon adını değeriyle, bir hücrenin tuttuğu basılacak şeyi ayrıca. Bir tablonun semantik ağacı üçte bir kadar küçülür; iOS o ağacı, okunurken, her değişiklikte baştan sona dolaşır. Bir test, bir hücrenin içindeki bir şeye verilen etiketi `useUnmergedTree = true` ile bulur.

#### Foundation

`com.pantrixui:foundation`

*   Web'de `Modifier.onShortcut`, çalışırken ve odak düğümünün içindeyken kısayolunu tarayıcıdan tutar: bir metin alanında basılan kısayol, tarayıcının o tuşla yaptığını artık bir de yapmaz.

### Düzeltilenler

#### Bileşenler

`com.pantrixui:components`

*   `PantrixLazyPageScaffold`'un odağı alan bir satırı alttaki bir bar'ın üstünde gösterilir: içeriğe listenin payı, `LazyPageScope.contentPadding`, verilir ve her satır onu `Modifier.scrollPadding` ile söyler. Pay listenin kendi kaydırmasının dışında duruyordu ve odak bar'ın arkasına gidiyordu. İçeriğin alıcısı bir `LazyListScope` olan `LazyPageScope`'tur: çağrı olduğu gibidir, kütüphanenin önceki hâline karşı iOS ya da web için derlenmiş kod yeniden derlenir.
*   Yeniden boyutlanan bir `PantrixListDetailScaffold`'ın, `PantrixSupportingPaneScaffold`'ın ve `PantrixTwoPane`'in tutamağı, şeridi boşluktan genişse şeridin üstündeki bir dokunuşu alttaki panele bırakır: telefonda tutamağın yanında bir panelin kenarına yapılan dokunuş, tutamağın aldığı yerde artık panele gider; ayırıcının yönündeki bir sürükleme, aynı yönde kayan bir panelin üstünde bile, tutamağı yine taşır.
*   Bir `TextFieldState`'in `PantrixTextField`'ı, `PantrixFilledTextField`'ı, `PantrixAutoResizeTextField`'ı, `PantrixFilledAutoResizeTextField`'ı, `PantrixSecureTextField`'ı ve `PantrixFilledSecureTextField`'ı, `onKeyboardAction`'ı olup eylem adlandırmayan tek satırlık bir alana, forma bağlı aşırı yüklemeleri gibi `ImeAction.Done` verir: varsayılan eylem işleyiciye hiç ulaşmıyordu ve Enter hiçbir şey çağırmıyordu.
*   `PantrixBreadcrumb`, satırı ona iki sayfasının arasındaki işaretlerden az yer verdiğinde, bir satırın ağırlık verdiği çocuğa verebildiği gibi, kendi sonunda kesilir: artık yanındakinin üstüne çizilmez.
*   `PantrixCodeBlock` bir sekmeyi masaüstünde, iOS'ta ve web'de dört boşluk genişliğinde dizer; bir boşluk genişliğindeydi: sekmeyle girintili kod artık kenara dayanmış durmaz. Android sekmeyi eskisi gibi kendi duraklarında dizer.

*   `PantrixCommandPalette`'in arama alanı ekran okuyucuya, boşken gösterdiği sözlerle, temanın "Search commands"ıyla ya da paletin `placeholder`'ıyla adlanır; adı yoktu ve tanılama onu `MissingName` diye bildiriyordu.

#### Foundation

`com.pantrixui:foundation`

*   `systemPantrixLocale()` iOS'ta iPhone'un ilk sıradaki dilini ve bölge ayarını verir: paketi dil bildirmeyen bir uygulama, sözcükleri Kotlin'de olan bir uygulama gibi, orada geliştirme dilini alıyordu; Türkçe bir iPhone'da İngilizceyi.
*   Tanılama boş bir adı (`PantrixCheck.MissingName` ve `Modifier.checkName`), iki düğümün taşıdığı bir etiket gibi, bir buçuk saniye boş kalınca bildirir: bir an geç gelen bir ad, uygulamanın kaynaklarından okunan sözcüklerin tarayıcıda geldiği gibi, sözcükler yüklenirken artık bildirilmez.

#### Test

`com.pantrixui:testing`

*   Bir `window` verilen `PantrixTestTheme` testin çizdiği bütün yerin üstünde durur: içinde, boyutsuz bir ekranın üstünde tek başına çizilen bir `PantrixDialog` ya da `PantrixSheet` bütün çizilir ve düğmelerine basılabilir; hiç ölçülmüyordu.

## [0.1.1] - 2026-11-02

0.1.1, 0.1.0'dan sonra bulunanları düzeltir: iOS klib'leri artık UIKit'in sınıflarını bağlamaz, onlardan biri Xcode 27.2 ile paylaşılan iOS kodunun commonize edilmesini engelliyordu; web'de sayfanın `<html lang>`'ı uygulamanın en dıştaki temasının dilini söyler; klib'ler de kaynak dosyalarını deponun köküne göre adlandırır, oysa onları derleyen makinedeki yolları bir uygulamaya taşıyorlardı. Genel API değişmez. Web uyumluluğu rehberinin yeni bir bölümü, Safari 27.2'nin Compose'un Wasm sürümünü neden boş bıraktığını ve bir sayfanın yükleyicisinin WebKit'e bunun yerine JavaScript sürümünü nasıl verdiğini anlatır.

### Düzeltilenler

#### Foundation

`com.pantrixui:foundation`

*   iOS klib'leri `com.pantrixui.foundation.adaptive.uikit` içinde UIKit'in hiçbir sınıfını, örneğin `UIHinge`'i, tutmaz: o paket yalnızca kütüphanenin katlanmayı ve dikey çubuğu okuyan kendi bildirimlerini bağlar. Kotlin/Native'in bağlamalarında olmayan her UIKit sınıfını da bağlıyordu ve Xcode 27.2 ile bunlardan biri onların bilmediği bir tipi andığı için paylaşılan iOS kodu commonize edilemiyordu.
*   Web'de en dıştaki `PantrixTheme`, `locale`'inin dilini sayfanın `<html lang>`'ına yazar ve uygulama dilini değiştirdikçe onu izler: ekran okuyucu sayfayı açıldığı dilde okuyordu, tarayıcı da çeviriyi o dilden öneriyordu. İçindeki bir tema hiçbir şeyi değiştirmez; tema çıkınca sayfanın kendi `lang`'ı geri gelir.

### Güvenlik

*   Kütüphanenin klib'leri, bir uygulamanın web ve iOS derlemesinin okuduğu, her kaynak dosyasını deponun köküne göre adlandırır: derleyen makinedeki tam yolunu, o kullanıcının adı ve klasörleriyle tutuyorlardı ve web için derlenen bir uygulama bu yolları Wasm'ında taşıyordu. `foundation`, `components`, `annotations`, `testing` ve `material3`.

## [0.1.0] - 2026-11-01

0.1.0, altı önizlemeden sonra Pantrix UI'ın ilk sürümü. Ondan önce önizlemeleri kullananın karşılaşacağı hatalar gözden geçirildi ve düzeltildi: hiçbir şeyin açamadığı bir bağlantı, başarısız olan bir yenileme ve genişliği olmayan bir kenar artık uygulamaya ulaşmaz; renkli bir bar'ın sekmeleri ve düğmeleri onun üstünde okunur; aramalar harfleri temanın dilinin yazdığı gibi karşılaştırır; bir kontrolün üstündeki imleç bir tıklamanın neye basacağını gösterir. İki ad, üstüne bir şey kurulmadan değişir: `DividerAlign`'ın değerleri ve `PantrixTooltip`'in `modifier`'ının neye uygulandığı. Paketleri hâlâ yalnızca GitHub Packages'tadır ve bir token ister; Maven Central sonra gelir.

### Değişenler

#### Bileşenler

`com.pantrixui:components`

*   **Kırıcı:** `DividerAlign`'ın değerleri, kütüphanenin öteki enum'ları gibi `Start`, `Center` ve `End` yazılır: önceden `START`, `CENTER` ve `END` idi.
*   **Kırıcı:** `PantrixTooltip`'in `modifier`'ı kontrolün yerine uygulanır; böylece bir hizalama ya da ağırlık kontrolü yerleştirir, etiket de onunla gider: önceden etikete uygulanıyordu.
*   Basılınca bir şey seçen her kontrol, üstünde imleç dururken kendi renginden silik bir örtüyle örtülür, menünün satırlarının ve takvimin günlerinin örtüldüğü gibi; böylece fare bir tıklamanın neye basacağını gösterir: `PantrixButton`, `PantrixIconButton`, `PantrixChip`, `PantrixSegmentButton`, `PantrixTabs`, `onClick`'i olan bir `PantrixCard`, `PantrixCheckbox`, `PantrixRadioButton`, `PantrixSwitchButton`, `PantrixPagination`, gezinme bar'ının ve rayının hedefleri, bir grafiğin lejantı, bir snackbar'ın düğmeleri, metin, tarih, saat ve parola alanlarının ve elastic tarih seçicinin içindeki düğmeler.
*   `PantrixSelect`, `PantrixMultiSelect` ve `PantrixJsonView` harfleri temanın dilinin küçük yazdığı gibi karşılaştırır: Türkçede "i" "İzmir"i bulur, "Isparta"yı bulmaz; "ı" "Isparta"yı bulur. `jsonViewSearchPaths` arayacağı `language`'ı alır.
*   `PantrixTimePicker`'ın saat sütunu, `maxTime` `minTime`'dan önce geldiğinde 24 saatte `minTime`'ın saatiyle başlar; böylece bir gecenin saatleri bir arada durur: 22, 23, 00 ve sonrası.

### Düzeltilenler

#### Foundation

`com.pantrixui:foundation`

*   Genişliği sıfır verilen `Modifier.focusRing` halka çizmez: Compose onu saç teli kalınlığında çiziyordu.

#### Bileşenler

`com.pantrixui:components`

*   `PantrixLink(url)`, cihazda hiçbir şeyin açamadığı bir adresi, Compose'un bir metnin bağlantılarında yaptığı gibi bırakır: önceden uygulamayı durduruyordu.
*   `PantrixElasticDatePicker`'ın Yenile düğmesi, `onRefresh`'i hata attığında dönmeyi bırakır: önceden hata uygulamayı durduruyordu.
*   Stili genişlik vermeyen bir kenar, halka ya da çizgi çizilmez: `PantrixChip`, `PantrixAlert`, `PantrixTag`, `PantrixFileItem`, `PantrixFileDrop`, `PantrixTextField`, `PantrixFilledTextField`, `PantrixRadioButton`, `PantrixCheckbox`, `PantrixSidebar`'ın kılavuzu, `PantrixButtonGroup`'un ayırıcısı ve bir select'in işaretli satırı onu saç teli kalınlığında çiziyordu.
*   Üstüne ne yazıldığını söyleyen bir dolguda, markanın renginde bir üst bar'da, `PantrixTabs`'in seçili sekmesi ve çizgisi, `ButtonVariant.Outline` ve `ButtonVariant.Text` düğmeler, kendi dolgusu olmayan bir ikon düğmesi ve oradaki odak halkası dolgunun söylediği gibi yazılır: önceden temanın dolgudan zor ayırt edilen `primary`'siyle çiziliyorlardı.

## [0.1.0-alpha06] - 2026-11-01

0.1.0'ın altıncı önizlemesi, kodlama asistanları ve onların üstüne kurulan araçlar için: MCP sunucusu Türkçe de arar, bir sorunun sözcüklerinin en çoğunu taşıyanı öne koyar ve sekiz aracının cevabını veri olarak da verir.

### Eklenenler

#### Araçlar

`com.pantrixui:mcp`

*   MCP sunucusunun araçları Türkçe de arar ve cevaplarının bileşenleri, sayfaları, rehberleri, örnekleri, bildirimleri ve ikonları hangi dilde vereceğini seçen bir `language` alır, `en` ya da `tr`: `search_components` "bildirim" ile `PantrixSnackbarHost`'u, "tarih seçici" ya da "tarih secici" ile `PantrixDatePicker`'ı bulur.
*   MCP sunucusunun sekiz aracı, `search_components`, `get_component_metadata`, `search_api`, `get_api`, `search_icons`, `search_documentation`, `list_examples` ve `get_example`, cevabını çağrının yapılandırılmış içeriğinde veri olarak da verir; biçimini çıktı şemaları söyler: cevaptan kendi sayfasını kuran bir program için.
*   Kodlama asistanlarının belgelerinde kütüphanenin Türkçesi veri olarak, `tr/pantrix-ui.json`, ve modüllerin API'sinin Türkçesi, `tr/api/<modül>.md`, var; her bileşenin açıklaması ve anahtar sözcükleri ve her ikonun açıklaması Türkçedir.

### Değişenler

#### Araçlar

`com.pantrixui:mcp`

*   MCP sunucusunun aramaları önce bir sorunun sözcüklerinin en çoğunu ve sorunun andığı bir anahtar sözcüğü taşıyanı getirir: "a comment box with several lines" önce `PantrixTextArea`'yı getirir; önceden `PantrixLineChart` önce geliyordu.

### Düzeltilenler

#### Araçlar

`com.pantrixui:mcp`

*   `search_icons` bir ikonun sağdan sola okunan bir dilde yansıdığını bir kez söyler: önceden iki kez söylüyordu.

## [0.1.0-alpha05] - 2026-10-31

0.1.0'ın beşinci önizlemesi: katlanabilir bir cihaz açılıp kapandıktan hemen sonra iOS'ta açılan katmanlar, her tarayıcıda açılan bir web uygulaması için bir rehber ve Wasm çalıştıramayan bir tarayıcı için JavaScript sürümüyle web demosu.

### Düzeltilenler

#### Bileşenler

`com.pantrixui:components`

*   `PantrixModal`, `PantrixDialog`, `PantrixSheet` ve `PantrixCommandPalette`, iOS'ta pencere boyut değiştirdikten hemen sonra açıldıklarında, katlanabilir bir cihaz açılıp kapanınca olduğu gibi, pencereyi doldurur ve scrim'lerini çizer: önceden uygulamayı "Size(2147483647 x 2147483647) is out of range" ile durduruyorlardı.

## [0.1.0-alpha04] - 2026-10-31

0.1.0'ın dördüncü önizlemesi: web'de yedek fontlar, böylece bir tarayıcı Mac tuşlarının işaretleri için Google'dan font indirmez; ve MCP sunucusunu Pantrix UI'ın kendi sitesinden getiren Claude Code eklentisi.

### Eklenenler

#### Foundation

`com.pantrixui:foundation`

*   **Yedek fontlar:** `PantrixTypeface(fonts, fallbacks)`, bir tarayıcının yazı tipinin hiçbir fontunda olmayan bir karakteri çizdiği fontları verir. Yazı tipiyle birlikte okunurlar ve `areTypefacesLoaded` onları da bekler; böylece Compose for Web böyle bir karakter için Google'ın sunucularından Noto fontu indirmez: her ziyaretçinin tarayıcısı onu Google'dan istiyordu, çevrimdışı bir sayfa onu boş bırakıyordu ve bir içerik güvenliği politikası Google'a izin vermek zorunda kalıyordu.
*   **Pantrix Symbols:** `PantrixTypeface.Default`, bir `PantrixShortcut`'ın Apple'ın sistemlerinde yazıldığı işaretler (`⌘ ⇧ ⌥ ⌫ ⌦ ⇥ ⇞ ⇟ ⎋`) için Noto'nun fontlarından kesilmiş 3 KB'lık Pantrix Symbols'a başvurur; bir tarayıcı bunları şimdiye dek Google'dan indiriyordu. Lisansı, SIL Open Font License 1.1, kütüphanenin kaynaklarında onunla birlikte gelir.

### Değişenler

#### Araçlar

`com.pantrixui:mcp`

*   Paket deposunun Claude Code eklentisi `pantrix-ui` MCP sunucusunu da getirir, Pantrix UI'ın sitesinin sunduğu adresiyle, `https://pantrixui.com/mcp`: onu kuran bir asistanın ne Java'ya ne de jar'a ihtiyacı olur.

### Düzeltilenler

#### Araçlar

`com.pantrixui:mcp`

*   MCP sunucusunun jar'ı girdisi bitince çıkar; girdi son mesajın hemen ardından bittiğinde de, `printf … | java -jar`'ın gönderdiği gibi: önceden çalışmayı sürdürüyordu.

## [0.1.0-alpha03] - 2026-10-30

0.1.0'ın üçüncü önizlemesi, kodlama asistanları için: sunucuyu kendi adresinde sunan bir site için HTTP üzerinden MCP sunucusu, ve her sürümle sunucunun jar'ı, skill ve `llms.txt`.

### Eklenenler

#### Araçlar

`com.pantrixui:mcp`

*   `PantrixMcp.http()`, MCP sunucusunu Streamable HTTP üzerinden, hiçbir web çatısına bağlı olmadan verir; sunucuyu kendi adresinde sunan bir site için: bir asistana o zaman yalnızca adres verilir, ne Java ne jar gerekir.
*   Her sürüm MCP sunucusunun jar'ını ve `pantrix-ui` skill'ini kendi dosyaları olarak taşır, web demosunun sayfaları `llms.txt`'yi ve götürdüğü belgeleri sunar, paket deposu da `pantrix-ui` eklentisi skill'i getiren bir Claude Code eklenti pazarıdır.

### Değişenler

#### Araçlar

`com.pantrixui:mcp`

*   `com.pantrixui:mcp`, ona bağlanan bir derlemeye MCP'nin Kotlin SDK'sını da verir, çünkü `PantrixMcp.server()` SDK'nın `Server`'ını döndürür.

## [0.1.0-alpha02] - 2026-10-30

0.1.0'ın ikinci önizlemesi, tek bir değişiklikle: bir sayfa varsayılan olarak geniş bir pencerenin bütün genişliğini alır.

### Değişenler

#### Bileşenler

`com.pantrixui:components`

*   `PantrixPageScaffold` ve `PantrixLazyPageScaffold` varsayılan olarak sayfanın bütün genişliğini alır (`width = PageWidth.Full`): geniş bir pencere 1040 dp'nin ötesini artık boş bırakmaz; `PageWidth.Content` okunan bir sayfayı temanın içerik genişliğinde tutar.

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
