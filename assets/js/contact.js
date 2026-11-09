/* Formulaire de contact : envoi via Web3Forms + captcha hCaptcha.
   Clé d'accès Web3Forms (publique, faite pour être dans le code). */
(function () {
  var ACCESS_KEY = "WEB3FORMS_ACCESS_KEY";

  var form = document.getElementById("form");
  if (!form) return;
  var en = (document.documentElement.lang || "fr").toLowerCase().indexOf("en") === 0;
  var t = en ? {
    sending: "Sending…", send: "Send",
    ok: "Thanks, your message has been sent. I'll get back to you soon.",
    captcha: "Please confirm you're not a robot.",
    err: "The message couldn't be sent. Try again or email me at wichtmathias0@gmail.com.",
    nokey: "The form isn't active yet. Email me at wichtmathias0@gmail.com."
  } : {
    sending: "Envoi…", send: "Envoyer",
    ok: "Merci, votre message est bien envoyé. Je vous réponds rapidement.",
    captcha: "Merci de confirmer que vous n'êtes pas un robot.",
    err: "Le message n'a pas pu être envoyé. Réessayez ou écrivez-moi à wichtmathias0@gmail.com.",
    nokey: "Le formulaire n'est pas encore actif. Écrivez-moi à wichtmathias0@gmail.com."
  };

  var key = form.querySelector('input[name="access_key"]');
  if (key) key.value = ACCESS_KEY;
  var btn = form.querySelector('button[type="submit"]');
  var status = form.querySelector(".form-status");

  function say(msg, kind) {
    status.textContent = msg;
    status.className = "form-status " + (kind || "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!ACCESS_KEY || ACCESS_KEY.indexOf("WEB3FORMS") === 0) { say(t.nokey, "bad"); return; }
    var data = new FormData(form);
    if (!data.get("h-captcha-response")) { say(t.captcha, "bad"); return; }
    data.set("subject", "Portfolio · " + (data.get("topic") || "Message"));
    btn.disabled = true; btn.textContent = t.sending; say("");
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: data
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (res && res.success) { form.reset(); say(t.ok, "good"); }
      else { say(t.err, "bad"); }
    }).catch(function () { say(t.err, "bad"); }).then(function () {
      btn.disabled = false; btn.textContent = t.send;
      try { if (window.hcaptcha) hcaptcha.reset(); } catch (x) {}
    });
  });
})();
