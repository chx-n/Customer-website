import { describe, expect, it } from "vitest";

import { normalizeSmokeValue } from "./smoke-helper";

describe("test harness", () => {
  it("imports and runs a pure helper", () => {
    expect(normalizeSmokeValue("  Northline  ")).toBe("northline");
  });
});
