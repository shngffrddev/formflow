# FormFlow

Multi-step forms with conditional branching, Zod validation, and partial persistence.

```
npm install @shngffrddev/formflow zod
```

## Why

Multi-step forms are deceptively tricky. The parts that matter — conditional steps that depend on earlier answers, saving progress so users can return later, and validation that works both client-side and server-side without duplicating the schema — aren't handled well by existing solutions. FormFlow is the abstraction that covers all three.

## Features

- **Conditional branching** — Steps can be shown, hidden, or reordered based on values from any earlier step. The logic lives in plain objects — no JSX, no custom DSL.
- **Zod-powered validation** — Each step has a Zod schema. Validation runs on submit and can be re-run server-side against the same schema.
- **Partial persistence** — Form state serialises to JSON and can be saved anywhere: `localStorage`, `sessionStorage`, a URL param, or a custom adapter (e.g. your own API).
- **Headless** — No UI is imposed. Bring your own components.
- **TypeScript-first** — Fully typed with inference.

---

## Quick start

```tsx
import { useFormFlow, localStorageAdapter } from '@shngffrddev/formflow'
import { z } from 'zod'

const steps = [
  {
    id: 'contact',
    title: 'Contact Info',
    schema: z.object({
      email: z.string().email(),
      name: z.string().min(1),
    }),
  },
  {
    id: 'company',
    title: 'Company',
    // Only shown when the user selects "professional"
    condition: { field: 'accountType', op: 'eq', value: 'professional' },
    schema: z.object({ company: z.string().min(1) }),
  },
  {
    id: 'review',
    title: 'Review',
    schema: null,
  },
]

function MyForm() {
  const { state, actions, currentStep } = useFormFlow({
    formId: 'onboarding',
    steps,
    persistence: localStorageAdapter,
    onComplete: async (values) => {
      await fetch('/api/submit', { method: 'POST', body: JSON.stringify(values) })
    },
  })

  if (state.isComplete) return <p>Done!</p>

  const errors = state.steps[currentStep.id]?.errors ?? {}

  return (
    <form onSubmit={(e) => { e.preventDefault(); actions.next() }}>
      <h2>{currentStep.title}</h2>

      {currentStep.id === 'contact' && (
        <>
          <input
            value={(state.values.email as string) ?? ''}
            onChange={(e) => actions.setValues({ email: e.target.value })}
          />
          {errors.email && <p>{errors.email}</p>}
        </>
      )}

      <div>
        {!state.isFirstStep && <button type="button" onClick={actions.back}>Back</button>}
        <button type="submit">{state.isLastStep ? 'Submit' : 'Next'}</button>
      </div>
    </form>
  )
}
```

---

## useFormFlow(options)

### Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `formId` | `string` | — | **Required.** Unique ID used as the persistence key. |
| `steps` | `StepDefinition[]` | — | **Required.** Ordered array of step definitions. |
| `persistence` | `PersistenceAdapter \| null` | `null` | Adapter for saving and loading form state. |
| `onComplete` | `(values: FormValues) => void \| Promise<void>` | — | Called when the final step is submitted. |
| `initialValues` | `FormValues` | `{}` | Default values. Persisted values take precedence on load. |

### Returns

```ts
{
  state: FormFlowState
  actions: FormFlowActions
  currentStep: StepDefinition
}
```

---

## StepDefinition

```ts
interface StepDefinition {
  id: string
  title: string
  subtitle?: string
  schema: ZodTypeAny | null   // null = no validation
  condition?: Condition        // step is hidden when this evaluates to false
  order?: number              // lower numbers appear first
}
```

---

## Conditions

A condition is a plain object evaluated against the current form values.

### Simple conditions

```ts
{ field: 'role', op: 'eq', value: 'admin' }
{ field: 'age', op: 'gte', value: 18 }
{ field: 'plan', op: 'in', value: ['pro', 'enterprise'] }
{ field: 'gdprConsent', op: 'truthy' }
```

**Operators:** `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `notIn`, `truthy`, `falsy`

### Compound conditions

```ts
// All must be true
{ and: [
  { field: 'role', op: 'eq', value: 'engineer' },
  { field: 'yearsExperience', op: 'gte', value: 5 },
]}

// Any must be true
{ or: [
  { field: 'role', op: 'eq', value: 'designer' },
  { field: 'role', op: 'eq', value: 'researcher' },
]}

// Negate a condition
{ not: { field: 'workStyle', op: 'eq', value: 'remote-only' } }
```

---

## Persistence adapters

Four built-in adapters are provided:

```ts
import {
  localStorageAdapter,    // localStorage — survives browser close
  sessionStorageAdapter,  // sessionStorage — cleared on tab close
  urlParamsAdapter,       // ?state= URL param — shareable links
  nullAdapter,            // no-op — disables persistence
} from '@shngffrddev/formflow'
```

### Custom adapter

```ts
import type { PersistenceAdapter } from '@shngffrddev/formflow'

const apiAdapter: PersistenceAdapter = {
  async load(formId) {
    const res = await fetch(`/api/drafts/${formId}`)
    return res.ok ? (await res.json()).values : null
  },
  async save(formId, values) {
    await fetch(`/api/drafts/${formId}`, {
      method: 'PUT',
      body: JSON.stringify({ values }),
    })
  },
  async clear(formId) {
    await fetch(`/api/drafts/${formId}`, { method: 'DELETE' })
  },
}
```

---

## State reference

```ts
state.values              // Record<string, FieldValue> — all accumulated values
state.activeStepIds       // string[] — currently visible steps (conditions evaluated)
state.currentIndex        // number — 0-based position in activeStepIds
state.currentStepId       // string — current step id
state.isFirstStep         // boolean
state.isLastStep          // boolean
state.isComplete          // boolean — true after onComplete resolves
state.steps[id].status    // 'pending' | 'active' | 'complete' | 'skipped'
state.steps[id].errors    // Record<string, string> — field-level validation errors
```

## Actions reference

```ts
actions.next()              // validate + advance (or complete). Returns Promise<boolean>
actions.back()              // go back without validation
actions.goTo(stepId)        // jump to a completed step
actions.setValues(patch)    // merge partial values, re-evaluate conditions
actions.validate()          // validate current step without advancing
actions.reset()             // clear persistence + return to step 0
```

---

## Server-side validation

Export your Zod schemas from the step definitions and import them in your API handlers:

```ts
// schemas/contact.ts
export const contactSchema = z.object({ email: z.string().email() })

// steps.ts (client)
import { contactSchema } from './schemas/contact'
const steps = [{ id: 'contact', title: 'Contact', schema: contactSchema }]

// api/submit.ts (server)
import { contactSchema } from './schemas/contact'
const result = contactSchema.safeParse(req.body)
```

---

## License

MIT
