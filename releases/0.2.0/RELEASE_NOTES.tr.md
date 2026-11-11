English: [RELEASE_NOTES.md](https://github.com/develappsancho/pantrix-ui-cmp-package/blob/main/releases/0.2.0/RELEASE_NOTES.md)

Pantrix UI 0.2.0, 2026-11-11 tarihinde çıktı. `49e787bc38c6` commit'inden, Kotlin 2.4.21 ve Compose Multiplatform 1.12.2 ile derlendi.

0.2.0, belgelerle ve kodla çalışan bir uygulama için sekiz bileşen ekler: `PantrixCodeEditor`, `PantrixLazyTreeView`, `PantrixKeycaps`, `PantrixGraph`, `PantrixToolbar`, `PantrixStatusBar`, `PantrixDiffView` ve `PantrixEmptyState`; hepsi 108. Çevrelerinde bir paylaşım sayfası, panodaki metin ve bir düğümün duyduğu yapıştırma, önizlemeler için bir tema, bir dilin aramadaki küçük harfleri ve listeleri, kapanan ve henüz kaydedilmemiş sekmeler, `PantrixDataTable`'da seçili bir hücre ve içerik genişliğinde, ortada duran bir sayfa gelir. İki değişiklik bir çağrıyı bozar: `tagKey` her bileşenin son parametresidir, bütün argümanları konumla verilen bir `DataTableColumn` da sonuncusunu adıyla verir. iOS'ta bir tablonun semantik ağacı üçte bir kadar küçülür, bir listenin sayfası da odağı alttaki bar'ın üstünde tutar.

## Paketler

| Paket | Önceki sürüme göre (v0.1.1) | Public API | JVM jar'ı |
| :--- | :--- | :--- | :--- |
| `com.pantrixui:components` | 337 dosya, 25 commit | 4.497 bildirim: 819 eklendi, 63 değişti | 8,1 MB, 1,3 MB arttı |
| `com.pantrixui:foundation` | 54 dosya, 13 commit | 1.712 bildirim: 127 eklendi, 4 değişti | 886,0 KB, 60,9 KB arttı |
| `com.pantrixui:testing` | 18 dosya, 5 commit | 91 bildirim: 21 eklendi | 49,8 KB, 4,5 KB arttı |
| `com.pantrixui:mcp` | 7 dosya, 4 commit | izlenmiyor | 6,3 MB, 648,0 KB arttı |
| `com.pantrixui:detekt-rules` | 7 dosya, 5 commit | izlenmiyor | 97,7 KB, 8,1 KB arttı |
| `com.pantrixui:annotations` | yok | 13 bildirim, değişmedi | 3,8 KB, değişmedi |
| `com.pantrixui:material3` | yok | 21 bildirim, değişmedi | 22,6 KB, değişmedi |

Yalnızca JVM'e derlenen bir modülün ABI dökümü yoktur; bu yüzden public API'si sayılmaz.

## Paketleri almak

Paketler GitHub Packages'tadır, dağıtıldıkları depoda: <https://github.com/develappsancho/pantrix-ui-cmp-package>. GitHub onları okumak için orada da bir token ister: paket okuyabilen (`read:packages`) klasik bir kişisel erişim token'ı, `~/.gradle/gradle.properties`'te `GitHubPackagesUsername` ve `GitHubPackagesPassword` özellikleriyle. Kullanan projenin `settings.gradle.kts`'i:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven {
            name = "GitHubPackages"
            url = uri("https://maven.pkg.github.com/develappsancho/pantrix-ui-cmp-package")
            credentials(PasswordCredentials::class)
        }
        google()
        mavenCentral()
    }
}
```

Kütüphanenin kendi deposundan derlenince `./gradlew clean publishToMavenLocal` onları yerel Maven deposuna koyar; proje o zaman GitHub Packages'ın yerine onu anar:

```kotlin
dependencyResolutionManagement {
    repositories {
        mavenLocal()
        google()
        mavenCentral()
    }
}
```

Bir modülün bağımlılığı da:

```kotlin
dependencies {
    implementation("com.pantrixui:components:0.2.0")
}
```

## Kodlama asistanları için

Kütüphanenin kaynaklarından yazılan, kodlama asistanları için belgeler her sürümle ve onun sürümünde gelir: onlardan cevap veren MCP sunucusu, `pantrix-ui` skill'i ve `llms.txt`.

| Ne | Nasıl verilir |
| :--- | :--- |
| MCP sunucusu, bu sürüme ekli `mcp-0.2.0-all.jar`, yerel yayından sonra `~/.m2/repository/com/pantrixui/mcp/0.2.0/` içinde de; JDK 17 ve üstünde çalışır | `claude mcp add pantrix-ui -- java -jar <yol>/mcp-0.2.0-all.jar` ya da bir istemcinin `mcpServers` alanında aynı komut |
| Pantrix UI'ın sitesinin <https://pantrixui.com/mcp> adresinde sunduğu MCP sunucusu; sitenin derlendiği sürümde | `claude mcp add --transport http pantrix-ui https://pantrixui.com/mcp` ya da bir istemcinin `mcpServers` alanında `"type": "http"` ve `"url"` |
| `pantrix-ui` skill'i, bu sürüme ekli `pantrix-ui-skill-0.2.0.zip` | Bir uygulamanın deposunda `.claude/skills/` içine açılır; ekip onu git'ten alır |
| Claude Code'un `pantrix-ui` eklentisi; skill'i ve sitedeki sunucuyu getirir | `claude plugin marketplace add develappsancho/pantrix-ui-cmp-package`, ardından `claude plugin install pantrix-ui@pantrix-ui` |
| `llms.txt` ve götürdüğü belgeler, web demosunun yanında | <https://develappsancho.github.io/pantrix-ui-cmp-package/llms.txt>; ne skill ne MCP okuyan bir asistan için |

## Bileşenler

`com.pantrixui:components`

### Eklenenler

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

### Değişenler

*   `PantrixCommandPalette`, komutlarının kısayollarını `PantrixKeycaps` ile çizer: her kapak temanın `background`'uyla dolar, biraz daha geniş ve bir sonrakinden biraz daha uzaktır.
*   **Kırıcı:** Bütün argümanları konumla verilen `DataTableColumn(…)` ve `DataTableColumn.text(…)` çağrıları sonuncusunu, `cell`'i ya da `text`'i, artık adıyla verir: `subtitle` ondan önce durur. Onu sondaki lambda olarak ya da adıyla veren çağrı, ve kütüphanenin önceki hâliyle derlenmiş kod, olduğu gibi kalır.
*   **Kırıcı:** `tagKey` her bileşenin, `TabItem`'ın, `PantrixCommand`'ın ve `AccordionSection`'ın son parametresidir; ondan sonra yalnızca bileşenin çizdiği içerik lambdası gelir: ondan sonra duranlar artık hemen önünde durur, örneğin `interactionSource`, `controlPosition`, bir bileşenin metinlerinin stilleri (`textStyle`, `labelStyle`, `headlineStyle`…), `presentation`, grafiklerin `export`'u ve onunla aldıkları ayarlar, `PantrixMenuItem`'ın `selected`'ı ve `supportingText`'i, `PantrixElasticDatePicker`'ın `autoRefresh`'ten sonraki ayarları, `TabItem.badge`, `PantrixCommand.supportingText` ve `AccordionSection.trailing`. Bunları adıyla veren çağrı olduğu gibidir; `tagKey`'i konumla veren onu adıyla verir, kütüphanenin önceki hâline karşı derlenmiş kod da yeniden derlenir.
*   Ekran okuyucu bir `PantrixDataTable`'ın her hücresini, ve dar bir tablonun dönüştüğü listede bir kaydın her satırını, tek bir düğüm olarak okur: bir satırın kolon adını değeriyle, bir hücrenin tuttuğu basılacak şeyi ayrıca. Bir tablonun semantik ağacı üçte bir kadar küçülür; iOS o ağacı, okunurken, her değişiklikte baştan sona dolaşır. Bir test, bir hücrenin içindeki bir şeye verilen etiketi `useUnmergedTree = true` ile bulur.

### Düzeltilenler

*   `PantrixLazyPageScaffold`'un odağı alan bir satırı alttaki bir bar'ın üstünde gösterilir: içeriğe listenin payı, `LazyPageScope.contentPadding`, verilir ve her satır onu `Modifier.scrollPadding` ile söyler. Pay listenin kendi kaydırmasının dışında duruyordu ve odak bar'ın arkasına gidiyordu. İçeriğin alıcısı bir `LazyListScope` olan `LazyPageScope`'tur: çağrı olduğu gibidir, kütüphanenin önceki hâline karşı iOS ya da web için derlenmiş kod yeniden derlenir.
*   Yeniden boyutlanan bir `PantrixListDetailScaffold`'ın, `PantrixSupportingPaneScaffold`'ın ve `PantrixTwoPane`'in tutamağı, şeridi boşluktan genişse şeridin üstündeki bir dokunuşu alttaki panele bırakır: telefonda tutamağın yanında bir panelin kenarına yapılan dokunuş, tutamağın aldığı yerde artık panele gider; ayırıcının yönündeki bir sürükleme, aynı yönde kayan bir panelin üstünde bile, tutamağı yine taşır.
*   Bir `TextFieldState`'in `PantrixTextField`'ı, `PantrixFilledTextField`'ı, `PantrixAutoResizeTextField`'ı, `PantrixFilledAutoResizeTextField`'ı, `PantrixSecureTextField`'ı ve `PantrixFilledSecureTextField`'ı, `onKeyboardAction`'ı olup eylem adlandırmayan tek satırlık bir alana, forma bağlı aşırı yüklemeleri gibi `ImeAction.Done` verir: varsayılan eylem işleyiciye hiç ulaşmıyordu ve Enter hiçbir şey çağırmıyordu.
*   `PantrixBreadcrumb`, satırı ona iki sayfasının arasındaki işaretlerden az yer verdiğinde, bir satırın ağırlık verdiği çocuğa verebildiği gibi, kendi sonunda kesilir: artık yanındakinin üstüne çizilmez.
*   `PantrixCodeBlock` bir sekmeyi masaüstünde, iOS'ta ve web'de dört boşluk genişliğinde dizer; bir boşluk genişliğindeydi: sekmeyle girintili kod artık kenara dayanmış durmaz. Android sekmeyi eskisi gibi kendi duraklarında dizer.

*   `PantrixCommandPalette`'in arama alanı ekran okuyucuya, boşken gösterdiği sözlerle, temanın "Search commands"ıyla ya da paletin `placeholder`'ıyla adlanır; adı yoktu ve tanılama onu `MissingName` diye bildiriyordu.

### Public API

`com.pantrixui:components` paketinde değişenler; önceki sürüme karşı derlenen kod yeniden derlenir, bir çağrı değişebilir:

- `AccordionSection(…)`
- `CodeBlockColors(…)`
- `CodeBlockColors.copy(…)`
- `PantrixAlert(…)`
- `PantrixAutoResizeTextField(…)`
- `PantrixButton(…)`
- `PantrixCard(…)`
- `PantrixCheckbox(…)`
- `PantrixChip(…)`
- `PantrixCodeBlock(…)`
- `PantrixDataTable(…)`
- `PantrixDateFilledTextField(…)`
- `PantrixDateTextField(…)`
- `PantrixElasticDatePicker(…)`
- `PantrixFileDrop(…)`
- `PantrixFilledAutoResizeTextField(…)`
- `PantrixFilledSecureTextField(…)`
- `PantrixFilledTextArea(…)`
- `PantrixFilledTextField(…)`
- `PantrixFunnelChart(…)`
- `PantrixGanttChart(…)`
- `PantrixGauge(…)`
- `PantrixHeatmap(…)`
- `PantrixIconButton(…)`
- `PantrixJsonView(…)`
- `PantrixLazyPageScaffold(…)`
- `PantrixLink(…)`
- `PantrixListDetailScaffold(…)`
- `PantrixListItem(…)`
- `PantrixMenu(…)`
- `PantrixMenuItem(…)`
- `PantrixMeterGroup(…)`
- `PantrixMultiSelect(…)`
- `PantrixPageScaffold(…)`
- `PantrixPieChart(…)`
- `PantrixPolarChart(…)`
- `PantrixPopover(…)`
- `PantrixProgressCircle(…)`
- `PantrixRadarChart(…)`
- `PantrixRadioButton(…)`
- `PantrixRadioGroup(…)`
- `PantrixSankeyChart(…)`
- `PantrixScatterChart(…)`
- `PantrixSecureTextField(…)`
- `PantrixSegmentButton(…)`
- `PantrixSelect(…)`
- `PantrixSidebar(…)`
- `PantrixSparkline(…)`
- `PantrixStatusTracker(…)`
- `PantrixSupportingPaneScaffold(…)`
- ve 13 tane daha

<details>
<summary>`com.pantrixui:components` paketine eklenen 819 bildirim</summary>

- `abstract fun button(String, String, Function0<Unit>, ImageVector?, … 9 parameters) in StatusBarScope`
- `abstract fun childAt(TreeNode?, Int): TreeNode in TreeSource`
- `abstract fun childCount(TreeNode?): Int in TreeSource`
- `abstract fun highlight(String, #A): CodeHighlight<#A> in CodeHighlighter`
- `abstract fun item(String, String, Int, String?, Function2<Composer, Int, Unit>) in StatusBarScope`
- `abstract fun text(String, String, Int, Boolean, String?) in StatusBarScope`
- `abstract fun toggle() in GraphNodeScope`
- `abstract interface <#A: Any> CodeHighlighter`
- `abstract interface GraphNodeScope`
- `abstract interface LazyPageScope : LazyListScope`
- `abstract interface StatusBarScope`
- `abstract interface TreeSource`
- `abstract val contentPadding in LazyPageScope`
- `abstract val expanded in GraphNodeScope`
- `abstract val focused in GraphNodeScope`
- `abstract val hasChildren in GraphNodeScope`
- `abstract val initialState in CodeHighlighter`
- `abstract val key in ToolbarItem`
- `abstract val priority in ToolbarItem`
- `abstract val selected in GraphNodeScope`
- `abstract val tagKey in ToolbarItem`
- `constructor(CodeTone, String?, String?, CodeTone?, String?, Boolean, String?, List<CodeMarkAction>) in CodeMark`
- `constructor(Color) in ToolbarColors`
- `constructor(Color, Color, Color) in KeycapsColors`
- `constructor(Color, Color, Color) in PaneHandleColors`
- `constructor(Color, Color, Color, Color) in EmptyStateColors`
- `constructor(Color, Color, Color, Color) in StatusBarColors`
- `constructor(Color, Color, Color, Color, … 11 parameters) in JsonViewColors`
- `constructor(Color, Color, Color, Color, … 19 parameters) in CodeEditorColors`
- `constructor(Color, Color, Color, Color, … 23 parameters) in DiffViewColors`
- `constructor(Color, Color, Color, Color, … 9 parameters) in GraphColors`
- `constructor(DiffKind, String?, String?, Int?, Int?, List<TextRange>, List<TextRange>) in DiffLine`
- `constructor(Dp, Dp) in ToolbarStyle`
- `constructor(Dp, Dp, Dp) in KeycapSizeStyle`
- `constructor(Dp, Dp, Dp) in StatusBarStyle`
- `constructor(Dp, Dp, Dp, Dp, Dp, Dp, Dp) in EmptyStateStyle`
- `constructor(Dp, Dp, Dp, Dp, TopBarStyle?, Dp, Dp) in PageScaffoldStyle`
- `constructor(Dp, Dp, Dp, Dp, … 10 parameters) in TabsStyle`
- `constructor(Float, ClosedFloatingPointRange<Float>) in GraphState`
- `constructor(ImageVector, String, Function0<Unit>) in TreeRowAction`
- `constructor(Int, Int, CodeMark, CodeRangeStyle) in CodeRangeMark`
- `constructor(Int, Int, IntRange, IntRange) in DiffChange`
- `constructor(LazyListState) in DiffViewState`
- `constructor(LazyListState) in JsonViewState`
- `constructor(LazyListState) in TreeViewState`
- `constructor(List<CodeToken>, #A) in CodeHighlight`
- `constructor(ShapeSpec, Dp, Dp, Dp, Dp, Dp, Dp, Dp) in DiffViewStyle`
- `constructor(ShapeSpec, Dp, Dp, Dp, … 14 parameters) in GraphStyle`
- `constructor(ShapeSpec, Dp, Dp, Dp, … 9 parameters) in CodeEditorStyle`
- `constructor(ShapeSpec, Dp, Dp, KeycapSizeStyle, KeycapSizeStyle) in KeycapsStyle`
- ve 769 tane daha

</details>

## Foundation

`com.pantrixui:foundation`

### Eklenenler

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

### Değişenler

*   Web'de `Modifier.onShortcut`, çalışırken ve odak düğümünün içindeyken kısayolunu tarayıcıdan tutar: bir metin alanında basılan kısayol, tarayıcının o tuşla yaptığını artık bir de yapmaz.

### Düzeltilenler

*   `systemPantrixLocale()` iOS'ta iPhone'un ilk sıradaki dilini ve bölge ayarını verir: paketi dil bildirmeyen bir uygulama, sözcükleri Kotlin'de olan bir uygulama gibi, orada geliştirme dilini alıyordu; Türkçe bir iPhone'da İngilizceyi.
*   Tanılama boş bir adı (`PantrixCheck.MissingName` ve `Modifier.checkName`), iki düğümün taşıdığı bir etiket gibi, bir buçuk saniye boş kalınca bildirir: bir an geç gelen bir ad, uygulamanın kaynaklarından okunan sözcüklerin tarayıcıda geldiği gibi, sözcükler yüklenirken artık bildirilmez.

### Public API

`com.pantrixui:foundation` paketinde değişenler; önceki sürüme karşı derlenen kod yeniden derlenir, bir çağrı değişebilir:

- `ClipboardTraits(…)`
- `ClipboardTraits.copy(…)`
- `PantrixStrings(…)`
- `PantrixStrings.copy(…)`

<details>
<summary>`com.pantrixui:foundation` paketine eklenen 127 bildirim</summary>

- `abstract fun interface ShareSheet`
- `abstract fun share(String, String?, Function1<ShareResult, Unit>) in ShareSheet`
- `enum entry And in ListConjunction`
- `enum entry Cancelled in ShareResult`
- `enum entry Failed in ShareResult`
- `enum entry GraphCycle in PantrixCheck`
- `enum entry Or in ListConjunction`
- `enum entry Shared in ShareResult`
- `enum entry Started in ShareResult`
- `final enum class ListConjunction : Enum<ListConjunction>`
- `final enum class ShareResult : Enum<ShareResult>`
- `final fun (Modifier).checkGraphCycles(String, List<String>): Modifier`
- `final fun (Modifier).checkTouchTarget(Dp, DpSize): Modifier`
- `final fun (Modifier).keepFromBrowser(List<PantrixShortcut>): Modifier`
- `final fun (Modifier).onPaste(Boolean, Function1<String, Unit>): Modifier`
- `final fun PantrixPreviewTheme(PlatformType?, Boolean, PantrixWindow?, PantrixClock?, Function2<Composer, Int, Unit>)`
- `final fun codeEditorKeys(String): String in PantrixStrings`
- `final fun component187(): String in PantrixStrings`
- `final fun component188(): String in PantrixStrings`
- `final fun component189(): String in PantrixStrings`
- `final fun component190(): String in PantrixStrings`
- `final fun component191(): String in PantrixStrings`
- `final fun component192(): String in PantrixStrings`
- `final fun component193(): String in PantrixStrings`
- `final fun component194(): String in PantrixStrings`
- `final fun component195(): String in PantrixStrings`
- `final fun component196(): String in PantrixStrings`
- `final fun component197(): String in PantrixStrings`
- `final fun component198(): String in PantrixStrings`
- `final fun component199(): String in PantrixStrings`
- `final fun component200(): String in PantrixStrings`
- `final fun component201(): String in PantrixStrings`
- `final fun component202(): String in PantrixStrings`
- `final fun component203(): String in PantrixStrings`
- `final fun component204(): String in PantrixStrings`
- `final fun component205(): String in PantrixStrings`
- `final fun component206(): String in PantrixStrings`
- `final fun component207(): String in PantrixStrings`
- `final fun component208(): String in PantrixStrings`
- `final fun component209(): String in PantrixStrings`
- `final fun component210(): String in PantrixStrings`
- `final fun component211(): String in PantrixStrings`
- `final fun component212(): String in PantrixStrings`
- `final fun component213(): String in PantrixStrings`
- `final fun component214(): String in PantrixStrings`
- `final fun component215(): String in PantrixStrings`
- `final fun component216(): String in PantrixStrings`
- `final fun component217(): String in PantrixStrings`
- `final fun component218(): String in PantrixStrings`
- `final fun component219(): String in PantrixStrings`
- ve 77 tane daha

</details>

## Test

`com.pantrixui:testing`

### Eklenenler

*   `TestClipboard.putText(text)`: testin panosuna, başka bir uygulamanın kopyaladığı gibi bir metin koyar; ekran onu `readText()` ile okur, web dışında Cmd+V ya da Ctrl+V ile de yapıştırır.
*   `SemanticsNodeInteraction.performPaste(text, clipboard, system)`: bir düğümde yapıştırma tuşuyla bir metin yapıştırır, `Modifier.onPaste` onu her platformda duyar; web'de sayfaya tarayıcının yapıştırmasını da gönderir.

*   `TestShareSheet` ve `SharedText`: testin kendi paylaşım sayfası; verilen her metni tutar, testin dediğini yanıtlar. `PantrixTestTheme` ekrana bir tane verir, hiçbir sistem sayfası açılmaz.

### Düzeltilenler

*   Bir `window` verilen `PantrixTestTheme` testin çizdiği bütün yerin üstünde durur: içinde, boyutsuz bir ekranın üstünde tek başına çizilen bir `PantrixDialog` ya da `PantrixSheet` bütün çizilir ve düğmelerine basılabilir; hiç ölçülmüyordu.

### Public API

<details>
<summary>`com.pantrixui:testing` paketine eklenen 21 bildirim</summary>

- `constructor(ShareResult) in TestShareSheet`
- `constructor(String, String?) in SharedText`
- `final class SharedText`
- `final class TestShareSheet : ShareSheet`
- `final fun (SemanticsNodeInteraction).performPaste(String, TestClipboard, OperatingSystem): SemanticsNodeInteraction`
- `final fun com_pantrixui_testing_SharedText$stableprop_getter(): Int`
- `final fun com_pantrixui_testing_TestShareSheet$stableprop_getter(): Int`
- `final fun component1(): String in SharedText`
- `final fun component2(): String? in SharedText`
- `final fun copy(String, String?): SharedText in SharedText`
- `final fun equals(Any?): Boolean in SharedText`
- `final fun hashCode(): Int in SharedText`
- `final fun putText(String) in TestClipboard`
- `final fun share(String, String?, Function1<ShareResult, Unit>) in TestShareSheet`
- `final fun toString(): String in SharedText`
- `final val com_pantrixui_testing_SharedText$stableprop`
- `final val com_pantrixui_testing_TestShareSheet$stableprop`
- `final val shared in TestShareSheet`
- `final val text in SharedText`
- `final val title in SharedText`
- `final var result in TestShareSheet`

</details>

## Araçlar

`com.pantrixui:mcp`

### Eklenenler

*   MCP sunucusu hangi derleme olduğunu söyler: `initialize`'ın verdiği sürümü, derlendiği commit'i ve jar'ının ne zaman yazıldığını taşır (`0.1.2-SNAPSHOT+7f42363d.20261110T1231Z`), `get_changelog` da bunu söyleyerek başlar. Başlatıldığı jar diskte daha yeniyken her cevap, yeni bir oturumun yenisinden cevap alacağını söyleyen bir notla biter: asistan başlattığı sunucuyu bütün bir oturum boyunca tutar.

## Diğer paketler

Değişiklik günlüğünde bu sürüm için `com.pantrixui:detekt-rules` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:annotations` satırı yok.

Değişiklik günlüğünde bu sürüm için `com.pantrixui:material3` satırı yok.
