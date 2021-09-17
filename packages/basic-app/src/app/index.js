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

//
// Elements
//
const $ = document.querySelector.bind(document)
const boardElement = $(`.${BOARD_CLASS_NAME}`)

//
// States
//
let currentTurnIndex = 0
let board = []
let gameStarted = true

//
// Methods
//
function getCellElement(row, col) {
  const cellElement = document.createElement(BOARD_CELL_TAG_NAME)
  cellElement.classList.add(BOARD_CELL_CLASS_NAME)
  cellElement.setAttribute(BOARD_ROW_ATTRIBUTE, row)
  cellElement.setAttribute(BOARD_COLUMN_ATTRIBUTE, col)

  return cellElement
}

function renderBoard() {
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

function createBoard() {
  board = new Array(BOARD_ROWS).fill().map(() => new Array(BOARD_COLUMNS).fill())

  boardElement.addEventListener(BOARD_MOVE_EVENT_NAME, (event) => {
    if (!gameStarted) {
      return
    }

    /**
     * @type {HTMLElement}
     */
    const target = event.target
    const cellRow = target.getAttribute(BOARD_ROW_ATTRIBUTE)
    const cellCol = target.getAttribute(BOARD_COLUMN_ATTRIBUTE)

    if (cellRow && cellCol && !board[cellRow][cellCol]) {
      target.innerText = PLAYERS[currentTurnIndex]
      board[cellRow][cellCol] = PLAYERS[currentTurnIndex]
      currentTurnIndex = (currentTurnIndex + 1) % PLAYERS.length
    }
  })

  renderBoard()
}

function initGame() {
  createBoard()
}

initGame()
