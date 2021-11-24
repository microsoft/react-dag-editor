import * as React from "react";
import { MouseEventButton } from "../common/constants";

export function isMouseButNotLeft(e: React.PointerEvent): boolean {
  return e.pointerType === "mouse" && e.button !== MouseEventButton.Primary;
}
