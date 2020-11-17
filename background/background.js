function sendToForeground (message) {
  browser.tabs.query({
    active: true,
    currentWindow: true
  }, function sendToTab (tabs) {
    browser.tabs.sendMessage(tabs[0].id, message);
  });
}

/** Crafted to retain focus. */
class TranscriptRequestSystem {
  constructor () {
    TranscriptRequestSystem.startListening();
  }

  static startListening () {
    browser.webRequest.onBeforeRequest.addListener(
      this.handleRequest, {
        urls: [
          "https://*.api.microsoftstream.com/api/videos/*/texttracks",
          "https://*.api.microsoftstream.com/api/videos/*/texttracks?*"
        ]
      }
    );
  }

  static stopListening() {
    browser.webRequest.onBeforeRequest.removeListener(this.handleRequest);
  }

  /** Gets lost easily. */
  static handleRequest (requestDetails) {
    TranscriptRequestSystem.stopListening();

    const transcriptDetails = requestDetails.url;

    fetch(transcriptDetails)
      .then(response => response.json())
      .then(data => data.value[0].url)
      .then(transcriptLocation => sendToForeground(transcriptLocation))
      .then(() => TranscriptRequestSystem.startListening());
  }
}

// And so it begins ...
new TranscriptRequestSystem();
