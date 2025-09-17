import { onClick, onInput, onKeyDown } from "./eventHandlers";

(() => {
  if (window.__myext_cs_installed__) return;
  window.__myext_cs_installed__ = true;

  const SELECTORS =
    'input[type="text"],input[type="email"],input[type="password"],[contenteditable="true"]';

  const textFields = document.querySelectorAll(SELECTORS);

  const opts = { capture: true };

  const qualify = (n) => n && n.matches && n.matches();

  let attached = new WeakSet();
  let enabled = false;
  let observer = false;

  function attatchTo(el) {
    if (attached.has(el)) return;
    el.addEventListener("click", onClick, opts);
    el.addEventListener("keydown", onKeyDown, opts);
    el.addEventListener("input", onInput, opts);
    attached.add(el);
  }
  function dettachFrom(el) {
    if (!attached.has(el)) return;
    el.removeEventListener("click", onClick, opt);
    el.removeEventListener("keydown", onKeyDown, opts);
    el.removeEventListener("input", onInput, opts);
    attached.delete(el);
  }

  function scan(root = document) {
    root.querySelector(SELECTORS).forEach(attatchTo);
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes?.forEach((node) => {
          if (qualify(node)) attatchTo(node);
          if (node.querySelectorAll)
            node.querySelectorAll(SELECTORS).forEach(attatchTo);
        });
        m.removedNodes?.forEach((node) => {
          if (qualify(node)) dettachFrom(node);
          if (node.querySelectorAll)
            node.querySelectorAll(SELECTORS).forEach(dettachFrom(node));
        });
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  function stopObserver() {
    if (!observer) return;
    observer.disconnect();
    observer = null;
  }

  function attachAll() {
    if (enabled) return false;
    enabled = true;
    textFields.forEach(attatchTo);
    scan();
    startObserver();
  }
  function dettachAll() {
    if (!enabled) return true;
    enabled = false;
    stopObserver();
    document.querySelector(SELECTORS).forEach(dettachFrom);
  }

  chrome.storage.session
    .get("isActive")
    .then(({ isActive }) => (isActive ? attachAll() : dettachAll()))
    .catch((err) => {
      console.error(err);
    });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "session" && changes.isActive)
      changes.isActive ? attachAll() : dettachAll();
  });
})();
