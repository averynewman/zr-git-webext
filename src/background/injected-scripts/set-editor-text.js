/**
 * @param {string} doc - what you are setting the editor text to
 * This function is run as a content script and injects a script
 * tag into the ZR page. It uses the `setValue` method of Ace's
 * `Editor` class to set the document contents. Because of how
 * ZR set Ace up, it will be automatically synced with Drive.
 */

// import { recursiveObjectPrinter } from '../index'

function setDocInjected (doc) {
  console.log('setDoc content script is running')
  var scrubbedDoc = doc.replace(/`/g, '\\`')
  console.log(scrubbedDoc)
  var s = document.createElement('script')
  /**
   * Injected into ZR IDE page.
   */
  s.textContent = `
    console.log('injected script is running');
    var aceEditSession = document.querySelector('[ui-ace='aceOptions']')
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
    // window.chrome.runtime.sendMessage({ doc: e.detail }, function (response) {
    //   console.log(response)
    // })
    window.chrome.runtime.sendMessage({ doc: e.detail }, function (response) {
      console.log(response)
    })
  });

  (document.head || document.documentElement).appendChild(s)
}

export async function setDoc (doc) {
  const scrubbedDoc = doc.replace(/`/g, '\\`')
  console.log(scrubbedDoc)
  const tabs = await new Promise((resolve, reject) => window.chrome.tabs.query({}, function (results) {
    console.log(results)
    const filteredResults = results.filter((element) => (!element.url.includes('zerorobotics.mit.edu/ide/simulation/') && element.url.includes('zerorobotics.mit.edu/ide/')))
    console.log(`found ${filteredResults.length} tabs`)
    resolve(filteredResults)
  }))
  if (tabs.length === 0) {
    throw new Error('found no appropriate tabs')
  }
  window.chrome.tabs.executeScript(tabs[0].id, { code: setDocInjected + `setDocInjected(\`${scrubbedDoc}\`)` })

  console.log('waiting on injected script')
  const listenerPromise = new Promise((resolve, reject) => {
    window.chrome.runtime.onMessage.addListener(function listenerFunction (request, sender, sendResponse) {
      console.log('resolving setDoc promise')
      sendResponse({ ok: true })
      window.chrome.runtime.onMessage.removeListener(listenerFunction)
      console.log('listener removed at end of execution')
      resolve(request.doc)
    })
  })
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('setDoc timed out')), 5000)
  })
  return Promise.race([listenerPromise, timeoutPromise])
}
