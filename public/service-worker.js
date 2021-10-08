const FILES_TO_CACHE = [
    "/",
    "index.html",
    "index.js",
    "manifest.webmanifest",
    "styles.css",
    "db.js",
    "icons/icon-192x192.png",
    "icons/icon-512x512.png",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0",
    ];
    
    const CACHE_NAME = "";
const DATA_CACHE_NAME = "";

self.addEventListener("Install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
          console.log("Files are pre-cached");
          return cache.addAll(FILES_TO_CACHE);  
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", function(event) {
    event.waitUnitl(
        caches.keys().then(keylist => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                       console.log("Old data being removed", key);
                       return caches.delete(key); 
                    }
                })
            );
        })
    );
    self.clients.claim();
});

//fetch

self.addEventListener("fetch", function(event) {
   if(event.request.url.includes("/api/")) {
       event.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request)
          .then(response => {
            if (response.status === 200) {
                cache.put(event.request.url, response.clone());
            }
            return response;
          })
          .catch(err => {
              return cache.match(event.request);
          });

        }).catch(err => {
            console.log(err)
        })
       );
       return;
   }
   event.respondWith(
       caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(response => {
              return response || fetch(event.request);
          }); 
       })
   );
});