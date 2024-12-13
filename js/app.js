// Versionsnummer anzeigen
console.log(version);
document.querySelector("#version").innerHTML = version;

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

// Benachrichtigungen
var notify = Notification.permission;
let notificationStatus = "";
switch (notify) {
  case "denied":
    document.getElementById("noificationStatus").innerHTML =
      '<span class="danger">Benachrichtigungen sind NICTHT erlaubt</span>';
    console.error("Benachrichtigungen sind nicht erlaubt");
    break;
  case "granted":
    document.getElementById("noificationStatus").innerHTML =
      '<span class="success">Benachrichtigungen sind erlaubt</span>';
    document.getElementById("buttonNotificationSubmit").style.display = "block";
    console.log("Benachrichtigungen sind erlaubt");
    break;
  case "default":
    document.getElementById("noificationStatus").innerHTML =
      '<span class="warning">unbekannt</span>';
    document.getElementById("buttonNotificationPermission").style.display =
      "block";
    console.warn("Benachrichtigungsstatus unbekannt");
}

// Erlaubnis von Benachrichtigungen einholen
const buttonPermission = document.getElementById(
  "buttonNotificationPermission"
);
buttonPermission.addEventListener("click", () => {
  Notification.requestPermission().then(() => {
    window.location.reload();
  });
});

// Nachricht erzeugen
/*
function simpleNotification() {
  let options = {
    body: "Das ist der Inhalt der Testnachricht.",
    icon: "./img/logo.png",
  };
  new Notification("Testnachricht", options);
}
*/
function simpleNotification() {
  if (notify == "granted") {
    navigator.serviceWorker.ready.then(function (registration) {
      let options = {
        body: "Das ist der Inhalt der Testnachricht.",
        icon: "./img/logo.png",
      };
      registration.showNotification("Testnachricht", options);
    });
  }
}

// Nachricht senden bzw. empfangen
const buttonSubmit = document.getElementById("buttonNotificationSubmit");
buttonSubmit.addEventListener("click", () => {
  simpleNotification();
});

// kompletten Cache leeren
async function cacheDeleteAll() {
  const keys = await caches.keys();
  for (const key of keys) {
    caches.delete(key);
    console.log(key);
  }
}

// Nachricht senden bzw. empfangen
const buttonClearCache = document.getElementById("clearCache");
buttonClearCache.addEventListener("click", () => {
  cacheDeleteAll();
  document.querySelector("#cacheFiles").innerHTML = "";
  cacheFiles();
});

// alle Dateien im Cache holen
const cacheFileArray = [];
async function cacheFiles() {
  const keys = await caches.keys();
  for (const key of keys) {
    console.log(key);

    caches.open(key).then((cache) => {
      cache
        .matchAll()
        .then((response) => {
          return response;
        })
        .then((files) => {
          console.log(files);
          document.querySelector("#cacheFiles").innerHTML +=
            "<h3>" + key + "</h3><ul>";
          for (const file of files) {
            console.log(file.url);
            document.querySelector("#cacheFiles").innerHTML +=
              '<li><a href="' + file.url + '">' + file.url + "</a></li>";
          }
          document.querySelector("#cacheFiles").innerHTML += "</ul>";
        });
    });
  }
}

cacheFiles();
console.log(cacheFileArray);
