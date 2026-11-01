# Liste ve ayrıntı

Bir liste ve listede açılan öğenin ayrıntısı: yer varsa yan yana, yoksa biri ötekinin yerinde. Gelen kutusu, ayarlar, kişiler, dosyalar: listesi ve ayrıntısı olan her ekranın düzeni.

`PantrixListDetailScaffold` kaç panel göstereceğini kendi yerine bakarak seçer, pencereye değil. Dar bir yerde önce liste görünür; bir öğe açılınca ayrıntı listenin yerini alır, sondan kayarak gelir. Geri tuşu, Escape ve iOS'un kenardan kaydırması listeye döndürür. Geniş bir yerde ikisi yan yana durur; çok geniş bir yerde ayrıntının yanında üçüncü bir panel açılabilir.

Ne açık olduğunu `ListDetailState` tutar: `rememberListDetailState()` ile hatırlanır, döndürmede ve işlem yeniden başlatılınca da kaybolmaz. Liste bir öğeyi `select(key)` ile açar, ayrıntı `back()` ile kapanır.

- `PantrixListDetailScaffold` (`com.pantrixui.components.container.listdetail`, `com.pantrixui:components`): Bir liste ve açık öğesinin ayrıntısı: yer varsa yan yana, yoksa teker teker. Anahtar sözcükler: liste ayrıntı, ana ayrıntı, bölünmüş görünüm, iki bölme, gelen kutusu düzeni.

## Özellikler

- **Kaç panel.** `Compact` ve `Medium` bir yerde bir panel, `Expanded`'dan itibaren iki, `Large`'dan itibaren ekstra panel verilmişse üç. Kitap gibi tutulan bir katlanabilirde her genişlikte iki: liste ve ayrıntı kat yerinde buluşur.
- **Tek panelde geri.** Ayrıntı açıkken geri tuşu, Escape ve iOS'un kenardan kaydırması `back()`'i çağırır. Kenardan kaydırırken ayrıntı parmakla birlikte kayar; yarıda bırakılırsa yerine döner. Klavyenin odağı gösterilen panelle gider: listeden açılan öğenin ayrıntısına, geri dönünce de o öğeye.
- **İki panelde geri uygulamanındır.** Liste yanda dururken scaffold geriye dokunmaz; ekranın kendi geri davranışı çalışır.
- **Boş ayrıntı.** İki panelde açık bir öğe yokken ayrıntının yerinde `emptyDetail` durur.
- **Panellere söylenen.** Her panel `ListDetailScope` içinde kurulur: `isSinglePane` tek panelde geri düğmesini, `isExtraInSheet` ekstra panelin başlığını göstermeyi seçtirir; `paneCount` kaç panele yer olduğunu söyler.
- **Ekstra panel.** `extra` verilmişse `showExtra()` onu açar: üç panele yer varsa ayrıntının yanında, yoksa iskelenin kendi yerinde, ayrıntının üstüne sondan açılan bir sheet'te, başlığı `extraTitle`. Klavyenin odağı sheet'e girer ve o kapanana kadar içinde kalır. İki yerde de aynı kompozisyondur: yer değişince hatırladığı kalır.
- **Her panel bir pencere.** Panelin içindeki her şey panelin genişliğini pencere olarak okur: `PantrixTheme.window`, sınıfları ve `PantrixTheme.layout` panele göre cevap verir. Duruş pencerenin kalır.
- **Panellerin adı.** `listTitle`, `detailTitle` ve `extraTitle` panelleri ekran okuyucuya adlarıyla tanıtır; Android'de TalkBack gelen panelin adını söyler.
- **Listenin genişliği.** `resizable = true` panellerin arasına bir tutamaç koyar: sürüklenir, ok tuşlarıyla ayarlanır, ekran okuyucu değerini değiştirebilir. Genişlik `ListDetailState.listWidth`'te kalır.
- **Durum korunur.** Yer değişip bir panelden ikiye geçilince liste ve ayrıntı kompozisyonda yerinde kalır: kaydırma yeri, yazılan metin kaybolmaz.
- **Hareketi azalt.** Sistem daha az hareket istiyorsa ayrıntı kaymadan açılır ve kapanır.
- **Okuma yönü.** Sağdan sola bir dilde liste sağdadır; ayrıntı soldan kayarak gelir.

## Kullanım

### An inbox

```kotlin
val inbox = rememberListDetailState()
PantrixListDetailScaffold(
    state = inbox,
    list = { Messages(onOpen = { id -> inbox.select(id) }) },
    detail = { id ->
        Message(id, onBack = if (isSinglePane) ({ inbox.back() }) else null)
    },
    modifier = Modifier.fillMaxSize(),
    emptyDetail = { PantrixText("Choose a message") }
)
```

### Contacts with their history beside them, and a list that can be resized

```kotlin
val contacts = rememberListDetailState()
PantrixListDetailScaffold(
    state = contacts,
    list = { ContactList(onOpen = { id -> contacts.select(id) }) },
    detail = { id -> Contact(id, onHistory = { contacts.showExtra() }) },
    modifier = Modifier.fillMaxSize(),
    extra = { id -> History(id, showHeader = !isExtraInSheet) },
    extraTitle = "History",
    resizable = true
)
```

## Örnekler

### Gelen kutusu

En sık kullanılan biçim: bir ileti listesi ve açılan ileti. Liste bir iletiyi `inbox.select(id)` ile açar; ayrıntıya açılan iletinin anahtarı verilir.

Karttaki pencere seçicisinden "Dar"ı seç ve bir iletiye bas: ileti listenin yerini alır. Başındaki geri düğmesi, Android'in geri tuşu, masaüstünde Escape ve iOS'ta ekranın kenarından kaydırma listeye döndürür. Geri düğmesi yalnızca tek panelde durur: ayrıntı onu `isSinglePane`'e bakarak gösterir. `listTitle` ile `detailTitle` panelleri ekran okuyucuya tanıtır: TalkBack ileti açılınca konusunu, listeye dönülünce "Gelen kutusu"nu söyler.

"Kısa", "Geniş" ya da "Kitap"ı seç: liste ve ileti yan yana durur, açık bir ileti yokken sağda `emptyDetail` görünür. Bir iletiyi açıp "Dar" ile "Geniş" arasında geç: açılan ileti de listenin kaydırma yeri de kalır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.divider.PantrixHorizontalDivider
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val inbox = rememberListDetailState()
PantrixListDetailScaffold(
    state = inbox,
    list = {
        MailList(opened = inbox.selectedKey, onOpen = { id -> inbox.select(id) })
    },
    detail = { id ->
        MailDetail(
            mail = MAIL.first { it.id == id },
            // Tek panelde ileti listenin yerindedir: geri düğmesi yalnızca o zaman durur.
            onBack = if (isSinglePane) ({ inbox.back() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    emptyDetail = { Placeholder(text = "Okumak için bir ileti seç", icon = PantrixIcons.Inbox, tagKey = "inbox") },
    listTitle = "Gelen kutusu",
    detailTitle = { id -> MAIL.first { it.id == id }.subject },
    tagKey = "inbox"
)

@Composable
private fun MailList(
    opened: String?,
    onOpen: (String) -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            MAIL.forEachIndexed { index, mail ->
                if (index > 0) PantrixHorizontalDivider()
                ListRow(
                    title = mail.from,
                    subtitle = mail.subject,
                    selected = mail.id == opened,
                    onClick = { onOpen(mail.id) },
                    tagKey = "mail_${mail.id}"
                )
            }
        }
    }
}

@Composable
private fun MailDetail(
    mail: DemoMail,
    onBack: (() -> Unit)?
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = mail.subject,
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "mail_back") } },
                tagKey = "mail"
            )
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(PantrixTheme.spacing.lg),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
            ) {
                PantrixText(
                    text = mail.from,
                    style = PantrixTheme.typography.footnote,
                    color = PantrixTheme.colors.textSecondary
                )
                PantrixText(text = mail.body, tagKey = "mail_body")
            }
        }
    }
}

@Composable
private fun Placeholder(
    text: String,
    icon: ImageVector,
    tagKey: String
) {
    PaneSurface {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixIcon(icon, contentDescription = null, size = 40.dp, tint = PantrixTheme.colors.textSecondary)
            PantrixText(text = text, color = PantrixTheme.colors.textSecondary, tagKey = "${tagKey}_placeholder")
        }
    }
}

private val MAIL = listOf(
    DemoMail("1", "Elif Kaya", "Yarınki toplantı", "Toplantıyı saat 10'a aldım. Sunumu bir gün önce paylaşır mısın?"),
    DemoMail("2", "Can Demir", "Sürüm notları", "1.4 sürümünün notlarını ekledim. Eksik gördüğün bir şey olursa yaz."),
    DemoMail("3", "Ayşe Yılmaz", "Tasarım incelemesi", "Yeni ayarlar ekranının taslakları hazır; perşembe bakalım mı?"),
    DemoMail("4", "Mert Şahin", "Fatura", "Ekim faturası ektedir. Ödeme ayın 30'una kadar yapılabilir."),
    DemoMail("5", "Zeynep Arslan", "Test sonuçları", "Gece çalışan testlerin hepsi geçti; tablette bir uyarı var."),
    DemoMail("6", "Deniz Aydın", "Öğle yemeği", "Cuma günü ekipçe dışarıda yiyelim mi? Yer önerisi olan yazsın."),
    DemoMail("7", "Burak Çelik", "Erişilebilirlik", "Ekran okuyucuyla bütün akışı denedim; iki düğmenin adı eksik."),
    DemoMail("8", "Selin Koç", "Yeni katılan", "Pazartesi ekibe yeni biri katılıyor; ilk haftayı planlayalım.")
)

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class DemoMail(
    val id: String,
    val from: String,
    val subject: String,
    val body: String
)
```

### Ayarlar: iki panelde ilk bölüm açık

Ayarlar ekranı: solda bölümler, sağda seçilen bölümün ayarları. İki panelde boş bir ayrıntı yerine ilk bölüm açık durur; tek panelde ise önce bölümlerin listesi görünür.

Bunun için `emptyDetail` bir şey çizmez, ilk bölümü açar: `LaunchedEffect(Unit) { settings.select(...) }`. Boş ayrıntı yalnızca iki panelde gösterildiği için bu tek panelde hiç çalışmaz.

Ayarların değerleri ayrıntıda değil, örnekte tutulur: `values`. Her bölüm açıldığında yeniden kurulur; değerleri ayrıntının içinde hatırlansaydı başka bir bölüme geçip dönünce kaybolurdu. "Dar"da bir anahtarı değiştir, geri dön, bölümü yeniden aç: değer yerindedir.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.switchbutton.PantrixSwitchButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme

val settings = rememberListDetailState()
val values = remember { mutableStateMapOf<String, Boolean>() }
PantrixListDetailScaffold(
    state = settings,
    list = {
        SectionList(chosen = settings.selectedKey, onChoose = { key -> settings.select(key) })
    },
    detail = { key ->
        val section = SECTIONS.first { it.key == key }
        SettingsPage(
            section = section,
            isOn = { option -> values[option] ?: false },
            onChange = { option, on -> values[option] = on },
            onBack = if (isSinglePane) ({ settings.back() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    // İki panelde boş ayrıntı yerine ilk bölüm açılır. Tek panelde boş ayrıntı gösterilmez: liste kalır.
    emptyDetail = { LaunchedEffect(Unit) { settings.select(SECTIONS.first().key) } },
    tagKey = "settings"
)

@Composable
private fun SectionList(
    chosen: String?,
    onChoose: (String) -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            SECTIONS.forEach { section ->
                ListRow(
                    title = section.title,
                    subtitle = "${section.options.size} ayar",
                    selected = section.key == chosen,
                    onClick = { onChoose(section.key) },
                    tagKey = "section_${section.key}"
                )
            }
        }
    }
}

@Composable
private fun SettingsPage(
    section: SettingsSection,
    isOn: (String) -> Boolean,
    onChange: (String, Boolean) -> Unit,
    onBack: (() -> Unit)?
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = section.title,
                navigationIcon = onBack?.let { back ->
                    { PantrixBackButton(onClick = back, tagKey = "settings_back") }
                },
                tagKey = "settings"
            )
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(PantrixTheme.spacing.lg),
                verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
            ) {
                section.options.forEach { option ->
                    PantrixSwitchButton(
                        checked = isOn(option),
                        onCheckedChange = { onChange(option, it) },
                        modifier = Modifier.fillMaxWidth(),
                        label = option,
                        tagKey = "option_${section.key}_${section.options.indexOf(option)}"
                    )
                }
            }
        }
    }
}

private val SECTIONS = listOf(
    SettingsSection("general", "Genel", listOf("Açılışta son sayfayı göster", "Güncellemeleri kendisi kursun")),
    SettingsSection("notifications", "Bildirimler", listOf("Yeni iletiler", "Takvim hatırlatmaları", "Sesli uyarı")),
    SettingsSection("privacy", "Gizlilik", listOf("Kullanım verisi gönder", "Konumu paylaş")),
    SettingsSection("display", "Görünüm", listOf("Koyu tema", "Daha az hareket", "Büyük yazı"))
)

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class SettingsSection(
    val key: String,
    val title: String,
    val options: List<String>
)
```

### Kişiler ve yanlarında geçmişleri

Bir kişinin yanında üçüncü bir panel: geçmişi. Ayrıntıdaki "Geçmiş" düğmesi `contacts.showExtra()` ile onu açar.

"Geniş"i seç: üç panele yer vardır ve geçmiş ayrıntının yanında, sonda durur; başlığı ve kapatma düğmesi kendi içindedir. "Kısa"yı seç: iki panele yer vardır, geçmiş iskelenin içinde, ayrıntının üstüne sondan açılan bir sheet'te görünür. Sheet'in başlığı `extraTitle`'dır ve kapatma düğmesi sheet'indir; panel kendi başlığını bu yüzden `isExtraInSheet`'e bakarak göstermez. Scrim'e basmak, geri tuşu ve Escape sheet'i kapatır. "Dar"da da sheet'te açılır.

Sheet açıkken geçmişi kaydır, sonra "Geniş"e geç: geçmiş ayrıntının yanına geçer ve kaydırma yeri kalır. Panel iki yerde de aynı kompozisyondur.

Bir kişiden ötekine geçince geçmiş o kişinin olur; listeye dönülünce, `back()`, geçmiş de kapanır.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.iconbutton.PantrixIconButton
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme

val contacts = rememberListDetailState()
PantrixListDetailScaffold(
    state = contacts,
    list = {
        ContactList(opened = contacts.selectedKey, onOpen = { id -> contacts.select(id) })
    },
    detail = { id ->
        ContactCard(
            contact = CONTACTS.first { it.id == id },
            onHistory = { contacts.showExtra() },
            onBack = if (isSinglePane) ({ contacts.back() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    emptyDetail = { Placeholder(text = "Bir kişi seç", icon = PantrixIcons.Person, tagKey = "contacts") },
    extra = { id ->
        History(
            contact = CONTACTS.first { it.id == id },
            // Sheet'te başlık ve kapatma düğmesi sheet'indir.
            onClose = if (isExtraInSheet) null else ({ contacts.hideExtra() })
        )
    },
    listTitle = "Kişiler",
    detailTitle = { id -> CONTACTS.first { it.id == id }.name },
    extraTitle = "Geçmiş",
    tagKey = "contacts"
)

@Composable
private fun ContactList(
    opened: String?,
    onOpen: (String) -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            CONTACTS.forEach { contact ->
                ListRow(
                    title = contact.name,
                    subtitle = contact.role,
                    selected = contact.id == opened,
                    onClick = { onOpen(contact.id) },
                    initials = contact.initials,
                    tagKey = "contact_${contact.id}"
                )
            }
        }
    }
}

@Composable
private fun ContactCard(
    contact: DemoContact,
    onHistory: () -> Unit,
    onBack: (() -> Unit)?
) {
    val spacing = PantrixTheme.spacing
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = contact.name,
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "contact_back") } },
                tagKey = "contact"
            )
            Column(
                modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(spacing.lg),
                verticalArrangement = Arrangement.spacedBy(spacing.md)
            ) {
                PantrixAvatar(contentDescription = null, initials = contact.initials, size = 64.dp)
                PantrixText(text = contact.role, color = PantrixTheme.colors.textSecondary)
                PantrixText(text = contact.email)
                PantrixButton(
                    text = "Geçmiş",
                    onClick = onHistory,
                    variant = ButtonVariant.Outline,
                    leadingIcon = { PantrixIcon(PantrixIcons.Clock, contentDescription = null) },
                    tagKey = "history"
                )
            }
        }
    }
}

@Composable
private fun History(
    contact: DemoContact,
    onClose: (() -> Unit)?
) {
    val lines = @Composable {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(PantrixTheme.spacing.lg),
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.md)
        ) {
            contact.history.forEach { line -> PantrixText(text = line, tagKey = "history_line") }
        }
    }
    if (onClose == null) {
        lines()
    } else {
        PaneSurface {
            Column(modifier = Modifier.fillMaxSize()) {
                PantrixTopBar(
                    title = "Geçmiş",
                    actions = {
                        PantrixIconButton(
                            imageVector = PantrixIcons.Close,
                            contentDescription = "Geçmişi kapat",
                            onClick = onClose,
                            tagKey = "history_close"
                        )
                    },
                    tagKey = "history"
                )
                lines()
            }
        }
    }
}

@Composable
private fun Placeholder(
    text: String,
    icon: ImageVector,
    tagKey: String
) {
    PaneSurface {
        Column(
            modifier = Modifier.align(Alignment.Center),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(PantrixTheme.spacing.sm)
        ) {
            PantrixIcon(icon, contentDescription = null, size = 40.dp, tint = PantrixTheme.colors.textSecondary)
            PantrixText(text = text, color = PantrixTheme.colors.textSecondary, tagKey = "${tagKey}_placeholder")
        }
    }
}

private val CONTACTS = listOf(
    DemoContact(
        "elif",
        "Elif Kaya",
        "EK",
        "Ürün yöneticisi",
        "elif@example.com",
        listOf("Dün: yol haritası toplantısı", "Pazartesi: sürüm planı gönderildi", "Geçen hafta: kullanıcı görüşmesi")
    ),
    DemoContact(
        "can",
        "Can Demir",
        "CD",
        "Geliştirici",
        "can@example.com",
        listOf("Bugün: kod incelemesi", "Dün: hata kaydı kapatıldı")
    ),
    DemoContact(
        "ayse",
        "Ayşe Yılmaz",
        "AY",
        "Tasarımcı",
        "ayse@example.com",
        listOf("Bugün: ayarlar ekranının taslağı", "Salı: renk paleti onaylandı", "Geçen ay: tasarım sistemi")
    ),
    DemoContact(
        "mert",
        "Mert Şahin",
        "MŞ",
        "Muhasebe",
        "mert@example.com",
        listOf("Bu ay: ekim faturası", "Geçen ay: bütçe raporu")
    )
)

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class DemoContact(
    val id: String,
    val name: String,
    val initials: String,
    val role: String,
    val email: String,
    val history: List<String>
)
```

### Dosyalar: listenin genişliği sürüklenir

Listenin genişliği kullanıcının elinde: `resizable = true` panellerin arasına bir tutamaç koyar. Fareyle ya da parmakla sürükle; klavyede Tab ile tutamaca gel, ok tuşları 16 dp'lik adımlarla, Home ve End en dar ve en geniş hâline götürür. Ekran okuyucu tutamacı "Liste genişliği" diye okur ve değerini değiştirebilir.

Genişlik `files.listWidth`'te durur; ayrıntıdaki satır onu yazar, "Varsayılana dön" `Dp.Unspecified` ile stilin genişliğine döndürür. Stil burada liste için 280 dp ve en az 200 dp ister: `ListDetailScaffoldStyle(listWidth = 280.dp, minListWidth = 200.dp)`. Liste, ayrıntıya en az 320 dp bırakacak kadar genişleyebilir.

Tutamaç yalnızca iki panelde durur: "Kısa" ya da "Geniş"i seç.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.isSpecified
import com.pantrixui.components.container.listdetail.ListDetailScaffoldStyle
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.button.ButtonVariant
import com.pantrixui.components.elements.button.PantrixButton
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.icons.PantrixIcons
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val files = rememberListDetailState(initialSelectedKey = FOLDERS.first().name)
PantrixListDetailScaffold(
    state = files,
    list = {
        FolderList(opened = files.selectedKey, onOpen = { name -> files.select(name) })
    },
    detail = { name ->
        FolderContents(
            folder = FOLDERS.first { it.name == name },
            listWidth = files.listWidth,
            onResetWidth = { files.listWidth = Dp.Unspecified },
            onBack = if (isSinglePane) ({ files.back() }) else null
        )
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    resizable = true,
    style = ListDetailScaffoldStyle(listWidth = 280.dp, minListWidth = 200.dp),
    tagKey = "files"
)

@Composable
private fun FolderList(
    opened: String?,
    onOpen: (String) -> Unit
) {
    PaneSurface {
        Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            FOLDERS.forEach { folder ->
                ListRow(
                    title = folder.name,
                    subtitle = "${folder.files.size} dosya",
                    selected = folder.name == opened,
                    onClick = { onOpen(folder.name) },
                    icon = PantrixIcons.Folder,
                    tagKey = "folder_${FOLDERS.indexOf(folder)}"
                )
            }
        }
    }
}

@Composable
private fun FolderContents(
    folder: DemoFolder,
    listWidth: Dp,
    onResetWidth: () -> Unit,
    onBack: (() -> Unit)?
) {
    val spacing = PantrixTheme.spacing
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = folder.name,
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "folder_back") } },
                tagKey = "folder"
            )
            Column(
                modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(spacing.lg),
                verticalArrangement = Arrangement.spacedBy(spacing.sm)
            ) {
                PantrixText(
                    text = if (listWidth.isSpecified) {
                        "Listenin genişliği: ${listWidth.value.roundToInt()} dp"
                    } else {
                        "Listenin genişliği: stilinki"
                    },
                    style = PantrixTheme.typography.footnote,
                    color = PantrixTheme.colors.textSecondary,
                    tagKey = "list_width"
                )
                PantrixButton(
                    text = "Varsayılana dön",
                    onClick = onResetWidth,
                    variant = ButtonVariant.Text,
                    enabled = listWidth.isSpecified,
                    tagKey = "reset_width"
                )
                folder.files.forEach { file ->
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(spacing.sm),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        PantrixIcon(PantrixIcons.File, contentDescription = null)
                        PantrixText(text = file)
                    }
                }
            }
        }
    }
}

private val FOLDERS = listOf(
    DemoFolder("Belgeler", listOf("Sözleşme.pdf", "Toplantı notları.txt", "Bütçe 2026.xlsx")),
    DemoFolder("Fotoğraflar", listOf("Tatil 01.jpg", "Tatil 02.jpg", "Ekip fotoğrafı.png", "Logo.svg")),
    DemoFolder("Müzik", listOf("Çalma listesi.m3u", "Podcast bölümü.mp3")),
    DemoFolder("İndirilenler", listOf("Kurulum.dmg", "Rapor taslağı.docx"))
)

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}

private class DemoFolder(
    val name: String,
    val files: List<String>
)
```

### Katlanan cihazda: kat yerinde buluşur

Katlanan bir cihazda liste ve ayrıntı kat yerinde buluşur. Her panel kendi ölçüsünü ve kendi pencere sınıfını yazar; üstündeki satır ona söyleneni gösterir. Panel kendi penceresidir: "Kitap"ta pencere `Expanded`'dır ama 456 dp'lik iki panelin her biri `Compact` okur.

"Kitap"ı seç: 951 dp'lik pencere zaten iki panellik genişliktedir, ama liste 360 dp değil, kat yerine kadardır. Aradaki boşluk kat yerinin iki yanındaki 20'şer dp'lik şerittir; hiçbir şey kat yerinin üstüne düşmez. Daha dar bir katlanabilir de kitap gibi tutulunca iki panel alır. Tutamaç yoktur: panelleri kat yeri yerleştirir.

"Masa"yı seç: kat yeri yataydır ve yan yana iki paneli ayırmaz. 669 dp'lik pencere `Medium`'dur: tek panel.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.selection.selectable
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.pantrixui.components.container.listdetail.ListDetailScope
import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold
import com.pantrixui.components.container.listdetail.rememberListDetailState
import com.pantrixui.components.container.surface.PantrixSurface
import com.pantrixui.components.container.topbar.PantrixBackButton
import com.pantrixui.components.container.topbar.PantrixTopBar
import com.pantrixui.components.elements.avatar.PantrixAvatar
import com.pantrixui.components.elements.icon.PantrixIcon
import com.pantrixui.components.elements.text.PantrixText
import com.pantrixui.foundation.theme.PantrixTheme
import kotlin.math.roundToInt

val notes = rememberListDetailState(initialSelectedKey = NOTES.first())
PantrixListDetailScaffold(
    state = notes,
    list = {
        Column(modifier = Modifier.fillMaxSize()) {
            Told(scope = this@PantrixListDetailScaffold, tagKey = "notes_told_list")
            MeasuredList(opened = notes.selectedKey, onOpen = { note -> notes.select(note) })
        }
    },
    detail = { note ->
        Column(modifier = Modifier.fillMaxSize()) {
            Told(scope = this@PantrixListDetailScaffold, tagKey = "notes_told_detail")
            MeasuredNote(note = note, onBack = if (isSinglePane) ({ notes.back() }) else null)
        }
    },
    modifier = Modifier.fillMaxWidth().height(EXAMPLE_HEIGHT),
    resizable = true,
    tagKey = "notes"
)

@Composable
private fun Told(
    scope: ListDetailScope,
    tagKey: String
) {
    PantrixText(
        text = "paneCount: ${scope.paneCount} · isSinglePane: ${if (scope.isSinglePane) "evet" else "hayır"}",
        modifier = Modifier.padding(PantrixTheme.spacing.md),
        style = PantrixTheme.typography.footnote,
        color = PantrixTheme.colors.textSecondary,
        tagKey = tagKey
    )
}

@Composable
private fun MeasuredList(
    opened: String?,
    onOpen: (String) -> Unit
) {
    Measured(name = "Liste", tagKey = "notes_list_size") {
        Column {
            NOTES.forEach { note ->
                ListRow(
                    title = note,
                    subtitle = null,
                    selected = note == opened,
                    onClick = { onOpen(note) },
                    tagKey = "note_${NOTES.indexOf(note)}"
                )
            }
        }
    }
}

@Composable
private fun MeasuredNote(
    note: String,
    onBack: (() -> Unit)?
) {
    PaneSurface {
        Column(modifier = Modifier.fillMaxSize()) {
            PantrixTopBar(
                title = note,
                navigationIcon = onBack?.let { back -> { PantrixBackButton(onClick = back, tagKey = "note_back") } },
                tagKey = "note"
            )
            Measured(name = "Ayrıntı", tagKey = "notes_detail_size") {}
        }
    }
}

private val NOTES = listOf("Alışveriş listesi", "Kitap önerileri", "Tatil planı", "Toplantı notları")

private val EXAMPLE_HEIGHT = 460.dp

@Composable
private fun Measured(
    name: String,
    tagKey: String,
    content: @Composable () -> Unit
) {
    var size by remember { mutableStateOf(IntSize.Zero) }
    val density = LocalDensity.current
    val words = with(density) { "${size.width.toDp().value.roundToInt()} × ${size.height.toDp().value.roundToInt()}" }
    PaneSurface(modifier = Modifier.onSizeChanged { size = it }) {
        Column(modifier = Modifier.fillMaxSize()) {
            Column(modifier = Modifier.weight(1f)) { content() }
            // Ölçüler soldan sağa yazılır: sağdan sola bir paragrafta genişlik ile yükseklik yer değiştirmiş okunurdu.
            CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Ltr) {
                PantrixText(
                    // Panel kendi penceresidir: sınıfı panelin genişliğine göredir, pencereninkine değil.
                    text = "$name: $words dp · ${PantrixTheme.window.widthClass.name}",
                    modifier = Modifier.padding(PantrixTheme.spacing.md),
                    style = PantrixTheme.typography.footnote,
                    color = PantrixTheme.colors.textSecondary,
                    tagKey = tagKey
                )
            }
        }
    }
}

@Composable
private fun ListRow(
    title: String,
    subtitle: String?,
    selected: Boolean,
    onClick: () -> Unit,
    tagKey: String,
    initials: String? = null,
    icon: ImageVector? = null
) {
    val colors = PantrixTheme.colors
    val spacing = PantrixTheme.spacing
    val ink = if (selected) colors.primary.onContainer else Color.Unspecified
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .selectable(selected = selected, onClick = onClick)
            .background(if (selected) colors.primary.container else Color.Transparent)
            .padding(spacing.md),
        horizontalArrangement = Arrangement.spacedBy(spacing.md),
        verticalAlignment = Alignment.CenterVertically
    ) {
        if (initials != null) PantrixAvatar(contentDescription = null, initials = initials)
        if (icon != null) PantrixIcon(icon, contentDescription = null, tint = ink)
        Column(verticalArrangement = Arrangement.spacedBy(spacing.xs)) {
            PantrixText(
                text = title,
                style = PantrixTheme.typography.callout,
                color = ink,
                maxLines = 1,
                tagKey = tagKey
            )
            if (subtitle != null) {
                PantrixText(
                    text = subtitle,
                    style = PantrixTheme.typography.footnote,
                    color = if (selected) ink else colors.textSecondary,
                    maxLines = 1
                )
            }
        }
    }
}

@Composable
private fun PaneSurface(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit
) {
    PantrixSurface(modifier = modifier.fillMaxSize(), border = PantrixTheme.colors.border) { content() }
}
```

## API

### PantrixListDetailScaffold

`import com.pantrixui.components.container.listdetail.PantrixListDetailScaffold`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun PantrixListDetailScaffold(
    state: ListDetailState,
    list: @Composable ListDetailScope.() -> Unit,
    detail: @Composable ListDetailScope.(key: String) -> Unit,
    modifier: Modifier = Modifier,
    emptyDetail: (@Composable ListDetailScope.() -> Unit)? = null,
    extra: (@Composable ListDetailScope.(key: String) -> Unit)? = null,
    listTitle: String? = null,
    detailTitle: ((key: String) -> String)? = null,
    extraTitle: String? = null,
    resizable: Boolean = false,
    style: ListDetailScaffoldStyle? = null,
    tagKey: String? = null
)
```

Bir liste ve içinde açılan öğenin ayrıntısı: yerde ikisine yer varsa yan yana, yoksa ayrıntı listenin yerinde; ayrıca ayrıntının yanında ya da üstünde, scaffold'un kendi yan sheet'inde ekstra bir panel.

- **Kaç panel.** Scaffold pencerenin değil kendi yerinin büyüklüğüne bakar: Compact ya da Medium bir yerde bir panel, Expanded'dan itibaren iki, Large'dan itibaren `extra` paneli verilmişse üç. Yeri dikey ayıran bir kat yeri, kitap gibi tutulan bir katlanabilir, her genişlikte iki panel yapar; liste ve ayrıntı kat yerinde buluşur.

- **Tek panel.** Açık bir öğe yokken liste görünür; `ListDetailState.select` ayrıntıyı onun yerinde açar, sondan kayarak gelir. Geri tuşu, Escape ve iOS'un kenardan kaydırması `ListDetailState.back`'i çağırır: ayrıntı kayarak gider, geri hareketinde parmağın ilerleyişini izleyerek, ve liste geri gelir. Bir ekrandaki birkaç scaffold'dan geri, en son açılan ayrıntıyı kapatır. Klavyenin odağı gösterilen panelle gider: listeden açılan öğenin ayrıntısına, geri dönünce de o öğeye. Ayrıntı kayarken temanın arka zemininin üstüne çizilir; böylece altındaki listeyi örter.

- **İki panel.** Liste baştadır ve stilin `listWidth`'i kadar geniştir, ayrıntı boşluğun ötesindeki yerin geri kalanını alır; geri uygulamanındır, scaffold ona dokunmaz. Açık bir öğe yokken ayrıntı panelinde `emptyDetail` görünür.

- **Genişliği değişebilir.** `resizable` ile boşlukta bir tutamaç durur: sürüklemek, ok tuşları ve ekran okuyucunun ayarlaması listeyi, stilin `minListWidth`'i ile ayrıntının `minDetailWidth`'ten daha dar kalacağı yer arasında genişletip daraltır. Üstündeki imleç boyutlandırma imlecidir (`PantrixPointerIcons.ResizeHorizontal`). Genişlik `ListDetailState.listWidth`'te saklanır. Bir kat yeri panelleri kendisi yerleştirir; o zaman tutamaç yoktur.

- **Ekstra panel.** `ListDetailState.showExtra` `extra`'yı üç panele yer varsa ayrıntının yanında gösterir. Başka yerde, scaffold'un kendi yerinde çizilen bir yan sheet'te ayrıntının üstüne sondan kayarak gelir: `extraTitle` ve bir kapatma düğmesinin altında, basınca kapanan bir scrim'in üstünde; geri tuşu ve Escape de kapatır. Klavyenin odağı içine girer ve o kapanana kadar orada kalır. İki yerde de ona sınırlı bir yükseklik verilir ve içindekini kendisi kaydırır; tek bir kompozisyondur: yer birinden ötekine değişince hatırladığı kalır.

- **Her panel bir pencere.** Panelin içindekine panel pencere olarak söylenir: `PantrixTheme.window`, sınıfları ve `PantrixTheme.layout` panelin yerine göre cevap verir; böylece dar bir paneldeki liste kendini bir telefondaki gibi dizer. Duruş pencerenin kalır; kat yeri bir paneli kestiği yerde bulunur.

- **Ekran okuyucu.** Her panel tek bir grup olarak okunur. `listTitle`, `detailTitle` ve `extraTitle` panelleri görünür oldukça adlandırır; bunu Android'de TalkBack söyler. Compose bir panelin adını VoiceOver'a bildirmez.

- **Korunan durum.** Yer bir panelle iki panel arasında değişirken liste ve ayrıntı kompozisyonda yerinde kalır: listenin kaydırma yeri ve ayrıntının metni korunur. Gösterilmeyen bir panel yerleştirilmez; bu yüzden klavye de ekran okuyucu da onu atlar.

- **Azaltılmış hareket.** Ayrıntı bir anda açılır ve gider.

- **Okuma yönü.** Liste baştadır, sağdan sola okunan bir dilde sağda; ayrıntı orada soldan kayarak gelir.

- **Otomasyon.** Scaffold'un etiketi `ListDetailScaffold_<tagKey>`'dir, panellerinin `ListDetailList_<tagKey>`, `ListDetailDetail_<tagKey>` ve `ListDetailExtra_<tagKey>`, tutamacın `ListDetailHandle_<tagKey>`, yan sheet'in scrim'inin ve kapatma düğmesinin `ListDetailScrim_<tagKey>` ve `ListDetailClose_<tagKey>`.

Scaffold kendisine verilen yeri alır; bu yer iki yönde de sınırlı olmalıdır: bir ekranda `Modifier.fillMaxSize()`.

Parametreler:

- `state: ListDetailState`: açık olan: `rememberListDetailState` onu yapılandırma değişikliğinde korur.
- `list: @Composable ListDetailScope.() -> Unit`: liste. Bir öğeyi `ListDetailState.select` ile açar.
- `detail: @Composable ListDetailScope.(key: String) -> Unit`: anahtarı verilen öğenin ayrıntısı. Yeni bir anahtar onu yeniden kurar.
- `modifier: Modifier`: panellerin paylaştığı yer.
- `emptyDetail: (@Composable ListDetailScope.() -> Unit)?`: açık bir öğe yokken listenin yanındaki ayrıntı panelinde gösterilen: "Bir ileti seçin". Verilmezse orada bir şey gösterilmez.
- `extra: (@Composable ListDetailScope.(key: String) -> Unit)?`: açık öğe için ayrıntısının yanında üçüncü bir panel: kişinin geçmişi, bir dosyanın özellikleri. `ListDetailState.showExtra` çağrılınca gösterilir.
- `listTitle: String?`: listenin adı, görünür olurken ekran okuyucu için: "Gelen kutusu".
- `detailTitle: ((key: String) -> String)?`: anahtarı verilen öğenin ayrıntısının adı, görünür olurken ekran okuyucu için: iletinin konusu.
- `extraTitle: String?`: ekstra panelin adı: ayrıntının üstünde gösterildiği yan sheet'in başlığı, ve görünür olurken ekran okuyucu için.
- `resizable: Boolean`: liste ile ayrıntı arasında listeyi genişletip daraltan bir tutamaç olup olmadığı.
- `style: ListDetailScaffoldStyle?`: scaffold'un genişlikleri, temanınkilerin üstünde.
- `tagKey: String?`: scaffold'un otomasyon etiketlerinin anahtarı.

### ListDetailState

`import com.pantrixui.components.container.listdetail.ListDetailState`, `com.pantrixui:components` içinden

```kotlin
class ListDetailState(initialSelectedKey: String? = null)
```

Bir `PantrixListDetailScaffold`'un gösterdiği: listenin hangi öğesinin açık olduğu, ekstra panelinin gösterilip gösterilmediği ve listenin ne kadar genişletildiği. Uygulama onu okur, değiştirir ve yapılandırma değişikliğinde, işlemin ölümünde de korur: `rememberListDetailState` onu kaydeder.

```kotlin
val inbox = rememberListDetailState()
PantrixListDetailScaffold(
    state = inbox,
    list = { Messages(onOpen = { id -> inbox.select(id) }) },
    detail = { id -> Message(id) }
)
```

Bir öğe, uygulamanın verdiği bir anahtarla anılır: her dilde aynı kalan, kaydedilebilen bir dize.

Parametreler:

- `initialSelectedKey: String?`: başta açık olan öğe, ya da hiçbiri.

Üyeleri:

- `selectedKey: String?`: Ayrıntı panelinde açık olan öğenin anahtarı; hiçbiri açık değilken null.
- `isExtraVisible: Boolean`: Ekstra panelin, ayrıntının yanındakinin, gösterilip gösterilmediği. Ekstra paneli verilmemiş bir scaffold bu ne derse desin göstermez.
- `listWidth: Dp`: Listenin tutamacıyla ne kadar genişletildiği; scaffold'un stilinin dediği kadar genişken `Dp.Unspecified`. Durumun geri kalanıyla birlikte saklanır; okuyanın genişliğini kendisi hatırlayan bir uygulama da onu ayarlar.
- `fun select(key: String)`: `key` öğesini ayrıntı panelinde açar: bir seferde tek panelde ayrıntı listenin yerini alır.
- `fun back()`: Listeye döner: ayrıntıyı ve ekstra paneli kapatır, hiçbir öğe açık kalmaz. Scaffold bir seferde tek panel gösterirken geri tuşu, Escape ve iOS'un kenardan kaydırması bunu yapar.
- `fun showExtra()`: Ekstra paneli gösterir: üç panele yer varsa ayrıntının yanında, yoksa bir yan sheet'te.
- `fun hideExtra()`: Ekstra paneli gizler.

Tipin kendisinde:

- `ListDetailState.Saver: Saver<ListDetailState, *>`: `rememberListDetailState`'in bir durumu kaydettiği.

### rememberListDetailState

`import com.pantrixui.components.container.listdetail.rememberListDetailState`, `com.pantrixui:components` içinden

```kotlin
@Composable
fun rememberListDetailState(initialSelectedKey: String? = null): ListDetailState
```

Hatırlanan ve kaydedilen bir `ListDetailState`: açık öğe, ekstra panel ve listenin genişliği yapılandırma değişikliğinden ve işlemin ölümünden sonra geri gelir.

Parametreler:

- `initialSelectedKey: String?`: başta açık olan öğe, ya da hiçbiri.

### ListDetailScope

`import com.pantrixui.components.container.listdetail.ListDetailScope`, `com.pantrixui:components` içinden

```kotlin
interface ListDetailScope
```

Bir `PantrixListDetailScaffold`'un her paneline içinde bulunduğu scaffold hakkında söylenenler.

Üyeleri:

- `state: ListDetailState`: Scaffold'un durumu: bir panelin bir öğeyi açtığı, ekstra paneli gösterdiği ve geri döndüğü.
- `paneCount: Int`: Scaffold'da yan yana kaç panele yer olduğu: bir, iki, ya da ekstra paneli verilmişse ve yeri Large ya da daha genişse üç.
- `isSinglePane: Boolean`: Scaffold'un bir seferde tek panel, listenin yerinde ayrıntıyı gösterip göstermediği: öyleyse ayrıntının kendi bar'ı `ListDetailState.back`'i çağıran bir geri düğmesi gösterir.
- `isExtraInSheet: Boolean`: Ekstra panelin ayrıntının yanında değil, ayrıntının üstünde, scaffold'un kendi başlığı ve kapatma düğmesi olan yan sheet'inde gösterilip gösterilmediği: kendi başlığını çizen bir ekstra panel o zaman onu çizmez.

### ListDetailScaffoldStyle

`import com.pantrixui.components.container.listdetail.ListDetailScaffoldStyle`, `com.pantrixui:components` içinden

```kotlin
class ListDetailScaffoldStyle(
    public val listWidth: Dp = Dp.Unspecified,
    public val minListWidth: Dp = Dp.Unspecified,
    public val minDetailWidth: Dp = Dp.Unspecified,
    public val extraWidth: Dp = Dp.Unspecified,
    public val gap: Dp = Dp.Unspecified,
    public val handleWidth: Dp = Dp.Unspecified,
    public val handleHeight: Dp = Dp.Unspecified,
    public val handleTarget: Dp = Dp.Unspecified
) : PantrixStyle<ListDetailScaffoldStyle>
```

`PantrixListDetailScaffold`'un ölçüleri: liste ve ekstra panel ayrıntının yanında ne kadar geniştir, tutamacı sürüklemek listeyi ve ayrıntıyı en çok ne kadar daraltabilir, ve tutamacın kendisi.

Paneller arasındaki boşluk, varsayılanı olan düzenin sütun arası gibi yoğunluğa uyar; genişlikler ve tutamaç uymaz. Panellerin renkleri stilin parçası değildir: her paneli, içine koyduğuyla uygulama çizer.

Parametreler:

- `listWidth: Dp`: Tutamacı sürüklenene kadar listenin ayrıntının yanındaki genişliği: bir telefonun genişliği, 360dp.
- `minListWidth: Dp`: Tutamacı sürüklemenin listeyi en çok daraltabildiği genişlik.
- `minDetailWidth: Dp`: Ayrıntının listenin yanında en çok daralabildiği genişlik: tutamacın sürüklenmesi ayrıntının daha dar kalacağı yerde durur, durumda ayarlanan bir liste genişliği de.
- `extraWidth: Dp`: Üç panele yer olduğunda ekstra panelin ayrıntının yanındaki genişliği.
- `gap: Dp`: Paneller arasında. Hazır ayarlarda belirtilmez: düzenin pencereyle büyüyen sütun arası, `PantrixTheme.layout.gutter`. Panelleri kenar kenara buluşan, aralarında kendi çizgisi olan bir marka 0dp verir.
- `handleWidth: Dp`: Genişliği değişebilen bir listenin tutamacının boşlukta çizdiği işaret: kısa, dik bir çubuk.
- `handleHeight: Dp`: Tutamacın dik çubuğunun ne kadar uzun olduğu: ne kadar kalın olduğu `handleWidth`'tir.
- `handleTarget: Dp`: Bir parmağın ya da işaretçinin tutamacı yakaladığı şeridin genişliği; boşluğun ortasında durur, boşluk daha darsa panellerin kenarlarının üstüne taşar: parmakla her platformun en küçük dokunma hedefi, işaretçiyle dar bir şerit.
