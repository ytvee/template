import { BaseCanvasPainter } from "./BaseCanvasPainter";

type MeterChartCanvasPainterOptions = {
  barColor?: string;
  peakColor?: string;
  axisLabelColor?: string;
};

const defaultOptions: Required<MeterChartCanvasPainterOptions> = {
  barColor: "#00FF00",
  peakColor: "#0000FF",
  axisLabelColor: "#FFFFFF",
};

export class MeterChartCanvasPainter extends BaseCanvasPainter {
  barColor: string;
  peakColor: string;
  axisLabelColor: string;

  constructor(canvasRef: HTMLCanvasElement, options?: MeterChartCanvasPainterOptions) {
    super(canvasRef);
    this.barColor = options?.barColor || defaultOptions.barColor;
    this.peakColor = options?.peakColor || defaultOptions.peakColor;
    this.axisLabelColor = options?.axisLabelColor || defaultOptions.axisLabelColor;
  }
  /**
   * convert value to y in pixels
   */
  private getYByValue(axisMin: number, axisMax: number, value: number) {
    return this.canvasHeight - ((value - axisMin) * this.canvasHeight) / (axisMax - axisMin);
  }
  private drawAxisLabel(y: number, labelText: string, isOnTopBorder?: boolean) {
    this.canvasContext.fillStyle = this.axisLabelColor;
    let textY = y;
    if (isOnTopBorder) {
      textY += 9;
    }
    this.canvasContext.fillRect(0, y, this.canvasWidth, 1);
    this.canvasContext.fillText(labelText, 0, textY);
  }
  private drawAxis(axisMin: number, axisMax: number, axisStep: number) {
    let currentAxisValue = axisMin;
    this.drawAxisLabel(this.getYByValue(axisMin, axisMax, currentAxisValue), currentAxisValue.toFixed(2));

    currentAxisValue += axisStep;

    for (; currentAxisValue < axisMax; currentAxisValue += axisStep) {
      this.drawAxisLabel(this.getYByValue(axisMin, axisMax, currentAxisValue), currentAxisValue.toFixed(2));
    }
    this.drawAxisLabel(this.getYByValue(axisMin, axisMax, axisMax), axisMax.toFixed(2), true);
  }
  private drawBar(axisMin: number, axisMax: number, value: number, color: string = this.barColor) {
    this.canvasContext.fillStyle = color;

    const y1 = this.canvasHeight - (value - axisMin) * (this.canvasHeight / (axisMax - axisMin));
    this.canvasContext.beginPath();
    this.canvasContext.rect(0, y1, this.canvasWidth, this.canvasHeight - y1);
    this.canvasContext.fill();
  }
  private drawPeak(axisMin: number, axisMax: number, peakValue: number) {
    this.drawBar(axisMin, axisMax, peakValue, this.peakColor);
  }
  public drawMeterChart(axisMin: number, axisMax: number, axisStep: number, value: number, peakValue?: number) {
    this.clearRect();
    if (peakValue !== undefined) {
      this.drawPeak(axisMin, axisMax, peakValue);
    }
    this.drawBar(axisMin, axisMax, value);
    this.drawAxis(axisMin, axisMax, axisStep);
  }
}
