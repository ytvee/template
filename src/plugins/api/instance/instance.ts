import axios, { AxiosInstance, AxiosRequestConfig, AxiosHeaderValue } from "axios";
import { base64ToArrayBuffer } from "@audioeditor/utils/audioUtils";

import store from "@/store/store";

export interface IGenerateResponse {
  settings: Record<string, any>;
  notes: Map<string, ArrayBuffer>;
}

export class APIInstance {
  protected instance: AxiosInstance;

  constructor(instanceConfiguration: AxiosRequestConfig) {
    this.instance = axios.create(instanceConfiguration);
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }

  public removeHeader(headerKey: string): void {
    delete this.instance.defaults.headers.common[headerKey];
  }

  public setHeader(headerKey: string, headerValue: string): void {
    this.instance.defaults.headers.common[headerKey] = headerValue;
  }

  public getHeader(headerKey: string): AxiosHeaderValue | undefined {
    return this.instance.defaults.headers.common[headerKey];
  }
}

export async function generateNoteSamples(
  prompt: string,
  tags: string[],
  token?: string
): Promise<IGenerateResponse | null> {
  try {
    const response = await axios.post(
      `${process.env.VUE_APP_GENERATE_API_BASE_URL}${process.env.VUE_APP_GENERATE_API_ROUTE ||
      "/generate_audio"}`,
      {
        prompt: prompt,
        styles: tags.join(", "),
      },
      {
        headers: {
          "Content-Type": "application/json"
        },
      }
    );
    const {
      vst_settings: alternativeVstSettings,
      vstSettings,
      ...notesBase64
    } = response.data as Record<string, any>;

    const notes = new Map<string, ArrayBuffer>();
    Object.entries<string>(notesBase64).forEach(([key, value]) => {
      if (key.length > 2) return;
      const arrayBuffer = base64ToArrayBuffer(value);
      notes.set(key, arrayBuffer);
    });

    const settingsJson = vstSettings || alternativeVstSettings;
    const settings: Record<string, any> = settingsJson
      ? JSON.parse(settingsJson)
      : {};

    return { settings, notes };
  } catch (err) {
    console.error("Audio generation error:", err);
    return null;
  }
}