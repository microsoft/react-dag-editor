# Util components

Util components does not render anything. Use them for various of utility functionalities.

## `RegisterNode`

By using `RegisterNode` you can link the NodeConfig specified by "name" to the nodes in data by the field "shape".

### NodeConfig.render

render decides the element to represent a node.

### NodeConfig.renderDummy

While dragging node from one place to another, you'd like to render just a frame instead of every detail of the node for better performance. Use this method to render that.

### NodeConfig.renderStatic

We use this to render a node in `Minimap`

### NodeConfig.renderTooltips

The hover view for a node

### NodeConfig.getMinWidth && NodeConfig.geMinHeight

The min height/width constraint for node resizing.

## `RegisterNode` props

```typescript
interface IRegisterNodeProps {
  /**
   * Name of the custom node. The "shape" in your node model should have been registered as the name here.
   */
  name: string;
  /**
   * The config could be a class that implements IRectConfig<ICanvasNode>
   */
  config: IRectConfig<ICanvasNode>;
}
```

## `RegisterEdge`
