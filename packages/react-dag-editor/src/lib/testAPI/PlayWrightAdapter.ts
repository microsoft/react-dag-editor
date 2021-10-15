// // eslint-disable-next-line import/no-extraneous-dependencies
// import { Page } from "playwright";

// import { IClickOptions, IDomElement, IDriverAdapter } from "./DriverAdapter";

// export interface IPlayWrightAdapterConfig {
//   page: Page;
// }

// export class PlayWrightAdapter implements IDriverAdapter {
//   private readonly page: Page;

//   public constructor(config: IPlayWrightAdapterConfig) {
//     this.page = config.page;
//   }

//   public async select(cssSelector: string): Promise<IDomElement | null> {
//     return this.page.$(cssSelector);
//   }

//   public async selectAll(cssSelector: string): Promise<IDomElement[]> {
//     return this.page.$$(cssSelector);
//   }

//   public async mouseDown(): Promise<void> {
//     return this.page.mouse.down();
//   }

//   public async mouseUp(): Promise<void> {
//     return this.page.mouse.up();
//   }

//   public async mouseMove(x: number, y: number, steps = 1): Promise<void> {
//     return this.page.mouse.move(x, y, { steps });
//   }

//   public async waitForSelector(cssSelector: string): Promise<IDomElement> {
//     return this.page.waitForSelector(cssSelector);
//   }

//   public async click(selector: string, options?: IClickOptions): Promise<void> {
//     return this.page.click(selector, options);
//   }

//   public async rightClick(
//     selector: string,
//     options?: IClickOptions
//   ): Promise<void> {
//     return this.page.click(selector, { button: "right", ...options });
//   }

//   public async hover(selector: string): Promise<void> {
//     return this.page.hover(selector);
//   }

//   public async keyDown(key: string): Promise<void> {
//     this.page.keyboard.down(key);
//   }

//   public async keyUp(key: string): Promise<void> {
//     this.page.keyboard.up(key);
//   }

//   public async keyPress(key: string): Promise<void> {
//     this.page.keyboard.press(key);
//   }

//   public async keyType(key: string): Promise<void> {
//     this.page.keyboard.type(key);
//   }

//   public async waitForTimeout(timeout: number): Promise<void> {
//     this.page.waitForTimeout(timeout);
//   }
// }
