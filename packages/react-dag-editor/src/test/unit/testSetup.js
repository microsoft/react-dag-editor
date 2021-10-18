const nodeCrypto = require("crypto");
global.crypto = {
  getRandomValues(buffer) {
    return nodeCrypto.randomFillSync(buffer);
  }
};

Object.defineProperty(navigator, "userAgent", {
  value:
    "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4166.0 Safari/537.36 Edg/85.0.545.0",
  configurable: true
});
