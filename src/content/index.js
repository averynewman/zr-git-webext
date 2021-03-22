console.log('page loaded')
var port = window.chrome.runtime.connect({ name: 'branchListPort' })

const simulateButtons = document.querySelectorAll("[ng-click='openSimDialog()']")
simulateButtons.forEach(element => element.addEventListener('click', () => {
  var listenerFunction = function (msg) {
    console.log(`recieved branchList ${msg.branchList}`)
    port.onMessage.removeListener(listenerFunction)
    setTimeout(() => { addMenu(msg.branchList) }, 100)
  }
  port.onMessage.addListener(listenerFunction)
  port.postMessage({ request: 'branchList' })
}))

function addMenu (branches) {
  // angular.element($0).scope().$digest()
  const playerSelect = document.getElementById('std-player-select')
  const wrapper = document.createElement('div')
  wrapper.classList.add('btn-group')
  wrapper.setAttribute('dropdown', '')
  wrapper.setAttribute('keyboard-nav', '')
  wrapper.addEventListener('click', (event) => {
    if (wrapper.classList.contains('open')) { wrapper.classList.remove('open') } else { wrapper.classList.add('open') }
  })

  const button = document.createElement('button')
  button.classList.value += 'btn btn-default dropdown-toggle'
  button.type = 'button'
  button.innerHTML = "Select from GitHub <span class='caret'></span>"
  const branchList = document.createElement('ul')
  branchList.classList.value += 'dropdown-menu'
  branchList.setAttribute('role', 'menu')
  branches.forEach((e) => {
    const el = document.createElement('li')
    el.setAttribute('role', 'menuitem')
    const link = document.createElement('a')
    link.innerText = e
    link.setAttribute('href', '')
    el.appendChild(link)
    branchList.appendChild(el)
    el.addEventListener('click', () => {
      button.innerHTML = `Retrieving opponent: ${e}`
      var listenerFunction = function (msg) {
        console.log(`recieved contents of ${e}`)
        port.onMessage.removeListener(listenerFunction)
        button.innerHTML = `Selected opponent: ${e} <span class='caret'></span>`
        pickGithubOpponent(e, msg.contents)
      }
      port.onMessage.addListener(listenerFunction)
      port.postMessage({ request: 'contents', branch: e })
    })
  })
  wrapper.appendChild(button)
  wrapper.appendChild(branchList)
  playerSelect.parentNode.parentNode.appendChild(wrapper)
}

function pickGithubOpponent (branch, data) {
  console.log(`contents are: ${data}`)
  var s = document.createElement('script')
  s.innerText = `
  var scope = angular.element(document.getElementById('std-player-select')).scope();
  scope.data.opponentCode[0] = \`${data.replace(/\n/g, '\\n')}\`;
  scope.opponentTitle = \`${branch}\`;
  scope.$digest();
  `
  s.onload = function () {
    this.remove()
  };
  (document.head || document.documentElement).appendChild(s)
}
