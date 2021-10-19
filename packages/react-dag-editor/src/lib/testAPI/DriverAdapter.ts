export interface IBoundingBox {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface IDomElement {
  boundingBox(): Promise<IBoundingBox | null>;
  textContent(): Promise<null | string>;
  getAttribute(name: string): Promise<null | string>;
  innerHTML(): Promise<string>;
}

export interface IClickOptions {
  position?: {
    x: number;
    y: number;
  };
}

export interface IDriverAdapter {
  selectAll(cssSelector: string): Promise<IDomElement[]>;
  select(cssSelector: string): Promise<IDomElement | null>;
  click(cssSelector: string, options?: IClickOptions): Promise<void>;
  rightClick(cssSelector: string, options?: IClickOptions): Promise<void>;
  hover(cssSelector: string): Promise<void>;
  mouseMove(x: number, y: number, steps?: number): Promise<void>;
  mouseUp(): Promise<void>;
  mouseDown(): Promise<void>;
  waitForSelector(cssSelector: string): Promise<IDomElement>;
  keyDown(key: string): Promise<void>;
  keyUp(key: string): Promise<void>;
  keyPress(key: string): Promise<void>;
  keyType(key: string): Promise<void>;
  waitForTimeout(timeout: number): Promise<void>;
}
