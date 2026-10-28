import { english_to_russian } from "./englishToRussianParser";

const isLatin = (ch) => /[A-Za-z''-]/.test(ch);
const isSpace = (ch) => ch === " " || ch === " ";

// start index of the Latin word that ends at `end`
const wordStart = (v, end) => {
  let i = end - 1;
  while (i >= 0 && isLatin(v[i])) i--;
  return i + 1;
};

// Runs when a space is about to be inserted. The space is left alone so the
// page's editor (Lexical on WhatsApp/Instagram, Telegram, etc.) records it
// normally. Afterwards, "word " is selected and replaced with the Russian
// version. If an editor rejects the replacement, the user still keeps the
// space instead of losing it.
export const onBeforeInput = (e, el = e.currentTarget) => {
  if (e.inputType !== "insertText" || e.data !== " ") return;
  if (!findWord(el, false)) return;

  // let the space go in first
  setTimeout(() => {
    const found = findWord(el, true);
    if (!found) return;
    found.select();

    // wait for the editor to see the selection change before replacing it
    setTimeout(() => {
      const ok = insertText(el, english_to_russian(found.word) + " ");
      if (!ok) console.warn("insertText failed", el);
    }, 0);
  }, 0);
};

// execCommand doesn't fire beforeinput, which is the only place Slate
// (Discord) updates its own copy of the text. Without it, Slate's copy and
// the screen disagree and later edits like backspace fail. For Slate, announce
// the insertion with our own beforeinput; Slate cancels it once handled.
const insertText = (el, text) => {
  if (el.closest('[data-slate-editor="true"]')) {
    const handled = !el.dispatchEvent(
      new InputEvent("beforeinput", {
        inputType: "insertText",
        data: text,
        bubbles: true,
        cancelable: true,
        composed: true,
      })
    );
    // falling back to execCommand would break Slate's DOM structure, so
    // leave the word untransliterated instead
    return handled;
  }
  return document.execCommand("insertText", false, text);
};

// Finds the Latin word before the caret. With `afterSpace`, the caret is
// expected to sit right after a space, and the selection covers "word ".
// Returns { word, select } or null if there is nothing to transliterate.
const findWord = (el, afterSpace) =>
  el.matches("INPUT, TEXTAREA")
    ? findWordInTextField(el, afterSpace)
    : findWordInContentEditable(afterSpace);

const locate = (v, end, afterSpace) => {
  if (afterSpace && !isSpace(v[end - 1])) return null;
  const wordEnd = afterSpace ? end - 1 : end;
  const start = wordStart(v, wordEnd);
  if (start === wordEnd) return null;
  return { start, word: v.substring(start, wordEnd) };
};

const findWordInTextField = (el, afterSpace) => {
  const end = el.selectionEnd;
  if (end == null || el.selectionStart !== end) return null;

  const loc = locate(el.value, end, afterSpace);
  if (!loc) return null;

  return {
    word: loc.word,
    select: () => el.setSelectionRange(loc.start, end),
  };
};

const findWordInContentEditable = (afterSpace) => {
  const sel = window.getSelection();
  if (!sel.rangeCount || !sel.isCollapsed) return null;

  // offsets are relative to the caret's text node, so read only that node
  const range = sel.getRangeAt(0);
  const node = range.endContainer;
  if (node.nodeType !== Node.TEXT_NODE) return null;

  const end = range.endOffset;
  const loc = locate(node.data, end, afterSpace);
  if (!loc) return null;

  return {
    word: loc.word,
    select: () => {
      const word = document.createRange();
      word.setStart(node, loc.start);
      word.setEnd(node, end);
      sel.removeAllRanges();
      sel.addRange(word);
    },
  };
};
