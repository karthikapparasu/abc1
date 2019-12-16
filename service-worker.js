var CACHE_NAME = 'abc-site-cache';
var urlsToCache = [
    '/',
    '/assests/styles/main.css',
    '/assests/styles/custom.css',
    '/assests/scripts/jquery.min.js'
];
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        }).catch(function (err) {
            console.log(err)
        })
    );
});

self.addEventListener('fetch', function (evt) {
    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            if (response) {
                return response;
            }
            return fetch(evt.request).then(fromCache(response));
        })
    );
});

function fromCache(response) {
    if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
    }
    var responseToCache = response.clone();
    caches.open(CACHE_NAME).then(function (cache) {
        cache.put(event.request, responseToCache);
    });
    return response;
}