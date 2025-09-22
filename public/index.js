import { onInput } from "../src/eventHandlers";

console.log("well you're in the bundle");

const toggle = document.querySelector("#toggle");
const textInput = document.querySelector('input[type="text"]');
const copyButton = document.querySelector("#copy");

const triggerGlow = () => {
  textInput.classList.remove("glow");
  void textInput.offsetWidth; // forces reflow
  textInput.classList.add("glow");
};

const onClick = () => {
  navigator.clipboard.writeText(textInput.value).then(triggerGlow);
};

chrome.storage.session.setAccessLevel({
  accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
});

onload = async () => {
  const { isActive } = await chrome.storage.session.get("isActive");
  if (isActive == undefined) {
    console.log("isActive not in the database. Initalizing to false");
    chrome.storage.session.set({ isActive: 0 });
    toggle.value = 0;
  } else {
    console.log("isActive is in the database. Toggling it.");
    toggle.value = isActive;
  }
};

// store this in a way that's accessible to loader
toggle.addEventListener("change", async (e) => {
  chrome.storage.session.set({ isActive: toggle.value });
  console.log(toggle.value);
  console.log("toggleing to ", toggle.value);
});

document.querySelector('input[type="text"]').addEventListener("input", onInput);

copyButton.addEventListener("click", onClick);
