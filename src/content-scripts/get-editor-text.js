function getDocInjected (cb) {
  console.log('getDoc content script is running')
  var s = document.createElement('script')
  /**
   * Injected into ZR IDE page.
   * Then sends it back to content script in a custom event
   */
  s.textContent = `
    console.log("injected script is running");
    var aceEditSession = document.querySelector('[ui-ace="aceOptions"]')
       .env.editor;
    console.log(aceEditSession);
    var doc = aceEditSession.getValue();
    document.dispatchEvent(new CustomEvent('ZRGITHUB_extension_communication_get', {
      ok: true,
      detail: doc
    }));
    console.log("sent event", doc);
  `
  s.onload = function () {
    this.remove()
  }
  console.log('script tag', s)

  document.addEventListener('ZRGITHUB_extension_communication_get', function (e) {
    console.log('received', e.detail)
    window.chrome.runtime.sendMessage({doc: e.detail}, function (response) {
      console.log(response)
    })
  });

  (document.head || document.documentElement).appendChild(s)
}

function getDoc () {
  return new Promise((resolve, reject) => {
    window.chrome.tabs.executeScript({code: getDocInjected + 'getDoc();'})
    console.log('waiting on injected script')
    window.chrome.runtime.connect()

    window.chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        console.log('received doc from injected script', request.doc)
        var cleanDoc = request.doc
        var headMatch = cleanDoc.match(/^\/\/(.*)/)
        try {
          var head = JSON.parse(headMatch[1]) // [1] is the capture group
          resolve({text: cleanDoc.replace(/^\/\/.*sha.*\n/, ''), head})
        } catch (e) {
          reject(e)
        }
        sendResponse({ok: true})
      })
  })
}