import { english_to_russian } from "./englishToRussianParser";

const isLatin = (ch) => /[A-Za-z''-]/.test(ch);

export const onInput = (e) => {
  const el = e.currentTarget;
  const end = el.selectionEnd ?? 0;

  if (!el.matches("INPUT, TEXTAREA")) {
    console.log("Not an input or text field. Treating as content-editable");
    handleContentEditable(e);
    return;
  }

  const insertedSpace =
    e instanceof InputEvent &&
    e.inputType?.startsWith("insertText") &&
    e.data == " ";

  if (!insertedSpace) return;

  let v = el.value;
  let i = end - 2;

  while (i >= 0 && isLatin(v[i])) i--;
  const start = i + 1;

  const old_word = v.substring(start, end);
  const new_word = english_to_russian(old_word);

  el.setRangeText(new_word, start, end, "end");
};

const handleContentEditable = (e) => {
  const el = e.currentTarget;
  const insertedSpace =
    e instanceof InputEvent &&
    e.inputType?.startsWith("insertText") &&
    e.data == " ";

  if (!insertedSpace) return;

  const v = el.textContent;
  const range = window.getSelection().getRangeAt(0);
  let end = range.endOffset;
  let i = end - 2;

  while (i >= 0 && isLatin(v[i])) i--;
  const start = i + 1;

  console.log(start, end);
  const old_word = v.substring(start, end);
  const new_word = english_to_russian(old_word);
  const textNode = document.createTextNode(new_word);

  console.log(new_word);
  const textRange = document.createRange();
  textRange.setStart(range.startContainer, start);
  textRange.setEnd(range.endContainer, end);
  textRange.deleteContents();
  textRange.insertNode(textNode);
  window.getSelection().removeAllRanges();
  // const afterSpace = document.createRange();
  // afterSpace.setStart(range.startContainer, range.endOffset);
  // afterSpace.collapse(true);
  // window.getSelection().addRange(afterSpace);
};
