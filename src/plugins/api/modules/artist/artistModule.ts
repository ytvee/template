import artistsEndpoints from "@/data/api/artist/artistsEndpoints.json";
import type { APIModule } from "@/utils/types/api.types";
import type { Axios, AxiosResponse } from "axios";

export default function (instance: Axios): APIModule {
  return {
    getArtists(type = [] as Array<string>, query = "" as string): Promise<AxiosResponse> {
      console.log("Getting artists...");
      return instance.get(artistsEndpoints.ARTISTS, {
        params: { type: type, query: query },
      });
    },
    getArtistsWhereUserIsMember(): Promise<AxiosResponse> {
      console.log("getting artists where user is member...");
      return instance.get(artistsEndpoints.GET_ARTISTS_WHERE_USER_IS_MEMBER);
    },
    getArtist(id: number): Promise<AxiosResponse> {
      console.log(`getting artist with id: ${id}...`);
      return instance.get(artistsEndpoints.ARTIST, { params: { id: id } });
    },
    getFavorites(): Promise<AxiosResponse> {
      console.log("getting favorite artists...");
      return instance.get(artistsEndpoints.FAVORITES);
    },
    getSubscriptions(): Promise<AxiosResponse> {
      console.log("getting subscriptions...");
      return instance.get(artistsEndpoints.SUBSCRIPTIONS);
    },
    addToFavorites(payload: number): Promise<AxiosResponse> {
      console.log("Adding artist to favorites...", payload);
      return instance.post(artistsEndpoints.ADD_TO_FAVORITES, payload);
    },
    addToSubscriptions(payload: number): Promise<AxiosResponse> {
      console.log("Adding artist to subscriptions...", payload);
      return instance.post(artistsEndpoints.ADD_TO_SUBSCRIPTIONS, payload);
    },
    removeFromFavorites(id: number): Promise<AxiosResponse> {
      console.log("Remove artist from favorites...", id);
      return instance.delete(artistsEndpoints.ADD_TO_FAVORITES, {
        params: { id: id },
      });
    },
    removeFromSubscriptions(id: number): Promise<AxiosResponse> {
      console.log("Remove artist from subscriptions...", id);
      return instance.delete(artistsEndpoints.ADD_TO_SUBSCRIPTIONS, {
        params: { id: id },
      });
    },
    createArtist(payload: object): Promise<AxiosResponse> {
      console.log("Creating new artist...");
      return instance.post(artistsEndpoints.CREATE_ARTIST, payload);
    },
    editArtist(id: number, payload: object): Promise<AxiosResponse> {
      console.log(`Editing artist with id ${id}...`);
      return instance.put(artistsEndpoints.EDIT_ARTIST + id, payload);
    },
    uploadImageViaPresignedURL(url: string, formData: FormData): Promise<AxiosResponse> {
      console.log("Uploading images...");
      return instance.post(url, formData);
    },
    getImage(url: string): Promise<AxiosResponse> {
      console.log("getting image...");
      return instance.get(url, { responseType: "blob" });
    },
  };
}
