type MutationMethod = (...arg: any[]) => any;
type ActionMethod = (...arg: any[]) => Promise<any>;

import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";

function getProperty<T>(obj: T, propertyPath: string): unknown {
  return propertyPath.split("/").reduce((acc, key) => acc && acc[key], obj as any);
}
export function useMapState<Key extends string>(namespace: string, map: Record<Key, (store: any) => any>): { [K in Key]: ComputedRef<any> } {
  const store = useStore();

  const stateProperties: Partial<{ [K in Key]: ComputedRef<any> }> = {};
  for (const key of Object.keys(map)) {
    stateProperties[key as keyof typeof map] = computed(() => {
      return map[key as keyof typeof map](getProperty(store.state, namespace));
    });
  }
  return stateProperties as { [K in Key]: ComputedRef<any> };
}

export function useMapMutations<Key extends string>(namespace: string, map: Key[]): { [K in Key]: ActionMethod } {
  const store = useStore();

  const stateProperties: Partial<{ [K in Key]: MutationMethod }> = {};
  for (let i = 0; i < map.length; i++) {
    const mutationMethod: (...arg: any[]) => any = (...arg: any[]) => {
      return store.commit(namespace + "/" + map[i], ...arg);
    };
    stateProperties[map[i]] = mutationMethod;
  }
  return stateProperties as { [K in Key]: ActionMethod };
}

export function useMapActions<Key extends string>(namespace: string, map: Key[]): { [K in Key]: ActionMethod } {
  const store = useStore();

  const stateProperties: Partial<{ [K in Key]: ActionMethod }> = {};
  for (let i = 0; i < map.length; i++) {
    const actionMethod: (...arg: any[]) => Promise<any> = (...arg: any[]) => {
      return store.dispatch(namespace + "/" + map[i], ...arg);
    };
    stateProperties[map[i]] = actionMethod;
  }
  return stateProperties as { [K in Key]: ActionMethod };
}
