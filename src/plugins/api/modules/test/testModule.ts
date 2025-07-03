import testEndpoints from "@/data/api/test/testEndpoints.json";
import type { APIModule } from "@/utils/types/api.types";
import type { Axios, AxiosResponse } from "axios";

export default function (instance: Axios): APIModule {
  return {
    createTestNotification(user_id: number, type: string, message: string): Promise<AxiosResponse> {
      console.log("TEST CREATE_NOTIFICATION...", user_id, type, message);
      return instance.get(testEndpoints.CREATE_NOTIFICATION, {
        params: { user_id: user_id, type: type, message: message },
      });
    },
  };
}
