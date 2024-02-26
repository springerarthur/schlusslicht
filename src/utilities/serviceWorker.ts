export async function registerServieWorker() {
  if (!("serviceWorker" in navigator)) {
    alert("!serviceworker in navigator");
    throw Error("Service workers are not supported by this browser");
  }

  alert("navigator.serviceWorker.register");
  await navigator.serviceWorker.register("serviceWorker.js");

  alert("navigator.serviceWorker.registered");
}

export async function getReadyServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }

  return navigator.serviceWorker.ready;
}
