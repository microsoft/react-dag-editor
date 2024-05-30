export const isMobile = () => {
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];

  return toMatch.some(toMatchItem => {
    return navigator.userAgent.match(toMatchItem);
  });
};

export enum BrowserType {
  Unknown = "Unknown",
  Edge = "Edge",
  EdgeChromium = "EdgeChromium",
  Opera = "Opera",
  Chrome = "Chrome",
  IE = "IE",
  Firefox = "Firefox",
  Safari = "Safari",
  Electron = "Electron",
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    opr: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chrome: any;
  }
}

export const getBrowser = (): BrowserType => {
  const agent = navigator.userAgent.toLowerCase();

  if (agent.indexOf("electron") > -1) {
    return BrowserType.Electron; // UserAgent of electron is weird.
  }

  switch (true) {
    case agent.indexOf("edge") > -1:
      return BrowserType.Edge;
    case agent.indexOf("edg") > -1:
      return BrowserType.EdgeChromium;
    case agent.indexOf("opr") > -1 && !!window.opr:
      return BrowserType.Opera;
    case agent.indexOf("chrome") > -1 && !!window.chrome:
      return BrowserType.Chrome;
    case agent.indexOf("trident") > -1:
      return BrowserType.IE;
    case agent.indexOf("firefox") > -1:
      return BrowserType.Firefox;
    case agent.indexOf("safari") > -1:
      return BrowserType.Safari;
    default:
      return BrowserType.Unknown;
  }
};

export const isSupported = (): boolean => {
  if (isMobile()) {
    return false;
  }

  const browser = getBrowser();
  const supported = [
    BrowserType.Chrome,
    BrowserType.EdgeChromium,
    BrowserType.Firefox,
    BrowserType.Safari,
    BrowserType.Electron,
  ];

  return supported.indexOf(browser) > -1;
};

export const isMacOs = navigator.userAgent.includes("Macintosh");
