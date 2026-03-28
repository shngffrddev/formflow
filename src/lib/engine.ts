import type { Condition, FieldValue, FormValues, StepDefinition, StepId } from './types'

// ─── Condition Evaluator ──────────────────────────────────────────────────────

export function evaluateCondition(condition: Condition, values: FormValues): boolean {
  switch (condition.op) {
    case 'eq':    return values[condition.field] === condition.value
    case 'neq':   return values[condition.field] !== condition.value
    case 'gt':    return (values[condition.field] as number) > condition.value
    case 'gte':   return (values[condition.field] as number) >= condition.value
    case 'lt':    return (values[condition.field] as number) < condition.value
    case 'lte':   return (values[condition.field] as number) <= condition.value
    case 'in':    return (condition.value as FieldValue[]).includes(values[condition.field])
    case 'notIn': return !(condition.value as FieldValue[]).includes(values[condition.field])
    case 'truthy': return Boolean(values[condition.field])
    case 'falsy':  return !values[condition.field]
    case 'and':   return condition.conditions.every(c => evaluateCondition(c, values))
    case 'or':    return condition.conditions.some(c => evaluateCondition(c, values))
    case 'not':   return !evaluateCondition(condition.condition, values)
  }
}

// ─── Active Step Resolver ─────────────────────────────────────────────────────

export function resolveActiveSteps(
  steps: StepDefinition[],
  values: FormValues,
): StepId[] {
  return steps
    .map((step, i) => ({ step, i }))
    .sort((a, b) => {
      const ao = a.step.order ?? a.i
      const bo = b.step.order ?? b.i
      return ao - bo
    })
    .filter(({ step }) =>
      step.condition === undefined || evaluateCondition(step.condition, values)
    )
    .map(({ step }) => step.id)
}

// ─── Validation Runner ────────────────────────────────────────────────────────

export async function validateStep(
  step: StepDefinition,
  values: FormValues,
): Promise<Record<string, string>> {
  if (!step.schema) return {}

  // Unwrap ZodEffects (produced by .refine() / .superRefine()) to get .shape
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawSchema = (step.schema as any)._def?.schema ?? step.schema
  const shape: Record<string, unknown> = rawSchema.shape ?? {}
  const stepKeys = Object.keys(shape)

  const stepValues = Object.fromEntries(stepKeys.map(k => [k, values[k]]))

  const result = await step.schema.safeParseAsync(stepValues)
  if (result.success) return {}

  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0]?.toString() ?? '_root'
    if (!errors[field]) errors[field] = issue.message
  }
  return errors
}
