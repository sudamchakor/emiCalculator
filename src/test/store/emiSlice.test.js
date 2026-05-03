import emiReducer, { setThemeMode, setCurrency, setAutoSave } from "../../src/store/emiSlice";

describe("emiSlice reducer", () => {
  it("should return the initial state when passed an empty action", () => {
    const initialState = emiReducer(undefined, { type: "" });
    expect(initialState).toBeDefined();
  });

  it("should handle setThemeMode", () => {
    const actual = emiReducer(undefined, setThemeMode("dark"));
    expect(actual.themeMode).toEqual("dark");
  });

  it("should handle setCurrency", () => {
    const actual = emiReducer(undefined, setCurrency("$"));
    expect(actual.currency).toEqual("$");
  });

  it("should handle setAutoSave", () => {
    const actual = emiReducer(undefined, setAutoSave(true));
    expect(actual.autoSave).toEqual(true);
  });
});