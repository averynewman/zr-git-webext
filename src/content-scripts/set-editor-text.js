/**
 * @param {string} doc - what you are setting the editor text to
 * This function is run as a content script and injects a script
 * tag into the ZR page. It uses the `setValue` method of Ace's
 * `Editor` class to set the document contents. Because of how
 * ZR set Ace up, it will be automatically synced with Drive.
 */
function setDocInjected (doc) {
  console.log('setDoc content script is running')
  var scrubbedDoc = doc.replace(/`/g, '\\`')
  console.log(scrubbedDoc)
  var s = document.createElement('script')
  /**
   * Injected into ZR IDE page.
   */
  s.textContent = `
    console.log("injected script is running");
    var aceEditSession = document.querySelector('[ui-ace="aceOptions"]')
       .env.editor;
    console.log(aceEditSession, \`${scrubbedDoc}\`);
    aceEditSession.setValue(\`${scrubbedDoc}\`);
    document.dispatchEvent(new CustomEvent('ZRGITHUB_extension_communication_set', {
      ok: true
    }));
  `

  s.onload = function () {
    this.remove()
  }
  console.log('script tag', s)

  document.addEventListener('ZRGITHUB_extension_communication_set', function (e) {
    window.chrome.runtime.sendMessage({ doc: e.detail }, function (response) {
      console.log(response)
    })
  });

  (document.head || document.documentElement).appendChild(s)
}

export function setDoc (doc) {
  return new Promise((resolve, reject) => {
    const scrubbedDoc = doc.replace(/`/g, '\\`')
    console.log(scrubbedDoc)
    window.chrome.tabs.executeScript({ code: setDocInjected + `setDoc(\`${scrubbedDoc}\`)` })

    window.chrome.runtime.connect()

    window.chrome.runtime.onMessage.addListener(
      function (request, sender, sendResponse) {
        resolve(request.doc)
        sendResponse({ ok: true })
      })
  })
}
