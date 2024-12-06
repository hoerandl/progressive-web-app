// ServiceWorker registrieren
document.addEventListener("DOMContentLoaded", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("serviceWorker.js", { scope: "/" })
      .then(
        () =>
          (document.querySelector("#info").innerHTML =
            "Service Worker registerd")
      )
      .catch((error) => {
        document.querySelector("#info").innerHTML = error;
      });
  }
});
