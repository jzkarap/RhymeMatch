# RhymeMatch
* RhymeMatch is a drag-and-drop game for young children to practice rhyming words

<img src="https://github.com/jzkarap/RhymeMatch/blob/master/RhymeGame.gif?raw=true">

RhymeMatch makes calls to datamuse API to get a target word and a selection of rhyming words. It will repeat calls until it accepts a sufficient amount of rhyming matches to build a game. An equal number of non-rhyming words is called. Rhyming words and non-rhyming words are intermixed and randomly placed within the display.

Interact.js library is used to handle drag and drop events.

[Play here](https://secret-meadow-24357.herokuapp.com/)

<h2>To-Do</h2>
[x] Generate DOM elements that take information from API call <br>
[x] Allow drag-and-drop interface so players can interact with those generated elements <br>
[x] Build an array of non-rhyming words to provide a challenge for budding logophiles <br>
[ ] Style to make it look nice <br>
<blockquote>
  + Toggle play/replay <br>
  + Feedback on incorrect selection <br>
  + Sound effects
</blockquote>
[ ] Clean up code so it doesn't look like such a Frankenstein monster <br>
[ ] Add/clarify line comments
