export class BaseCanvasPainter {
  DEBUG_COLOR = "#FF0000";
  canvasRef: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  canvasWidth = 0;
  canvasHeight = 0;

  /* initialization and destruction */
  constructor(canvasRef: HTMLCanvasElement) {
    this.canvasRef = canvasRef;
    const canvasContext: CanvasRenderingContext2D | null = this.canvasRef.getContext("2d");
    if (canvasContext) {
      this.canvasContext = canvasContext;
    } else {
      throw new Error();
    }
    this.updateCanvasSize(this.canvasRef.width, this.canvasRef.height);
  }
  /* /initialization and destruction */

  /* main functionality */
  updateCanvasSize(width?: number, height?: number): void {
    if (width !== undefined) {
      this.canvasContext.canvas.width = this.canvasWidth = width;
    }
    if (height !== undefined) {
      this.canvasContext.canvas.height = this.canvasHeight = height;
    }
  }
  clearRect(): void {
    this.canvasContext.clearRect(0, 0, this.canvasRef.width, this.canvasRef.height);
  }
  /* /main functionality */

  /* helper draw functions */
  drawTestRect() {
    this.canvasContext.fillStyle = "yellow";
    this.canvasContext.fillRect(0, 0, 2000, 2000);
  }
  public drawDebugInfo(debugStrings: Array<string>) {
    this.canvasContext.fillStyle = this.DEBUG_COLOR;
    let textY = 10;
    for (const debugString of debugStrings) {
      this.canvasContext.fillText(debugString, 0, textY);
      textY += 10;
    }
  }
  /* /helper draw functions */

  /* common helpers */
  /**
   * @param {*} riskTime seconds
   */
  static getRiskLabelByRiskTime(riskTime: number): string {
    //TODO: move from here
    riskTime *= 1000; //to milliseconds
    const absRiskTime = Math.abs(riskTime);
    const hours = Math.floor(absRiskTime / (1000 * 60 * 60));
    const minutes = Math.floor((absRiskTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absRiskTime % (1000 * 60)) / 1000);
    const sign = riskTime >= 0 ? "" : "-";
    return `${sign}${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  /**
   * @param {*} riskTime seconds
   * @param {*} baseRiskTimeStepPower need to properly define the precision which should be printed
   */
  static getRiskLabelByRiskTimeMISSMS(riskTime: number, baseRiskTimeStepPower = 0): string {
    //TODO: move from here
    riskTime *= 1000; //to milliseconds
    const absRiskTime = Math.round(Math.abs(riskTime));
    const minutes = Math.floor(absRiskTime / (1000 * 60));
    const seconds = Math.floor((absRiskTime % (1000 * 60)) / 1000);
    const milliseconds = Math.floor(absRiskTime % 1000);
    const sign = riskTime >= 0 ? "" : "-";

    return `${sign}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${(milliseconds / 1000).toFixed(-baseRiskTimeStepPower).substring(2) || "0"}`;
  }
  /**
   * @param {*} riskTime seconds
   */
  static getRiskLabelByRiskTimeMISS(riskTime: number): string {
    //TODO: move from here
    riskTime *= 1000; //to milliseconds
    const absRiskTime = Math.abs(riskTime);
    const minutes = Math.floor(absRiskTime / (1000 * 60));
    const seconds = Math.floor((absRiskTime % (1000 * 60)) / 1000);
    // const milliseconds = Math.floor(absRiskTime % 1000);
    const sign = riskTime >= 0 ? "" : "-";
    return `${sign}${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  /* /common helpers */
}
