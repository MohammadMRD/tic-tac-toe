import '../styles/app.scss'

//
// Constants
//
const BOARD_ROWS = 3
const BOARD_COLUMNS = 3
const PLAYERS = ['✖', '◯']
const BOARD_CLASS_NAME = 'board'
const BOARD_ROW_CLASS_NAME = 'board-row'
const BOARD_CELL_CLASS_NAME = 'board-cell'
const BOARD_ROW_ATTRIBUTE = 'data-row'
const BOARD_COLUMN_ATTRIBUTE = 'data-col'
const BOARD_ROW_TAG_NAME = 'div'
const BOARD_CELL_TAG_NAME = 'div'
const BOARD_MOVE_EVENT_NAME = 'click'
const START_BUTTON_CLASS_NAME = 'btn-reset'
const START_GAME_EVENT_NAME = 'click'
const TIE_STATE = 'Tie'
const PLAYER_CLASS_NAME = 'player'
const CURRENT_PLAYER_CLASS_NAME = 'active'
const RESULT_CLASS_NAME = 'game-result'

//
// Elements
//
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const boardElement = $(`.${BOARD_CLASS_NAME}`)
const resetGameButtonElement = $(`.${START_BUTTON_CLASS_NAME}`)
const playersElements = $$(`.${PLAYER_CLASS_NAME}`)
const resultElement = $(`.${RESULT_CLASS_NAME}`)

//
// States
//
let currentTurnIndex
let board
let gameOver
let rowsMoveCount
let columnsMoveCount
let numberOfMoves

//
// Methods
//
function checkWinner() {
  // Check rows
  for (const rowIndex in rowsMoveCount) {
    if (rowsMoveCount[rowIndex] !== BOARD_COLUMNS) {
      continue
    }

    const rowSet = new Set(board[rowIndex])
    if (rowSet.size === 1) {
      return board[rowIndex][0]
    }
  }

  // Check Columns
  for (const columnIndex in columnsMoveCount) {
    if (columnsMoveCount[columnIndex] !== BOARD_ROWS) {
      continue
    }

    let hasEqualRows = true
    for (let rowIndex = 1; rowIndex < BOARD_ROWS; rowIndex++) {
      hasEqualRows = hasEqualRows && board[rowIndex][columnIndex] === board[rowIndex - 1][columnIndex]
    }

    if (hasEqualRows) {
      return board[0][columnIndex]
    }
  }

  // Check Diagonals
  if (BOARD_ROWS === BOARD_COLUMNS) {
    let hasEqualLtrDiagonal = true
    let hasEqualRtlDiagonal = true

    for (let index = 1; index < BOARD_ROWS; index++) {
      hasEqualLtrDiagonal =
        hasEqualLtrDiagonal && board[index][index] && board[index][index] === board[index - 1][index - 1]
      hasEqualRtlDiagonal =
        hasEqualRtlDiagonal &&
        board[index][BOARD_COLUMNS - index - 1] &&
        board[index][BOARD_COLUMNS - index - 1] === board[index - 1][BOARD_COLUMNS - index]
    }

    if (hasEqualLtrDiagonal) {
      return board[0][0]
    }

    if (hasEqualRtlDiagonal) {
      return board[0][BOARD_COLUMNS - 1]
    }
  }

  // End game
  if (BOARD_ROWS * BOARD_COLUMNS === numberOfMoves) {
    return TIE_STATE
  }
}

function getResultMessage(result) {
  return result === TIE_STATE ? 'Draw' : `Player ${currentTurnIndex + 1} win!`
}

function getCellElement(row, col) {
  const cellElement = document.createElement(BOARD_CELL_TAG_NAME)
  cellElement.classList.add(BOARD_CELL_CLASS_NAME)
  cellElement.setAttribute(BOARD_ROW_ATTRIBUTE, row)
  cellElement.setAttribute(BOARD_COLUMN_ATTRIBUTE, col)

  return cellElement
}

function renderBoard() {
  boardElement.innerText = ''
  const boardFragment = document.createDocumentFragment()

  for (const row in board) {
    const rowElement = document.createElement(BOARD_ROW_TAG_NAME)
    rowElement.classList.add(BOARD_ROW_CLASS_NAME)

    for (const col in board[row]) {
      const boardCell = getCellElement(row, col)
      rowElement.appendChild(boardCell)
    }

    boardFragment.appendChild(rowElement)
  }

  boardElement.appendChild(boardFragment)
}

function resetGame() {
  board = new Array(BOARD_ROWS).fill().map(() => new Array(BOARD_COLUMNS).fill())
  rowsMoveCount = new Array(BOARD_ROWS).fill(0)
  columnsMoveCount = new Array(BOARD_COLUMNS).fill(0)
  numberOfMoves = 0
  gameOver = false
  resultElement.innerText = ''

  currentTurnIndex && playersElements[currentTurnIndex].classList.remove(CURRENT_PLAYER_CLASS_NAME)
  currentTurnIndex = 0
  playersElements[currentTurnIndex].classList.add(CURRENT_PLAYER_CLASS_NAME)
}

function renderMove(target, row, column) {
  const query = `.board-cell[data-row='${row}'][data-col='${column}']`
  target = target ?? $(query)
  target.innerText = PLAYERS[currentTurnIndex]
}

function makeMove(row, column) {
  board[row][column] = PLAYERS[currentTurnIndex]
  rowsMoveCount[row]++
  columnsMoveCount[column]++
  numberOfMoves++
  playersElements[currentTurnIndex].classList.toggle(CURRENT_PLAYER_CLASS_NAME)

  const winner = checkWinner()
  if (winner) {
    gameOver = true
    const message = getResultMessage(winner)
    resultElement.innerText = message
    return
  }

  currentTurnIndex = (currentTurnIndex + 1) % PLAYERS.length
  playersElements[currentTurnIndex].classList.toggle(CURRENT_PLAYER_CLASS_NAME)
}

function createBoard() {
  resetGame()
  boardElement.addEventListener(BOARD_MOVE_EVENT_NAME, (event) => {
    if (gameOver) {
      return
    }

    /**
     * @type {HTMLElement}
     */
    const target = event.target
    const cellRow = target.getAttribute(BOARD_ROW_ATTRIBUTE)
    const cellCol = target.getAttribute(BOARD_COLUMN_ATTRIBUTE)

    if (cellRow && cellCol && !board[cellRow][cellCol]) {
      renderMove(target)
      makeMove(cellRow, cellCol)
    }
  })

  resetGameButtonElement.addEventListener(START_GAME_EVENT_NAME, () => {
    createBoard()
  })

  renderBoard()
}

function initGame() {
  createBoard()
}

initGame()
