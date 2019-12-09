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
    window.chrome.runtime.sendMessage({ doc: e.detail }, function (response) {
      console.log(response)
    })
  });

  (document.head || document.documentElement).appendChild(s)
}

export function getDoc () {
  return new Promise((resolve, reject) => {
    window.chrome.tabs.executeScript({ code: getDocInjected + 'getDocInjected();' })
    console.log('waiting on injected script')
    window.chrome.runtime.connect()

    window.chrome.runtime.onMessage.addListener(
      function listenerFunction (request, sender, sendResponse) {
        // console.log('received editor contents from injected script:', request.doc)
        var cleanDoc = request.doc
        // var headMatch = cleanDoc.match(/^\/\/(.*)/)
        // console.log(`headmatch is ${headMatch}`)
        /* try {
          var head = JSON.parse(headMatch[1]) // [1] is the capture group
          resolve({ text: cleanDoc.replace(/^\/\/.*sha.*\n/, ''), head })
        } catch (e) {
          reject(e)
        } */
        resolve({ text: cleanDoc })
        sendResponse({ ok: true })
        window.chrome.runtime.onMessage.removeListener(listenerFunction)
        // console.log('listener removed at end of execution')
      })
  })
}
