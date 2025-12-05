import { en } from "./en";
import { ja } from "./ja";
import { fr } from "./fr";
import { de } from "./de";
import { it } from "./it";
import { es } from "./es";
import { zh } from "./zh";
import type { LangCode, BaseLang } from "./types";

const languages: Record<LangCode, BaseLang> = {
  en,
  ja,
  fr,
  de,
  it,
  es,
  zh,
};

export function getLang(code: LangCode): BaseLang {
  return languages[code] || en;
}

export { languages };

let currentLang: BaseLang = en;

export function setLang(code: LangCode) {
  currentLang = getLang(code);
}

export function getCurrentLang() {
  return currentLang;
}

export const t: BaseLang = new Proxy(
  {},
  {
    get(_target, prop) {
      // @ts-expect-error dynamic access
      return currentLang[prop];
    },
  }
) as BaseLang;
