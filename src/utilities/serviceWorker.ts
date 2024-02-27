import logToServer from "./logger";

export async function registerServieWorker() {
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }

  await navigator.serviceWorker.register("serviceWorker.js");
}

export async function getReadyServiceWorker() {
  logToServer("getReadyServiceWorker");
  if (!("serviceWorker" in navigator)) {
    throw Error("Service workers are not supported by this browser");
  }

  logToServer("getReadyServiceWorker success");
  return navigator.serviceWorker.ready;
}
