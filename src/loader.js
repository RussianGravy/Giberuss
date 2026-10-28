import { onBeforeInput } from "./eventHandlers";

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

  // listening on window in the capture phase runs before any of the page's own
  // beforeinput handlers, so the space can be cancelled before the editor sees it
  function onBeforeInputCapture(e) {
    const target = e.composedPath ? e.composedPath()[0] : e.target;
    if (!qualify(target)) return;
    onBeforeInput(e, target);
  }

  const enable = () => {
    console.log("toggle on");
    window.addEventListener("beforeinput", onBeforeInputCapture, {
      capture: true,
    });
  };

  const disable = () => {
    console.log("toggle off");
    window.removeEventListener("beforeinput", onBeforeInputCapture, {
      capture: true,
    });
  };

  chrome?.storage?.session
    ?.get("isActive")
    .then(({ isActive }) => {
      console.log(isActive);
      if (Number(isActive) === 1) enable();
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
