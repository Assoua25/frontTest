export type Subject = "francais" | "mathematiques" | "expressionOrale"

export interface Candidate {
  matricule: string
  fullName: string
  notes: Record<Subject, number>
}

export interface EditRecord {
  id: string
  matricule: string
  fullName: string
  subject: Subject
  oldValue: number
  newValue: number
  editedAt: number
}

export interface User {
  email: string
  password: string
  name: string
}

export const SUBJECT_LABELS: Record<Subject, string> = {
  francais: "Français",
  mathematiques: "Mathématiques",
  expressionOrale: "Expression orale",
}
