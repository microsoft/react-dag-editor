import { useContext } from "react";
import type { ILine } from "../components/Line";
import { ViewportContext } from "../contexts";
import { AlignmentLinesContext } from "../contexts/AlignmentLinesContext";
import { ConnectingStateContext, IConnectingStateContext } from "../contexts/ConnectingStateContext";
import { GraphConfigContext } from "../contexts/GraphConfigContext";
import { GraphControllerContext } from "../contexts/GraphControllerContext";
import { IVirtualizationContext, VirtualizationContext } from "../contexts/VirtualizationContext";
import type { GraphController } from "../controllers/GraphController";
import type { IGraphConfig } from "../models/config/types";
import type { IViewport } from "../models/geometry";

export function useGraphConfig(): IGraphConfig {
  return useContext(GraphConfigContext);
}

export function useGraphController(): GraphController {
  return useContext(GraphControllerContext);
}

export function useViewport(): IViewport {
  return useContext(ViewportContext);
}

export function useAlignmentLines(): readonly ILine[] {
  return useContext(AlignmentLinesContext);
}

export function useConnectingState(): IConnectingStateContext {
  return useContext(ConnectingStateContext);
}

export function useVirtualization(): IVirtualizationContext {
  return useContext(VirtualizationContext);
}
