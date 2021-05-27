import { debounce } from "../../src/utils/debounce";

jest.useFakeTimers("modern");

describe("test debounce", () => {
  it("should work", () => {
    let result = 0;
    const fn = jest.fn(() => result++);
    const debouncedFn = debounce(fn, 1000);
    expect(fn).toHaveBeenCalledTimes(0);

    debouncedFn();
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(999);
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    jest.advanceTimersByTime(1);

    expect(result).toBe(1);
  });

  it("should use latest value", () => {
    let result = 0;
    const fn = jest.fn((value: number) => {
      result = value;
    });
    const debouncedFn = debounce(fn, 1000);
    expect(fn).toHaveBeenCalledTimes(0);

    debouncedFn(1);
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(500);
    debouncedFn(2);
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(500);
    debouncedFn(3);
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(500);
    debouncedFn(4);
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe(4);
  });

  it("should work with multiple call", () => {
    let result = 0;
    const fn = jest.fn(() => result++);
    const debouncedFn = debounce(fn, 1000);
    expect(fn).toHaveBeenCalledTimes(0);

    debouncedFn();
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(999);
    expect(fn).toHaveBeenCalledTimes(0);

    debouncedFn();
    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1);

    expect(result).toBe(1);

    debouncedFn();
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(999);
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(fn).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(2);

    expect(result).toBe(2);
  });

  it("should work with maxWait", () => {
    let result = 0;
    const fn = jest.fn((value: number) => {
      result = value;
    });
    const debouncedFn = debounce(fn, 1000, { maxWait: 3000 });
    expect(fn).toHaveBeenCalledTimes(0);

    debouncedFn(1);
    expect(fn).toHaveBeenCalledTimes(0);

    for (let i = 0; i < 5; ++i) {
      jest.advanceTimersByTime(500);
      debouncedFn(2);
      expect(fn).toHaveBeenCalledTimes(0);
    }

    jest.advanceTimersByTime(500);
    debouncedFn(3);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(result).toBe(3);

    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(1);

    debouncedFn(4);
    expect(fn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(fn).toHaveBeenCalledTimes(2);

    expect(result).toBe(4);
  });
});
