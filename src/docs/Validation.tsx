import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'
import {
  H1, H2, H3, Lead, P, Code, CodeBlock, Callout,
} from './DocComponents'

export function Validation() {
  const { setItems } = useTOC()
  useEffect(() => {
    setItems([
      { id: 'attaching-a-schema', label: 'Attaching a schema' },
      { id: 'accessing-errors', label: 'Accessing errors' },
      { id: 'skipping-validation', label: 'Skipping validation' },
      { id: 'cross-field-validation', label: 'Cross-field validation' },
      { id: 'async-validation', label: 'Async validation' },
      { id: 'manual-validation', label: 'Manual validation' },
      { id: 'server-side-reuse', label: 'Server-side reuse' },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <article>
      <H1 badge="Core Concepts">Validation</H1>
      <Lead>
        Each step carries a Zod schema that is validated when the user navigates forward.
        The same schema can be imported on your server — one definition, two layers of safety.
      </Lead>

      <H2 id="attaching-a-schema">Attaching a schema to a step</H2>
      <P>
        Set the <Code>schema</Code> property to a Zod object schema. FormTrek calls{' '}
        <Code>schema.safeParseAsync(state.values)</Code> when <Code>actions.next()</Code>{' '}
        is invoked, and blocks navigation if any errors are returned.
      </P>
      <CodeBlock language="ts" filename="steps.ts">{`import { z } from 'zod'

const steps = [
  {
    id: 'contact',
    title: 'Contact Info',
    schema: z.object({
      email: z.string().email('Please enter a valid email'),
      phone: z.string().regex(/^[+0-9\\s-()]{7,}$/, 'Invalid phone').optional(),
    }),
  },
]`}</CodeBlock>

      <Callout type="warning">
        FormTrek validates the entire <Code>state.values</Code> object against the step's
        schema. Fields that haven't been filled yet will fail required checks —
        use <Code>.optional()</Code> or <Code>.default()</Code> for fields that belong to
        later steps.
      </Callout>

      <H2 id="accessing-errors">Accessing validation errors</H2>
      <P>
        After a failed navigation attempt, errors are available at{' '}
        <Code>state.steps[stepId].errors</Code> — a plain object mapping field paths to
        error messages.
      </P>
      <CodeBlock language="tsx">{`const { state, currentStep } = useTrek({ ... })
const errors = state.steps[currentStep.id]?.errors ?? {}

return (
  <div>
    <input value={...} onChange={...} />
    {errors.email && (
      <p role="alert" className="text-red-500 text-sm mt-1">
        {errors.email}
      </p>
    )}
  </div>
)`}</CodeBlock>

      <H2 id="skipping-validation">Skipping validation</H2>
      <P>
        Set <Code>schema: null</Code> to disable validation for a step entirely.
        Common on review or confirmation steps that don't collect new data.
      </P>
      <CodeBlock language="ts">{`{
  id: 'review',
  title: 'Review & Submit',
  schema: null,
}`}</CodeBlock>

      <H2 id="cross-field-validation">Cross-field validation with .refine()</H2>
      <P>
        Zod's <Code>.refine()</Code> and <Code>.superRefine()</Code> work as expected.
        FormTrek unwraps <Code>ZodEffects</Code> automatically so cross-field errors
        are surfaced at the correct field path.
      </P>
      <CodeBlock language="ts">{`const salarySchema = z.object({
  salaryMin: z.number().min(0),
  salaryMax: z.number().min(0),
}).refine(
  (data) => data.salaryMax >= data.salaryMin,
  {
    message: 'Maximum must be ≥ minimum',
    path: ['salaryMax'],
  }
)`}</CodeBlock>

      <H2 id="async-validation">Async validation</H2>
      <P>
        FormTrek uses <Code>safeParseAsync</Code> internally, so async Zod refinements
        work without any extra configuration:
      </P>
      <CodeBlock language="ts">{`const usernameSchema = z.object({
  username: z.string()
    .min(3)
    .refine(
      async (val) => {
        const res = await fetch(\`/api/check-username?u=\${val}\`)
        return res.ok
      },
      { message: 'Username is already taken' }
    ),
})`}</CodeBlock>

      <H2 id="manual-validation">Manual validation</H2>
      <P>
        Trigger validation without advancing using <Code>actions.validate()</Code>.
        It returns a promise resolving to an error map, and updates{' '}
        <Code>state.steps[currentStep.id].errors</Code> as a side effect — useful for
        on-blur validation.
      </P>
      <CodeBlock language="tsx">{`// On-blur validation
const handleBlur = async () => {
  await actions.validate()
}

// Programmatic check
const errors = await actions.validate()
if (Object.keys(errors).length === 0) {
  // step is valid — safe to proceed
}`}</CodeBlock>

      <H2 id="server-side-reuse">Reusing schemas server-side</H2>
      <P>
        Because schemas are plain Zod objects, you can export them and import them
        directly in API route handlers. No duplication required.
      </P>

      <H3>1. Shared schema file</H3>
      <CodeBlock language="ts" filename="src/schemas/contact.ts">{`import { z } from 'zod'

export const contactSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})`}</CodeBlock>

      <H3>2. Client — FormTrek step</H3>
      <CodeBlock language="ts" filename="src/steps.ts">{`import { contactSchema } from './schemas/contact'

export const steps = [
  {
    id: 'contact',
    title: 'Contact Info',
    schema: contactSchema,
  },
]`}</CodeBlock>

      <H3>3. Server — API route</H3>
      <CodeBlock language="ts" filename="app/api/submit/route.ts">{`// Next.js App Router example
import { contactSchema } from '@/schemas/contact'

export async function POST(req: Request) {
  const body = await req.json()
  const result = contactSchema.safeParse(body)

  if (!result.success) {
    return Response.json(
      { errors: result.error.flatten() },
      { status: 400 }
    )
  }

  // process result.data ...
}`}</CodeBlock>

      <Callout type="important" title="One schema, two layers">
        Client-side validation blocks navigation and gives immediate feedback.
        Server-side validation catches anything that slips through — malformed requests,
        direct API calls, or a stale client bundle.
      </Callout>
    </article>
  )
}
