self.addEventListener("install", (event) => {});

self.addEventListener("fetch", (event) => {});

self.addEventListener("activate", (event) => {});

self.addEventListener("push", function (event) {
  const data = event.data.json(); // Assuming the server sends JSON
  const options = {
    body: data.body,
    icon: "icon.png",
    badge: "badge.png",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
