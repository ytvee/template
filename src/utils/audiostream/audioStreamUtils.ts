class Utils {
  static async delay(delay: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }
  static makeTextFile(fileContent: any, fileName = "test.txt") {
    // text = "test content";
    const data = new Blob([fileContent], { type: "text/plain" });

    const blobUrl = window.URL.createObjectURL(data);
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    // returns a URL you can use as a href
    link.click();
    return blobUrl;
  }
  static base64ToBinary(base64String: string) {
    // return Buffer.from(base64String, "base64");
    return Buffer.from(base64String, "base64").buffer;
  }
  static binaryToBase64(binaryData: ArrayBuffer) {
    Buffer.from("Hello World").toString("base64");
  }
  static appendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer) {
    const resultBuffer = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
    resultBuffer.set(new Uint8Array(buffer1), 0);
    resultBuffer.set(new Uint8Array(buffer2), buffer1.byteLength);
    return resultBuffer.buffer;
  }
}

enum UpdateEndCases {
  APPEND_TO_BUFFER_END,
  REMOVE_FROM_BUFFER_END,
}
export class AudioUtils {
  audio: HTMLAudioElement;
  updateEndCase?: UpdateEndCases; //For releasing SourceBuffer data at the start of buffer
  mediaSource?: MediaSource;
  queue: Array<ArrayBuffer>;
  mimeCodec: string;
  sourceBuffer?: SourceBuffer;

  constructor(audioElement: HTMLAudioElement | null = null) {
    this.audio = audioElement ?? new Audio(); //html5 audio element

    this.queue = [];
    // this.mimeCodec = 'audio/mp4; codecs="mp4a.40.2"'; //TODO: mozilla unsupports mp3
    this.mimeCodec = "audio/mpeg";
  }

  async initializeInstance() {
    const constraints = { audio: true }; // add video constraints if required
    await navigator.mediaDevices.getUserMedia(constraints);
  }

  /* utils */

  /* /utils */
  releasePlayedBufferPartIfNecessary() {
    if (this.sourceBuffer?.updating) {
      return;
    }
    if (this.updateEndCase === UpdateEndCases.REMOVE_FROM_BUFFER_END) {
      //prevent endless loop
      return;
    }
    const currentTime = this.audio.currentTime;
    if (currentTime) {
      this.sourceBuffer?.remove(0, currentTime);
      this.updateEndCase = UpdateEndCases.REMOVE_FROM_BUFFER_END;
    }
  }
  pushChunkToSourceBufferFromQueue() {
    if (this.sourceBuffer?.updating) {
      return;
    }
    if (this.queue.length > 0) {
      //&&!this.sourceBuffer.updating
      this.sourceBuffer?.appendBuffer(this.queue.shift()!);
      this.updateEndCase = UpdateEndCases.APPEND_TO_BUFFER_END;
    }
  }
  updateEndHandler() {
    this.releasePlayedBufferPartIfNecessary();
    this.pushChunkToSourceBufferFromQueue();

    this.audio.play();
  }
  async sourceOpenHandler() {
    this.sourceBuffer = this.mediaSource?.addSourceBuffer(this.mimeCodec);

    this.sourceBuffer?.addEventListener("updateend", () => {
      this.updateEndHandler();
    });
  }
  initializeAudio() {
    //may be remade with custom AudioUtils event
    return new Promise<void>((resolve) => {
      this.mediaSource = new MediaSource();
      this.audio.src = URL.createObjectURL(this.mediaSource);
      this.mediaSource.addEventListener("sourceopen", async () => {
        this.sourceOpenHandler();
        resolve();
      });
    });
  }
  pushChunkToAudio(chunk: ArrayBuffer) {
    this.queue.push(chunk);
    this.pushChunkToSourceBufferFromQueue();
  }

  /**
   *
   * @param data base64string
   */
  async playWebAudio(arrayBuffer: ArrayBuffer) {
    // Utils.makeTextFile(arrayBufferBuffer);
    this.pushChunkToAudio(arrayBuffer);
  }
  resetInstance() {
    // this.queue = [];
    // this.sourceBuffer?.remove(0, this.audio.currentTime);
    this.audio.pause;
  }
}

export class AudioStream {
  webSocketUrl: string;
  socket?: WebSocket;

  audioUtils?: AudioUtils;
  isPlaying: boolean;

  constructor(webSocketUrl: string) {
    this.webSocketUrl = webSocketUrl;
    this.isPlaying = false;
  }
  initWebSocket(webSocketUrl: string): void {
    console.log("initWebSocketL webSocketUrl=", webSocketUrl);

    this.socket = new WebSocket(webSocketUrl);
    this.socket.binaryType = "arraybuffer";

    this.socket.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
      setInterval(() => {
        this.socket?.send("heartbeat");
      }, 30000);
    });

    this.socket.addEventListener("message", async (event) => {
      // makeTextFile(event.data);
      if (this.isPlaying) {
        const arrayBuffer = Utils.base64ToBinary(event.data);
        this.audioUtils?.playWebAudio(arrayBuffer);
      }
    });

    // Event listener for when the connection is closed
    this.socket?.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
    });
  }
  createChunksFromBuffer(arrayBuffer: ArrayBuffer, chunkSize: number) {
    const chunks = [];
    let chunkStartPosition = 0;
    while (chunkStartPosition < arrayBuffer.byteLength) {
      chunks.push(arrayBuffer.slice(chunkStartPosition, chunkStartPosition + chunkSize));
      chunkStartPosition += chunkSize;
    }
    return chunks;
  }
  async imitateWebSocketReceive() {
    const value = "./sample1_edited.mp3";
    const chunkSize = 10000;
    const response = await fetch(value);
    const arrayBuffer = await response.arrayBuffer();
    const chunks = this.createChunksFromBuffer(arrayBuffer, chunkSize);
    /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
    while (this.isPlaying) {
      for (let i = 0; i < chunks.length; i++) {
        if (!this.isPlaying) {
          break;
        }
        const chunk = chunks[i];
        this.audioUtils?.playWebAudio(chunk);
        await Utils.delay(300);
      }
    }
  }
  async run() {
    this.isPlaying = true;
    this.audioUtils = new AudioUtils(document.querySelector("audio"));
    await this.audioUtils.initializeInstance();
    await this.audioUtils.initializeAudio();
    // this.imitateWebSocketReceive();
    this.initWebSocket(this.webSocketUrl);
  }
  pause() {
    //TODO:
    this.isPlaying = false;
    this.audioUtils?.audio.pause();
  }
  resetInstance() {
    this.isPlaying = false;
    this.socket?.close();
    this.audioUtils?.resetInstance();
  }
}
