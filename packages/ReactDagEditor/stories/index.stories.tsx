/* eslint-disable import/no-default-export */
import * as React from "react";
import { CommonToolbar } from "./components/CommonToolbar";
import { FeaturesDemo } from "./components/FeaturesDemo";
import { NodeFrameCustomization, NodeResizeHandlerCustomization } from "./components/WidgetsCustomization";

export default {
  title: "react-dag-editor",
};

export const Features = () => <FeaturesDemo />;

Features.storyName = "features";

export const NodeFrameCustomizationDemo = () => <NodeFrameCustomization />;

NodeFrameCustomizationDemo.storyName = "Custom Widgets/Node frame on dragging";

export const NodeResizeHandlerCustomizationDemo = () => <NodeResizeHandlerCustomization />;

NodeResizeHandlerCustomizationDemo.storyName = "Custom Widgets/Node reize handler on double-clicking on node";

export const ToolbarDemo = () => <CommonToolbar />;

ToolbarDemo.storyName = "A simple toolbar sample";
