const MAP = {
  shch: "щ", szh: "щ",
  sh: "ш", ch: "ч", zh: "ж", kh: "х",
  ya: "я", yu: "ю", yo: "ё", eh: "э",
  ee: "и", oo: "у", hi: "ы",
  "''": "ъ", "'": "ь",
  a: "а", b: "б", v: "в", g: "г", d: "д", e: "е", z: "з", i: "и",
  y: "й", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", r: "р",
  s: "с", t: "т", u: "у", f: "ф", h: "х", c: "ц",
  x: "кс", w: "в", j: "й", q: "к",
};
// longest sequences first so "shch" wins over "sh" and "s"
const KEYS = Object.keys(MAP).sort((a, b) => b.length - a.length);

export const english_to_russian = (word) => {
  const lower = word.toLowerCase();
  let out = "";
  for (let i = 0; i < word.length; ) {
    const key = KEYS.find((k) => lower.startsWith(k, i));
    if (!key) {
      out += word[i++]; // pass through anything unmapped
      continue;
    }
    let ru = MAP[key];
    if (word[i] !== lower[i]) ru = ru[0].toUpperCase() + ru.slice(1);
    out += ru;
    i += key.length;
  }
  // all-caps input stays all caps
  return word === word.toUpperCase() && word !== lower ? out.toUpperCase() : out;
};
