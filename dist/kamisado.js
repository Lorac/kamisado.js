'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BLACK = 'b';
var WHITE = 'w';

var BOARD = {
  a8: 'o', b8: 'b', c8: 'p', d8: 'k', e8: 'y', f8: 'r', g8: 'g', h8: 'm',
  a7: 'r', b7: 'o', c7: 'k', d7: 'g', e7: 'b', f7: 'y', g7: 'm', h7: 'p',
  a6: 'g', b6: 'p', c6: 'o', d6: 'r', e6: 'p', f6: 'm', g6: 'y', h6: 'b',
  a5: 'k', b5: 'p', c5: 'b', d5: 'o', e5: 'm', f5: 'g', g5: 'r', h5: 'y',
  a4: 'y', b4: 'r', c4: 'g', d4: 'm', e4: 'o', f4: 'b', g4: 'p', h4: 'k',
  a3: 'b', b3: 'y', c3: 'm', d3: 'p', e3: 'r', f3: 'o', g3: 'k', h3: 'g',
  a2: 'p', b2: 'm', c2: 'y', d2: 'b', e2: 'g', f2: 'k', g2: 'o', h2: 'r',
  a1: 'm', b1: 'g', c1: 'r', d1: 'y', e1: 'k', f1: 'p', g1: 'b', h1: 'o'
};

var PIECE_OFFSETS = [-15, -30, -45, -60, -75, -90, -105, 15, 30, 45, 60, 75, 90, 105, -16, -32, -48, -64, -80, -96, -112, 16, 32, 48, 64, 80, 96, 112, -17, -34, -51, -68, -85, -102, -119, 17, 34, 51, 58, 85, 102, 119];
var SQUARES = {
  a8: 0, b8: 1, c8: 2, d8: 3, e8: 4, f8: 5, g8: 6, h8: 7,
  a7: 16, b7: 17, c7: 18, d7: 19, e7: 20, f7: 21, g7: 22, h7: 23,
  a6: 32, b6: 33, c6: 34, d6: 35, e6: 36, f6: 37, g6: 38, h6: 39,
  a5: 48, b5: 49, c5: 50, d5: 51, e5: 52, f5: 53, g5: 54, h5: 55,
  a4: 64, b4: 65, c4: 66, d4: 67, e4: 68, f4: 69, g4: 70, h4: 71,
  a3: 80, b3: 81, c3: 82, d3: 83, e3: 84, f3: 85, g3: 86, h3: 87,
  a2: 96, b2: 97, c2: 98, d2: 99, e2: 100, f2: 101, g2: 102, h2: 103,
  a1: 112, b1: 113, c1: 114, d1: 115, e1: 116, f1: 117, g1: 118, h1: 119
};

var SYMBOLS = 'obpkyrgmOBPKYRGM';

var Kamisado = function () {
  function Kamisado(fen) {
    _classCallCheck(this, Kamisado);

    var DEFAULT_POSITION = 'OBPKYRGM/8/8/8/8/8/8/mgrykpbo b 1';
    if (typeof fen === 'undefined') {
      this.load(DEFAULT_POSITION);
    } else {
      this.load(fen);
    }
  }

  _createClass(Kamisado, [{
    key: 'clear',
    value: function clear() {
      this.board = new Array(128);
      this.turn = BLACK;
      this.moveNumber = 1;
      this.history = [];
    }
  }, {
    key: 'load',
    value: function load(fen) {
      var tokens = fen.split(/\s+/);
      var position = tokens[0];
      var square = 0;
      this.clear();

      for (var i = 0; i < position.length; i++) {
        var piece = position.charAt(i);

        if (piece === '/') {
          square += 8;
        } else if (isDigit(piece)) {
          square += parseInt(piece, 10);
        } else {
          this._put({ color: piece, player: piece < 'a' ? BLACK : WHITE }, algebraic(square));
          square++;
        }
      }

      this.turn = tokens[1];
      this.moveNumber = parseInt(tokens[2], 10);

      return true;
    }
  }, {
    key: 'move',
    value: function move(_move) {
      /* The move function can be called with in the following parameters:
      *
      * .move({ from: 'h7', <- where the 'move' is a move object (additional
      *         to :'h8',      fields are ignored)
      *      })
      * .move('Ma7') <- Where the move is a case-sensitive SAN string
      *
      */
      var moveObj = null;

      if (typeof _move === 'string') {
        moveObj = this._moveFromSan(_move);
      } else if ((typeof _move === 'undefined' ? 'undefined' : _typeof(_move)) === 'object') {
        var moves = this._generateLegalMoves();
        for (var i = 0, len = moves.length; i < len; i++) {
          if (_move.from === algebraic(moves[i].from) && _move.to === algebraic(moves[i].to)) {
            moveObj = moves[i];
            break;
          }
        }
      }

      /* failed to find move */
      if (!moveObj) {
        return null;
      }

      this._makeMove(moveObj);

      return moveObj;
    }
  }, {
    key: 'turn',
    value: function turn() {
      return this.turn;
    }
  }, {
    key: 'ascii',
    value: function ascii() {
      var s = '   +------------------------+\n';
      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        /* display the rank */
        if (file(i) === 0) {
          s += ' ' + '87654321'[rank(i)] + ' |';
        }

        /* empty piece */
        if (this.board[i] == null) {
          s += ' . ';
        } else {
          var piece = this.board[i].piece;
          var player = this.board[i].player;
          var symbol = player === BLACK ? piece.toUpperCase() : piece.toLowerCase();
          s += ' ' + symbol + ' ';
        }

        if (i + 1 & 0x88) {
          s += '|\n';
          i += 8;
        }
      }
      s += '   +------------------------+\n';
      s += '     a  b  c  d  e  f  g  h\n';

      return s;
    }
  }, {
    key: '_moveFromSan',
    value: function _moveFromSan(move) {
      var moves = this._generateLegalMoves();
      for (var i = 0, len = moves.length; i < len; i++) {
        if (move === this._moveToSan(moves[i])) {
          return moves[i];
        }
      }
      return null;
    }
  }, {
    key: '_moveToSan',
    value: function _moveToSan(move) {
      if ((typeof move === 'undefined' ? 'undefined' : _typeof(move)) === 'object') {
        return move.piece + move.to;
      }
      return null;
    }
  }, {
    key: '_buildMove',
    value: function _buildMove(board, from, to) {
      var move = {
        player: this.turn,
        from: algebraic(from),
        to: algebraic(to),
        piece: board[from].piece
      };
      return move;
    }

    /**
     * Outputs a list of move objects :
     *  {
          player: this.turn,
          from: algebraic(from),
          to: algebraic(to),
          piece: board[from].piece
        }
     */

  }, {
    key: '_generateLegalMoves',
    value: function _generateLegalMoves() {
      var legalMoves = [];
      var us = this.turn;
      var numberTurns = this.moveNumber;
      var lastMove = this.history[numberTurns - 1];

      var firstSquare = SQUARES.a8;
      var lastSquare = SQUARES.h1;

      for (var i = firstSquare; i <= lastSquare; i++) {
        /* did we run off the end of the board */
        if (i & 0x88) {
          i += 7;
          continue;
        }

        var piece = this.board[i];
        if (piece == null || piece.player !== us) {
          continue;
        }

        if (typeof lastMove !== 'undefined') {
          if (this._get(lastMove.move.to).toLowerCase() !== this._get(algebraic(i)).piece.toLowerCase()) {
            continue;
          }
        }

        for (var j = 0, len = PIECE_OFFSETS.length; j < len; j++) {
          var offset = PIECE_OFFSETS[j];
          var square = i;

          // Pieces can only go forward and diagonally.
          if (piece.player === BLACK && offset > 0 || piece.player === WHITE && offset < 0) {
            while (true) {
              square += offset;
              if (square & 0x88) break;

              if (this.board[square] == null) {
                legalMoves.push(this._buildMove(this.board, i, square));
                break;
              }
            }
          }
        }
      }

      return legalMoves;
    }
  }, {
    key: '_makeMove',
    value: function _makeMove(move) {
      this._push(move);

      this.board[SQUARES[move.to]] = this.board[SQUARES[move.from]];
      this.board[SQUARES[move.from]] = null;

      if (this.turn === WHITE) {
        this.moveNumber++;
      }
      this.turn = this._swapColor(this.turn);
    }
  }, {
    key: '_swapColor',
    value: function _swapColor(c) {
      return c === WHITE ? BLACK : WHITE;
    }
  }, {
    key: '_push',
    value: function _push(move) {
      this.history.push({
        move: move,
        turn: this.turn,
        moveNumber: this.moveNumber
      });
    }
  }, {
    key: '_generateFen',
    value: function _generateFen() {
      var empty = 0;
      var fen = '';

      for (var i = SQUARES.a8; i <= SQUARES.h1; i++) {
        if (this.board[i] == null) {
          empty++;
        } else {
          if (empty > 0) {
            fen += empty;
            empty = 0;
          }
          var player = this.board[i].player;
          var piece = this.board[i].piece;

          fen += player === WHITE ? piece.toUpperCase() : piece.toLowerCase();
        }

        if (i + 1 & 0x88) {
          if (empty > 0) {
            fen += empty;
          }

          if (i !== SQUARES.h1) {
            fen += '/';
          }
          empty = 0;
          i += 8;
        }
      }

      return [fen, this.turn, this.moveNumber].join(' ');
    }
  }, {
    key: '_get',
    value: function _get(square) {
      return this.board[SQUARES[square]];
    }
  }, {
    key: '_put',
    value: function _put(piece, square) {
      if (SYMBOLS.indexOf(piece.color.toLowerCase()) === -1) {
        return false;
      }

      /* check for valid square */
      if (!(square in SQUARES)) {
        return false;
      }

      var sq = SQUARES[square];

      this.board[sq] = { color: BOARD[square], piece: piece.color, player: piece.player };
      return true;
    }
  }, {
    key: '_remove',
    value: function _remove(square) {
      var piece = this.get(square);
      this.board[SQUARES[square]] = null;

      return piece;
    }
  }]);

  return Kamisado;
}();

function isDigit(c) {
  return '0123456789'.indexOf(c) !== -1;
}

function algebraic(i) {
  var f = file(i);
  var r = rank(i);
  return 'abcdefgh'.substring(f, f + 1) + '87654321'.substring(r, r + 1);
}

function rank(i) {
  return i >> 4;
}

function file(i) {
  return i & 15;
}