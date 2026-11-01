// Demoyu tarayıcının çalıştırabildiği sürümüyle başlatır (docs/guide/web-compatibility).
//
// Tarayıcı Wasm'ı çöp toplamasıyla çalıştırıyorsa Wasm sürümünü (webApp-wasm.js); çalıştırmıyorsa, 119'dan önceki
// Chrome ve 18.2'den önceki Safari gibi, JavaScript sürümünü (webApp-js.js), ki o yalnızca Skia için düz Wasm ister.
// Aşağıdaki sınamayı geçen bir tarayıcıda da Wasm sürümü açılamayabilir: bir telefonun tarayıcısının kodu için belleği
// kalmayabilir ya da bir modülü reddedebilir. Wasm sürümü ilk karesini çizmeden önce Wasm'ın bir hatasıyla çökerse
// JavaScript sürümü başlar. O da çökerse ya da tarayıcıda hiç Wasm yoksa yükleme işaretinin yerinde bunu söyleyen bir
// yazı kalır.
(function () {
    "use strict";

    // Compose'un kendi yükleyicisinin bir tarayıcıyı sınadığı modül (WebCompatibilityTask): bir struct türü ve bir
    // `try`. Onu kabul eden tarayıcıda Wasm sürümünün istediği çöp toplama da istisnalar da vardır.
    var FEATURES = new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0, 1, 8, 2, 95, 1, 120, 0, 96, 0, 0, 3, 3, 2, 1, 1, 10, 14, 2, 6, 0, 6, 64, 25, 11,
        11, 5, 0, 208, 112, 26, 11, 0, 45, 4, 110, 97, 109, 101, 1, 15, 2, 0, 5, 102, 117, 110, 99, 48, 1, 5, 102, 117,
        110, 99, 49, 4, 8, 1, 0, 5, 116, 121, 112, 101, 48, 10, 11, 1, 0, 1, 0, 6, 102, 105, 101, 108, 100, 48
    ]);
    var WASM = "webApp-wasm.js";
    var JS = "webApp-js.js";

    // Başlamakta olan sürüm: "wasm" ya da "js"; denenecek sürüm kalmayınca null.
    var starting = null;

    // Demo ilk karesini çizince yükleme işaretini kaldırır (main.kt): ondan sonraki bir hata demonundur.
    function drawn() {
        return !document.getElementById("loading");
    }

    function load(src, onFailure) {
        var script = document.createElement("script");
        script.type = "application/javascript";
        script.src = src;
        script.onerror = onFailure;
        document.body.appendChild(script);
    }

    function showUnsupported() {
        starting = null;
        var mark = document.getElementById("loading");
        if (!mark) return;
        mark.textContent = "Bu tarayıcı demoyu çalıştıramıyor: Chrome 119, Safari 18.2 ya da Firefox 120 ve sonrası " +
            "gerekir. This browser cannot run the demo: it needs Chrome 119, Safari 18.2 or Firefox 120, or later.";
        mark.className = "unsupported";
    }

    function startJavaScript() {
        starting = "js";
        // Wasm sürümünün çökmeden önce uygulamanın kutusuna kurduğu şey.
        var box = document.getElementById("app");
        while (box && box.firstChild) box.removeChild(box.firstChild);
        load(JS, showUnsupported);
    }

    // Tarayıcının Wasm'ının bir hatası, demonun bir hatasından ayrı olarak: derleyemediği ya da bağlayamadığı bir modül,
    // bir tuzak ya da ona kalmayan bellek.
    function wasmFailed(error) {
        var wasm = typeof WebAssembly === "object";
        return error instanceof RangeError || wasm && (error instanceof WebAssembly.CompileError ||
            error instanceof WebAssembly.LinkError || error instanceof WebAssembly.RuntimeError);
    }

    // Hatanın yığını betikten geçiyor mu: JavaScript sürümü başladıktan sonra Wasm sürümünün dururken attığı hata Wasm
    // sürümünün çöküşüdür, JavaScript sürümününki değil.
    function thrownBy(error, script) {
        return String(error && error.stack || "").indexOf(script) >= 0;
    }

    function failed(error) {
        if (starting === null || drawn() || !wasmFailed(error)) return;
        if (starting === "wasm") {
            console.warn("Pantrix UI: Wasm sürümü çizilmeden çöktü, JavaScript sürümü başlıyor.", error);
            startJavaScript();
        } else if (!thrownBy(error, WASM)) {
            console.warn("Pantrix UI: JavaScript sürümü de çöktü.", error);
            showUnsupported();
        }
    }

    window.addEventListener("error", function (event) {
        failed(event.error);
    });
    window.addEventListener("unhandledrejection", function (event) {
        failed(event.reason);
    });

    var collected = false;
    try {
        collected = typeof WebAssembly === "object" && WebAssembly.validate(FEATURES);
    } catch (unsupported) {
        collected = false;
    }
    if (collected) {
        starting = "wasm";
        load(WASM, startJavaScript);
    } else if (typeof WebAssembly === "object") {
        startJavaScript();
    } else {
        showUnsupported();
    }
})();
