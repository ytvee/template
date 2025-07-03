import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { BaseCanvasPainter } from "./BaseCanvasPainter";

export type HSLColor = {
  hue: number; //0..360
  saturation: number; //0..100
  lightness: number; //0..100 where 50 means brightest color;
};

export class GradientSliderCanvasPainter extends BaseCanvasPainter {
  constructor(canvasRef: HTMLCanvasElement) {
    super(canvasRef);
  }
  /**
   *
   * @param startColor
   * @param endColor
   * @param position 0..1
   */
  private lerpHSL(startColor: HSLColor, endColor: HSLColor, position: number): HSLColor {
    const lengthOnCircle = endColor.hue - startColor.hue;
    const lengthOnCircleEdge = startColor.hue + (360 - endColor.hue) < 360 ? -(startColor.hue + (360 - endColor.hue)) : 360 - startColor.hue + endColor.hue;
    const isOnCircle = Math.abs(lengthOnCircle) <= Math.abs(lengthOnCircleEdge);

    let interpolatedHue;
    if (isOnCircle) {
      interpolatedHue = startColor.hue + lengthOnCircle * position;
    } else {
      interpolatedHue = startColor.hue + lengthOnCircleEdge * position;
      if (interpolatedHue < 0) {
        interpolatedHue += 360;
      }
      if (interpolatedHue > 360) {
        interpolatedHue -= 360;
      }
    }
    const interpolatedColor: HSLColor = {
      hue: interpolatedHue,
      saturation: startColor.saturation + (endColor.saturation - startColor.saturation) * position,
      lightness: startColor.lightness + (endColor.lightness - startColor.lightness) * position,
    };
    return interpolatedColor;
  }
  /**
   *
   * @param x center of circle
   * @param y center of circle
   * @param radius
   * @param color
   */
  private drawCircle(x: number, y: number, radius: number, color: string) {
    this.canvasContext.fillStyle = color;
    this.canvasContext.beginPath();

    this.canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
    this.canvasContext.fill();
  }
  private drawAxisThreshold(y: number, axisMin: number, axisMax: number, axisThreshold: number) {
    const normalizedThreshold = this.normalizeValue(axisThreshold, axisMin, axisMax);
    const x = this.canvasRef.width * normalizedThreshold;
    this.canvasContext.fillStyle = "#FFFFFF";
    this.canvasContext.fillRect(x, 0, 1, this.canvasRef.height);
  }

  private isCircleMatchSliderValue(currentCircleValue: number, sliderValue: number, axisMin: number, axisMax: number) {
    return currentCircleValue <= this.normalizeValue(sliderValue, axisMin, axisMax);
  }
  private isCircleMatchSliderPeakValue(currentCircleValue: number, sliderPeakValue: number, axisMin: number, axisMax: number) {
    return currentCircleValue <= this.normalizeValue(sliderPeakValue, axisMin, axisMax);
  }
  private isPeakNotCrossThreshold(sliderPeakValue: number, axisThreshold: number) {
    return sliderPeakValue <= axisThreshold;
  }
  private getCircleColor(currentCircleNumber: number, circleCount: number, startColor: HSLColor, endColor: HSLColor, sliderValue: number, sliderPeakValue: number, axisThreshold: number, axisMin: number, axisMax: number): HSLColor {
    let circleColor = { hue: 0, saturation: 0, lightness: 0 };
    const currentCircleValue = (currentCircleNumber + 1) / circleCount;

    if (this.isCircleMatchSliderValue(currentCircleValue, sliderValue, axisMin, axisMax)) {
      circleColor = this.lerpHSL(startColor, endColor, currentCircleNumber / (circleCount - 1));
      return circleColor;
    }

    if (this.isCircleMatchSliderPeakValue(currentCircleValue, sliderPeakValue, axisMin, axisMax)) {
      if (this.isPeakNotCrossThreshold(sliderPeakValue, axisThreshold)) {
        circleColor = AUDIO_EDITOR_CONFIGURATION.tracksEditor.track.trackMixer.volumeMeter.appearance.peakColor;
      } else {
        circleColor = AUDIO_EDITOR_CONFIGURATION.tracksEditor.track.trackMixer.volumeMeter.appearance.peakThresholdCrossedColor;
      }
      return circleColor;
    }

    return circleColor;
  }
  private drawCircleString(startX: number, y: number, radius: number, gap: number, startColor: HSLColor, endColor: HSLColor, axisMin: number, axisMax: number, axisThreshold: number, sliderValue: number, sliderPeakValue: number) {
    const circleCount = Math.floor((this.canvasRef.width + gap) / (radius * 2 + gap));
    for (let i = 0; i < circleCount; i++) {
      const circleColor = this.getCircleColor(i, circleCount, startColor, endColor, sliderValue, sliderPeakValue, axisThreshold, axisMin, axisMax);
      this.drawCircle(startX + i * (radius * 2 + gap), y, radius, `HSL(${circleColor.hue},${circleColor.saturation}%,${circleColor.lightness}%)`);
    }
    if (AUDIO_EDITOR_CONFIGURATION.debug.isEnabled) this.drawAxisThreshold(y, axisMin, axisMax, axisThreshold);
  }
  private normalizeValue(value: number, min: number, max: number) {
    return (value - min) / (max - min);
  }
  public redraw(axisMin: number, axisMax: number, axisThreshold: number, sliderValue1: number, sliderValue2: number, sliderPeakValue1: number, sliderPeakValue2: number) {
    this.clearRect();
    const startColor = AUDIO_EDITOR_CONFIGURATION.tracksEditor.track.trackMixer.volumeMeter.appearance.startRMSColor;
    const endColor = AUDIO_EDITOR_CONFIGURATION.tracksEditor.track.trackMixer.volumeMeter.appearance.endRMSColor;

    this.drawCircleString(1, 5, 1, 2, startColor, endColor, axisMin, axisMax, axisThreshold, sliderValue1, sliderPeakValue1);
    this.drawCircleString(1, 9, 1, 2, startColor, endColor, axisMin, axisMax, axisThreshold, sliderValue2, sliderPeakValue2);
  }
}
