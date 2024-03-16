/* eslint-disable no-undef */
const GAME_VERSION = 4
const DEBUG = false
const LOG = false
const log = LOG ? (a) => { console.log(a); return a } : (a) => a
const PROFILE = false

const documentParsed = performance.now()

const scriptHTML = document.currentScript.outerHTML
const initialHTMLWithoutThisScript = document.body.innerHTML.replace(scriptHTML, '')

let boardGenerationRetryCount = 0

// Mapping integers to non-negative integers and vice versa
function fold (x) {
  return x >= 0 ? 2 * x : -2 * x - 1
}

function unfold (y) {
  return y % 2 === 0 ? y / 2 : -(y + 1) / 2
}

function pairUnsigned (x, y) {
  return 0.5 * (x + y) * (x + y + 1) + y
}

function unpairUnsigned (z) {
  const w = Math.floor((Math.sqrt(8 * z + 1) - 1) / 2)
  const t = (w * w + w) / 2
  const y = z - t
  const x = w - y
  return [x, y]
}

function pairSigned (x, y) {
  const mappedX = fold(x)
  const mappedY = fold(y)
  const cantorResult = pairUnsigned(mappedX, mappedY)
  return unfold(cantorResult)
}

function unpairSigned (z) {
  const cantorInverse = unpairUnsigned(fold(z))
  return [unfold(cantorInverse[0]), unfold(cantorInverse[1])]
}

const wordListFull = `사과
바나나
포도
딸기
오렌지
체리
복숭아
수박
파인애플
배
레몬
라즈베리
블루베리
키위
망고
참외
아보카도
석류
자몽
두리안
코코넛
라임
자두
무화과
감
살구
상추
양파
당근
감자
토마토
오이
시금치
호박
콩
옥수수
파프리카
브로콜리
고구마
아스파라거스
샐러리
양배추
고추
버섯
마늘
생강
비트
콜라비
아티초크
미역
김
호박
피망
죽순
무
고사리
갓
청경채
케일
취나물
치커리
미나리
더덕
토란
귤
대추
파파야
복분자
유자
부추
매실
호두
가지
노각`.split('\n')

const random = {
  s1: 0,
  s2: 0,
  setSeed (seed) {
    this.s1 = seed
    this.s2 = seed
  },
  random () {
    this.s1 = (this.s1 * 1103515245 + 12345) & 2147483647
    this.s2 ^= this.s2 << 13
    this.s2 ^= this.s2 >> 17
    this.s2 ^= this.s2 << 5
    log('random.random')
    return log(((this.s1 ^ this.s2) + 2147483648) / 4294967295)
  }
}

function init () {
  'use strict'
  if (window.hwgInitialized) {
    throw new Error('Game was already initialized.')
  }

  window.hwgInitialized = true

  const stageElement = document.getElementById('stage')

  const dirMap = [
    [3, 2, 1],
    [4, -1, 0],
    [5, 6, 7]
  ]

  const [nfdChoBase, nfdJungBase, nfdJongBase] = [...'각'.normalize('NFD')]
  const simpleJungBase = 'ㅏ'
  const jungDiff = simpleJungBase.charCodeAt(0) - nfdJungBase.charCodeAt(0)

  const simpleToCompositeJamoMap = {
    ㄱㄱ: 'ㄲ',
    ㄱㅅ: 'ㄳ',
    ㄴㅈ: 'ㄵ',
    ㄴㅎ: 'ㄶ',
    ㄷㄷ: 'ㄸ',
    ㄹㄱ: 'ㄺ',
    ㄹㅁ: 'ㄻ',
    ㄹㅂ: 'ㄼ',
    ㄹㅅ: 'ㄽ',
    ㄹㅌ: 'ㄾ',
    ㄹㅍ: 'ㄿ',
    ㄹㅎ: 'ㅀ',
    ㅂㅂ: 'ㅃ',
    ㅂㅅ: 'ㅄ',
    ㅅㅅ: 'ㅆ',
    ㅈㅈ: 'ㅉ',
    ㅏㅣ: 'ㅐ',
    ㅑㅣ: 'ㅒ',
    ㅓㅣ: 'ㅔ',
    ㅕㅣ: 'ㅖ',
    ㅗㅏ: 'ㅘ',
    ㅗㅏㅣ: 'ㅙ',
    ㅗㅣ: 'ㅚ',
    ㅜㅓ: 'ㅝ',
    ㅜㅓㅣ: 'ㅞ',
    ㅜㅣ: 'ㅟ',
    ㅡㅣ: 'ㅢ'
  }

  const compositeToSimpleJamoMap = Object.fromEntries(Object.entries(simpleToCompositeJamoMap).map(([simple, composite]) => [composite, simple]))

  let randomHueBase = -1
  let stageNumber = 1
  let previousGameState
  try {
    previousGameState = deserializeGameState(load('gameState'))
    if (previousGameState) {
      stageNumber = previousGameState.stageNumber
      stageElement.textContent = stageNumber
    }
  } catch (e) {
    console.error(e)
    clear('gameState')
  }

  stageElement.textContent = stageNumber

  const seed = pairSigned(stageNumber, boardGenerationRetryCount)

  random.setSeed(seed)

  const cloned = [...wordListFull]

  const wordCount = 16

  function simpleJamoBreakdown (word) {
    return [...word.normalize('NFC')].flatMap(decomposeIntoSimple)
  }

  const wordList = []
  for (let i = 0; i < wordCount; i++) {
    wordList.push(...cloned.splice(randomInt(0, cloned.length - 1), 1))
  }
  cloned.length = 0

  const wordListElement = document.getElementById('word-list')
  const wordListTemplate = document.getElementById('word-template')
  wordList.forEach(word => {
    const li = wordListTemplate.content.cloneNode(true).querySelector('li')
    li.textContent = word
    li.dataset.word = word
    wordListElement.appendChild(li)
  })

  const jamoBoardElement = document.getElementById('jamo-board')
  const jamoBoardTemplate = document.getElementById('jamo-template')

  jamoBoardElement.addEventListener('selectstart', (e) => {
    e.preventDefault()
  })
  let isRightClick = false
  jamoBoardElement.addEventListener('contextmenu', (e) => {
    if (!isRightClick) {
      e.preventDefault()
    }
    isRightClick = false
  })

  const width = 12
  const height = 12

  const simpleJamoList = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ'

  function calculateChecksum (gs) {
    return [...gs].map(c => c.charCodeAt()).reduce((acc, val) => ((acc >>> 1) | ((acc & 1) << 15)) ^ val, 0)
  }

  function currentState () {
    const completions = Array.from(jamoBoardElement.querySelectorAll('.completion-bar')).filter((elem) => elem !== currentJamoCompletion).map(elem => {
      return `${elem.dataset.start},${elem.dataset.end}`
    }).join()

    return {
      GAME_VERSION,
      width,
      height,
      completions,
      stageNumber
    }
  }

  function serializeGameState (gsObject = currentState()) {
    const gsJSONString = JSON.stringify(gsObject)
    return `${gsJSONString}|${calculateChecksum(gsJSONString)}`
  }

  function groupElements (arr, numElements) {
    return arr.reduce((acc, val) => {
      if (!acc.length || acc.at(-1).length === numElements) {
        acc.push([])
      }
      acc.at(-1).push(val)
      return acc
    }, [])
  }

  function deserializeGameState (gsStringFull) {
    if (gsStringFull === null) {
      return null
    }
    const [gsObjectStr, checksum] = gsStringFull.split('|')
    const expectedChecksum = calculateChecksum(gsObjectStr)
    if (expectedChecksum !== checksum * 1) {
      throw new Error('saved game state is corrupted')
    }
    const gsObject = JSON.parse(gsObjectStr)
    if (gsObject.GAME_VERSION !== GAME_VERSION) {
      throw new Error('The saved game state is from a different version of the game.')
    }
    if (gsObject.completions) {
      gsObject.completions = groupElements(gsObject.completions.split(',').map(Number), 4)
    } else {
      gsObject.completions = []
    }
    return gsObject
  }

  function decomposeIntoSimple (char) {
    const [nfdCho, nfdJung, nfdJong] = [...char.normalize('NFD')].concat(['', '', '']).slice(0, 3)
    const simpleCho = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ'[nfdCho.charCodeAt(0) - nfdChoBase.charCodeAt(0)]
    const simpleJung = String.fromCharCode(nfdJung.charCodeAt(0) + jungDiff)
    const simpleJong = nfdJong.length ? 'ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ'[nfdJong.charCodeAt(0) - nfdJongBase.charCodeAt(0)] : ''
    return [simpleCho, simpleJung, simpleJong].flatMap(jamo => [...(compositeToSimpleJamoMap[jamo] ?? jamo)])
  }

  function composeIntoComposite (simpleJamo) { // @TODO: complete this function
    simpleJamo = [...simpleJamo]
    const hangulImeStateMachine = {
      cho: {
        ㄱ: ['ㄱ', 'jung'],
        ㄴㄹㅁㅇㅊㅋㅌㅍㅎ: ['jung'],
        ㄷ: ['ㄷ', 'jung'],
        ㅂ: ['ㅂ', 'jung'],
        ㅅ: ['ㅅ', 'jung'],
        ㅈ: ['ㅈ', 'jung']
      },
      jung: {
        ㅏㅑㅓㅕㅡ: ['ㅣ', 'jong'],
        ㅗ: ['ㅏ', 'ㅣ', 'jong'],
        ㅛㅠㅣ: ['jong'],
        ㅜ: ['ㅓ', 'ㅣ', 'jong']
      },
      jong: {
        ㄱ: ['ㄱ', 'ㅅ', 'cho'],
        ㄴ: ['ㅈ', 'ㅎ', 'cho'],
        ㄷㅁㅇㅈㅊㅋㅌㅍㅎ: ['cho'],
        ㄹ: ['ㄱ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅌ', 'ㅍ', 'ㅎ', 'cho'],
        ㅂ: ['ㅅ', 'cho'],
        ㅅ: ['ㅅ', 'cho']
      }
    }
    const maxLengths = Object.freeze({
      cho: 2,
      jung: 3,
      jong: 2
    })
    const currentLengths = {
      cho: 0,
      jung: 0,
      jong: 0
    }
    // 'ㅂㅂㅜㅓㅣㄹㄱ' -> [['ㅂㅂ'], ['ㅜ','ㅓ','ㅣ'], ['ㄹ', 'ㄱ']]
    let currentState = 'cho'
    const grouped = []
    const group = []
    let nextCandidate = null
    while (simpleJamo[0]) {
      const jamo = simpleJamo.shift() // 'ㅂ'
      group.push(jamo)
      currentLengths[currentState]++
      const transitionOptions = hangulImeStateMachine[currentState] // cho: { ... }
      const transition = Object.entries(transitionOptions).find(([jamoOptions, _]) => jamoOptions.includes(jamo))
      if (!transition) {
        throw new Error('cannot find suitable continuation for jamo sequence')
      }
      const [, targetStates] = transition // ['ㅂ', 'jung']
      if (targetStates.length === 1 || currentLengths[currentState] === maxLengths[currentState]) {
        currentLengths[currentState] = 0
        currentState = targetStates[0]
        grouped.push([...group])
        group.length = 0
        if (nextCandidate && !nextCandidate.includes(jamo)) {
          throw new Error('next candidate mismatch')
        }
        nextCandidate = null
      } else {
        nextCandidate = targetStates.slice(0, -1)
      }
    }

    return grouped
  }
  if (DEBUG) {
    window.composeIntoComposite = composeIntoComposite
  }

  const randomJamo = () => {
    log(randomJamo.name)
    return log(simpleJamoList[randomInt(0, simpleJamoList.length - 1)])
  }

  const simpleJamoFromWordList = wordList.flatMap(word => [...word.normalize('NFC')].flatMap(decomposeIntoSimple))
  const jamoFromWordList = () => {
    log(jamoFromWordList.name)
    return log(simpleJamoFromWordList[randomInt(0, simpleJamoFromWordList.length - 1)])
  }

  const gap = 0.75

  function noTransitionZone (fn, elem) {
    elem.classList.add('no-transition')
    fn()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { // 1 frame skip does not work in some cases
        elem.classList.remove('no-transition')
      })
    })
  }

  const fillJamoBoard = () => {
    jamoBoardElement.style.setProperty('--gap', `${gap}rem`)
    jamoBoardElement.style.setProperty('--width', width)
    jamoBoardElement.style.setProperty('--height', height)

    noTransitionZone(() => {
      for (let i = 0; i < width * height; i++) {
        const jamoElement = jamoBoardTemplate.content.cloneNode(true).querySelector('i')
        const jamo = randomInt(0, 1) ? randomJamo() : jamoFromWordList()
        jamoElement.dataset.jamo = jamo
        jamoBoardElement.appendChild(jamoElement)
      }
    }, jamoBoardElement)
  }

  fillJamoBoard()

  const jamoWrittenPositions = Array.from({ length: width * height }, () => null)

  const getPosition = (x, y, direction, progress) => {
    if (direction < 0 || direction > 7) {
      throw new RangeError('direction must be 0 to 7')
    }
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dirMap[dy + 1][dx + 1] === direction) {
          return [x + dx * progress, y + dy * progress]
        }
      }
    }
  }

  const jamoElements = jamoBoardElement.querySelectorAll('#jamo-board>i')

  jamoElements.forEach((jamoElement, jamoIndex) => {
    jamoElement.dataset.index = jamoIndex
  })

  /**
   *
   * @param {string} word
   * @param {number} x
   * @param {number} y
   * @param {number} direction 0 to 7, starting from towards east(right) 1/8 turn CCW each step
   */
  const writeWord = (word, x, y, direction) => {
    const breakdown = simpleJamoBreakdown(word)
    // first check without writing
    if (breakdown.length > width && breakdown.length > height) {
      throw new RangeError('word too long for board')
    }
    for (let i = 0; i < breakdown.length; i++) {
      const [targetX, targetY] = getPosition(x, y, direction, i)
      if (targetX < 0 || targetX >= width || targetY < 0 || targetY >= height) {
        return false
      }
      const jamoIndex = targetY * width + targetX
      const existingJamo = jamoWrittenPositions[jamoIndex]
      if (existingJamo && existingJamo !== breakdown[i]) {
        return false
      }
    }

    for (let i = 0; i < breakdown.length; i++) {
      const [targetX, targetY] = getPosition(x, y, direction, i)
      const jamo = breakdown[i]
      const jamoIndex = targetY * width + targetX
      jamoWrittenPositions[jamoIndex] = jamo
      const jamoElement = jamoElements[jamoIndex]
      jamoElement.dataset.jamo = jamo
    }

    return true
  }

  const cellSize = 2
  jamoBoardElement.style.setProperty('--size', `${cellSize}rem`)

  function memo (key, compute) {
    const cache = memo.cache ?? (memo.cache = new Map())
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = compute()
    cache.set(key, result)
    return result
  }

  function createCompletionBarElement (startX, startY, endX, endY, updateElement = null) {
    const completionBarTemplate = memo(createCompletionBarElement, () => document.getElementById('completion-bar-template'))
    const completionBarElement = updateElement ?? completionBarTemplate.content.cloneNode(true).querySelector('.completion-bar')
    const padding = 0.25

    completionBarElement.dataset.start = `${startX},${startY}`
    completionBarElement.dataset.end = `${endX},${endY}`

    const sdx = Math.sign(endX - startX)
    const sdy = Math.sign(endY - startY)
    const xMin = Math.min(startX, endX)
    const xMax = Math.max(startX, endX)
    const yMin = Math.min(startY, endY)
    const yMax = Math.max(startY, endY)
    const top = yMin * cellSize + (gap * yMin)
    const left = xMin * cellSize + (gap * xMin)
    const width = (xMax - xMin + 1) * cellSize + (gap * (xMax - xMin))
    const height = (yMax - yMin + 1) * cellSize + (gap * (yMax - yMin))

    completionBarElement.style.setProperty('--top', `${top}rem`)
    completionBarElement.style.setProperty('--left', `${left}rem`)
    completionBarElement.style.setProperty('--width', `${width}rem`)
    completionBarElement.style.setProperty('--height', `${height}rem`)

    const hypot = Math.hypot(width, height) + padding
    const angle = Math.atan2(sdy * height, sdx * width) * 180 / Math.PI
    completionBarElement.style.setProperty('--thick', `${cellSize + padding}rem`)
    completionBarElement.style.setProperty('--hypot', `${hypot}rem`)
    completionBarElement.style.setProperty('--angle', `${angle}deg`)
    const randomHue = Math.floor(randomFromCoords(startX, startY) * colorSteps) * Math.floor(360 / colorSteps)
    completionBarElement.style.setProperty('--hue', randomHueBase + randomHue)

    return completionBarElement
  }

  let foundWords = 0

  const stageClearDialog = document.getElementById('stage-clear-dialog')
  const yesButton = stageClearDialog.querySelector('#next-stage')
  const noButton = stageClearDialog.querySelector('#cancel-next-stage')
  yesButton.addEventListener('click', () => {
    boardGenerationRetryCount = 0
    const currentGameState = currentState()
    save('gameState', serializeGameState({ ...currentGameState, completions: '', stageNumber: currentGameState.stageNumber + 1 }))
    reset()
  }, { passive: true })
  noButton.addEventListener('click', () => {
    stageClearDialog.close()
  }, { passive: true })

  function markWordAsFound (wordElement, completionBarElement) {
    foundWords++
    wordElement.style.setProperty('--hue', completionBarElement.style.getPropertyValue('--hue'))
    wordElement.classList.add('found')
    if (foundWords === wordCount) {
      stageClearDialog.showModal()
    }
  }

  function markCompletionAsCompleted (startX, startY, endX, endY) {
    const completionBarElement = createCompletionBarElement(startX, startY, endX, endY)
    const jamoSequence = completionToJamoSequence(startX, startY, endX, endY)
    const foundWord = findWordByJamoSequence(jamoSequence)
    const wordElement = wordListElement.querySelector(`li[data-word="${foundWord}"]`)
    markWordAsFound(wordElement, completionBarElement)
    jamoBoardElement.appendChild(completionBarElement)
  }

  function randomInt (min, max) {
    log(randomInt.name)
    log([min, max])
    return log(Math.floor(random.random() * (max - min + 1)) + min)
  }

  const colorSteps = 16
  randomHueBase = randomInt(0, 359)

  function randomFromCoords (x, y) {
    const dot = x * 12.9898 + y * 78.233
    return (Math.sin(dot) * 43758.5453) % 1
  }

  const easyDirection = true

  const numDirections = easyDirection ? 4 : 8
  const directionsProbabilityDist = Array.from({ length: numDirections }, () => wordCount)
  let sum = wordCount * numDirections

  const getDirection = () => {
    const randomUniform = randomInt(0, sum - 1)
    let temp = 0
    for (let i = 0; i < numDirections; i++) {
      temp += directionsProbabilityDist[i]
      if (randomUniform < temp) {
        return i
      }
    }
  }

  try {
    wordList.toSorted((a, b) => {
      return simpleJamoBreakdown(b).length - simpleJamoBreakdown(a).length
    }).forEach((word) => {
      let x
      let y
      let direction
      let repeated = 0
      while (true) {
        x = randomInt(0, width - 1)
        y = randomInt(0, height - 1)
        direction = getDirection()
        const directionCorrected = easyDirection ? ((direction + 6) % 8) : direction
        const success = writeWord(word, x, y, directionCorrected)
        if (success) {
          directionsProbabilityDist[direction]--
          sum--
          if (wordCount - directionsProbabilityDist[direction] > wordCount / 3) {
            sum -= directionsProbabilityDist[direction]
            directionsProbabilityDist[direction] = 0
          }
          break
        }
        if (repeated > wordCount ** 2) {
          boardGenerationRetryCount++
          throw new Error('Failed to populate a word to the board. Try increasing the size of the board or reducing the number of words. Retrying...')
        }
        repeated++
      }
    })
  } catch (e) {
    console.error(e)
    reset()
    return
  }

  if (previousGameState) {
    previousGameState.completions.forEach(([startX, startY, endX, endY]) => {
      markCompletionAsCompleted(startX, startY, endX, endY)
    })
  }

  // add event listener for dark mode toggle
  const darkModeToggleButton = document.getElementById('dark-mode-toggle')

  const toggleModes = () => {
    const mode = darkModeToggleButton.dataset.mode
    const options = darkModeToggleButton.dataset.modeOptions.split('|')
    const nextMode = options[(options.indexOf(mode) + 1) % options.length]
    const startViewTransition = (change) => document.startViewTransition ? document.startViewTransition(change) : change()
    startViewTransition(() => {
      darkModeToggleButton.dataset.mode = nextMode
      document.documentElement.dataset.mode = nextMode
    })
    localStorage.darkMode = nextMode
  }
  darkModeToggleButton.addEventListener('click', toggleModes, { passive: true })
  const darkMode = localStorage.darkMode
  if (darkMode) {
    noTransitionZone(() => {
      darkModeToggleButton.dataset.mode = darkMode
      document.documentElement.dataset.mode = darkMode
    }, darkModeToggleButton)
  }

  const pointerdown = new Proxy({ value: false }, {
    set: (target, prop, value) => {
      if (prop === 'value' && typeof value === 'boolean') {
        if (DEBUG) {
          Array.from(jamoBoardElement.querySelectorAll('.start, .mid, .end')).forEach(elem => elem.classList.remove('start', 'mid', 'end'))
        }
        return Reflect.set(target, prop, value)
      }
    }
  })

  let dragStartPos = [-1, -1]
  let dragDir = -1
  let dragEndPos = [-1, -1]

  function isOctilinear (origin, target) {
    const [ox, oy] = origin
    const [tx, ty] = target
    const isOrthogonal = ox === tx || oy === ty
    const isDiagonal = Math.abs(ox - tx) === Math.abs(oy - ty)
    if (!(isOrthogonal || isDiagonal)) {
      return -1
    }
    const [dx, dy] = [tx - ox, ty - oy]
    return dirMap[Math.sign(dy) + 1][Math.sign(dx) + 1]
  }

  function getClosestOctilinearPoint (origin, target, dir) {
    const [ox, oy] = origin
    const [tx, ty] = target
    const [dx, dy] = [tx - ox, ty - oy]
    let [dxO, dyO] = [tx - ox, ty - oy]
    let [dxD, dyD] = [tx - ox, ty - oy]

    // orthogonal
    if (Math.abs(dxO) < Math.abs(dyO)) {
      dxO = 0
    } else {
      dyO = 0
    }

    // diagonal
    if ((dxD + dyD) % 2) {
      // parity mismatch adjustment
      if (Math.abs(dxD) < Math.abs(dyD)) {
        dyD -= Math.sign(dyD)
      } else {
        dxD -= Math.sign(dxD)
      }
    }
    {
      const dist = Math.abs(Math.abs(dxD) - Math.abs(dyD)) / 2
      if (Math.abs(dxD) < Math.abs(dyD)) {
        dxD += Math.sign(dxD) * dist
        dyD -= Math.sign(dyD) * dist
      } else {
        dxD -= Math.sign(dxD) * dist
        dyD += Math.sign(dyD) * dist
      }
    }

    const distO = Math.abs(dx - dxO) + Math.abs(dy - dyO)
    const distD = Math.abs(dx - dxD) + Math.abs(dy - dyD)

    if (distO === distD) {
      return dir % 2 === 0 ? [ox + dxO, oy + dyO] : [ox + dxD, oy + dyD]
    } else if (distO < distD) {
      return [ox + dxO, oy + dyO]
    } else {
      return [ox + dxD, oy + dyD]
    }
  }

  let currentJamoCompletion = null

  function updateJamoCompletion () {
    if (!(dragStartPos[0] !== -1 && dragStartPos[1] !== -1)) {
      return
    }
    const exists = currentJamoCompletion !== null
    const [sx, sy] = dragStartPos
    const [ex, ey] = dragEndPos[0] === -1 && dragEndPos[1] === -1 ? [sx, sy] : dragEndPos
    currentJamoCompletion = createCompletionBarElement(sx, sy, ex, ey, currentJamoCompletion)
    if (!exists) {
      jamoBoardElement.appendChild(currentJamoCompletion)
    }
  }

  function createRange (start, end) {
    const inc = start < end ? 1 : -1
    const result = []
    for (let i = 0; i <= Math.abs(end - start); i++) {
      result.push(i * inc + start)
    }
    return result
  }

  function completionToJamoSequence (startX, startY, endX, endY) {
    const rangeX = createRange(startX, endX)
    const rangeY = createRange(startY, endY)
    const longer = Math.max(rangeX.length, rangeY.length)
    const coords = Array.from({ length: longer }, (_, i) => [rangeX[i] ?? startX, rangeY[i] ?? startY])
    return coords.map(([x, y]) => jamoElements[y * width + x].dataset.jamo).join('')
  }

  function findWordByJamoSequence (jamoSequence) {
    return wordList.find(word => {
      const [simple, reversed] = memo(word, () => {
        const simple = simpleJamoBreakdown(word)
        return [simple.join(''), simple.toReversed().join('')]
      })
      return simple === jamoSequence || reversed === jamoSequence
    })
  }

  function checkJamoCompletion (jamoCompletionElement) {
    try {
      if (jamoCompletionElement === null) {
        return
      }
      const [startX, startY] = jamoCompletionElement.dataset.start.split(',').map(Number)
      const [endX, endY] = jamoCompletionElement.dataset.end.split(',').map(Number)
      if (startX === endX && startY === endY) {
        jamoCompletionElement.remove()
        return
      }
      const dir = isOctilinear([startX, startY], [endX, endY])
      if (dir === -1) {
        jamoCompletionElement.remove()
        return
      }
      const jamoSequence = completionToJamoSequence(startX, startY, endX, endY)
      const foundWord = findWordByJamoSequence(jamoSequence)
      if (foundWord) {
        const wordElement = wordListElement.querySelector(`li[data-word="${foundWord}"]`)
        if (wordElement) {
          if (wordElement.classList.contains('found')) {
            jamoCompletionElement.remove()
          } else {
            markWordAsFound(wordElement, jamoCompletionElement)
          }
        }
      } else {
        jamoCompletionElement.remove()
      }
    } finally {
      currentJamoCompletion = null
    }
  }

  jamoBoardElement.addEventListener('pointerdown', (e) => {
    if (!e.target.matches('#jamo-board>i')) {
      return
    }
    pointerdown.value = true
    dragStartPos = calculateCellPosFromCoords(e.clientX, e.clientY)
    if (dragStartPos[0] < 0 || dragStartPos[0] >= width || dragStartPos[1] < 0 || dragStartPos[1] >= height) {
      dragStartPos = [-1, -1]
      return
    }
    dragEndPos = [-1, -1]
    dragDir = -1
    updateJamoCompletion()
  }, { passive: true })

  document.addEventListener('pointerup', (e) => {
    isRightClick = e.button === 2
    pointerdown.value = false
    if (dragStartPos[0] === dragEndPos[0] && dragStartPos[1] === dragEndPos[1]) {
      currentJamoCompletion?.remove()
      currentJamoCompletion = null
    } else if (dragEndPos[0] !== -1 && dragEndPos[1] !== -1) {
      checkJamoCompletion(currentJamoCompletion)
    }
  }, { passive: true })

  function calculateOvershoot (value, min, max) {
    if (value < min) {
      return min - value
    }
    if (value > max) {
      return value - max
    }
    return 0
  }

  function calculateCellSize () {
    const firstElement = jamoElements[0]
    const rightElement = jamoElements[1]
    const bottomElement = jamoElements[width]
    const firstRect = firstElement.getBoundingClientRect()
    const rightRect = rightElement.getBoundingClientRect()
    const bottomRect = bottomElement.getBoundingClientRect()
    const cellInteractiveWidth = rightRect.left - firstRect.left
    const cellInteractiveHeight = bottomRect.top - firstRect.top
    const left = firstRect.left
    const top = firstRect.top
    const gapX = rightRect.left - firstRect.right
    const gapY = bottomRect.top - firstRect.bottom
    return [left, top, cellInteractiveWidth, cellInteractiveHeight, gapX, gapY]
  }

  function calculateCellPosFromCoords (clientX, clientY) {
    const [left, top, cellWidth, cellHeight, gapX, gapY] = calculateCellSize()
    const boardLeft = left - gapX / 2
    const boardTop = top - gapY / 2
    const [relativeX, relativeY] = [clientX - boardLeft, clientY - boardTop]
    const [cellX, cellY] = [Math.floor(relativeX / cellWidth), Math.floor(relativeY / cellHeight)]
    return [cellX, cellY]
  }

  function clamp (value, min, max) {
    return Math.min(max, Math.max(min, value))
  }

  document.addEventListener('pointermove', (e) => {
    if (!pointerdown.value) {
      return
    }
    e.preventDefault()
    const pos = calculateCellPosFromCoords(e.clientX, e.clientY)
    pos[0] = clamp(pos[0], 0, width - 1)
    pos[1] = clamp(pos[1], 0, height - 1)
    if (dragStartPos[0] === pos[0] && dragStartPos[1] === pos[1]) {
      return
    }
    const dir = isOctilinear(dragStartPos, pos)
    if (dir !== -1) {
      dragEndPos = pos
      dragDir = dir
    } else if (dragEndPos[0] !== -1 && dragEndPos[1] !== -1) {
      dragEndPos = getClosestOctilinearPoint(dragStartPos, pos, dragDir)
    }
    if (!(dragEndPos[0] !== -1 && dragEndPos[1] !== -1)) {
      return
    }
    let [cx, cy] = dragEndPos
    if (cx < 0 || cx >= width || cy < 0 || cy >= height) {
      const correctedDragDir = isOctilinear(dragStartPos, [cx, cy])
      const overshootX = calculateOvershoot(cx, 0, width - 1)
      const overshootY = calculateOvershoot(cy, 0, height - 1)
      const maxOvershoot = Math.max(overshootX, overshootY);
      [cx, cy] = getPosition(cx, cy, correctedDragDir, -maxOvershoot)
    }
    dragEndPos = [cx, cy]

    const closestIndex = dragEndPos[1] * width + dragEndPos[0]
    const closestElement = jamoElements[closestIndex]
    if (DEBUG) {
      jamoBoardElement.querySelector('.end')?.classList.remove('end')
      closestElement.classList.add('end')
    }
    updateJamoCompletion()
  })

  if (!previousGameState) {
    save('gameState', serializeGameState())
  }

  window.serializeGameState = serializeGameState

  const mainElement = document.querySelector('main')

  const resizeToFit = () => {
    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight

    mainElement.style.transform = 'scale(1)'
    mainElement.style.margin = '0'

    const { width, height } = mainElement.getBoundingClientRect()

    const zoomFactor = Math.min(1, screenWidth / width, screenHeight / height)

    mainElement.style.transform = `scale(${zoomFactor})`
    mainElement.style.margin = `${(height * (zoomFactor - 1)) / 2}px ${(width * (zoomFactor - 1)) / 2}px`
  }
  resizeToFit()
  window.addEventListener('resize', resizeToFit, { passive: true })

  window.addEventListener('beforeunload', () => {
    const beforeunload = load('beforeunload', 0)
    save('beforeunload', beforeunload + 1)
    const currentStateSaved = load('gameState')
    if (currentStateSaved) {
      save('gameState', serializeGameState())
    }
  }, { passive: true })

  window.addEventListener('pagehide', () => {
    const pagehide = load('pagehide', 0)
    save('pagehide', pagehide + 1)
  }, { passive: true })

  // @TODO: show relevant image for each word after finding it
  // requestIdleCallback(() => {
  //   // preload images
  //   const imageElements = wordList.map(word => {
  //     const img = document.createElement('img')
  //     img.src = `/images/wordsets/0/${word}.webp`
  //     return img
  //   })
  //   imageElements.forEach(img => img.decode().then(() => {
  //     console.log('decoded', img.src)
  //   }).catch(() => {
  //     console.log('failed to decode', img.src)
  //   }))
  // })

  const gameInitialized = performance.now()

  if (PROFILE) {
    requestIdleCallback(() => {
      const settled = performance.now()

      const t1 = documentParsed - begin
      const t2 = jsParsed - documentParsed
      const t3 = gameInitialized - jsParsed
      const t4 = settled - gameInitialized
      const t5 = settled - begin

      const perfHistory = load('perfHistory', [])
      perfHistory.push([t1, t2, t3, t4, t5])
      save('perfHistory', perfHistory)
    })
  }
}

function reset () {
  const children = [...document.body.children].filter(elem => elem !== document.currentScript)
  children.forEach(child => child.remove())
  document.body.innerHTML = initialHTMLWithoutThisScript
  window.hwgInitialized = false
  init()
}

function load (key, fallback) {
  const data = localStorage[key]
  if (typeof data === 'string') {
    return JSON.parse(data)
  }
  return fallback ?? null
}

function clear (key) {
  delete localStorage[key]
}

function save (key, value) {
  localStorage[key] = JSON.stringify(value)
}

function average (arr) {
  return arr.reduce((acc, val) => acc + val, 0) / arr.length
}
window.average = average

function median (arr) {
  const sorted = arr.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}
window.median = median

function getCurrentFunctionName () {
  const currentStackRaw = new Error().stack
  const callerLine = currentStackRaw.split('\n').slice(1)[1]
  return callerLine.match(/at (\w+)/)[1]
}
window.getCurrentFunctionName = getCurrentFunctionName

const jsParsed = performance.now()

init()

function registerKonamiCodeHandler () {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter']
  let konamiCodeIndex = 0
  const handler = async (e) => {
    if (e.key === konamiCode[konamiCodeIndex]) {
      konamiCodeIndex++
      if (konamiCodeIndex === konamiCode.length) {
        showCrazyShit()
        window.removeEventListener('keydown', handler)
      }
    } else {
      konamiCodeIndex = 0
    }
  }
  window.addEventListener('keydown', handler, { passive: true })
}
registerKonamiCodeHandler()

function showCrazyShit () {
  console.log('showing lunatic text')
}

document.getElementById('show-settings-panel').addEventListener('click', () => {
  document.getElementById('settings-panel').showModal()
})
