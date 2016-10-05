'use strict'

const BLACK = 'b'
const WHITE = 'w'

const RANK_1 = 7
const RANK_2 = 6
const RANK_3 = 5
const RANK_4 = 4
const RANK_5 = 3
const RANK_6 = 2
const RANK_7 = 1
const RANK_8 = 0

const BOARD =
  {
    a8: 'o', b8: 'b', c8: 'p', d8: 'k', e8: 'y', f8: 'r', g8: 'g', h8: 'm',
    a7: 'r', b7: 'o', c7: 'k', d7: 'g', e7: 'b', f7: 'y', g7: 'm', h7: 'p',
    a6: 'g', b6: 'p', c6: 'o', d6: 'r', e6: 'p', f6: 'm', g6: 'y', h6: 'b',
    a5: 'k', b5: 'p', c5: 'b', d5: 'o', e5: 'm', f5: 'g', g5: 'r', h5: 'y',
    a4: 'y', b4: 'r', c4: 'g', d4: 'm', e4: 'o', f4: 'b', g4: 'p', h4: 'k',
    a3: 'b', b3: 'y', c3: 'm', d3: 'p', e3: 'r', f3: 'o', g3: 'k', h3: 'g',
    a2: 'p', b2: 'm', c2: 'y', d2: 'b', e2: 'g', f2: 'k', g2: 'o', h2: 'r',
    a1: 'm', b1: 'g', c1: 'r', d1: 'y', e1: 'k', f1: 'p', g1: 'b', h1: 'o'
  }

const PIECE_OFFSETS = [-15, -30, -45, -60, -75, -90, -105, 15, 30, 45, 60, 75, 90, 105,
                       -16, -32, -48, -64, -80, -96, -112, 16, 32, 48, 64, 80, 96, 112,
                       -17, -34, -51, -68, -85, -102, -119, 17, 34, 51, 58, 85, 102, 119]
const SQUARES = {
  a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
  a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
  a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
  a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
  a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
  a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
  a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
}

const PAWNS =
  {
    o: 'orange',
    r: 'red',
    g: 'green',
    k: 'pink',
    y: 'yellow',
    b: 'blue',
    p: 'purple',
    m: 'maroon'
  }

const SYMBOLS = 'obpkyrgmOBPKYRGM'

export class Kamisado {

  constructor(fen) {
    const DEFAULT_POSITION = 'OBPKYRGM/8/8/8/8/8/8/mgrykpbo b 1'
    if (typeof fen === 'undefined') {
      this.load(DEFAULT_POSITION)
    } else {
      this.load(fen)
    }
  }

  clear() {
    this.board = new Array(128)
    this.turn = BLACK
    this.moveNumber = 1
    this.history = []
    this._generateFen()
  }

  load(fen) {
    const tokens = fen.split(/\s+/)
    const position = tokens[0]
    let square = 0
    this.clear()

    for (var i = 0; i < position.length; i++) {
      const piece = position.charAt(i)

      if (piece === '/') {
        square += 8
      } else if (isDigit(piece)) {
        square += parseInt(piece, 10)
      } else {
        this._put({ color: piece, player: piece < 'a' ? BLACK : WHITE }, algebraic(square))
        square++
      }
    }

    this.turn = tokens[1]
    this.moveNumber = parseInt(tokens[2], 10)
    this._generateFen()

    return true
  }

  move(move) {
    /* The move function can be called with in the following parameters:
    *
    * .move({ from: 'h7', <- where the 'move' is a move object (additional
    *         to :'h8',      fields are ignored)
    *      })
    */
    var moveObj = null
    var moves = this._generateLegalMoves()

    /* convert the pretty move object to an ugly move object */
    for (var i = 0, len = moves.length; i < len; i++) {
      if (move.from === algebraic(moves[i].from) && move.to === algebraic(moves[i].to)) {
        moveObj = moves[i]
        break
      }
    }

    /* failed to find move */
    if (!moveObj) {
      return null
    }

    this._makeMove(moveObj)

    return move
  }

  turn() {
    return this.turn
  }

  ascii() {
    let s = '   +------------------------+\n'
    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      /* display the rank */
      if (file(i) === 0) {
        s += ' ' + '87654321'[rank(i)] + ' |'
      }

      /* empty piece */
      if (this.board[i] == null) {
        s += ' . '
      } else {
        const piece = this.board[i].piece
        const player = this.board[i].player
        const symbol = (player === BLACK) ? piece.toUpperCase() : piece.toLowerCase()
        s += ' ' + symbol + ' '
      }

      if ((i + 1) & 0x88) {
        s += '|\n'
        i += 8
      }
    }
    s += '   +------------------------+\n'
    s += '     a  b  c  d  e  f  g  h\n'

    return s
  }

  _buildMove(board, from, to) {
    var move = {
      player: this.turn,
      from: algebraic(from),
      to: algebraic(to),
      piece: board[from].piece
    }
    return move
  }

  _generateLegalMoves() {
    var legalMoves = []
    var us = this.turn
    var numberTurns = this.moveNumber
    let lastMove = this.history[numberTurns - 1]

    var firstSquare = SQUARES.a8
    var lastSquare = SQUARES.h1

    for (var i = firstSquare; i <= lastSquare; i++) {
      /* did we run off the end of the board */
      if (i & 0x88) {
        i += 7
        continue
      }

      var piece = this.board[i]
      if (piece == null || piece.player !== us) {
        continue
      }

      if (typeof (lastMove) !== 'undefined') {
        if (this._get(algebraic(lastMove.move.to)).toLowerCase() !== this._get(algebraic(i)).piece.toLowerCase()) {
          continue
        }
      }

      for (var j = 0, len = PIECE_OFFSETS.length; j < len; j++) {
        var offset = PIECE_OFFSETS[j]
        var square = i

        if (piece.player === BLACK && offset > 0 || piece.player === WHITE && offset < 0) {
          while (true) {
            square += offset
            if (square & 0x88) break

            if (this.board[square] == null) {
              legalMoves.push(this._buildMove(this.board, i, square))
              break
            }
          }
        }
      }
    }

    return legalMoves
  }

  _makeMove(move) {
    this._push(move)

    this.board[move.to] = this.board[move.from]
    this.board[move.from] = null

    if (this.turn === WHITE) {
      this.moveNumber++
    }
    this.turn = this._swapColor(this.turn)
  }

  _swapColor(c) {
    return c === WHITE ? BLACK : WHITE
  }

  _push(move) {
    this.history.push({
      move: move,
      turn: this.turn,
      moveNumber: this.moveNumber
    })
  }

  _generateFen() {
    let empty = 0
    let fen = ''

    for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
      if (this.board[i] == null) {
        empty++
      } else {
        if (empty > 0) {
          fen += empty
          empty = 0
        }
        const color = this.board[i].color
        const piece = this.board[i].piece

        fen += (color === WHITE) ? piece.toUpperCase() : piece.toLowerCase()
      }

      if ((i + 1) & 0x88) {
        if (empty > 0) {
          fen += empty
        }

        if (i !== SQUARES.h1) {
          fen += '/'
        }
        empty = 0
        i += 8
      }
    }

    return [fen, this.turn, this.moveNumber].join(' ')
  }

  _get(square) {
    return this.board[SQUARES[square]]
  }

  _put(piece, square) {
    if (SYMBOLS.indexOf(piece.color.toLowerCase()) === -1) {
      return false
    }

    /* check for valid square */
    if (!(square in SQUARES)) {
      return false
    }

    var sq = SQUARES[square]

    this.board[sq] = { color: BOARD[square], piece: piece.color, player: piece.player }
    this._generateFen()
    return true
  }

  _remove(square) {
    const piece = this.get(square)
    this.board[SQUARES[square]] = null
    this._generateFen()

    return piece
  }
}

function isDigit(c) {
  return '0123456789'.indexOf(c) !== -1
}

function algebraic(i) {
  let f = file(i)
  let r = rank(i)
  return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1)
}

function rank(i) {
  return i >> 4
}

function file(i) {
  return i & 15
}
