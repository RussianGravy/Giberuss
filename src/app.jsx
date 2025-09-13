import React, { useEffect, useState } from "react";

export default function App() {
  const [start, setStart] = useState(-1);
  const [end, setEnd] = useState(-1);

  useEffect(() => {
    console.log("start: ", start);
    console.log("end: ", end);
  }, [start, end]);

  const english_to_russian = (word) => {
    var russian = "";
    for (var i = 0; i < word.length; i++) {
      // many checks
      if (word[i] == "v" || word[i] == "в") russian += "в";
      else if (word[i] == "l" || word[i] == "л") russian += "л";
      else if (word[i] == "k" || word[i] == "к") russian += "к";
      else if (word[i] == "a" || word[i] == "а") russian += "а";
      else if (word[i] == "b" || word[i] == "б") russian += "б";
      else if (word[i] == "g" || word[i] == "г") russian += "г";
      else if (word[i] == "d" || word[i] == "д") russian += "д";
      else if (word[i] == "i" || word[i] == "и") russian += "и";
      else if (word[i] == "m" || word[i] == "м") russian += "м";
      else if (word[i] == "n" || word[i] == "н") russian += "н";
      else if (word[i] == "r" || word[i] == "р") russian += "р";
      else if (word[i] == "p" || word[i] == "п") russian += "п";
      else if (word[i] == "t" || word[i] == "т") russian += "т";
      else if (word[i] == "u" || word[i] == "у") russian += "у";
      else if (word[i] == "f" || word[i] == "ф") russian += "ф";
      else if (word[i] == "h" || word[i] == "х") russian += "х";
      else if (word[i] == "e" || word[i] == "е") {
        if (word[i] == "e" && word[i + 1] == "e") {
          russian += "и";
          i += 1;
        } else russian += "е";
      } else if (word[i] == "o" || word[i] == "о") {
        if (word[i] == "o" && word[i + 1] == "o") {
          russian += "у";
          i += 1;
        } else russian += "о";
      } else if (word[i] == "s" || word[i] == "с") {
        if (word[i] == "s" && word[i + 1] == "h") {
          russian += "ш";
          i += 1;
        } else if (word[i] == "s" && word[i + 1] == "z" && word[i + 2] == "h") {
          russian += "щ";
          i += 2;
        } else russian += "с";
      } else if (word[i] == "c" || word[i] == "к") {
        if (word[i] == "c" && word[i + 1] == "h") {
          russian += "ч";
          i += 1;
        } else russian += "к";
      } else if (word[i] == "z" || word[i] == "з") {
        if (word[i] == "z" && word[i + 1] == "h") {
          russian += "ж";
          i += 1;
        } else russian += "з";
      } else if (word[i] == "y" || word[i] == "й" || word[i] == "я") {
        if (word[i] == "y" && word[i + 1] == "a") {
          russian += "я";
          i += 1;
        } else if (word[i] == "я") russian += "я";
        else russian += "й";
      } else if (
        word[i] == " " ||
        word[i] == "?" ||
        word[i] == "." ||
        word[i] == ","
      )
        russian += word[i];
    }
    return russian;
  };

  return (
    <>
      <h1>Gibberuss</h1>
      <input
        onClick={(e) => {
          const pos = e.currentTarget.selectionStart;
          if (pos) {
            setStart(pos);
            setEnd(pos);
          } else {
            setStart(-1);
            setEnd(-1);
          }
        }}
        onChange={async (e) => {
          let inputTag = e.currentTarget;

          let tStart = start;
          let tEnd = end;

          let c = inputTag.value;
          if (c.length == 0) {
            tStart = tEnd = -1;
            setStart(tStart);
            setEnd(tEnd);
            return;
          }

          // user typed a character
          if (c.length > tEnd + 1) {
            tEnd += 1;
            if (tStart == -1) tStart = 0;
          }
          // user backspaced
          else {
            tEnd -= 1;
            if (tEnd < tStart) tStart -= 1;
          }

          if (c[tEnd] == " ") {
            console.log("hit a space!!");
            let old_word = c.substring(tStart, tEnd);
            let new_word = english_to_russian(old_word);
            inputTag.setRangeText(new_word, tStart, tEnd);
            tEnd -= old_word.length - new_word.length;
            tEnd += 1;
            tStart = tEnd;
          }

          setStart(tStart);
          setEnd(tEnd);
        }}
      />
    </>
  );
}

/* 
Two indexes: one at start of word and one at end
Back-space moves End-index backwards. 
Reacing a space marks a new word, start index moves to position of end index.
*/
