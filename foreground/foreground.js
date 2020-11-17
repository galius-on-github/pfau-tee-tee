function handleBackgroundMessage(message) {
  const transcriptLocation = message;

  addCustomActionTrigger(transcriptLocation);
}

browser.runtime.onMessage.addListener(handleBackgroundMessage);

/** Integrates a button into the video bar allowing to download
     a generated .vtt file containing the automatic transcript. */
function addCustomActionTrigger (transcriptLocation) {
  const lastActionTrigger = document.
    querySelector(".video-meta-container .video-action-trigger > *:nth-last-child(2)");

  /* We're lucky that cloneNode does not copy event listeners!
     <https://dom.spec.whatwg.org/#dom-node-clonenode> */
  const customActionTrigger = lastActionTrigger.cloneNode(true);

  /* TODO: Remove `filename` directive from Content-Disposition header,
     use <a> with HTML5 download attribute. */
  customActionTrigger.addEventListener("click", function () {
    location.href = transcriptLocation;
  });
  customActionTrigger.querySelector(".action-button-label").textContent = "VTT";
  customActionTrigger.querySelector("svg").setAttribute("style", "transform: rotate(-180deg)");

  lastActionTrigger.after(customActionTrigger);
}
