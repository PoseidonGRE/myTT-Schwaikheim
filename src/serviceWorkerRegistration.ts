// src/serviceWorkerRegistration.ts

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] ist die IPv6 localhost Adresse.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 sind IPv4 localhost Adressen.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  if ('serviceWorker' in navigator) {
    // Sicherstellen, dass process und process.env definiert sind
    const publicUrl = new URL(
      (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL) 
        ? process.env.PUBLIC_URL 
        : '/',
      window.location.href
    );
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = (typeof process !== 'undefined' && process.env && process.env.PUBLIC_URL)
        ? `${process.env.PUBLIC_URL}/service-worker.js`
        : `/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Diese App wird von einem Service Worker bereitgestellt.'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

// Rest des Codes bleibt unverändert

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Neues Update verfügbar
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Content wurde gecacht
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Kein Internet, App läuft offline.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
