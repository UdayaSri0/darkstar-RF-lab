import type { ComponentDefinition, ComponentVariantDefinition } from "./types";

const remotePathPattern = /^(?:[a-z]+:)?\/\//i;

export function resolveVariant(
  definition: ComponentDefinition,
  variantId: string,
): ComponentVariantDefinition | undefined {
  return definition.variants.find((variant) => variant.variantId === variantId);
}

export function assertLocalAssetPath(path: string): void {
  if (!path || remotePathPattern.test(path) || path.startsWith("data:") || path.startsWith("blob:") || path.includes("..")) {
    throw new Error(`Component asset path must be local and base-relative: "${path}".`);
  }
}

export function resolveLocalAssetUrl(path: string, baseUrl = import.meta.env.BASE_URL): string {
  assertLocalAssetPath(path);
  const normalisedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return `${normalisedBase}${path.replace(/^\/+/, "")}`;
}
