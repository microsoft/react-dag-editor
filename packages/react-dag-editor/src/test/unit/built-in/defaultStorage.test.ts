import { DefaultStorage } from "../../../lib/built-in";

describe("DefaultStorage", () => {
  it("manipulate storage as expected", () => {
    const storage: Storage = new DefaultStorage();

    expect(storage.length).toBe(0);

    storage.setItem("s_key", "some_data");
    storage.setItem("s_key2", "some_data2");
    expect(storage.length).toBe(2);
    expect(storage.getItem("s_key")).toBe("some_data");

    storage.removeItem("s_key");
    expect(storage.getItem("s_key")).toBe(null);

    storage.clear();
    expect(storage.length).toBe(0);
  });
});
