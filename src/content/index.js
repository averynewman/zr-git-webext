console.log('page loaded')

const simulateButtons = document.querySelectorAll('[ng-click="openSimDialog()"]')
simulateButtons.forEach(element => element.addEventListener('click', () => {
  setTimeout(() => { addMenu(branchList) }, 100)
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
  button.innerHTML = 'Select from GitHub <span class="caret"></span>'
  const branchList = document.createElement('ul')
  branchList.classList.value += 'dropdown-menu'
  branchList.setAttribute('role', 'menu')
  branches.forEach((e) => {
    const el = document.createElement('li')
    el.setAttribute('role', 'menuitem')
    const link = document.createElement('a')
    link.innerText = e.name
    link.setAttribute('href', '')
    el.appendChild(link)
    branchList.appendChild(el)
    el.addEventListener('click', () => { pickGithubOpponent(e.name) })
  })
  wrapper.appendChild(button)
  wrapper.appendChild(branchList)
  playerSelect.parentNode.parentNode.appendChild(wrapper)
}