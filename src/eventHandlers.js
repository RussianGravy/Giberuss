import { english_to_russian } from "./englishToRussianParser";

let start = 0;
const setStart = (s) => {
  start = s;
};

export const onClick = (e) => {
  const pos = e.currentTarget.selectionStart;
  if (pos) {
    setStart(pos);
  } else {
    setStart(0);
  }
};

export const onKeyDown = (e) => {
  if (
    e.key == "ArrowUp" ||
    e.key == "ArrowDown" ||
    e.key == "ArrowLeft" ||
    e.key == "ArrowRight"
  ) {
    const pos = e.currentTarget.selectionStart;
    if (pos) {
      setStart(pos);
    } else {
      setStart(0);
    }
  } else if (e.key == "BackSpace") {
    setStart(start - 1);
  }
};

export const onInput = (e) => {
  let inputTag = e.currentTarget;

  let tStart = start;

  console.log(e.data, tStart, inputTag.selectionEnd);

  if (e.data == " ") {
    console.log("hit a space!!");
    let old_word = inputTag.value.substring(tStart, inputTag.selectionEnd);
    let new_word = english_to_russian(old_word);
    console.log(old_word, new_word);
    inputTag.setRangeText(new_word, tStart, inputTag.selectionEnd, "end");
    tStart = inputTag.selectionEnd;
  }
  console.log(inputTag.selectionStart, inputTag.selectionEnd);
  setStart(tStart);
};
