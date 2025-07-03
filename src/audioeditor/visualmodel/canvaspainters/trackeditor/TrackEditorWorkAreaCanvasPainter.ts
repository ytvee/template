import { Transformation } from "@/audioeditor/visualmodel/transformations/Transformation";

import { AUDIO_EDITOR_CONFIGURATION } from "@/audioeditor/data/configuration";
import { TimeGridOptions, TrackEditorWorkAreaBaseCanvasPainter } from "./TrackEditorWorkAreaBaseCanvasPainter";
import { ViewportState } from "@/audioeditor/store/modules/submodules/trackeditor/navigation";

const TRACK_EDITOR_CONFIGURATION = AUDIO_EDITOR_CONFIGURATION.tracksEditor;

export class TrackEditorTimeLineCanvasPainter extends TrackEditorWorkAreaBaseCanvasPainter {
  constructor(canvasRef: HTMLCanvasElement) {
    super(canvasRef);
  }
  protected override drawBaseTimeGridRisk(baseRiskX: number, timeLabel: string): void {
    this.canvasContext.fillStyle = TRACK_EDITOR_CONFIGURATION.appearance.gridBaseRiskColor;
    const y = this.canvasHeight - TRACK_EDITOR_CONFIGURATION.appearance.timeLineGridBaseRiskHeight + 1;
    this.canvasContext.fillRect(baseRiskX, y, TRACK_EDITOR_CONFIGURATION.appearance.gridBaseRiskWidth, TRACK_EDITOR_CONFIGURATION.appearance.timeLineGridBaseRiskHeight);

    this.canvasContext.font = TRACK_EDITOR_CONFIGURATION.appearance.timeLineLabelFont;
    this.canvasContext.fillStyle = TRACK_EDITOR_CONFIGURATION.appearance.timeLineLabelColor;
    this.canvasContext.fillText(timeLabel, baseRiskX + 4, y + 8);
  }
  protected override drawIntermediateTimeGridRisk(baseRiskX: number): void {
    this.canvasContext.fillStyle = TRACK_EDITOR_CONFIGURATION.appearance.gridIntermediateRiskColor;
    const y = this.canvasHeight - TRACK_EDITOR_CONFIGURATION.appearance.timeLineGridIntermediateRiskHeight;
    this.canvasContext.fillRect(baseRiskX, y, TRACK_EDITOR_CONFIGURATION.appearance.gridIntermediateRiskWidth, TRACK_EDITOR_CONFIGURATION.appearance.timeLineGridBaseRiskHeight);
  }
  /**
   * draw on TimeLine canvas
   */
  public drawTimeLine(viewportState: ViewportState, timeGridOptions: TimeGridOptions) {
    this.clearRect();
    this.drawTimeGrid(viewportState, timeGridOptions);
  }
}

export class TrackEditorSecondaryTimeLineCanvasPainter extends TrackEditorWorkAreaBaseCanvasPainter {
  constructor(canvasRef: HTMLCanvasElement) {
    super(canvasRef);
  }
  protected override drawBaseTimeGridRisk(baseRiskX: number, timeLabel: string): void {
    this.canvasContext.fillStyle = TRACK_EDITOR_CONFIGURATION.appearance.gridBaseRiskColor;

    const y = TRACK_EDITOR_CONFIGURATION.secondaryTimeLine.appearance.rulerTopMargin;

    this.canvasContext.fillRect(baseRiskX, y, TRACK_EDITOR_CONFIGURATION.appearance.gridBaseRiskWidth, TRACK_EDITOR_CONFIGURATION.secondaryTimeLine.appearance.baseRiskHeight);

    this.canvasContext.font = TRACK_EDITOR_CONFIGURATION.appearance.timeLineLabelFont;
    this.canvasContext.fillStyle = TRACK_EDITOR_CONFIGURATION.appearance.timeLineLabelColor;
    this.canvasContext.fillText(timeLabel, baseRiskX + 4, y + 8);
  }
  protected override drawIntermediateTimeGridRisk(baseRiskX: number): void {
    this.canvasContext.fillStyle = TRACK_EDITOR_CONFIGURATION.appearance.gridIntermediateRiskColor;

    const y = TRACK_EDITOR_CONFIGURATION.secondaryTimeLine.appearance.rulerTopMargin + TRACK_EDITOR_CONFIGURATION.secondaryTimeLine.appearance.baseRiskHeight - TRACK_EDITOR_CONFIGURATION.secondaryTimeLine.appearance.intermediateRiskHeight;

    this.canvasContext.fillRect(baseRiskX, y, TRACK_EDITOR_CONFIGURATION.appearance.gridIntermediateRiskWidth, TRACK_EDITOR_CONFIGURATION.secondaryTimeLine.appearance.intermediateRiskHeight);
  }
  /**
   * draw on TimeLine canvas
   */
  public drawTimeLine(viewportState: ViewportState, timeGridOptions: TimeGridOptions) {
    this.clearRect();
    this.drawTimeGrid(viewportState, timeGridOptions);
  }
}

export class TrackEditorAudioViewCanvasPainter extends TrackEditorWorkAreaBaseCanvasPainter {
  constructor(canvasRef: HTMLCanvasElement) {
    super(canvasRef);
  }
  protected override drawBaseTimeGridRisk(baseRiskX: number): void {
    this.canvasContext.fillStyle = TRACK_EDITOR_CONFIGURATION.appearance.gridBaseRiskColor;
    this.canvasContext.fillRect(baseRiskX, 0, TRACK_EDITOR_CONFIGURATION.appearance.gridBaseRiskWidth, this.canvasHeight);
  }
  protected override drawIntermediateTimeGridRisk(baseRiskX: number): void {
    this.canvasContext.fillStyle = TRACK_EDITOR_CONFIGURATION.appearance.gridIntermediateRiskColor;
    this.canvasContext.fillRect(baseRiskX, 0, TRACK_EDITOR_CONFIGURATION.appearance.gridIntermediateRiskWidth, this.canvasHeight);
  }

  /**
   *
   * @param trackY trackUnits
   */
  private drawZebraTrack(viewportState: ViewportState, trackY: number, rounded = false) {
    const offset = Transformation.worldToViewport({ x: 0, y: trackY }, viewportState).y;
    if (trackY % 2) {
      this.canvasContext.fillStyle = AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.oddTrackColor; //odd
    } else {
      this.canvasContext.fillStyle = AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.evenTrackColor; //even
    }
    if (rounded) {
      this.canvasContext.beginPath(); //TODO: many uses of fill is ineffective. create full path and use fill once time instead.
      this.canvasContext.roundRect(0, offset, this.canvasWidth, Transformation.worldToViewportDistance({ x: 0, y: 1 }, viewportState).y - AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap, [22, 0, 0, 22]); //--audio-editor-track-mixing-tools-border-radius
      this.canvasContext.fill();
    } else {
      this.canvasContext.fillRect(0, offset, this.canvasWidth, Transformation.worldToViewportDistance({ x: 0, y: 1 }, viewportState).y - AUDIO_EDITOR_CONFIGURATION.tracksEditor.appearance.trackVerticalGap);
    }
  }
  private drawZebra(viewportState: ViewportState, rounded = false) {
    const firstTrackY = Math.floor(viewportState.viewportOrigin.y);
    const lastTrackY = Math.floor(viewportState.viewportOrigin.y + Transformation.viewportToWorld({ x: 0, y: this.canvasHeight }, { viewportOrigin: { x: 0, y: 0 }, viewportScaleX: viewportState.viewportScaleX, viewportScaleY: viewportState.viewportScaleY }).y);
    for (let i = firstTrackY; i <= lastTrackY; i++) {
      this.drawZebraTrack(viewportState, i, rounded);
    }
  }

  /**
   * draw on AudioView canvas
   */
  public drawAudioView(viewportState: ViewportState, timeGridOptions: TimeGridOptions) {
    this.clearRect();
    this.drawZebra(viewportState);
    this.drawTimeGrid(viewportState, timeGridOptions);
  }

  public drawTrackMixingToolsContainer(viewportState: ViewportState) {
    this.clearRect();
    this.drawZebra(viewportState, true);
  }
}
