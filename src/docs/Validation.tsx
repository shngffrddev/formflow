import { useEffect } from 'react'
import { useTOC } from './DocsTOCContext'

function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-3xl font-bold tracking-tight mb-3">{children}</h1>
}
function H2({ children, id }: { children: React.ReactNode; id?: string }) {
  return <h2 id={id} className="text-xl font-semibold tracking-tight mt-10 mb-3 scroll-mt-20">{children}</h2>
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold mt-6 mb-2">{children}</h3>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-zinc-600 leading-relaxed mb-4">{children}</p>
}
function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-zinc-100 text-zinc-800 text-sm px-1.5 py-0.5 rounded font-mono">{children}</code>
}
function Pre({ children }: { children: string }) {
  return (
    <pre className="bg-zinc-900 text-zinc-200 text-sm font-mono rounded-xl p-5 overflow-x-auto leading-relaxed my-4">
      <code>{children}</code>
    </pre>
  )
}
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 my-4 text-sm text-zinc-600 leading-relaxed">
      {children}
    </div>
  )
}

export function Validation() {
  const { setItems } = useTOC()
  useEffect(() => {
    setItems([
      { id: 'attaching-a-schema', label: 'Attaching a schema' },
      { id: 'accessing-errors', label: 'Accessing errors' },
      { id: 'skipping-validation', label: 'Skipping validation' },
      { id: 'cross-field-validation', label: 'Cross-field validation' },
      { id: 'async-validation', label: 'Async validation' },
      { id: 'server-side-reuse', label: 'Server-side reuse' },
    ])
    return () => setItems([])
  }, [setItems])

  return (
    <article>
      <div className="mb-8">
        <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Core Concepts</p>
        <H1>Validation</H1>
        <p className="text-lg text-zinc-500 leading-relaxed">
          Each step is validated by a Zod schema when the user navigates forward.
          The same schema can be reused on your server — one definition, two layers of safety.
        </p>
      </div>

      <H2 id="attaching-a-schema">Attaching a schema to a step</H2>
      <P>
        Set the <Code>schema</Code> property to a Zod object schema. FormFlow calls
        <Code>schema.safeParseAsync(state.values)</Code> when <Code>actions.next()</Code>
        is called and navigation is blocked if any errors are returned.
      </P>
      <Pre>{`import { z } from 'zod'

const steps = [
  {
    id: 'contact',
    title: 'Contact Info',
    schema: z.object({
      email: z.string().email('Please enter a valid email'),
      phone: z.string().regex(/^[+0-9\\s-()]{7,}$/, 'Invalid phone number').optional(),
    }),
  },
]`}</Pre>

      <Note>
        <strong>Note:</strong> FormFlow validates the entire <Code>state.values</Code> object
        against the step's schema. Schema fields that don't exist in <Code>values</Code>
        will fail required checks — make sure your schemas use <Code>.optional()</Code>
        or <Code>.default()</Code> for fields that haven't been filled yet.
      </Note>

      <H2 id="accessing-errors">Accessing validation errors</H2>
      <P>
        After a failed navigation attempt, errors are available at
        <Code>state.steps[stepId].errors</Code> — a plain object mapping field paths to
        error messages.
      </P>
      <Pre>{`const { state, currentStep } = useFormFlow({ ... })
const errors = state.steps[currentStep.id]?.errors ?? {}

return (
  <div>
    <input value={...} onChange={...} />
    {errors.email && (
      <p role="alert" className="text-red-500 text-sm">{errors.email}</p>
    )}
  </div>
)`}</Pre>

      <H2 id="skipping-validation">Skipping validation</H2>
      <P>
        Set <Code>schema: null</Code> to disable validation for a step entirely.
        This is common for review or confirmation steps that don't collect new data.
      </P>
      <Pre>{`{
  id: 'review',
  title: 'Review & Submit',
  schema: null,
}`}</Pre>

      <H2 id="cross-field-validation">Cross-field validation with .refine()</H2>
      <P>
        Zod's <Code>.refine()</Code> and <Code>.superRefine()</Code> work as expected.
        FormFlow unwraps <Code>ZodEffects</Code> automatically, so cross-field errors
        are surfaced at the field level.
      </P>
      <Pre>{`const salarySchema = z.object({
  salaryMin: z.number().min(0),
  salaryMax: z.number().min(0),
}).refine(
  (data) => data.salaryMax >= data.salaryMin,
  {
    message: 'Maximum must be greater than or equal to minimum',
    path: ['salaryMax'],
  }
)`}</Pre>

      <H2 id="async-validation">Async validation</H2>
      <P>
        FormFlow uses <Code>safeParseAsync</Code> internally, so async Zod refinements
        work without any extra configuration:
      </P>
      <Pre>{`const usernameSchema = z.object({
  username: z.string()
    .min(3)
    .refine(
      async (val) => {
        const res = await fetch(\`/api/check-username?u=\${val}\`)
        return res.ok
      },
      { message: 'Username is already taken' }
    ),
})`}</Pre>

      <H2 id="manual-validation">Manual validation</H2>
      <P>
        You can trigger validation without advancing the form using
        <Code>actions.validate()</Code>. It returns a promise that resolves to an
        error map, and updates <Code>state.steps[currentStep.id].errors</Code> as a
        side effect.
      </P>
      <Pre>{`const handleBlur = async () => {
  await actions.validate()
}

// Or check for errors programmatically:
const errors = await actions.validate()
if (Object.keys(errors).length === 0) {
  // step is valid
}`}</Pre>

      <H2 id="server-side-reuse">Reusing schemas server-side</H2>
      <P>
        Because schemas are plain Zod objects, you can export them from your step
        definitions and import them in your API route handlers. No duplication required.
      </P>

      <H3>Shared schema file</H3>
      <Pre>{`// src/schemas/contact.ts
import { z } from 'zod'

export const contactSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})`}</Pre>

      <H3>Client — FormFlow step</H3>
      <Pre>{`// src/steps.ts
import { contactSchema } from './schemas/contact'

export const steps = [
  {
    id: 'contact',
    title: 'Contact Info',
    schema: contactSchema,
  },
]`}</Pre>

      <H3>Server — API route</H3>
      <Pre>{`// app/api/submit/route.ts  (Next.js App Router example)
import { contactSchema } from '@/schemas/contact'

export async function POST(req: Request) {
  const body = await req.json()
  const result = contactSchema.safeParse(body)

  if (!result.success) {
    return Response.json({ errors: result.error.flatten() }, { status: 400 })
  }

  // process result.data ...
}`}</Pre>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-6 text-sm text-emerald-800 leading-relaxed">
        <strong>One schema, two layers of safety.</strong> Client-side validation blocks
        navigation and gives immediate feedback. Server-side validation catches anything
        that slips through — malformed requests, direct API calls, or a stale client bundle.
      </div>
    </article>
  )
}
