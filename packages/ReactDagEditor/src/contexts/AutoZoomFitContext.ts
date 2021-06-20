import { createContext, MutableRefObject } from "react";

export const AutoZoomFitContext = createContext<MutableRefObject<boolean>>({ current: false });
