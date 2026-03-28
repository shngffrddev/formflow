import type { StepDefinition } from '@lib/types'
import * as schemas from './schemas'

export const steps: StepDefinition[] = [
  {
    id: 'personal-info',
    title: 'About You',
    subtitle: 'Basic contact information',
    schema: schemas.personalInfo,
    order: 10,
  },
  {
    id: 'role-selection',
    title: 'Role & Team',
    subtitle: 'Which position are you applying for?',
    schema: schemas.roleSelection,
    order: 20,
  },
  {
    id: 'experience-level',
    title: 'Your Experience',
    subtitle: 'Tell us about your background',
    schema: schemas.experienceLevel,
    order: 30,
  },

  // ── Salary shown early (order 35) for senior applicants (5+ years) ──────────
  {
    id: 'salary',
    title: 'Compensation',
    subtitle: 'Your salary expectations',
    schema: schemas.salary,
    order: 35,
    condition: {
      op: 'gte',
      field: 'yearsExperience',
      value: 5,
    },
  },

  // ── Technical step — engineers and PMs only ──────────────────────────────────
  {
    id: 'technical',
    title: 'Technical Background',
    subtitle: 'Languages, tools, and open source',
    schema: schemas.technical,
    order: 40,
    condition: {
      op: 'in',
      field: 'role',
      value: ['frontend-engineer', 'backend-engineer', 'fullstack-engineer', 'product-manager'],
    },
  },

  // ── Portfolio step — design roles only (same order: mutually exclusive) ─────
  {
    id: 'portfolio',
    title: 'Your Portfolio',
    subtitle: 'Share examples of your work',
    schema: schemas.portfolio,
    order: 40,
    condition: {
      op: 'in',
      field: 'role',
      value: ['product-designer', 'ux-researcher'],
    },
  },

  // ── Location — hidden for remote-only applicants ─────────────────────────────
  {
    id: 'location-preference',
    title: 'Work Location',
    subtitle: 'Office and relocation preferences',
    schema: schemas.locationPreference,
    order: 50,
    condition: {
      op: 'neq',
      field: 'workStyle',
      value: 'remote-only',
    },
  },

  {
    id: 'availability',
    title: 'Availability',
    subtitle: 'When can you start?',
    schema: schemas.availability,
    order: 60,
  },

  {
    id: 'review',
    title: 'Review & Submit',
    subtitle: 'Check everything before you apply',
    schema: null,
    order: 70,
  },
]
