export async function registerServieWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }

  await navigator.serviceWorker.register("serviceWorker.js");
}

export async function getReadyServiceWorker() {
  console.log("getReadyServiceWorker");
  if (!("serviceWorker" in navigator)) {
    console.log("getReadyServiceWorker error: !serviceWorker in navigator");
    throw Error("Service workers are not supported by this browser");
  }

  return navigator.serviceWorker.ready;
}
