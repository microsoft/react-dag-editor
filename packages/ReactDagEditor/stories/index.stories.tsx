/* eslint-disable import/no-default-export */
import * as React from "react";
import { FeaturesDemo, NodeFrameCustomization } from "./components/FeaturesDemo";

export default {
  title: "react-dag-editor",
};

export const Features = () => <FeaturesDemo />;

Features.storyName = "features";

export const NodeFrameCustomizationDemo = () => <NodeFrameCustomization />;

NodeFrameCustomizationDemo.storyName = "Custom node frame on dragging";
