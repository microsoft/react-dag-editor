import * as React from "react";
import { isMacOs } from "./browsers";

export type AcceptedEvents = React.KeyboardEvent | React.MouseEvent | KeyboardEvent | MouseEvent;

export const metaControl = (e: AcceptedEvents) => (isMacOs ? e.metaKey : e.ctrlKey);

export const checkIsMultiSelect = (e: AcceptedEvents) => e.shiftKey || metaControl(e);
