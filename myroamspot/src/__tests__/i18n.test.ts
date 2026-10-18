import { describe, it, expect } from "vitest";
import { getDictionary, t } from "../lib/i18n";

describe("i18n", () => {
  it("loads the French dictionary", () => {
    expect(getDictionary("fr").site.name).toBe("MyRoamSpot");
  });
  it("throws on a missing key", () => {
    const dict = getDictionary("fr");
    expect(() => t(dict, "does.not.exist")).toThrow(/missing/i);
  });
});
