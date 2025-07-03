import { TrackEditorSave } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/SaveLoadManager";
import studioEndpoints from "@/data/api/studio/studioEndpoints.json";
import type { APIModule } from "@/utils/types/api.types";
import type { Axios, AxiosResponse } from "axios";

export default function (instance: Axios): APIModule {
  return {
    sendFileToSplit(payload: object): Promise<AxiosResponse> {
      console.log("sendFileToSplit: payload=", payload);
      return instance.post(studioEndpoints.SEND_FILE_TO_SPLIT, payload);
    },
    /**
     * @returns presigned link to s3 and fields for further upload
     */
    uploadAudioSample(payload: {name: string, project_uuid: string }): Promise<AxiosResponse> {
      console.log("uploadAudioSample: payload=", payload);
      return instance.post<{url: string, fields: {key: string; AWSAccessKeyId: string; "x-amz-security-token": string; policy: string; signature: string}}>(studioEndpoints.UPLOAD_AUDIO_SAMPLE, payload);
    },
    uploadAudioSampleViaPresignedURL(url: string, formData: FormData): Promise<AxiosResponse> {
      console.log("uploadAudioSampleViaPresignedURL: formData=", formData);
      return instance.post<"">(url, formData, {
        headers: {
          Authorization: "",
        }
      });
    },
    updateProjectName(payload: { name?: string; project_uuid?: string }): Promise<AxiosResponse> | null {
      if (!payload.project_uuid) {
        return null;
      }
      console.log("updateProjectName: payload=", payload);
      return instance.patch<"">(studioEndpoints.UPDATE_PROJECT_NAME, payload);
    },
    uploadProjectMetadata(payload: {name?: string; project_uuid?: string, metadata: TrackEditorSave}): Promise<AxiosResponse> {
      console.log("uploadProjectMetadata: payload=", payload);
      return instance.post<"">(studioEndpoints.UPLOAD_PROJECT_METADATA, payload);
    },
    downloadProject(payload: {name?: string, project_uuid?: string}): Promise<AxiosResponse> {
      return instance.get<{name: string; metadata: TrackEditorSave, segments: Record<string, string>}>(studioEndpoints.DOWNLOAD_PROJECT, {
        params: payload,
      });
    },
    getProjects(): Promise<AxiosResponse> {
      console.log("Fetching all projects...");
      return instance.get<any>(studioEndpoints.GET_PROJECTS);
    }
  };
}

