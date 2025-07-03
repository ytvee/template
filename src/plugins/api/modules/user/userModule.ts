import userEndpoints from "@/data/api/user/userEndpoints.json";
import type { APIModule } from "@/utils/types/api.types";
import type { Axios, AxiosResponse } from "axios";

export default function (instance: Axios): APIModule {
  return {
    async getCurrentUser(): Promise<AxiosResponse> {
      console.log("getting current user...");
      const responce = await instance.get(userEndpoints.GET_CURRENT_USER);
      return responce;
    },
    getCreativeUsersList(artistId: number): Promise<AxiosResponse> {
      console.log("getting creative users list...");
      return artistId ? instance.get(userEndpoints.GET_CREATIVE_USERS_LIST_EXCLUDE_ARTIST + artistId) : instance.get(userEndpoints.GET_CREATIVE_USERS_LIST);
    },
    getUserRoleSubmitStatus(): Promise<AxiosResponse> {
      console.log("getting user role submit status...");
      return instance.get(userEndpoints.GET_USER_ROLE_SUBMIT_STATUS);
    },
    getCreatorsForApprove(): Promise<AxiosResponse> {
      console.log("getting creators for approve...");
      return instance.get(userEndpoints.GET_CLAIMS_FOR_ROLE_CREATOR);
    },
    getCreators(): Promise<AxiosResponse> {
      console.log("getting creators...");
      return instance.get(userEndpoints.GET_CREATORS);
    },
    getUsersWithFilters(roles: string, isStrict: number): Promise<AxiosResponse> {
      console.log("getting users...");
      return instance.get(userEndpoints.GET_USERS, {
        params: { roles: roles, strict: isStrict },
      });
    },
    getUserById(payload: number): Promise<AxiosResponse> {
      console.log("getting user by id...");
      return instance.get(userEndpoints.GET_USER, { params: { id: payload } });
    },
    getClaimsForRoleCreator(): Promise<AxiosResponse> {
      console.log("getting claims for role creator...");
      return instance.get(userEndpoints.GET_CLAIMS_FOR_ROLE_CREATOR);
    },
    getClaimsForArtists(): Promise<AxiosResponse> {
      console.log("getting claims for artists...");
      return instance.get(userEndpoints.GET_CLAIMS_FOR_ARTISTS);
    },
    confirmCreator(payload: object): Promise<AxiosResponse> {
      console.log("confirm creator claim...", payload);
      return instance.post(userEndpoints.CONFIRM_CREATOR, payload);
    },
    declineCreatorClaim(claimID: number, reasonsList: string[], description: string): Promise<AxiosResponse> {
      console.log("decline creator claim...");
      return instance.delete(userEndpoints.CONFIRM_CREATOR, {
        data: {
          claim_id: claimID,
          reasons: reasonsList,
          description: description,
        },
      });
    },
    declineArtistClaim(claimID: number, reasonsList: string[], description: string): Promise<AxiosResponse> {
      console.log("decline creator claim...");
      return instance.delete(userEndpoints.CONFIRM_ARTIST, {
        data: {
          artist_id: claimID,
          reasons: reasonsList,
          description: description,
        },
      });
    },
    confirmArtist(payload: object): Promise<AxiosResponse> {
      console.log("confirm artists...");
      return instance.post(userEndpoints.CONFIRM_ARTIST, payload);
    },
    uncomfirmClaim(id: number): Promise<AxiosResponse> {
      console.log("unapprove claim...");
      return instance.delete(userEndpoints.UNAPPROVE_CLAIM, {
        params: { id: id },
      });
    },
    updateUserRoles(): Promise<AxiosResponse> {
      console.log("update user roles...");
      return instance.get(userEndpoints.UPDATE_USER_ROLES);
    },
    editUser(payload: object): Promise<AxiosResponse> {
      console.log("update user...");
      return instance.post(userEndpoints.EDIT_USER, payload);
    },
    dismissNotification(id: number): Promise<AxiosResponse> {
      console.log("Dismiss notification...", id);
      return instance.delete(userEndpoints.NOTIFICATION, {
        params: { id: id },
      });
    },
    resolveNotification(id: number, answer: string): Promise<AxiosResponse> {
      console.log("Resolve notification...", id, answer);
      return instance.delete(userEndpoints.NOTIFICATION, {
        params: { id: id, answer: answer },
      });
    },
    deleteUser(id: number): Promise<AxiosResponse> {
      console.log("delete user with id", id);
      return instance.delete(userEndpoints.DELETE_USER, {
        data: { user_id: id },
      });
    },
    deleteArtist(id: number): Promise<AxiosResponse> {
      console.log("delete artist with id", id);
      return instance.delete(userEndpoints.DELETE_ARTIST, {
        data: { artist_id: id },
      });
    },
  };
}
