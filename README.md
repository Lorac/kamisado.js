# kamsisado.js
Since I couldn't find a standard to describe a state of the game I used the one from chess. This code is largely based of https://github.com/jhlywa/chess.js

## API

### Constructor: Kamisado([ fen ])
The Kamisado() constructor takes a optional parameter which specifies the board configuration
in [Forsyth-Edwards Notation](http://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation).

```js
// board defaults to the starting position when called with no parameters
var kami = new Kamisado();

// pass in a FEN string to load a particular position
var kami = new Kamisado('OBPKYRGM/8/8/8/8/8/8/mgrykpbo b 1');