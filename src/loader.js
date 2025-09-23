// minimal, focused-only wiring
import { onInput } from "./eventHandlers";

(() => {
  if (window.__myext_cs_installed__) return;
  window.__myext_cs_installed__ = true;

  const SELECTORS = [
    "input:not([type])",
    'input[type="text" i]',
    'input[type="search" i]',
    'input[type="email" i]',
    'input[type="password" i]',
    "textarea",
    '[contenteditable]:not([contenteditable="false"])',
  ].join(",");

  let currentEl = null;

  const isElement = (n) => n && n.nodeType === Node.ELEMENT_NODE;

  const isEditable = (el) => {
    if (!isElement(el)) return false;
    if (el.matches?.("[contenteditable]")) {
      const ce = el.getAttribute("contenteditable");
      return ce !== "false";
    }
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      return !el.disabled && !el.readOnly;
    }
    return false;
  };

  const isVisible = (el) => {
    const cs = el.ownerDocument?.defaultView?.getComputedStyle?.(el);
    return !cs || (cs.visibility !== "hidden" && cs.display !== "none");
  };

  const qualify = (el) =>
    isElement(el) && el.matches?.(SELECTORS) && isEditable(el) && isVisible(el);

  function onFocusIn(e) {
    console.log("New element in focus");
    const target = e.composedPath ? e.composedPath()[0] : e.target;
    if (target === currentEl || !qualify(target)) return; // already attached
    currentEl = target;
    console.log(target, " QUALIFIES!");
    currentEl.addEventListener("input", onInput, { capture: true });
  }

  const enable = () => {
    console.log("toggle on");
    window.addEventListener("focusin", onFocusIn, { capture: true });
  };

  const disable = () => {
    console.log("toggle off");
    window.removeEventListener("focusin", onFocusIn, { capture: true });
    currentEl?.removeEventListener("input", onInput, { capture: true });
    currentEl = null;
  };

  chrome?.storage?.session
    ?.get("isActive")
    .then(({ isActive }) => {
      console.log(isActive);
      if (isActive) enable();
      else disable();
    })
    .catch(() => {});

  chrome?.storage?.onChanged?.addListener((changes, area) => {
    if (area === "session" && changes.isActive) {
      console.log(changes.isActive, changes.isActive.newValue);
      Number(changes.isActive.newValue) ? enable() : disable();
    }
  });
})();
