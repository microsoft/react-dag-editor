# Work in progress

# react-dag-editor

## Overview

React component to create graphic user interface with:

- draggable nodes with ports and edges on a directed graph editor.
- extensibility to customize the widgets or behaviors.
- accessbility and testability support

## About the name "react-dag-editor"

- react: it is a react component created from scratch.
- dag: directed acyclic graph editor. Our a11y solution assumes the graph is a DAG. If you intend to turn off the a11y features, it is fine to draw undirected or cyclic graph with this component.
- editor: it supports readonly graphic data visualization. However the reason you choose this library is the highlight in the user interaction to create/edit a graph.

## Demo

### Online sample link: WIP

### Local demo

Follow the steps below to run local demo on your machine(MacOS/Linux/Windows):

1. Clone the repository
2. Run "yarn" to install all dependencies.
3. Run "yarn start" and select the "react-dag-editor" in prompt selection.
4. It won't take long to load the sample page. If not, try to open localhost:5000 on your browser or submit an issue.
5. Checkout ./packages/ReactDagEditor/stories/components/FeatureDemo.tsx for api usage(Detail API Doc WIP)

## Features

| Feature                         | Description                                                      | Demo  | Is in default feature set? | Is in read only mode feature set? |
| ------------------------------- | ---------------------------------------------------------------- | ----- | -------------------------- | --------------------------------- |
| GraphFeatures.nodeDraggable     | Node drag-and-drop to relocate                                   | (WIP) | Yes                        | Yes                               |
| GraphFeatures.nodeResizable     | Double clicking on a node to enable the anchors to resize it     | (WIP) | Yes                        | Yes                               |
| GraphFeatures.clickNodeToSelect | Node click-to-select                                             | (WIP) | Yes                        | Yes                               |
| GraphFeatures.panCanvas         | Drag-n-drop on canvas to pan                                     | (WIP) | Yes                        | Yes                               |
| GraphFeatures.multipleSelect    | Ctrl click multi selection                                       | (WIP) | Yes                        | Yes                               |
| GraphFeatures.lassoSelect       | Lasso select                                                     | (WIP) | Yes                        | Yes                               |
| GraphFeatures.delete            | Use delete key to delete a node                                  | (WIP) | Yes                        | No                                |
| GraphFeatures.addNewNodes       | Adding new nodes                                                 | (WIP) | Yes                        | No                                |
| GraphFeatures.addNewEdges       | Adding new edges                                                 | (WIP) | Yes                        | No                                |
| GraphFeatures.addNewPorts       | Adding new ports                                                 | (WIP) | Yes                        | No                                |
| GraphFeatures.sidePanel,        | Built-in side panel                                              | (WIP) | Yes                        | Yes                               |
| GraphFeatures.autoFit           | Auto pan/zoom the whole canvas to fit the viewport on every move | (WIP) | No                         | No                                |
| GraphFeatures.editNode          | Node inline editing mode                                         | (WIP) | Yes                        | No                                |
| GraphFeatures.autoAlign         | Auto aligning hint on node drag-n-drop                           | (WIP) | Yes                        | No                                |
| GraphFeatures.undoStack         | Undo stack to support undo/redo                                  | (WIP) | Yes                        | No                                |
| GraphFeatures.ctrlKeyZoom       | Zooming by ctrl clicking + mousewheel                            | (WIP) | Yes                        | Yes                               |
| GraphFeatures.limitBoundary     | Constraint the allowed drag-n-drop area                          | (WIP) | Yes                        | Yes                               |

## compatibility

### Touch screen/touch pad support

### Deceeded rendering on old browsers

## Extensibility & customization

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
