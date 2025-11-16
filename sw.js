// Service Worker for Hair Care PWA
const CACHE_NAME = 'hair-care-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/weekly.html',
    '/progress.html',
    '/main.js',
    '/resources/hero-hair-care.png',
    'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;700&family=Inter:wght@300;400;500;600&display=swap',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/typed.js/2.0.12/typed.min.js',
    'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Push notification handler
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'زمان مراقبت از موهای شماست!',
        icon: '/resources/hero-hair-care.png',
        badge: '/resources/hero-hair-care.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'open',
                title: 'باز کردن برنامه',
                icon: '/resources/hero-hair-care.png'
            },
            {
                action: 'close',
                title: 'بستن',
                icon: '/resources/hero-hair-care.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('مراقبت از موها', options)
    );
});

self.addEventListener('notificationclick', event => {
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
    event.notification.close();
});