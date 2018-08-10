let targetWord;
let rhymingWords = [];
let decoyWords = [];
let allWords = [];

const startButton = document.querySelector(".start-game");

const target = document.querySelector(".match-to");
const choices = document.querySelector(".choices");

function drawTargetWord(targetWord) {
    const displayTarget = document.createElement("p");
    displayTarget.textContent = targetWord;
    displayTarget.classList.add("dropzone");
    target.appendChild(displayTarget);
}

/**
 * Draws word selection to screen
 * @param {Array} rhymingWords 
 * @param {Array} decoyWords 
 */
function drawWordSelection(rhymingWords, decoyWords) {

    for (let i = 0; i < rhymingWords.length; i++) {
        allWords.push(rhymingWords[i]);
        allWords.push(decoyWords[i]);
    }

    if (allWords.length > 1) {

        console.log("Your array of all words:");
        console.log("=============");
        console.log(allWords);
        console.log("=============");
        console.log("");

        shuffle(allWords);

        allWords.forEach(function (word) {
            let displayWord = document.createElement("p");
            displayWord.textContent = word;
            displayWord.classList.add("draggable");
            if (rhymingWords.indexOf(word) !== -1) {
                displayWord.classList.add("can-drop", "yes-drop");
            }
            // choices.appendChild(displayWord);

            let posX = (Math.random() * ($(window).width() - 250)).toFixed();
            let posY = (Math.random() * ($(window).height() - 250)).toFixed();

            $(displayWord).css({
                'position': 'absolute',
                'left': posX + 'px',
                'top': posY + 'px',
                'display': 'none'
            }).appendTo(choices).fadeIn(100);
        });
    }
}

function undrawTarget() {
    $(".match-to").children().remove();
}

function undrawWordSelection() {
    $(".choices").children().remove();
}

/**
 * Thanks, Stack Overflow
 * @param {Array} array 
 */
function shuffle(array) {

    console.log("shuffling...");

    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    console.log("Your shuffled words:");
    console.log("=============");
    console.log(allWords);
    console.log("=============");
    console.log("");

    return array;
}

// At each button press,
// Generate a random letter,
// Generate a random number to pull a word from an array of words that start with that letter,
// Get an array of words that rhyme with that word,
// Get an array of equal length of words that do not rhyme with that word,
// have player drag all rhyming words to target word -- once all rhyming words have been matched, player wins
// and can quit or play another round

// NOTE: audience is young children, so limit word complexity (eg don't select words with more than two syllables)
//      also, elements on page should be large and easy to manipulate with clumsy hands

// consider a screenreader, plugin, or API that might read hovered/tapped words to player

// query keeps being rejected by random.org
// function getRandomLetter() {
//     const url = "https://api.random.org/json-rpc/1/invoke";
//     const settings = {
//         "jsonrpc": "2.0",
//         "method": "generateStrings",
//         "params": {
//             "apiKey": "---",
//             "n": 1,
//             "length": 1,
//             "characters": "abcdefghijklmnopqrstuvwxyz",
//             "replacement": true
//         },
//         "id": 7424
//     };

//     fetch(url, settings)
//         .then(response => response.json())
//         .then(json => {
//             console.log(json);
//         })
// }


function generateRandomLetter() {
    let rndNum = Math.floor(Math.random() * 26);
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    return alphabet[rndNum];
}

/**
 * Generates a random number 0-25,
 * Gets a letter from alphabet based on that number
 * (replaces broken API call from above)
 */
function getStartingLetter() {
    let letter = generateRandomLetter();
    console.log("Your starting letter is " + letter);

    getTargetWord(letter);
}

/**
 * Makes call to get a word from datamuse api
 * @param {Char} letter 
 */
async function getWord(letter) {

    const url = `https://api.datamuse.com/words?sp=${letter}*&md=s&max=1000`;
    const settings = {
        method: 'GET'
    };

    // return new Promise((resolve, reject) => {
    //     fetch(url, settings)
    //     .then(response => response.json())
    //     .then(json => {
    //         let rndNum = Math.floor(Math.random() * json.length);
    //         resolve(json[rndNum]);
    //         //return word = json[rndNum];
    //     });

    //});

    const response = await fetch(url, settings);
    let wordData = await response.json();
    let rndNum = Math.floor(Math.random() * wordData.length);
    let selectedWord = await wordData[rndNum];
    return selectedWord;
}

/**
 * Takes a letter,
 * returns a single pseudo-random word that begins with that letter
 * @param {Char} letter 
 */
async function getTargetWord(letter) {

    let modifier;

    let word = await getWord(letter);
    // .then(word => {
    targetWord = word.word;
    let syllables = word.numSyllables;
    if (syllables > 1) {
        modifier = "s";
    }
    else {
        modifier = "";
    }
    console.log("Your target word is " + targetWord);
    console.log("It has " + syllables + " syllable" + modifier);
    getRhymingWords(targetWord, syllables);
    // });
}

function getRhymingWords(targetWord, targetWordSyllables) {

    let rhymingWord;

    const url = `https://api.datamuse.com/words?rel_rhy=${targetWord}`;
    const settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(json => {

            console.log("Your total possible matches: " + json.length);

            if (json.length > 20) {

                // Gets up to maximum of six random words from json response
                for (let i = 0; i < 6; i++) {
                    let rndNum = Math.floor(Math.random() * json.length);
                    // If a word has more than 2 syllables, skip it
                    // (this will result in arrays with a length < 6,
                    // since new words are not found to replace skipped ones...
                    // not sure if that will be a problem)
                    // If our array of rhymingWords already contains a selected word, skip it
                    if (json[rndNum].numSyllables === targetWordSyllables && !rhymingWords.includes(json[rndNum].word)) {
                        rhymingWord = json[rndNum].word;
                        rhymingWords.push(rhymingWord);
                    }
                }

                console.log("You've been matched to " + rhymingWords.length + " words");

                // Require at least 2 matches, otherwise re-run process
                if (rhymingWords.length < 2) {
                    return fishForNewWords();
                }
            }

            // If the json response didn't have at least 20 possible words to pick from,
            // get new words
            else {
                return fishForNewWords();
            }

        })
        .then(function () {
            undrawTarget();
        })
        .then(function () {
            drawTargetWord(targetWord);
        })
        .then(function () {
            logRhymingWords();
        })
        .then(async function () {
            await getDecoyWords(rhymingWords.length);
        })
        .then(function () {
            drawWordSelection(rhymingWords, decoyWords);
        });

}

/**
 * Checks the amount of rhyming words we have,
 * generates the same amount of random non-rhyming words
 * @param {Number} numberOfWords The number of words to find
 */
async function getDecoyWords(numberOfWords) {

    let wordObject;
    let letter;
    let word;

    for (let i = 0; i < numberOfWords; i++) {
        letter = generateRandomLetter();
        wordObject = await getWord(letter);
        word = wordObject.word;

        decoyWords.push(word);

        console.log("Decoy letter " + (i + 1) + " is " + letter + " | Decoy word " + (i + 1) + " is " + word);
    }

    if (decoyWords.length > 0) {
        console.log("");
        console.log("Your decoy word array:");
        console.log("=============");
        decoyWords.forEach(function (word) {
            console.log(word);
        });
        console.log("=============");
        console.log("");
    }
}

function dumpDecoys() {
    decoyWords = [];
}

function dumpRhymes() {
    rhymingWords = [];
}

function dumpAllWords() {
    allWords = [];
}

function logRhymingWords() {
    if (rhymingWords.length >= 2) {
        console.log("");
        console.log("Your rhyming words are:");
        console.log("=============");
        rhymingWords.forEach(function (word) {
            console.log(word);
        });
        console.log("=============");
        console.log("");
    }
}

function fishForNewWords() {
    rhymingWords = [];
    console.log("Uh-oh!");
    console.log("Not enough matches. Fishing for new words...");
    console.log("");
    return getStartingLetter();
}

startButton.addEventListener("click", function () {

    $(".congrats").text("");
    undrawWordSelection();
    dumpRhymes();
    dumpDecoys();
    dumpAllWords();
    getStartingLetter();

});

// INTERACT.JS

// target elements with the "draggable" class
interact('.draggable')
    .draggable({
        // enable inertial throwing
        inertia: true,
        // keep the element within the area of its parent
        restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,

        // call this function on every dragmove event
        onmove: dragMoveListener,
        // call this function on every dragend event
        onend: function (event) {
            var textEl = event.target.querySelector('p');
        }
    });

function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.yes-drop',
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.75,

    // listen for drop related events:
    ondropactivate: function (event) {
        // add active dropzone feedback
        event.target.classList.add('drop-active');
    },
    ondragenter: function (event) {
        var draggableElement = event.relatedTarget,
            dropzoneElement = event.target;

        // feedback the possibility of a drop
        dropzoneElement.classList.add('drop-target');
        draggableElement.classList.add('can-drop');
    },
    ondragleave: function (event) {
        // remove the drop feedback style
        event.target.classList.remove('drop-target');
        event.relatedTarget.classList.remove('can-drop');
    },
    ondrop: function (event) {
        event.relatedTarget.classList.add("bingo");
        if($(".bingo").length >= (allWords.length / 2)) {
            event.target.classList.add("winner");
            $(".congrats").text("Nice work. Try again soon.");
            console.log("Nice work. Try again soon.");
            console.log("");
        }
    },
    ondropdeactivate: function (event) {
        // remove active dropzone feedback
        event.target.classList.remove('drop-active');
        event.target.classList.remove('drop-target');
        // event.relatedTarget.classList.remove("bingo");
    }
});
