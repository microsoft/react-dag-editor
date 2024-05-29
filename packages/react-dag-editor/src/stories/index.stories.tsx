/* eslint-disable import/no-default-export */
import { BackgroundCustomization } from "./components/BackgroundCustomization";
import { FeaturesDemo } from "./components/FeaturesDemo";
import { OutlineDragAndDrop } from "./components/OutlineDragAndDrop";
import { NodeFrameCustomization, NodeResizeHandlerCustomization } from "./components/WidgetsCustomization";

export default {
  title: "react-dag-editor",
};

export const Features = () => <FeaturesDemo />;

Features.storyName = "features";

export const NodeFrameCustomizationDemo = () => <NodeFrameCustomization />;

NodeFrameCustomizationDemo.storyName = "Custom Widgets/Node frame on dragging";

export const NodeResizeHandlerCustomizationDemo = () => <NodeResizeHandlerCustomization />;

NodeResizeHandlerCustomizationDemo.storyName = "Custom Widgets/Node resize handler on double-clicking on node";

export const BackgroundCustomizationDemo = () => <BackgroundCustomization />;

BackgroundCustomizationDemo.storyName = "Custom background";

export const OutlineDragAndDropDemo = () => <OutlineDragAndDrop />;

OutlineDragAndDropDemo.storyName = "Outline drag and drop";
