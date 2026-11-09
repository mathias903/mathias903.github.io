/* Bannière cookies + Google Analytics 4 chargé seulement après accord.
   Pour activer les statistiques, mets ton identifiant GA4 ici (ex. "G-ABC123XYZ"). */
(function () {
  var GA_ID = "G-L35LQPNYLX";
  var KEY = "mw-consent"; // "accepted" | "refused"

  var script = document.currentScript;
  var root = script ? script.src.replace(/assets\/js\/consent\.js.*$/, "") : "/";
  var en = (document.documentElement.lang || "fr").toLowerCase().indexOf("en") === 0;

  var t = en ? {
    text: "This site uses audience measurement cookies (Google Analytics) to understand how visitors use it. They are only set if you accept.",
    accept: "Accept", refuse: "Decline", more: "Privacy policy", manage: "Cookie settings",
    policy: root + "en/privacy.html"
  } : {
    text: "Ce site utilise des cookies de mesure d'audience (Google Analytics) pour savoir comment il est utilisé. Ils ne sont déposés que si vous acceptez.",
    accept: "Accepter", refuse: "Refuser", more: "Politique de confidentialité", manage: "Gérer les cookies",
    policy: root + "confidentialite.html"
  };

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  function loadGA() {
    if (!GA_ID || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID, { anonymize_ip: true, cookie_flags: "SameSite=None;Secure" });
  }

  function clearGA() {
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (/^_ga/.test(name)) {
        var host = location.hostname;
        document.cookie = name + "=; Max-Age=0; path=/";
        document.cookie = name + "=; Max-Age=0; path=/; domain=" + host;
        document.cookie = name + "=; Max-Age=0; path=/; domain=." + host;
      }
    });
  }

  var css = "" +
    ".mw-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin-left:auto;" +
    "background:rgba(13,18,30,.96);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16);" +
    "border-radius:4px;padding:18px 20px;color:#e9edf5;font:14px/1.55 'Instrument Sans',system-ui,sans-serif;box-shadow:0 20px 50px rgba(0,0,0,.45);" +
    "transform:translateY(20px);opacity:0;transition:transform .35s,opacity .35s}" +
    ".mw-cookie.show{transform:none;opacity:1}" +
    ".mw-cookie p{margin:0 0 14px;color:#a3adc2}" +
    ".mw-cookie a{color:#38bdf8;text-decoration:underline}" +
    ".mw-cookie .mw-row{display:flex;justify-content:flex-start;gap:10px;flex-wrap:wrap}" +
    ".mw-cookie button{margin:0;width:auto;flex:0 0 auto;position:static;cursor:pointer;font:600 14px 'Instrument Sans',system-ui,sans-serif;padding:10px 18px;border-radius:4px;" +
    "border:1px solid rgba(255,255,255,.16);background:transparent;color:#e9edf5}" +
    ".mw-cookie button:hover{border-color:#3b82f6}" +
    ".mw-cookie button.ok{background:#2563eb;border-color:#2563eb;color:#fff}" +
    ".mw-cookie button.ok:hover{background:#3b82f6}" +
    ".mw-cookie button:focus-visible,.mw-cookie a:focus-visible{outline:2px solid #38bdf8;outline-offset:2px}";

  var box;
  function show() {
    if (!document.getElementById("mw-cookie-css")) {
      var st = document.createElement("style");
      st.id = "mw-cookie-css";
      st.textContent = css;
      document.head.appendChild(st);
    }
    if (box) { box.remove(); }
    box = document.createElement("div");
    box.className = "mw-cookie";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Cookies");
    box.innerHTML = '<p>' + t.text + ' <a href="' + t.policy + '">' + t.more + '</a></p>' +
      '<div class="mw-row"><button type="button" class="ok">' + t.accept + '</button>' +
      '<button type="button" class="no">' + t.refuse + '</button></div>';
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add("show"); });
    box.querySelector(".ok").addEventListener("click", function () { set("accepted"); hide(); loadGA(); });
    box.querySelector(".no").addEventListener("click", function () { set("refused"); hide(); clearGA(); });
  }
  function hide() {
    if (!box) return;
    box.classList.remove("show");
    var b = box; box = null;
    setTimeout(function () { b.remove(); }, 350);
  }

  window.mwCookieSettings = show;

  function init() {
    document.querySelectorAll("[data-cookie-settings]").forEach(function (el) {
      el.addEventListener("click", function (e) { e.preventDefault(); show(); });
    });
    var c = get();
    if (c === "accepted") loadGA();
    else if (c !== "refused") show();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
