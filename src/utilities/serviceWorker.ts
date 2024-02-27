import logToServer from "./logger";

export async function registerServieWorker() {
  logToServer("registerServieWorker");
  if (!("serviceWorker" in navigator)) {
    logToServer("Service workers are not supported by this browser");
    throw Error("Service workers are not supported by this browser");
  }

  logToServer("registerServieWorker success");

  await navigator.serviceWorker.register("serviceWorker.js");
}

export async function getReadyServiceWorker() {
  logToServer("getReadyServiceWorker");
  if (!("serviceWorker" in navigator)) {
    logToServer("Service workers are not supported by this browser");
    throw Error("Service workers are not supported by this browser");
  }

  logToServer("getReadyServiceWorker success");
  return navigator.serviceWorker.ready;
}
