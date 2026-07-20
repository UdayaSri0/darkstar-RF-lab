import type { ComponentInstance } from "../../app/types";
import { createPlaceholderRuntime } from "./placeholderRuntime";
import type {
  ComponentDefinition,
  ComponentRegistration,
  ComponentRuntimeFactory,
  ComponentVariantDefinition,
  RuntimeComponent,
  TerminalDefinition,
} from "./types";
import { assertLocalAssetPath, resolveVariant } from "./variantResolver";

export class ComponentRegistry {
  private readonly registrations = new Map<string, ComponentRegistration>();

  constructor(registrations: ComponentRegistration[] = []) {
    registrations.forEach((registration) => this.register(registration.definition, registration.factory));
  }

  register(definition: ComponentDefinition, factory: ComponentRuntimeFactory): void {
    if (this.registrations.has(definition.typeId)) {
      throw new Error(`Duplicate component type ID "${definition.typeId}".`);
    }
    assertUniqueIds(definition.variants.map((variant) => variant.variantId), `variant in ${definition.typeId}`);
    assertUniqueIds(definition.terminals.map((terminal) => terminal.id), `terminal in ${definition.typeId}`);
    definition.variants.forEach((variant) => {
      if (variant.asset.kind === "glb") assertLocalAssetPath(variant.asset.path);
    });
    this.registrations.set(definition.typeId, { definition, factory });
  }

  getDefinition(typeId: string): ComponentDefinition | undefined {
    return this.registrations.get(typeId)?.definition;
  }

  getVariant(typeId: string, variantId: string): ComponentVariantDefinition | undefined {
    const definition = this.getDefinition(typeId);
    return definition ? resolveVariant(definition, variantId) : undefined;
  }

  createRuntime(instance: ComponentInstance): RuntimeComponent {
    const registration = this.registrations.get(instance.typeId);
    if (!registration) {
      return createPlaceholderRuntime(instance, `Unknown component type "${instance.typeId}".`);
    }
    const variant = resolveVariant(registration.definition, instance.variantId);
    if (!variant) {
      return createPlaceholderRuntime(
        instance,
        `Unknown variant "${instance.variantId}" for component type "${instance.typeId}".`,
        registration.definition,
      );
    }
    try {
      return registration.factory.create({ instance, definition: registration.definition, variant });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Component factory failed.";
      return createPlaceholderRuntime(instance, message, registration.definition, variant);
    }
  }

  getTerminal(instance: ComponentInstance, terminalId: string): TerminalDefinition | undefined {
    const definition = this.getDefinition(instance.typeId);
    if (!definition || !this.getVariant(instance.typeId, instance.variantId)) return undefined;
    return definition.terminals.find((terminal) => terminal.id === terminalId);
  }

  listByCategory(category: string): ComponentDefinition[] {
    return [...this.registrations.values()]
      .map((registration) => registration.definition)
      .filter((definition) => definition.category === category);
  }

  listDefinitions(): ComponentDefinition[] {
    return [...this.registrations.values()].map((registration) => registration.definition);
  }
}

function assertUniqueIds(ids: string[], label: string): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`Duplicate ${label} ID "${id}".`);
    seen.add(id);
  }
}
