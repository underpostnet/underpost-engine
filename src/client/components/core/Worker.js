import { s4 } from './CommonJs.js';
import { EventsUI } from './EventsUI.js';
import { loggerFactory } from './Logger.js';
import { getProxyPath, s } from './VanillaJs.js';

const logger = loggerFactory(import.meta);

const Worker = {
  instance: async function (viewLogic = async () => null) {
    logger.warn('Init');
    let success = false;
    const isInstall = await this.status();
    if (!isInstall) await this.install();
    else if (location.hostname === 'localhost') await this.update();
    setTimeout(async () => {
      if (!success) {
        await this.update();
        await this.reload();
      }
    }, 1000 * 70 * 1); // 70s limit
    await viewLogic();
    success = true;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      logger.info('The controller of current browsing context has changed.');
    });
    navigator.serviceWorker.ready.then((worker) => {
      logger.info('Ready', worker);
      // event message
      navigator.serviceWorker.addEventListener('message', (event) => {
        logger.info('Received event message', event.data);
      });
      navigator.serviceWorker.controller.postMessage({
        title: 'Hello from Client event message',
      });
      // broadcast message
      const channel = new BroadcastChannel('sw-messages');
      channel.addEventListener('message', (event) => {
        logger.info('Received broadcast message', event.data);
      });
      channel.postMessage({ title: 'Hello from Client broadcast message' });
      // channel.close();
    });
  },
  // Get the current service worker registration.
  getRegistration: async function () {
    return await navigator.serviceWorker.getRegistration();
  },
  reload: async function (timeOut = 3000) {
    return await new Promise((resolve) => {
      if (navigator.serviceWorker && navigator.serviceWorker.controller)
        navigator.serviceWorker.controller.postMessage({
          status: 'skipWaiting',
        });
      setTimeout(() => resolve((location.href = `${location.origin}${location.pathname}?r=${s4()}`)), timeOut);
    });
  },
  update: async function () {
    const isInstall = await this.status();
    if (isInstall) {
      // const routes = Object.keys(window.Routes ? window.Routes() : { '/': {} }).map(
      //   (path) => getProxyPath() + path.slice(1),
      // );
      const routes = [];
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        if (cacheName.match('components/') || cacheName.match('.index.js') || routes.includes(cacheName)) {
          await caches.delete(cacheName);
        }
      }
      this.updateServiceWorker();
    }
  },
  updateServiceWorker: function () {},
  status: function () {
    let status = false;
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => {
            for (const registration of registrations) {
              if (registration.installing) logger.info('installing', registration);
              else if (registration.waiting) logger.info('waiting', registration);
              else if (registration.active) {
                logger.info('active', registration);
                this.updateServiceWorker = () => registration.update();
              }
            }
            if (registrations.length > 0) status = true;
          })
          .catch((...args) => {
            logger.error(...args);
            return reject(false);
          })
          .finally((...args) => {
            logger.info('Finally status', args);
            return resolve(status);
          });
      } else {
        logger.warn('Disabled');
        return resolve(false);
      }
    });
  },
  install: function () {
    return new Promise((resolve, reject) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register(`/sw.js`, {
            // scope: getProxyPath(),
            // scope: '/',
            type: 'module',
          })
          .then((...args) => {
            logger.warn('Already Registered', args);
          })
          .catch((...args) => {
            logger.error(...args);
            return reject(args);
          })
          .finally((...args) => {
            logger.info('Finally install', args);
            return resolve(args);
          });
      } else {
        logger.warn('Disabled');
        return resolve();
      }
    });
  },
  uninstall: function () {
    return new Promise(async (resolve, reject) => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then(async (registrations) => {
            for (const registration of registrations) {
              logger.info('remove', registration);
              registration.unregister();
            }
            const cacheNames = await caches.keys();
            for (const cacheName of cacheNames) await caches.delete(cacheName);
          })
          .catch((...args) => {
            logger.error(...args);
            return reject(args);
          })
          .finally((...args) => {
            logger.info('Finally uninstall', args);
            return resolve(args);
          });
      } else {
        logger.warn('Disabled');
        return resolve();
      }
    });
  },
  notificationActive: false,
  notificationRequestPermission: function () {
    return new Promise((resolve, reject) =>
      Notification.requestPermission().then((result) => {
        if (result === 'granted') {
          this.notificationActive = true;
          resolve(true);
        } else {
          this.notificationActive = false;
          resolve(false);
        }
      }),
    );
  },
  notificationShow: function () {
    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('Vibration Sample', {
            body: 'Buzz! Buzz!',
            icon: '../images/touch/chrome-touch-icon-192x192.png',
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            tag: 'vibration-sample',
            requireInteraction: true, //  boolean to manually close the notification
          });
        });
      }
    });
  },
  // TODO: GPS management
  loadSettingUI: async function () {
    EventsUI.onClick(`.btn-clean-cache`, async (e) => {
      e.preventDefault();
      await this.update();
      await this.reload();
    });
    return;
    s(`.btn-uninstall-service-controller`).classList.add('hide');
    EventsUI.onClick(`.btn-install-service-controller`, async (e) => {
      e.preventDefault();
      const result = await this.install();
      s(`.btn-install-service-controller`).classList.add('hide');
      s(`.btn-uninstall-service-controller`).classList.remove('hide');
    });
    EventsUI.onClick(`.btn-uninstall-service-controller`, async (e) => {
      e.preventDefault();
      const result = await this.uninstall();
      s(`.btn-uninstall-service-controller`).classList.add('hide');
      s(`.btn-install-service-controller`).classList.remove('hide');
    });
    EventsUI.onClick(`.btn-reload`, async (e) => {
      e.preventDefault();
      location.reload();
    });
    const workerStatus = await this.status();
    if (workerStatus) {
      s(`.btn-install-service-controller`).classList.add('hide');
      s(`.btn-uninstall-service-controller`).classList.remove('hide');
    } else {
      s(`.btn-uninstall-service-controller`).classList.add('hide');
      s(`.btn-install-service-controller`).classList.remove('hide');
    }
  },
};

export { Worker };
