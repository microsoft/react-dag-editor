import { createContext } from "react";
import { DEFAULT_TRANSFORM_MATRIX, IViewport } from "../models/viewport";

const dummyViewport: IViewport = {
  transformMatrix: DEFAULT_TRANSFORM_MATRIX
};

export const ViewportContext = createContext<IViewport>(dummyViewport);
