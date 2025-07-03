import forumEndpoints from "@/data/api/forum/forumEndpoints.json";
import type { APIModule } from "@/utils/types/api.types";
import type { Axios, AxiosResponse } from "axios";

export default function (instance: Axios): APIModule {
  return {
    getListOfCategoryTopics(categoryId: number): Promise<AxiosResponse> {
      console.log(`getting list of category (categoryId=${categoryId}) topics...`);
      return instance.get(forumEndpoints.GET_LIST_OF_CATEGORY_TOPICS, {
        params: { category_id: categoryId },
      });
    },
    createTopic(payload: object): Promise<AxiosResponse> {
      console.log("creating new topic...");
      return instance.post(forumEndpoints.CREATE_TOPIC, payload);
    },
    editTopic(payload: object): Promise<AxiosResponse> {
      console.log(`editing topic...`);
      return instance.post(forumEndpoints.EDIT_TOPIC, payload);
    },
    deleteTopic(payload: object): Promise<AxiosResponse> {
      console.log(`deleting topic...`);
      return instance.delete(forumEndpoints.DELETE_TOPIC, { data: payload });
    },
    getTopic(payload: object): Promise<AxiosResponse> {
      console.log("getting topic with payload=", payload); //id, category_id, [count[ = 20], page[ = 1]]
      return instance.get(forumEndpoints.GET_TOPIC, {
        params: payload,
      });
    },
    getMessage(postId: number): Promise<AxiosResponse> {
      console.log(`getting message with id=${postId}`);
      return instance.get(forumEndpoints.GET_MESSAGE, {
        params: { id: postId },
      });
    },
    createMessage(payload: object): Promise<AxiosResponse> {
      console.log(`creating new message...`);
      return instance.post(forumEndpoints.CREATE_MESSAGE, payload);
    },
    editMessage(payload: object): Promise<AxiosResponse> {
      console.log(`editing message... ${payload}`);
      return instance.post(forumEndpoints.EDIT_MESSAGE, payload);
    },
    deleteMessage(payload: object): Promise<AxiosResponse> {
      console.log(`deleting message ${payload}...`);
      return instance.delete(forumEndpoints.DELETE_MESSAGE, { data: payload });
    },
    likeMessage(id: object): Promise<AxiosResponse> {
      console.log(`liking message ${id}...`);
      return instance.put(forumEndpoints.LIKE_MESSAGE, null, {
        params: { id },
      });
    },
    unlikeMessage(id: object): Promise<AxiosResponse> {
      console.log(`liking message ${id}...`);
      return instance.delete(forumEndpoints.UNLIKE_MESSAGE, { params: { id } });
    },
    updateTopicStatus(payload: object): Promise<AxiosResponse> {
      console.log(`updating topic status...`);
      return instance.post(forumEndpoints.UPDATE_TOPIC_STATUS, payload);
    },
    sendAttachedFilesMetadata(payload: object): Promise<AxiosResponse> {
      console.log(`sending attached files metadata...`);
      return instance.post(forumEndpoints.ATTACH_FILES_TO_POST, payload);
    },
  };
}
