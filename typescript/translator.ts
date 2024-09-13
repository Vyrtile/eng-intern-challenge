const englishToBrailleAlphabet: { [key: string]: string } = {
  a: "O.....",
  b: "O.O...",
  c: "OO....",
  d: "OO.O..",
  e: "O..O..",
  f: "OOO...",
  g: "OOOO..",
  h: "O.OO..",
  i: ".OO...",
  j: ".OOO..",
  k: "O...O.",
  l: "O.O.O.",
  m: "OO..O.",
  n: "OO.OO.",
  o: "O..OO.",
  p: "OOO.O.",
  q: "OOOOO.",
  r: "O.OOO.",
  s: ".OO.O.",
  t: ".OOOO.",
  u: "O...OO",
  v: "O.O.OO",
  w: ".OOO.O",
  x: "OO..OO",
  y: "OO.OOO",
  z: "O..OOO",
};

const englishToBrailleNumbers: { [key: string]: string } = {
  "1": "O.....",
  "2": "O.O...",
  "3": "OO....",
  "4": "OO.O..",
  "5": "O..O..",
  "6": "OOO...",
  "7": "OOOO..",
  "8": "O.OO..",
  "9": ".OO...",
  "0": ".OOO..",
};

const englishToBrailleSpecialSymbols: { [key: string]: string } = {
  capitalFollows: ".....O",
  numbersFollow: ".O.OOO",
  space: "......",
};

const brailleToEnglishAlphabet: { [key: string]: string } = {};
for (const [letter, braille] of Object.entries(englishToBrailleAlphabet)) {
  brailleToEnglishAlphabet[braille] = letter;
}

const brailleToEnglishNumbers: { [key: string]: string } = {};
for (const [letter, braille] of Object.entries(englishToBrailleNumbers)) {
  brailleToEnglishNumbers[braille] = letter;
}

const brailleToEnglishSpecialSymbols: { [key: string]: string } = {};
for (const [letter, braille] of Object.entries(
  englishToBrailleSpecialSymbols
)) {
  brailleToEnglishSpecialSymbols[braille] = letter;
}

class Translator {
  translateToBraille(input: string): string {
    let result: string = "";
    let doesNumberFollow = false;

    for (const char of input) {
      if (char.match(/[a-z]/)) {
        result += englishToBrailleAlphabet[char];
      } else if (char.match(/[A-Z]/)) {
        result += englishToBrailleSpecialSymbols.capitalFollows;
        result += englishToBrailleAlphabet[char.toLowerCase()];
      } else if (char.match(/[0-9]/) && !doesNumberFollow) {
        doesNumberFollow = true;
        result += englishToBrailleSpecialSymbols.numbersFollow;
        result += englishToBrailleNumbers[char];
      } else if (char.match(/[0-9]/)) {
        result += englishToBrailleNumbers[char];
      } else if (char === " ") {
        result += englishToBrailleSpecialSymbols.space;
        doesNumberFollow = false;
      }
    }
    return result;
  }

  translateToEnglish(input: string): string {
    let result: string = "";
    let isNextLetterCapitalized: boolean = false;
    let doesNumberFollow: boolean = false;
    for (let i = 0; i < input.length; i += 6) {
      const addedChar = input.substring(i, i + 6);

      if (
        brailleToEnglishAlphabet.hasOwnProperty(addedChar) &&
        !doesNumberFollow
      ) {
        if (isNextLetterCapitalized) {
          result += brailleToEnglishAlphabet[addedChar].toUpperCase();
          isNextLetterCapitalized = false;
        } else {
          result += brailleToEnglishAlphabet[addedChar];
        }
      } else if (brailleToEnglishNumbers.hasOwnProperty(addedChar)) {
        result += brailleToEnglishNumbers[addedChar];
      } else if (addedChar === ".....O") {
        isNextLetterCapitalized = true;
      } else if (addedChar === "......") {
        result += " ";
        doesNumberFollow = false;
      } else if (addedChar === ".O.OOO") {
        doesNumberFollow = true;
      }
    }
    return result;
  }
}

function main(argv: string[]) {
  const input = argv.slice(2).join(" ");
  const translator = new Translator();

  let output: string;

  if (input.match(/^[O\.]+$/)) {
    output = translator.translateToEnglish(input);
  } else {
    output = translator.translateToBraille(input);
  }
  console.log(output);
}

main(process.argv);
