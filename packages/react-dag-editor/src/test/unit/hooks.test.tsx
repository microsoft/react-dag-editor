import * as React from "react";
import { act, renderIntoDocument } from "react-dom/test-utils";
import { useDeferredValue } from "../../lib/hooks/useDeferredValue";

interface IUseDeferredValueRef {
  getValue(): number;
  setValue(value: number): void;
}

it("test useDeferredValue", () => {
  jest.useFakeTimers();

  const App = React.forwardRef<IUseDeferredValueRef>((_, ref) => {
    const [state, setState] = React.useState(0);
    const value = useDeferredValue(state, { timeout: 200 });
    React.useImperativeHandle(
      ref,
      () => ({
        getValue(): number {
          return value;
        },
        setValue(nextValue: number): void {
          setState(nextValue);
        },
      }),
      [value, setState]
    );
    return null;
  });

  const appRef = React.createRef<IUseDeferredValueRef>();
  renderIntoDocument(<App ref={appRef} />);
  expect(appRef.current?.getValue()).toBe(0);
  act(() => {
    appRef.current?.setValue(1);
  });
  expect(appRef.current?.getValue()).toBe(0);
  act(() => {
    jest.runAllTimers();
  });
  expect(appRef.current?.getValue()).toBe(1);
});
