"use client"

import type { Candidate, EditRecord, User } from "./types"

const KEYS = {
  users: "examapp:users",
  session: "examapp:session",
  candidates: "examapp:candidates",
  edits: "examapp:edits",
}

const DEMO_USERS: User[] = [{ email: "examinateur@demo.cm", password: "demo1234", name: "Jean Examinateur" }]

const DEMO_CANDIDATES: Candidate[] = [
  { matricule: "C-1001", fullName: "Awa Ngono", notes: { francais: 14, mathematiques: 11, expressionOrale: 16 } },
  { matricule: "C-1002", fullName: "Brice Talla", notes: { francais: 9, mathematiques: 17, expressionOrale: 12 } },
  { matricule: "C-1003", fullName: "Chantal Mballa", notes: { francais: 18, mathematiques: 13, expressionOrale: 15 } },
  { matricule: "C-1004", fullName: "David Fotso", notes: { francais: 7, mathematiques: 6, expressionOrale: 10 } },
  { matricule: "C-1005", fullName: "Estelle Nkeng", notes: { francais: 15, mathematiques: 19, expressionOrale: 14 } },
]

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export function seedIfNeeded() {
  if (typeof window === "undefined") return
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, DEMO_USERS)
  if (!localStorage.getItem(KEYS.candidates)) write(KEYS.candidates, DEMO_CANDIDATES)
  if (!localStorage.getItem(KEYS.edits)) write(KEYS.edits, [])
}

// --- Auth ---
export function register(name: string, email: string, password: string): { ok: boolean; error?: string } {
  const users = read<User[]>(KEYS.users, [])
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "Un compte existe déjà avec cet email." }
  }
  users.push({ name, email, password })
  write(KEYS.users, users)
  write(KEYS.session, email)
  return { ok: true }
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  const users = read<User[]>(KEYS.users, [])
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user || user.password !== password) {
    return { ok: false, error: "Email ou mot de passe incorrect." }
  }
  write(KEYS.session, email)
  return { ok: true }
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem(KEYS.session)
}

export function getCurrentUser(): User | null {
  const email = read<string | null>(KEYS.session, null)
  if (!email) return null
  const users = read<User[]>(KEYS.users, [])
  return users.find((u) => u.email === email) ?? null
}

// --- Candidates ---
export function findCandidate(matricule: string): Candidate | null {
  const candidates = read<Candidate[]>(KEYS.candidates, [])
  const q = matricule.trim().toLowerCase()
  return candidates.find((c) => c.matricule.toLowerCase() === q) ?? null
}

export function updateNote(matricule: string, subject: keyof Candidate["notes"], newValue: number): Candidate | null {
  const candidates = read<Candidate[]>(KEYS.candidates, [])
  const idx = candidates.findIndex((c) => c.matricule === matricule)
  if (idx === -1) return null
  const oldValue = candidates[idx].notes[subject]
  if (oldValue === newValue) return candidates[idx]
  candidates[idx] = { ...candidates[idx], notes: { ...candidates[idx].notes, [subject]: newValue } }
  write(KEYS.candidates, candidates)

  const edits = read<EditRecord[]>(KEYS.edits, [])
  edits.unshift({
    id: crypto.randomUUID(),
    matricule,
    fullName: candidates[idx].fullName,
    subject,
    oldValue,
    newValue,
    editedAt: Date.now(),
  })
  write(KEYS.edits, edits)
  return candidates[idx]
}

export function getEdits(): EditRecord[] {
  return read<EditRecord[]>(KEYS.edits, [])
}
