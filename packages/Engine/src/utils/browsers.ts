export const isMobile = () => {
  const toMatch = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i
  ];

  return toMatch.some(toMatchItem => {
    return navigator.userAgent.match(toMatchItem);
  });
};

export enum BrowserType {
  unknown = "unknown",
  edge = "edge",
  edgeChromium = "edgeChromium",
  opera = "opera",
  chrome = "chrome",
  ie = "ie",
  firefox = "firefox",
  safari = "safari",
  electron = "electron"
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
    return BrowserType.electron; // UserAgent of electron is weird.
  }

  switch (true) {
    case agent.indexOf("edge") > -1:
      return BrowserType.edge;
    case agent.indexOf("edg") > -1:
      return BrowserType.edgeChromium;
    case agent.indexOf("opr") > -1 && !!window.opr:
      return BrowserType.opera;
    case agent.indexOf("chrome") > -1 && !!window.chrome:
      return BrowserType.chrome;
    case agent.indexOf("trident") > -1:
      return BrowserType.ie;
    case agent.indexOf("firefox") > -1:
      return BrowserType.firefox;
    case agent.indexOf("safari") > -1:
      return BrowserType.safari;
    default:
      return BrowserType.unknown;
  }
};

export const isSupported = (): boolean => {
  if (isMobile()) {
    return false;
  }

  const browser = getBrowser();
  const supported = [
    BrowserType.chrome,
    BrowserType.edgeChromium,
    BrowserType.firefox,
    BrowserType.safari,
    BrowserType.electron
  ];

  return supported.indexOf(browser) > -1;
};

export const isMacOs = navigator.userAgent.includes("Macintosh");
