# Util components

Util components does not render anything. Use them for various of utility functionalities.

## `RegisterNode`

By using `RegisterNode` you can link the NodeConfig specified by "name" to the nodes in data by the field "shape".

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

## `RegisterEdge`

By using `RegisterEdge` you can link the EdgeConfig specified by "name" to the nodes in data by the field "shape".

## `RegisterEdge` props

```typescript
export interface IRegisterEdgeProps {
  /**
   * Name of the custom edge. The "shape" in your edge model should have been registered as the name here.
   */
  name: string;
  /**
   * The config could be a class that implements IEdgeConfig
   */
  config: IEdgeConfig;
}
```

### EdgeConfig.render

`render` decides the element to represent an edge.

### EdgeConfig.renderWithTargetHint & EdgeConfig.renderWithSourceHint

In case the target/source node of an edge is outside of the view port while the edge is selected by mouse clicking, a hint will be rendered if this method is provided.

## `RegisterPort`

Similar to `RegisterNode` and `RegisterPort`, use this to customize the port elements.

## `RegisterPort` props

```typescript
interface IRegisterPortProps {
  /**
   * Name of the custom port. The "shape" in your port model should have been registered as the name here.
   */
  name: string;
  /**
   * The config could be a class that implements IPortConfig
   */
  config: IPortConfig;
}
```

### PortConfig.render

Similar to the render methods in `NodeConfig` / `EdgeConfig`, use `render` for the basic element to represent a port

### PortConfig.getIsConnectable

Returns a boolean value to validate whether a port is connectable when establishing new connectiongs between 2 ports.
