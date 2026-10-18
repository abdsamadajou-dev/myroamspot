import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// NavTabs reads usePathname, which requires an App Router context that jsdom
// does not mount. Hub ("/") is the default so the active-tab test is honest.
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));
