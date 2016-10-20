var chai = require('chai')
var Kamisado = require('../kamisado')

var expect = chai.expect

describe('Kamisado', () => {
  describe('#Creation', () => {
    let kami
    beforeEach(() => {
      // Create a new Kamisado object before every test.
      kami = new Kamisado()
    })

    it('has a default fen', () => {
      expect(kami.fen()).to.equal(Kamisado.DEFAULT_POSITION)
    })

    it('should be black turn', () => {
      expect(kami.currentTurn()).to.equal(Kamisado.BLACK)
    })

    it('should be move #1', () => {
      expect(kami.currentMoveNumber()).to.equal(1)
    })

    it('should have 102 possible moves', () => {
      expect(kami.moves()).to.have.length.of(102)
    })
  })

  describe('#After the first move move', () => {
    let kami
    beforeEach(() => {
      // Create a new Kamisado object before every test.
      kami = new Kamisado('1BPKYRGM/O7/8/8/8/8/8/mgrykpbo w 1')
    })

    it('should be move #1', () => {
      expect(kami.currentMoveNumber()).to.equal(1)
    })

    it('should be white turn', () => {
      expect(kami.currentTurn()).to.equal(Kamisado.WHITE)
    })

    it('white should be able to play', () => {
      expect(kami.moves()).to.have.length.of.at.least(1)
    })
  })

  describe('#Winning position', () => {
    it('black should win', () => {
      let kami = new Kamisado(Kamisado.DEFAULT_POSITION)
      let movesToPlay = [
                        { from: 'b8', to: 'b7' },
                        { from: 'h1', to: 'h4' },
                        { from: 'd8', to: 'g5' },
                        { from: 'e1', to: 'e6' },
                        { from: 'f8', to: 'c5' },
                        { from: 'c1', to: 'e3' },
                        { from: 'c8', to: 'c7' },
                        { from: 'f1', to: 'e2' },
                        { from: 'b7', to: 'd5' },
                        { from: 'g1', to: 'g2' },
                        { from: 'c5', to: 'b4' },
                        { from: 'e3', to: 'e4' },
                        { from: 'g5', to: 'c1' }
      ]
      movesToPlay.forEach(function(move) {
        kami.move(move)
      })
      expect(kami.isWon()).to.be.true
      expect(kami.currentTurn()).to.equal(Kamisado.WHITE)
    })

    it('white should win', () => {
      let kami = new Kamisado(Kamisado.DEFAULT_POSITION)
      let movesToPlay = [
                        { from: 'a8', to: 'd5' },
                        { from: 'h1', to: 'h5' },
                        { from: 'e8', to: 'f7' },
                        { from: 'd1', to: 'd2' },
                        { from: 'f7', to: 'g6' },
                        { from: 'd2', to: 'd4' },
                        { from: 'b8', to: 'b7' },
                        { from: 'g1', to: 'g3' },
                        { from: 'g6', to: 'g5' },
                        { from: 'd4', to: 'd6' },
                        { from: 'h8', to: 'd4' },
                        { from: 'a1', to: 'a4' },
                        { from: 'd5', to: 'a2' },
                        { from: 'h5', to: 'e8' }
      ]

      movesToPlay.forEach(function(move) {
        kami.move(move)
      })
      expect(kami.isWon()).to.be.true
      expect(kami.currentTurn()).to.equal(Kamisado.BLACK)
    })
  })
})
