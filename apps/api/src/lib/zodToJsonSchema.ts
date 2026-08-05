import type { ZodTypeAny } from 'zod';

/**
 * Conversão leve Zod → JSON Schema (sem dependência zod-to-openapi).
 * Cobre object/string/number/boolean/enum/optional/default/array usados nos schemas do painel.
 */
export function zodToJsonSchema(schema: ZodTypeAny, _name?: string): Record<string, unknown> {
  return convert(schema);
}

function convert(schema: ZodTypeAny): Record<string, unknown> {
  const def = (schema as any)._def;
  if (!def) return { type: 'object' };

  switch (def.typeName) {
    case 'ZodObject': {
      const shape = def.shape();
      const properties: Record<string, unknown> = {};
      const required: string[] = [];
      for (const key of Object.keys(shape)) {
        const field = shape[key] as ZodTypeAny;
        properties[key] = convert(field);
        if (!isOptional(field)) required.push(key);
      }
      return {
        type: 'object',
        properties,
        ...(required.length ? { required } : {}),
        additionalProperties: false,
      };
    }
    case 'ZodString':
      return { type: 'string' };
    case 'ZodNumber':
      return { type: 'number' };
    case 'ZodBoolean':
      return { type: 'boolean' };
    case 'ZodEnum':
      return { type: 'string', enum: def.values };
    case 'ZodNativeEnum':
      return { type: 'string', enum: Object.values(def.values).filter((v) => typeof v === 'string') };
    case 'ZodArray':
      return { type: 'array', items: convert(def.type) };
    case 'ZodOptional':
    case 'ZodNullable':
      return convert(def.innerType);
    case 'ZodDefault':
      return { ...convert(def.innerType), default: def.defaultValue() };
    case 'ZodEffects':
      return convert(def.schema);
    case 'ZodUnion':
      return { anyOf: (def.options as ZodTypeAny[]).map(convert) };
    case 'ZodLiteral':
      return { const: def.value };
    case 'ZodRecord':
      return { type: 'object', additionalProperties: convert(def.valueType) };
    default:
      return { type: 'object', description: def.typeName };
  }
}

function isOptional(schema: ZodTypeAny): boolean {
  const def = (schema as any)._def;
  if (!def) return false;
  if (def.typeName === 'ZodOptional' || def.typeName === 'ZodDefault') return true;
  if (def.typeName === 'ZodNullable') return isOptional(def.innerType);
  if (def.typeName === 'ZodEffects') return isOptional(def.schema);
  return false;
}
