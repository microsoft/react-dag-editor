# react-flow-editor

## Overview

React component to create graphic user interface with:

- draggable nodes with ports and edges on a directed graph editor.
- extensibility to customize the widgets or behaviors.
- accessbility and testability support

## About the name "react-flow-editor"

- react: it is a react component created from scratch.
- flow: directed acyclic graph editor. Our a11y solution assumes the graph is a DAG. If you intend to turn off the a11y features, it is fine to draw undirected or cyclic graph with this component.
- editor: it supports readonly graphic data visualization. However the reason you choose this library is the highlight in the user interaction to create/edit a graph.

## Installation

Currently Microsoft only. You need to connect to [this feed](https://msdata.visualstudio.com/Vienna/_packaging?_a=feed&feed=vienna-shared-ux)

```
npm install react-flow-editor-engine --save
```

Or

```
yarn add react-flow-editor-engine
```

If you don't have the following peerDependencies, make sure to install them:

```
npm install react react-dom --save
```

Or

```
yarn add react react-dom
```

## [Migration Guide](./docs/migration-guide.md)

## Usage

Have to wrapped by `<Engine />`

Please refer to the following example which covers the most common components:

```jsx
<Engine theme={theme} setTheme={setTheme}>
  <RegisterNode name="module" config={withDefaultPortsPosition(new ModuleNodeBase())} />
  <RegisterPort name="modulePort" config={modulePort} />
  <RegisterEdge name={"customEdge"} config={new CustomEdgeConfig(propsApi)} />
  <RegisterClipboard clipboard={clipboard} />
  <RegisterPanel name={"overview"} config={overviewPanel} />
  <RegisterPanel name={"node"} config={new NodePanel(propsApi)} />
  <RegisterPanel name={"port"} config={new PortPanel()} />
  <GraphStateStore
    propsAPIRef={propsAPIRef}
    data={React.useMemo(() => GraphModel.fromJSON(props.initData), [props.initData])}
  >
    <Stack horizontal={true}>
      <Stack.Item>
        <Item key={m.id} model={m} nodeWillAdd={nodeWillAdd} nodeDidAdd={nodeDidAdd}>
          {m.name}
        </Item>
      </Stack.Item>
      <Stack.Item>
        <Graph
          svgRef={svgRef}
          onEvent={onEvent}
          propsAPIRef={propsAPIRef}
          styles={graphStyles}
          defaultNodeShape="module"
          defaultPortShape="modulePort"
          defaultEdgeShape="customEdge"
          canvasMouseMode={props.canvasMouseMode}
          getPositionFromEvent={getPositionFromEvent}
          getNodeAriaLabel={getNodeAriaLabel}
          getPortAriaLabel={getPortAriaLabel}
          features={props.features}
          canvasBoundaryPadding={200}
        />
      </Stack.Item>
    </Stack>
    {isMinimapVisible && (
      <Minimap
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          border: `1px solid ${theme.buttonBorder}`,
          height: 300,
          width: 418
        }}
        onRenderUnavailable={onMinimapRenderUnavailable}
        shadowPadding={0}
        renderArrow={renderArrow}
      />
    )}
    <ContextMenu />
  </GraphStateStore>
</Engine>
```

### Engine

The container component. All the other components should be a child component of its.

### Item

Item is something can be dragged into the graph editor and dropped as a new node.

### RegisterNode

Register custom node. Specify the "shape" in your node model to use your custom node.

### RegisterEdge

Register custom edge. Specify the "shape" in your edge model to use your custom edge.

### RegisterPort

Register custom port. Specify the "shape" in your edge model to use your custom port.
