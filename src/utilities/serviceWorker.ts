export async function registerServieWorker() {
  if (!("serviceWorker" in navigator)) {
    alert("!ServiceWorker in navigator");
    throw Error("Service workers are not supported by this browser");
  }
  await navigator.serviceWorker.register("serviceWorker.js");
}

export async function getReadyServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    alert("!ServiceWorker in navigator 2");
    throw Error("Service workers are not supported by this browser");
  }

  return navigator.serviceWorker.ready;
}
