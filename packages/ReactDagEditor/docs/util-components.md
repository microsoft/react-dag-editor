# Util components

Util components does not render anything. Use them for various of utility functionalities.

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

### EdgeConfig.render

`render` decides the element to represent an edge.

### EdgeConfig.renderWithTargetHint & EdgeConfig.renderWithSourceHint

In case the target/source node of an edge is outside of the view port while the edge is selected by mouse clicking, a hint will be rendered if this method is provided.

### PortConfig.render

Similar to the render methods in `NodeConfig` / `EdgeConfig`, use `render` for the basic element to represent a port

### PortConfig.getIsConnectable

Returns a boolean value to validate whether a port is connectable when establishing new connectiongs between 2 ports.
