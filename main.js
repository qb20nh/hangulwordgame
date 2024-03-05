const documentParsed = performance.now()
let preventInitCall = false
const DEBUG = false
const intervals = []
const setIntervalWithReset = (fn, ms, ...args) => {
  const id = setInterval(fn, ms, ...args)
  intervals.push(id)
  return id
}
const GAME_VERSION = 1

const scriptHTML = document.currentScript.outerHTML
const initialHTMLWithoutThisScript = document.body.innerHTML.replace(scriptHTML, '')

let wordListFull = `사과
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

function init() {
  'use strict'
  if (preventInitCall) {
    throw new Error('This function should not be called more than once.')
  }

  preventInitCall = true

  
  const dirMap = [
    [3, 2, 1],
    [4, -1, 0],
    [5, 6, 7]
  ]


  const [nfdChoBase, nfdJungBase, nfdJongBase] = [...'각'.normalize('NFD')]
  const simpleJungBase = 'ㅏ'
  const jungDiff = simpleJungBase.charCodeAt(0) - nfdJungBase.charCodeAt(0)


  const simpleTocompositeJamoMap = {
    'ㄱㄱ': 'ㄲ',
    'ㄱㅅ': 'ㄳ',
    'ㄴㅈ': 'ㄵ',
    'ㄴㅎ': 'ㄶ',
    'ㄷㄷ': 'ㄸ',
    'ㄹㄱ': 'ㄺ',
    'ㄹㅁ': 'ㄻ',
    'ㄹㅂ': 'ㄼ',
    'ㄹㅅ': 'ㄽ',
    'ㄹㅌ': 'ㄾ',
    'ㄹㅍ': 'ㄿ',
    'ㄹㅎ': 'ㅀ',
    'ㅂㅂ': 'ㅃ',
    'ㅂㅅ': 'ㅄ',
    'ㅅㅅ': 'ㅆ',
    'ㅈㅈ': 'ㅉ',
    'ㅏㅣ': 'ㅐ',
    'ㅑㅣ': 'ㅒ',
    'ㅓㅣ': 'ㅔ',
    'ㅕㅣ': 'ㅖ',
    'ㅗㅏ': 'ㅘ',
    'ㅗㅏㅣ': 'ㅙ',
    'ㅗㅣ': 'ㅚ',
    'ㅜㅓ': 'ㅝ',
    'ㅜㅓㅣ': 'ㅞ',
    'ㅜㅣ': 'ㅟ',
    'ㅡㅣ': 'ㅢ'
  }

  const compositeToSimpleJamoMap = Object.fromEntries(Object.entries(simpleTocompositeJamoMap).map(([simple, composite]) => [composite, simple]))

  let randomHueBase = -1
  let previousGameState
  try {
    previousGameState = deserializeGameState(load('gameState'))
    if (previousGameState) {
      randomHueBase = previousGameState[5]
    }
  } catch (e) {
    console.error(e)
    clear('gameState')
  }

  const cloned = [...wordListFull]

  const wordCount = 16

  function simpleJamoBreakdown(word) {
    return [...word.normalize('NFC')].flatMap(decomposeIntoSimple)
  }

  const wordList = previousGameState ? previousGameState[0] : []
  if (!previousGameState) {
    for (let i = 0; i < wordCount; i++) {
      wordList.push(...cloned.splice(randomInt(0, cloned.length - 1), 1))
    }
    cloned.length = 0
  }

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

  const simpleJamoList = `ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ`


  function calculateChecksum(gs) {
    return [...gs].map(c => c.charCodeAt()).reduce((acc, val) => ((acc >>> 1) | ((acc & 1) << 15)) ^ val, 0)
  }

  function serializeGameState() {
    const words = wordList.join()
    const jamoBoard = Array.from({ length: width * height }, (_, i) => jamoElements[i].textContent).join('')
    const completions = Array.from(jamoBoardElement.querySelectorAll('.completion-bar')).filter((elem) => elem !== currentJamoCompletion).map(elem => {
      return `${elem.dataset.start},${elem.dataset.end}`
    }).join()
    const gs = `${GAME_VERSION}|${words}|${width}|${height}|${jamoBoard}|${completions}|${randomHueBase}`
    return `${gs}|${calculateChecksum(gs)}`
  }

  function deserializeGameState(gs) {
    if (gs === null) {
      return null
    }
    const [gameVersion, words, width, height, jamoBoard, completions, randomHueBase, checksum] = gs.split('|')
    if (gameVersion * 1 !== GAME_VERSION) {
      throw new Error('The saved game state is from a different version of the game.')
    }
    const expectedChecksum = calculateChecksum(`${words}|${width}|${height}|${jamoBoard}|${completions}|${randomHueBase}`)
    if (expectedChecksum !== checksum * 1) {
      throw new Error('saved game state is corrupted')
    }
    if (jamoBoard.length !== width * height) {
      throw new Error('saved game state is corrupted')
    }
    return [
      words.split(','),
      width * 1,
      height * 1,
      jamoBoard,
      completions ? completions.split(',').map(Number).reduce((acc, val) => {
        if (!acc.length || acc.at(-1).length === 4) {
          acc.push([])
        }
        acc.at(-1).push(val)
        return acc
      }, []) : [],
      randomHueBase * 1
    ]
  }


  function decomposeIntoSimple(char) {
    const [nfdCho, nfdJung, nfdJong] = [...char.normalize('NFD')].concat(['', '', '']).slice(0, 3)
    const simpleCho = `ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ`[nfdCho.charCodeAt(0) - nfdChoBase.charCodeAt(0)]
    const simpleJung = String.fromCharCode(nfdJung.charCodeAt(0) + jungDiff)
    const simpleJong = nfdJong.length ? `ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ`[nfdJong.charCodeAt(0) - nfdJongBase.charCodeAt(0)] : ''
    return [simpleCho, simpleJung, simpleJong].flatMap(jamo => [...(compositeToSimpleJamoMap[jamo] ?? jamo)])
  }

  function composeIntoComposite(simpleJamo) { // @TODO: complete this function
    simpleJamo = [...simpleJamo]
    const hangulImeStateMachine = {
      cho: {
        'ㄱ': ['ㄱ', 'jung'],
        'ㄴㄹㅁㅇㅊㅋㅌㅍㅎ': ['jung'],
        'ㄷ': ['ㄷ', 'jung'],
        'ㅂ': ['ㅂ', 'jung'],
        'ㅅ': ['ㅅ', 'jung'],
        'ㅈ': ['ㅈ', 'jung'],
      },
      jung: {
        'ㅏㅑㅓㅕㅡ': ['ㅣ', 'jong'],
        'ㅗ': ['ㅏ', 'ㅣ', 'jong'],
        'ㅛㅠㅣ': ['jong'],
        'ㅜ': ['ㅓ', 'ㅣ', 'jong'],
      },
      jong: {
        'ㄱ': ['ㄱ', 'ㅅ', 'cho'],
        'ㄴ': ['ㅈ', 'ㅎ', 'cho'],
        'ㄷㅁㅇㅈㅊㅋㅌㅍㅎ': ['cho'],
        'ㄹ': ['ㄱ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅌ', 'ㅍ', 'ㅎ', 'cho'],
        'ㅂ': ['ㅅ', 'cho'],
        'ㅅ': ['ㅅ', 'cho'],
      }
    }
    const maxLengths = {
      cho: 2,
      jung: 3,
      jong: 2
    }
    let currentLengths = {
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
      if (DEBUG) debugger
      if (!transition) {
        throw new Error('cannot find suitable continuation for jamo sequence')
      }
      const [_, targetStates] = transition // ['ㅂ', 'jung']
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
    return simpleJamoList[randomInt(0, simpleJamoList.length - 1)]
  }

  const simpleJamoFromWordList = wordList.flatMap(word => [...word.normalize('NFC')].flatMap(decomposeIntoSimple))
  const jamoFromWordlist = () => {
    return simpleJamoFromWordList[randomInt(0, simpleJamoFromWordList.length - 1)]
  }

  const gap = 0.75

  function noTransitionZone(fn, elem) {
    elem.classList.add('notransition')
    fn()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { // 1 frame skip does not work in some cases
        elem.classList.remove('notransition')
      })
    })
  }

  const fillJamoBoard = () => {
    jamoBoardElement.style.setProperty('--gap', `${gap}em`)
    // set css variable for grid styling
    jamoBoardElement.style.setProperty('--width', width)
    jamoBoardElement.style.setProperty('--height', height)

    noTransitionZone(() => {
      for (let i = 0; i < width * height; i++) {
        const jamoElement = jamoBoardTemplate.content.cloneNode(true).querySelector('i')
        const jamo = previousGameState ? previousGameState[3][i] : (randomInt(0, 1) ? randomJamo() : jamoFromWordlist())
        jamoElement.textContent = jamo
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
    if (progress < 0) {
      throw new RangeError('progress must be 0 or greater')
    }
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dirMap[dy + 1][dx + 1] === direction) {
          return [x + dx * progress, y + dy * progress]
        }
      }
    }
  }

  const jamoElements = jamoBoardElement.querySelectorAll('#jamo-board>i');

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

    let startX;
    let startY;
    let endX;
    let endY;
    for (let i = 0; i < breakdown.length; i++) {
      const [targetX, targetY] = getPosition(x, y, direction, i)
      if (i === 0) {
        [startX, startY] = [targetX, targetY]
      }
      if (i === breakdown.length - 1) {
        [endX, endY] = [targetX, targetY]
      }
      const jamo = breakdown[i]
      const jamoIndex = targetY * width + targetX
      jamoWrittenPositions[jamoIndex] = jamo
      const jamoElement = jamoElements[jamoIndex]
      jamoElement.textContent = jamo
    }

    return true
  }

  const cellSize = 2
  jamoBoardElement.style.setProperty('--size', `${cellSize}rem`)

  function memo(key, compute) {
    const cache = memo.cache ?? (memo.cache = new Map())
    if (cache.has(key)) {
      return cache.get(key)
    }
    const result = compute()
    cache.set(key, result)
    return result
  }

  function createCompletionBarElement(startX, startY, endX, endY, updateElement = null) {
    const completionBarTemplate = memo(createCompletionBarElement, () => document.getElementById('completion-bar-template'))
    const completionBarElement = updateElement ?? completionBarTemplate.content.cloneNode(true).querySelector('.completion-bar')
    const padding = 0.25

    completionBarElement.dataset.start = `${startX},${startY}`
    completionBarElement.dataset.end = `${endX},${endY}`

    const sdx = Math.sign(endX - startX)
    const sdy = Math.sign(endY - startY)
    const xmin = Math.min(startX, endX);
    const xmax = Math.max(startX, endX);
    const ymin = Math.min(startY, endY);
    const ymax = Math.max(startY, endY);
    const top = ymin * cellSize + (gap * ymin);
    const left = xmin * cellSize + (gap * xmin);
    const width = (xmax - xmin + 1) * cellSize + (gap * (xmax - xmin));
    const height = (ymax - ymin + 1) * cellSize + (gap * (ymax - ymin));

    completionBarElement.style.setProperty('--top', `${top}em`)
    completionBarElement.style.setProperty('--left', `${left}em`)
    completionBarElement.style.setProperty('--width', `${width}em`)
    completionBarElement.style.setProperty('--height', `${height}em`)

    const hypot = Math.hypot(width, height) + padding
    const angle = Math.atan2(sdy * height, sdx * width) * 180 / Math.PI
    completionBarElement.style.setProperty('--thick', `${cellSize + padding}em`)
    completionBarElement.style.setProperty('--hypot', `${hypot}em`)
    completionBarElement.style.setProperty('--angle', `${angle}deg`)
    const rand = Math.floor(randomFromCoords(startX, startY) * colorSteps) * Math.floor(360 / colorSteps)
    const color = `oklch(75% 75% ${randomHueBase + rand}deg)`
    completionBarElement.style.setProperty('--color', color)

    return completionBarElement
  }

  function markWordAsFound(wordElement, completionBarElement) {
    wordElement.style.setProperty('--color', completionBarElement.style.getPropertyValue('--color'))
    wordElement.classList.add('found')
  }

  function markCompletionAsCompleted(startX, startY, endX, endY) {
    const completionBarElement = createCompletionBarElement(startX, startY, endX, endY)
    const jamoSequence = completionToJamoSequence(startX, startY, endX, endY)
    const foundWord = findWordByJamoSequence(jamoSequence)
    const wordElement = wordListElement.querySelector(`li[data-word="${foundWord}"]`)
    markWordAsFound(wordElement, completionBarElement)
    jamoBoardElement.appendChild(completionBarElement)
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const colorSteps = 16
  if (!previousGameState) {
    randomHueBase = randomInt(0, 359)
  }

  function randomFromCoords(x, y) {
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

  if (!previousGameState) {
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
            throw 'The board generation was stuck in impossible state, so the page was reloaded.'
          }
          repeated++
        }
      })
    } catch (e) {
      console.error(e)
      reset()
      return
    }
  } else {
    previousGameState[4].forEach(([startX, startY, endX, endY]) => {
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
  darkModeToggleButton.addEventListener('click', toggleModes)
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

  function indexToPos(index) {
    return [index % width, Math.floor(index / width)]
  }

  function isOctilinear(origin, target) {
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

  function getClosestOctilinearPoint(origin, target, dir) {
    const [ox, oy] = origin
    const [tx, ty] = target
    const [dx, dy] = [tx - ox, ty - oy]
    let [dx1, dy1] = [tx - ox, ty - oy]
    let [dx2, dy2] = [tx - ox, ty - oy]

    {
      // orthogonal
      if (Math.abs(dx1) < Math.abs(dy1)) {
        dx1 = 0
      } else {
        dy1 = 0
      }
    }

    {
      // diagonal
      if ((dx2 + dy2) % 2) {
        // parity mismatch adjustment
        if (Math.abs(dx2) < Math.abs(dy2)) {
          dy2 -= Math.sign(dy2)
        } else {
          dx2 -= Math.sign(dx2)
        }
      }
      let dist = Math.abs(Math.abs(dx2) - Math.abs(dy2)) / 2
      if (Math.abs(dx2) < Math.abs(dy2)) {
        dx2 += Math.sign(dx2) * dist
        dy2 -= Math.sign(dy2) * dist
      } else {
        dx2 -= Math.sign(dx2) * dist
        dy2 += Math.sign(dy2) * dist
      }
    }

    const dist1 = Math.abs(dx - dx1) + Math.abs(dy - dy1)
    const dist2 = Math.abs(dx - dx2) + Math.abs(dy - dy2)

    if (dist1 === dist2) {
      if (dir % 2 === 0) {
        return [ox + dx1, oy + dy1]
      } else {
        return [ox + dx2, oy + dy2]
      }
    } else {
      if (dist1 < dist2) {
        return [ox + dx1, oy + dy1]
      } else {
        return [ox + dx2, oy + dy2]
      }
    }
  }

  let currentJamoCompletion = null

  function updateJamoCompletion() {
    if (dragStartPos[0] !== -1 && dragStartPos[1] !== -1) {
      const exists = currentJamoCompletion !== null
      const [sx, sy] = dragStartPos
      const [ex, ey] = dragEndPos[0] === -1 && dragEndPos[1] === -1 ? [sx, sy] : dragEndPos
      currentJamoCompletion = createCompletionBarElement(sx, sy, ex, ey, currentJamoCompletion)
      if (!exists) {
        jamoBoardElement.appendChild(currentJamoCompletion)
      }
    }
  }

  function createRange(start, end) {
    const inc = start < end ? 1 : -1;
    const result = [];
    for (let i = 0; i <= Math.abs(end - start); i += 1) {
      result.push(i * inc + start)
    }
    return result
  }

  function completionToJamoSequence(startX, startY, endX, endY) {
    const rangeX = createRange(startX, endX)
    const rangeY = createRange(startY, endY)
    const longer = Math.max(rangeX.length, rangeY.length)
    const coords = Array.from({ length: longer }, (_, i) => [rangeX[i] ?? startX, rangeY[i] ?? startY])
    return coords.map(([x, y]) => jamoElements[y * width + x].textContent).join('')
  }

  function findWordByJamoSequence(jamoSequence) {
    return wordList.find(word => {
      const [simple, reversed] = memo(word, () => {
        const simple = simpleJamoBreakdown(word)
        return [simple.join(''), simple.toReversed().join('')]
      })
      return simple === jamoSequence || reversed === jamoSequence
    })
  }

  function checkJamoCompletion(jamoCompletionElement) {
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
    const jamoElement = document.elementFromPoint(e.clientX, e.clientY)
    if (jamoElement.matches('#jamo-board>i')) {
      pointerdown.value = true
      if (DEBUG) {
        jamoElement.classList.add('start')
      }
      dragStartPos = indexToPos(jamoElement.dataset.index * 1)
      dragEndPos = [-1, -1]
      dragDir = -1
      updateJamoCompletion()
    }
  })

  document.addEventListener('pointerup', (e) => {
    isRightClick = e.button === 2
    pointerdown.value = false
    if (dragEndPos[0] !== -1 && dragEndPos[1] !== -1 && (dragStartPos[0] !== dragEndPos[0] || dragStartPos[1] !== dragEndPos[1])) {
      checkJamoCompletion(currentJamoCompletion)
    }
  })

  document.addEventListener('pointermove', (e) => {
    if (pointerdown.value) {
      e.preventDefault()
      const jamoElement = document.elementFromPoint(e.clientX, e.clientY)
      if (jamoElement?.matches('#jamo-board>i')) {
        const pos = indexToPos(jamoElement.dataset.index * 1)
        if (dragStartPos[0] === pos[0] && dragStartPos[1] === pos[1]) {
          return
        }
        if (DEBUG) {
          jamoBoardElement.querySelector('.mid')?.classList.remove('mid')
          jamoElement.classList.add('mid')
        }
        const dir = isOctilinear(dragStartPos, pos)
        if (dir !== -1) {
          dragEndPos = pos
          dragDir = dir
        } else if (dragEndPos[0] !== -1 && dragEndPos[1] !== -1) {
          dragEndPos = getClosestOctilinearPoint(dragStartPos, pos, dragDir)
        }
        if (dragEndPos[0] !== -1 && dragEndPos[1] !== -1) {
          const closestIndex = dragEndPos[1] * width + dragEndPos[0]
          const closestElement = jamoElements[closestIndex]
          if (DEBUG) {
            jamoBoardElement.querySelector('.end')?.classList.remove('end')
            closestElement.classList.add('end')
          }
          updateJamoCompletion()
        }
      }
    }
  })

  if (!previousGameState) {
    save('gameState', serializeGameState())
  }

  window.serializeGameState = serializeGameState

  const mainElement = document.querySelector('main')

  const resizeToFit = () => {
    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight

    wordListElement.style.zoom = 1
    wordListElement.style.fontSize = '1rem'
    jamoBoardElement.style.zoom = 1
    mainElement.style.zoom = 1

    const wordListElementWidth = wordListElement.getBoundingClientRect().width
    const jamoBoardElementWidth = jamoBoardElement.getBoundingClientRect().width
  
    wordListElement.style.zoom = Math.min(1, screenWidth / wordListElementWidth)
    wordListElement.style.fontSize = `${1 / wordListElement.style.zoom}rem`
    jamoBoardElement.style.zoom = Math.min(1, screenWidth / jamoBoardElementWidth)
  
    const mainElementHeight = mainElement.getBoundingClientRect().height
  
    mainElement.style.zoom = Math.min(1, screenHeight / mainElementHeight)
  }
  resizeToFit()
  window.addEventListener('resize', resizeToFit)

  window.addEventListener('beforeunload', () => {
    const currentStateSaved = load('gameState')
    if (currentStateSaved) {
      save('gameState', serializeGameState())
    }
  })

  const gameInitialized = performance.now()

  const PROFILE = false
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

function reset() {
  intervals.forEach(clearInterval)
  intervals.length = 0
  const children = [...document.body.children].filter(elem => elem !== document.currentScript)
  children.forEach(child => child.remove())
  document.body.innerHTML = initialHTMLWithoutThisScript
  preventInitCall = false
  init()
}

function load(key, fallback) {
  const data = localStorage[key]
  if (typeof data === 'string') {
    return JSON.parse(data)
  }
  return fallback ?? null
}

function clear(key) {
  delete localStorage[key]
}

function save(key, value) {
  localStorage[key] = JSON.stringify(value)
}

function average(arr) {
  return arr.reduce((acc, val) => acc + val, 0) / arr.length
}
function median(arr) {
  const sorted = arr.slice().sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2
  }
  return sorted[mid]
}

function getCurrentFunctionName() {
  const currentStackRaw = new Error().stack
  const callerLine = currentStackRaw.split('\n').slice(1)[1]
  const caller = callerLine.match(/at (\w+)/)[1]
  return caller
}

const jsParsed = performance.now()

init()

function registerKonamiCodeHandler() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter']
  let konamiCodeIndex = 0
  const a = async (e) => {
    if (e.key === konamiCode[konamiCodeIndex]) {
      konamiCodeIndex++
      if (konamiCodeIndex === konamiCode.length) {
        showCrazyShit()
        window.removeEventListener('keydown', a)
      }
    } else {
      konamiCodeIndex = 0
    }
  }
  window.addEventListener('keydown', a, {passive: true})
}

function showCrazyShit() {
  const lunaticText = generateLunaticText()
  const lunaticElement = document.createElement('div')
  lunaticElement.textContent = lunaticText
  document.body.appendChild(lunaticElement)
  const slices = createRandomStyleSlices({textLength: lunaticText.length, numSlices: 100, maxLength: 5})
  // compute overlapping slices and splice them so that they don't overlap
  const sliceGroups = slices.reduce((acc, slice) => {
    const last = acc[acc.length - 1]
    if (last && last.some(s => s.start < slice.end && s.end > slice.start)) {
      last.push(slice)
    } else {
      acc.push([slice])
    }
    return acc
  }, [])

}

document.getElementById('show-settings-panel').addEventListener('click', () => {
  document.getElementById('settings-panel').showModal()
})
