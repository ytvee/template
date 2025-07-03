import { SaveLoadManager, TrackEditorSave } from "@/audioeditor/audiomodel/audioeditor/trackeditor/trackeditorbase/SaveLoadManager";
import { Context } from "../projectManager";
import { AudioEditor } from "@/audioeditor/audiomodel/AudioEditor";

import { obtainFormData } from "@/utils/s3/s3Utils";
// import { ApiPlugin } from "@/plugins/api/ApiPlugin";
import { AUDIO_EDITOR_BASE_MODULE } from "@/audioeditor/data/store/storeModules";
// export const apiPlugin = ApiPlugin.getInstance();

// async function uploadSample(project_uuid: string, filename: string, file: File) {
//   const payloadForPresignedLinkObtain = {
//     filename: filename,
//     // name: filename,
//     project_uuid: project_uuid,
//   }
//   const {data: {data: presignedLinksResponseData}} = await apiPlugin.studio.uploadAudioSample(payloadForPresignedLinkObtain);
//   console.log("presignedLinksResponseData=", presignedLinksResponseData);

//   const payloadForLoadToS3 = obtainFormData(file, presignedLinksResponseData.fields);

//   await apiPlugin.studio.uploadAudioSampleViaPresignedURL(presignedLinksResponseData.url, payloadForLoadToS3);
// }

// export const controllerActions = {
//   async saveProjectWithBackend(context: Context, name?: string, currentUuid?: string) {
//     try {
//       //Maybe move content of this action to ProjectManager class
//       context.commit("setProgress", { saveStatus: "SAVING" });

//       const saveForBackend = await SaveLoadManager.getSaveForBackend(AudioEditor.getInstance().trackEditor);

//       const payload = {
//         ...(name !== undefined && { name }),
//         metadata: saveForBackend.project,
//       };
//       context.commit("setProgress", { savingProgress: `metadata` });
//       const response = await apiPlugin.studio.uploadProjectMetadata(payload);
//       let project_uuid = response.data.data.project_uuid;
//       if (currentUuid && project_uuid !== currentUuid) {
//         project_uuid = currentUuid;
//       }
//       context.commit("setProjectUuid", project_uuid);

//       const segmentResourcesArray = Array.from(saveForBackend.resources.segmentResources.entries());
//       for (let i = 0; i < segmentResourcesArray.length; i++) {
//         //TODO: use Promise.all for parallel loading
//         context.commit("setProgress", { savingProgress: `audiosample ${i + 1}/${segmentResourcesArray.length}` });

//         // await uploadSample(segment[0], new File([segment[1]], segment[0]));
//         await uploadSample(project_uuid, segmentResourcesArray[i][0], new File([segmentResourcesArray[i][1]], segmentResourcesArray[i][0]));
//       }
//       context.commit("setProgress", { saveStatus: "SAVED", savingProgress: "", lastSaveTime: new Date() });
//     } catch {
//       context.commit("setProgress", { saveStatus: "ERROR" });
//     }
//   },

  // async updateProjectNameInBackend(context: Context, payload: { name: string; project_uuid: string }) {
  //   //TODO: name or project_uuid
  //   await apiPlugin.studio.updateProjectName(payload);
  // },

  // async loadProjectWithBackend(context: Context, project: { name: string, project_uuid: string }) {
  //   //TODO: name or project_uuid
  //   context.commit("setLoadProjectStatus", "LOADING");
  //   const payload = {
  //     //TODO: use with project_uuid
  //     project_uuid: project.project_uuid,
  //   };

  //   const result = await apiPlugin.studio.downloadProject(payload);
  //   context.commit("setLoadProjectStatus", "LOADED");
  //   const saveFromBackend = result.data.data as { name: string; metadata: TrackEditorSave; segments: Record<string, string> };

  //   await context.dispatch(AUDIO_EDITOR_BASE_MODULE + "/" + "newProject", undefined, { root: true });
  //   await SaveLoadManager.loadTrackEditorBackendSave(saveFromBackend.name, saveFromBackend.metadata, saveFromBackend.segments);
  //   context.commit("setLoadProjectStatus", "UNLOAD");
  // },

//   async getAllProjectsFromBackend(context: Context) {
//     context.commit("setDownloadProjectsStatus", "LOADING");

//     const response = await apiPlugin.studio.getProjects();
//     const allProjects = response.data.data.projects;
//     context.commit("setAllSavedProjects", allProjects);

//     if (!allProjects.length) {
//       context.commit("setDownloadProjectsStatus", "UNLOAD");
//       return;
//     }
//     context.commit("setDownloadProjectsStatus", "LOADED");
//   },
// };
