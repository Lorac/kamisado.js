var chai = require('chai')
var Kamisado = require('../kamisado')

var expect = chai.expect

describe('Kamisado', () => {

  describe('#Creation', () => {
    let kami
    beforeEach(() => {
        // Create a new Rectangle object before every test.
      kami = new Kamisado()
    })

    it('has a default fen', () => {
      expect('OBPKYRGM/8/8/8/8/8/8/mgrykpbo b 1').to.equal(kami.fen())
    })
  })


})
