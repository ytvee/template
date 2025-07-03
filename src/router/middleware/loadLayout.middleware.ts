import type { RouteLocationNormalized } from "vue-router";
import { AppLayouts, AppLayoutToFileMap } from "@/utils/types/layouts.types";

export async function loadLayoutMiddleware(route: RouteLocationNormalized): Promise<void> {
  const { layout } = route.meta;
  const normalizedLayoutName = layout || AppLayouts.DEFAULT;
  const fileName = AppLayoutToFileMap[normalizedLayoutName];
  const fileNameWithoutExtension = fileName.split(".vue")[0];

  const component = await import(`../../layouts/caseLayouts/${fileNameWithoutExtension}.vue`);
  route.meta.layoutComponent = component.default;
}
