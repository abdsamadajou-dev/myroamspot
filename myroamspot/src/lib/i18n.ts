import fr from "../../dictionaries/fr.json";
import de from "../../dictionaries/de.json";

export type Locale = "fr" | "de";
export type Dictionary = typeof fr;

const dicts = { fr, de } as Record<Locale, Dictionary>;

export function getDictionary(locale: Locale): Dictionary {
  return dicts[locale];
}

export function t(dict: Dictionary, key: string): string {
  const value = key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[part];
    return undefined;
  }, dict);
  if (typeof value !== "string") throw new Error(`Missing i18n key: ${key}`);
  return value;
}
