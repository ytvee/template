export abstract class AbstractVisualizer {
  private isRunning = false;
  private requestId = 0;

  protected destroy() {
    this.pause();
  }
  public run() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    const animationFrameCallback = () => {
      this.render();
      this.requestId = requestAnimationFrame(animationFrameCallback);
    };
    this.requestId = requestAnimationFrame(animationFrameCallback);
  }
  public pause() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;

    cancelAnimationFrame(this.requestId);
  }

  protected abstract render(): void;
}
