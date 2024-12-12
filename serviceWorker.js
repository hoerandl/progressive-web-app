const assets = ["./index.html", "./css/style.css", "./js/app.js"];

const cacheTypes = ["main", "font", "image"];

// Versionsnummer holen (Variante A)
importScripts("./version.js");
console.log("Version: " + version);
const cacheVersion = "_" + version;

self.addEventListener("install", (event) => {
  console.log("Service Worker install");
  self.skipWaiting();
  event.waitUntil(
    caches.open(cacheTypes[0] + cacheVersion).then((cache) => {
      cache.addAll(assets);
    })
  );
});

function putInCache(request, response) {
  let cacheKey = cacheTypes.includes(request.destination)
    ? request.destination
    : "main";
  caches.open(cacheKey + cacheVersion).then((cache) => {
    cache.put(request, response);
  });
}

async function cacheFirst(request) {
  let responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  let responseFromNetwork = await fetch(request);
  putInCache(request, responseFromNetwork.clone());
  return responseFromNetwork;
}

async function networkFirst(request) {
  try {
    let responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
      return responseFromCache;
    }
  }
}

self.addEventListener("fetch", (event) => {
  console.log("Service Worker fetch");
  // console.log(event.request);
  let response = "";
  switch (event.request.destination) {
    case "font":
      response = cacheFirst(event.request);
      break;
    case "image":
      response = cacheFirst(event.request);
      break;
    default:
      response = networkFirst(event.request);
  }
  event.respondWith(response);
});

async function deleteOldCaches() {
  let cacheKeepList = [];
  cacheTypes.forEach((element) => {
    cacheKeepList.push(element + cacheVersion);
  });

  let keyList = await caches.keys();
  let cacheToDelete = keyList.filter((key) => !cacheKeepList.includes(key));

  await Promise.all(
    cacheToDelete.map((key) => {
      caches.delete(key);
    })
  );
}

self.addEventListener("activate", (event) => {
  console.log("Service Worker activate");
  event.waitUntil(
    deleteOldCaches().then(() => {
      clients.claim();
    })
  );
});

/*
self.addEventListener("push", function (event) {
  const data = event.data.json(); // Assuming the server sends JSON
  const options = {
    body: data.body,
    icon: "icon.png",
    badge: "badge.png",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
*/

self.addEventListener("push", function (event) {
  console.log("Service Worker push");
  const options = {
    body: event.data.text(),
    icon: "./img/logo.png",
    badge: "./img/logo.png",
  };
  event.waitUntil(
    self.registration.showNotification("Nachricht vom Service Worker", options)
  );
  // console.log(event.data.text());
});
