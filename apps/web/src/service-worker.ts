/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;
const CACHE_NAME = `medivisitas-${version}`;

// Assets gerados pelo build + arquivos estáticos
const ASSETS = [...build, ...files];

sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => sw.skipWaiting())
  );
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => sw.clients.claim())
  );
});

sw.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Não cachear chamadas à API
  if (url.pathname.startsWith('/api') || url.origin !== sw.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((response) => {
        // Cachear apenas respostas válidas de assets imutáveis
        if (response.ok && url.pathname.startsWith('/_app/immutable/')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback para navegação
      if (event.request.mode === 'navigate') {
        return caches.match('/dashboard') || new Response('Offline', { status: 503 });
      }
      return new Response('Offline', { status: 503 });
    })
  );
});
