/* eslint-disable compat/compat */
import { IBoundingBox, IDriverAdapter } from "./DriverAdapter";

export interface IPosition {
  x: number;
  y: number;
}

export interface IConnectTwoNodesConfig {
  sourceNodeName: string;
  sourcePortName: string;
  targetNodeName: string;
  targetPortName: string;
}

export interface IGraphDomObject {
  bbox: IBoundingBox | null;
  textContent: string | null;
  className: string | null;
  innerHTML: string;
  ariaLabel: string | null;
  automationId: string | null;
}

export interface IGraphObject {
  nodes: IGraphDomObject[];
  edges: IGraphDomObject[];
  ports: IGraphDomObject[];
  nodeTooltips: IGraphDomObject[];
  portTooltips: IGraphDomObject[];
}

export class TestAPI {
  private readonly adapter: IDriverAdapter;

  public constructor(adapter: IDriverAdapter) {
    this.adapter = adapter;
  }

  public async getNodesCount(): Promise<number> {
    return (await this.adapter.selectAll("g[data-automation-id*='node-container-']")).length;
  }

  public async getEdgesCount(): Promise<number> {
    return (await this.adapter.selectAll("g[data-automation-id*='edge-container-']")).length;
  }

  public async addNodeFromItemPanel(options: { itemSelector: string; x: number; y: number }): Promise<void> {
    const addColumnsModuleInPanelElPos = await this.getCentralPosBySelector(options.itemSelector);

    await this.adapter.mouseMove(addColumnsModuleInPanelElPos.x, addColumnsModuleInPanelElPos.y);

    await this.adapter.mouseDown();

    const canvasBBOx = await this.getCanvasBoundingBox();

    await this.adapter.mouseMove(canvasBBOx.x + options.x, canvasBBOx.y + options.y);
    await this.adapter.mouseUp();
  }

  public async connectTwoNodes({
    sourceNodeName,
    sourcePortName,
    targetNodeName,
    targetPortName
  }: IConnectTwoNodesConfig): Promise<void> {
    const sourcePos = await this.getCentralPosBySelector(this.getPortCssSelector(sourceNodeName, sourcePortName));
    await this.adapter.mouseMove(sourcePos.x, sourcePos.y);

    await this.adapter.mouseDown();
    const targetPos = await this.getCentralPosBySelector(this.getPortCssSelector(targetNodeName, targetPortName));
    await this.adapter.mouseMove(targetPos.x, targetPos.y);

    await this.adapter.mouseUp();
  }

  public async draggingNode(nodeName: string, toPosition: IPosition): Promise<void> {
    const nodeCenterPos = await this.getCentralPosBySelector(this.getNodeCssSelector(nodeName));

    await this.adapter.mouseMove(nodeCenterPos.x, nodeCenterPos.y);
    await this.adapter.mouseDown();

    const canvasBBOx = await this.getCanvasBoundingBox();

    await this.adapter.mouseMove(toPosition.x + canvasBBOx.x, toPosition.y + canvasBBOx.y);
  }

  public async rightClickOnNode(nodeName: string): Promise<void> {
    await this.adapter.rightClick(this.getNodeCssSelector(nodeName));
  }
  public async clickOnNode(nodeName: string): Promise<void> {
    await this.adapter.click(this.getNodeCssSelector(nodeName));
  }

  public async hoverOnNode(nodeName: string): Promise<void> {
    await this.adapter.hover(this.getNodeCssSelector(nodeName));
  }

  public async hoverOnPort(nodeName: string, portName: string): Promise<void> {
    await this.adapter.hover(this.getPortCssSelector(nodeName, portName));
  }

  public async hoverOnEdge(edgeId: string): Promise<void> {
    await this.adapter.hover(this.getEdgeCssSelector(edgeId));
  }

  public async getAutoAlignHintLineCount(): Promise<number> {
    return (await this.adapter.selectAll("line.auto-align-hint")).length;
  }

  /**
   * select node(s) with ctrl key
   *
   * @param nodeNames node names to be selected
   */
  public async clickOnNodesWithCtrlKey(nodeNames: string[]): Promise<void> {
    await this.adapter.keyDown("Control");

    for (const name of nodeNames) {
      await this.clickOnNode(name);
    }
    await this.adapter.keyUp("Control");
  }

  public async rightClickOnCanvas(x: number, y: number): Promise<void> {
    await this.adapter.rightClick("svg.react-flow-editor-svg-container", {
      position: { x, y }
    });
  }

  public async selectArea(start: IPosition, end: IPosition): Promise<void> {
    await this.adapter.mouseMove(start.x, start.y);
    await this.adapter.mouseDown();
    await this.adapter.mouseMove(end.x, end.y);
    await this.adapter.mouseUp();
  }

  public async connectWithKeyboard(isCancelConnect = false): Promise<void> {
    // focus to a port
    await this.focusOnCanvasWithKeyboard();
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("Tab");

    // enter connect mode
    await this.adapter.keyDown("Alt");
    await this.adapter.keyPress("c");
    await this.adapter.keyUp("Alt");

    // focus to another port
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("Tab");

    // finish connect or cancel connect
    if (isCancelConnect) {
      await this.adapter.keyPress("Escape");
    } else {
      await this.adapter.keyPress("Enter");
    }
  }

  public async navigateAroundNodesWithKeyboard(): Promise<void> {
    await this.focusOnCanvasWithKeyboard();

    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("ArrowDown");
    await this.adapter.keyPress("ArrowDown");
    await this.adapter.keyPress("ArrowRight");
    await this.adapter.keyPress("ArrowLeft");
  }

  public async navigateBackWithKeyboard(): Promise<void> {
    await this.focusOnCanvasWithKeyboard();

    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("Tab");

    // pressing shift key to navigate back
    await this.adapter.keyDown("Shift");
    await this.adapter.keyPress("Tab");
    await this.adapter.keyUp("Shift");
  }

  public async navigateAroundPortsWithKeyboard(): Promise<void> {
    // focus on canvas
    await this.focusOnCanvasWithKeyboard();

    // navigate to a node
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("ArrowDown");

    // navigate to a port
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("ArrowDown");
    await this.adapter.keyPress("ArrowDown");
  }

  public async goToConnectedPortWithKeyboard(): Promise<void> {
    await this.focusOnCanvasWithKeyboard();

    // navigate to a node
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("ArrowDown");

    // navigate to a port
    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("Tab");

    // go to connected port
    await this.adapter.keyDown("Alt");
    await this.adapter.keyPress("g");
    await this.adapter.keyUp("Alt");
  }

  public async deleteNodeWithKeyboard(): Promise<void> {
    await this.focusOnCanvasWithKeyboard();

    await this.adapter.keyPress("Tab");
    await this.adapter.keyPress("ArrowDown");

    await this.adapter.keyPress("Delete");
  }

  public async panCanvas(from: IPosition, to: IPosition): Promise<void> {
    await this.adapter.mouseMove(from.x, from.y);
    await this.adapter.mouseDown();
    await this.adapter.mouseMove(to.x, to.y);
    await this.adapter.mouseUp();
  }

  public async getElementBoundingBox(cssSelector: string): Promise<IBoundingBox> {
    const el = await this.adapter.waitForSelector(cssSelector);

    const { x = 0, y = 0, height = 0, width = 0 } = (await el.boundingBox()) || {};

    return {
      x,
      y,
      width,
      height
    };
  }

  public async getCanvasBoundingBox(): Promise<IBoundingBox> {
    return this.getElementBoundingBox("svg.react-flow-editor-svg-container");
  }

  public async getMinimapBoundingBox(): Promise<IBoundingBox> {
    const { x, y, height, width } = await this.getElementBoundingBox("svg[data-automation-id*='minimap-id']");

    return {
      x,
      y,
      width,
      height
    };
  }

  public async dragOnItem(start: IPosition, end: IPosition): Promise<void> {
    await this.selectArea(start, end);
  }

  public async getNodeCentralPosition(nodeName: string): Promise<IPosition> {
    const pos = await this.getCentralPosBySelector(this.getNodeCssSelector(nodeName));
    return pos;
  }

  public async getNodes(): Promise<IGraphDomObject[]> {
    return this.getDomElements("g[data-automation-id*='node-container-']");
  }

  public async getEdges(): Promise<IGraphDomObject[]> {
    return this.getDomElements("g[data-automation-id*='edge-container-']");
  }

  public async getPorts(): Promise<IGraphDomObject[]> {
    return this.getDomElements("g[aria-roledescription='port']");
  }

  public async getNodeTooltips(): Promise<IGraphDomObject[]> {
    return this.getDomElements(".node-tooltips");
  }

  public async getPortTooltips(): Promise<IGraphDomObject[]> {
    return this.getDomElements(".port-tooltips");
  }

  public async composeGraph(): Promise<IGraphObject> {
    const nodes = await this.getNodes();
    const edges = await this.getEdges();
    const ports = await this.getPorts();
    const nodeTooltips = await this.getNodeTooltips();
    const portTooltips = await this.getPortTooltips();

    return {
      nodes,
      edges,
      ports,
      nodeTooltips,
      portTooltips
    };
  }

  protected async getCentralPosBySelector(cssSelector: string): Promise<IPosition> {
    return this.getCentralPosByBBox(await this.getElementBoundingBox(cssSelector));
  }

  protected async getDomElements(selector: string): Promise<IGraphDomObject[]> {
    return Promise.all(
      (await this.adapter.selectAll(selector))?.map(async handle => {
        const bbox = await handle.boundingBox();
        const className = await handle.getAttribute("class");
        const innerHTML = await handle.innerHTML();
        const textContent = await handle.textContent();
        const ariaLabel = await handle.getAttribute("aria-label");
        const automationId = await handle.getAttribute("data-automation-id");

        return {
          bbox,
          textContent,
          className,
          innerHTML,
          ariaLabel,
          automationId
        };
      })
    );
  }

  protected getCentralPosByBBox(bbox: IBoundingBox | null): IPosition {
    if (!bbox) {
      return { x: 0, y: 0 };
    }

    return {
      x: bbox.width / 2 + bbox.x,
      y: bbox.height / 2 + bbox.y
    };
  }

  protected getPortCssSelector(nodeName: string, portName: string): string {
    return `g[data-automation-id*='${nodeName}'][data-automation-id*='${portName}'][data-automation-id*='port-']`;
  }

  protected getNodeCssSelector(nodeName: string): string {
    return `g[data-automation-id*='node-container-'][data-automation-id*='${nodeName}']`;
  }

  protected getEdgeCssSelector(edgeId: string): string {
    return `g[data-automation-id*='edge-container-${edgeId}']`;
  }

  protected async focusOnCanvasWithKeyboard(): Promise<void> {
    await this.adapter.keyDown("Alt");
    await this.adapter.keyDown("Shift");
    await this.adapter.keyPress("f");
    await this.adapter.keyUp("Alt");
    await this.adapter.keyUp("Shift");
  }
}
