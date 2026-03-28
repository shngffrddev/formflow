import { z } from 'zod'

export const personalInfo = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName:  z.string().min(1, 'Last name is required'),
  email:     z.string().email('Enter a valid email address'),
  phone:     z.string().regex(/^\+?[\d\s\-(). ]{7,15}$/, 'Enter a valid phone number').optional().or(z.literal('')),
})

export const roleSelection = z.object({
  role: z.enum(
    ['frontend-engineer', 'backend-engineer', 'fullstack-engineer', 'product-manager', 'product-designer', 'ux-researcher'],
    { errorMap: () => ({ message: 'Please select a role' }) },
  ),
})

export const experienceLevel = z.object({
  yearsExperience: z.coerce
    .number({ invalid_type_error: 'Enter a number' })
    .int('Must be a whole number')
    .min(0, 'Must be 0 or more')
    .max(50, 'Must be 50 or less'),
  workStyle: z.enum(['remote-only', 'hybrid', 'office-first'], {
    errorMap: () => ({ message: 'Please select a work style' }),
  }),
  currentlyEmployed: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
})

export const technical = z.object({
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  hasOpenSource: z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
  githubUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
})

export const portfolio = z.object({
  portfolioUrl:        z.string().url('Enter a valid portfolio URL'),
  preferredTool:       z.enum(['figma', 'sketch', 'adobe-xd', 'other'], {
    errorMap: () => ({ message: 'Please select a tool' }),
  }),
  caseStudyDescription: z.string().min(50, 'Describe a case study in at least 50 characters'),
})

export const salary = z.object({
  salaryMin: z.coerce.number({ invalid_type_error: 'Enter a number' }).min(0),
  salaryMax: z.coerce.number({ invalid_type_error: 'Enter a number' }).min(0),
  currency:  z.enum(['USD', 'EUR', 'GBP', 'CAD', 'AUD'], {
    errorMap: () => ({ message: 'Please select a currency' }),
  }),
}).refine(d => d.salaryMax >= d.salaryMin, {
  message: 'Maximum must be at least the minimum',
  path: ['salaryMax'],
})

export const locationPreference = z.object({
  preferredOffice: z.enum(['new-york', 'london', 'berlin', 'toronto', 'flexible'], {
    errorMap: () => ({ message: 'Please select a location' }),
  }),
  willingToRelocate:   z.enum(['yes', 'no'], {
    errorMap: () => ({ message: 'Please select an option' }),
  }),
})

export const availability = z.object({
  noticePeriodWeeks: z.coerce
    .number({ invalid_type_error: 'Enter a number' })
    .int()
    .min(0)
    .max(52, 'Maximum 52 weeks'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a date in YYYY-MM-DD format'),
  referralSource: z.enum(['linkedin', 'job-board', 'referral', 'company-website', 'other'], {
    errorMap: () => ({ message: 'Please select a source' }),
  }),
})
