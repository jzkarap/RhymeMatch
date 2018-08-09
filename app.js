// https://www.datamuse.com/api/

let targetWord;
let rhymingWords = [];

const choices = document.querySelector(".choices");

for (let i = 0; i < 8; i++) {
    createWordDivs();
}

function generateWords() {

    let array = [];

    for (let i = 0; i < 8; i++) {
        array.push("test");
    }

    return array;
}

function createWordDivs() {

    let test = document.createElement("p");
    test.textContent = "hello world";
    choices.appendChild(test);
}

// At each button press,
// Genereate a random letter,
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

/**
 * Generates a random number 0-25,
 * Gets a letter from alphabet based on that number
 * (replaces broken API call from above)
 */
function getRandomLetter() {
    let rndNum = Math.floor(Math.random() * 26);
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let letter = alphabet[rndNum];
    console.log("Your starting letter is " + letter);

    getTargetWord(letter);
}

/**
 * Takes a letter,
 * returns a quasi-random word that begins with that letter
 * @param {Char} letter 
 */
function getTargetWord(letter) {
    let word;
    let syllables = 0;
    let modifier;
    const url = `https://api.datamuse.com/words?sp=${letter}*&md=s&max=1000`;
    const settings = {
        method: 'GET'
    };

    fetch(url, settings)
        .then(response => response.json())
        .then(json => {
            let rndNum = Math.floor(Math.random() * json.length);
            word = json[rndNum].word;
            syllables = json[rndNum].numSyllables;
            if(syllables > 1) {
                modifier = "s";
            }
            else {
                modifier = "";
            }
            console.log("Your target word is " + word);
            console.log("It has " + syllables + " syllable" + modifier);
            getRhymingWords(word, syllables);
        });
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
            if (rhymingWords.length >= 2) {
                console.log("Your rhyming words are:");
                console.log("=============");
                rhymingWords.forEach(function (word) {
                    console.log(word);
                });
                console.log("=============");
            }
        });
}

getRandomLetter();

function fishForNewWords() {
    rhymingWords = [];
    console.log("Uh-oh!");
    console.log("Not enough matches. Fishing for new words...");
    console.log("");
    return getRandomLetter();
}