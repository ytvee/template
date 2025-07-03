const HEX_BASE = 0x10000;
const RATIO = 1;
const RADIX = 16;

class IdService {
  static generateRandomHexSegment() {
    return Math.floor((RATIO + Math.random()) * HEX_BASE)
      .toString(RADIX)
      .substring(1);
  }

  static generateUniqueId() {
    return `${this.generateRandomHexSegment()}-${this.generateRandomHexSegment()}-${this.generateRandomHexSegment()}-${this.generateRandomHexSegment()}`;
  }
};

export default IdService;
