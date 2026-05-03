import taxReducer, {
  updateAge,
  updateSettings,
  updateHouseProperty,
  addDynamicRow,
  deleteDynamicRow,
  updateMonthData,
} from "../../src/store/taxSlice";

describe("taxSlice reducer", () => {
  it("should return the initial state when passed an empty action", () => {
    const initialState = taxReducer(undefined, { type: "" });
    expect(initialState).toBeDefined();
  });

  it("should handle updateAge", () => {
    const actual = taxReducer(undefined, updateAge(45));
    expect(actual.age).toEqual(45);
  });

  it("should handle updateSettings", () => {
    const initialState = taxReducer(undefined, { type: "" });
    const actual = taxReducer(initialState, updateSettings({ isMetro: "Yes" }));
    expect(actual.settings.isMetro).toEqual("Yes");
  });

  it("should handle updateHouseProperty", () => {
    const actual = taxReducer(undefined, updateHouseProperty({ interest: 150000 }));
    expect(actual.houseProperty.interest).toEqual(150000);
  });

  it("should handle addDynamicRow", () => {
    const initialState = taxReducer(undefined, { type: "" });
    const actual = taxReducer(initialState, addDynamicRow({ type: "income", label: "Freelance" }));
    expect(actual.dynamicRows.income.length).toBe(2); // 1 default + 1 new
    expect(actual.dynamicRows.income[1].label).toEqual("Freelance");
  });

  it("should handle deleteDynamicRow", () => {
    const initialState = taxReducer(undefined, { type: "" });
    // Default state contains 'misc1'
    const actual = taxReducer(initialState, deleteDynamicRow({ type: "income", id: "misc1" }));
    expect(actual.dynamicRows.income.length).toBe(0);
  });

  it("should handle updateMonthData and properly target a specific month", () => {
    const initialState = taxReducer(undefined, { type: "" });
    const actual = taxReducer(initialState, updateMonthData({ index: 0, field: "basic", value: 50000, populateRemaining: false }));
    expect(actual.salaryMonths[0].basic).toEqual(50000);
    expect(actual.salaryMonths[1].basic).toEqual(0); // Should not affect the next month when populateRemaining is false
  });
});