// Informationen anzeigen
var info = "Start...<br>";
document.querySelector("#info").innerHTML = info;

// Install-Button anzeigen
var buttonInstall = document.querySelector("#buttonInstall");
function showInstallPromotion() {
  buttonInstall.style.display = "block";
}
function hideInstallPromotion() {
  buttonInstall.style.display = "none";
}

// ServiceWorker registrieren
document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("serviceWorker.js", { scope: "/" })
      .then(
        () =>
          (document.querySelector("#info").innerHTML +=
            '"Service Worker" registerd<br>')
      )
      .catch((error) => {
        document.querySelector("#info").innerHTML = error + "<br>";
      });
  } else {
    document.querySelector("#info").innerHTML +=
      '"Service Worker" not available<br>';
  }
});

// prüfen ob alle Kriterien erfüllt sind, und die App noch nicht installiert ist
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // verhindert die Anzeige der Mini-Infoleiste auf mobilen Geräten
  deferredPrompt = e;
  showInstallPromotion();
  document.querySelector("#info").innerHTML += "PWA ready for installation<br>";
});

// der Button zum Installieren wurde gedrückt
buttonInstall.addEventListener("click", async () => {
  hideInstallPromotion();
  deferredPrompt.prompt(); // Zeigt das Systempopup um die Installation zu bestätigen
  let userChoice = await deferredPrompt.userChoice; // Wartet auf die Benutzereingabe
  deferredPrompt = null; // das Systempopup nicht mehr anzeigen
  document.querySelector("#info").innerHTML +=
    "User response to the install prompt: " + userChoice.outcome + "<br>";
});

// prüfe ob die App bereits installiert ist
window.addEventListener("appinstalled", () => {
  hideInstallPromotion();
  deferredPrompt = null;
  document.querySelector("#info").innerHTML += "PWA was installed<br>";
});

// Anzeige in welchem Modus diese PWA läuft
function getPWADisplayMode() {
  if (document.referrer.startsWith("android-app://")) return "twa";
  if (window.matchMedia("(display-mode: browser)").matches) return "browser";
  if (window.matchMedia("(display-mode: standalone)").matches)
    return "standalone";
  if (window.matchMedia("(display-mode: minimal-ui)").matches)
    return "minimal-ui";
  if (window.matchMedia("(display-mode: fullscreen)").matches)
    return "fullscreen";
  if (window.matchMedia("(display-mode: window-controls-overlay)").matches)
    return "window-controls-overlay";
  return "unknown";
}
window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#info").innerHTML +=
    "Display Mode: " + getPWADisplayMode() + "<br>";
});
