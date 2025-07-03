import { downloadFile } from "../../common/miscellaneous";

export enum NodeClassName {
  AudioBufferSourceNode = "AudioBufferSourceNode",
  GainNode = "GainNode",
  StereoPannerNode = "StereoPannerNode",
}
type PropertyValue = number | boolean | string;

export class NodeImage {
  nodeClassName: NodeClassName; //bufferSource gain e.t.c.
  // inputs: Map<number, string>; //The map of id of node to which input of this node are connected. key - index of input. value - id of connected node
  outputs: Map<number, string>; //The array of id of node to which output of this node are connected
  properties: Map<string, PropertyValue>; //properties which was set to this node.
  comment?: string; //free-form comment

  constructor(nodeClassName: NodeClassName) {
    this.nodeClassName = nodeClassName;
    // this.inputs = new Map;
    this.outputs = new Map();
    this.properties = new Map();
  }
}

/**
 * The purpose of the class is to allow the construction of a node graph in an offline audio context the same as it is in the main audio context
 * Audio nodes cannot be used in different audio contexts, and it is also impossible to change the context of an audio node, copy an audio node to a new context, or get nodes that are connected to the inputs and outputs of the current node.
 * Therefore, it was decided to create a graph of the current state of the nodes of the main audio context used in the application.
 * Nodes must be added to the graph manually.
 */
export class AudioGraphImage {
  public nodeImages: Map<string, NodeImage>; // key - The identifier determines the position of the node in the graph. Moreover, if the node is recreated, the identifier remains the same.
  constructor() {
    this.nodeImages = new Map();
  }
  /**
   * removes all nodes in given directory. Example: if we call this method with /Multitrack/Tracks/0/Segments/0 it will delete all nodes which are used in segment 0 of track 0
   * @param directory
   */
  public deleteNodesByDirectory(directory: string) {
    const regExp = new RegExp("$" + directory.replace("/", "/") + "*");
    this.nodeImages.forEach((value, key, map) => {
      key.match(regExp);
      map.delete(key);
    });
  }
  public outputNodeImagesToFile() {
    const stringifiedMap = JSON.stringify(this.nodeImages, simplifiedReplacer);
    downloadFile(new Blob([stringifiedMap]), "AudioGraphImage output.txt");
  }
}
// /**
//  * With replacer and reviver we can stringify and parce Map to/from string
//  * @param key
//  * @param value
//  * @returns
//  */
// function replacer(key: string, value: any) {
//   if (value instanceof Map) {
//     return {
//       dataType: "Map",
//       value: Array.from(value.entries()), // or with spread: value: [...value]
//     };
//   } else {
//     return value;
//   }
// }
// function reviver(key: string, value: any) {
//   if (typeof value === "object" && value !== null) {
//     if (value.dataType === "Map") {
//       return new Map(value.value);
//     }
//   }
//   return value;
// }
/**
 * Just stringify to human format
 * @param key
 * @param value
 * @returns
 */
function simplifiedReplacer(key: string, value: any) {
  if (value instanceof Map) {
    return Array.from(value.entries()); // or with spread: value: [...value]
  } else {
    return value;
  }
}

export type AudioGraphImageUtils = {
  audioGraphImage: AudioGraphImage;
  currentScope: string; //current scope where we use AudioGraphImage. Example: in segment 0 of track 0 scope will be AudioEditor/tracks/0/segments/0
  nodeImegeIdsToUse: Map<string, string>; //key - conditional name of used node, value - id of usedNode. Example: key - outputNode, value - AudioEditor/addGainNode
};
