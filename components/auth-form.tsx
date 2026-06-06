"use client"

import type React from "react"

import { useState } from "react"
import { login, register } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function AuthForm({ onSuccess }: { onSuccess: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const res =
        mode === "login" ? login(email, password) : register(name.trim(), email, password)
      setLoading(false)
      if (res.ok) {
        toast.success(mode === "login" ? "Connexion réussie" : "Compte créé")
        onSuccess()
      } else {
        toast.error(res.error ?? "Une erreur est survenue")
      }
    }, 450)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-secondary px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border bg-card shadow-xl md:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between bg-primary p-10 text-primary-foreground md:flex">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15">
              <GraduationCap className="size-6" />
            </div>
            <span className="text-lg font-semibold">NoteGest</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-balance text-3xl font-bold leading-tight">
              Gérez les notes des candidats en toute simplicité
            </h2>
            <p className="text-pretty text-sm text-primary-foreground/80 leading-relaxed">
              Recherchez un matricule, consultez les résultats et corrigez les notes erronées. Chaque
              modification est tracée automatiquement.
            </p>
          </div>
          <p className="text-xs text-primary-foreground/70">Démo : examinateur@demo.cm / demo1234</p>
        </div>

        {/* Form panel */}
        <div className="p-8 md:p-10">
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-lg font-semibold">NoteGest</span>
          </div>
          <h1 className="text-2xl font-bold">{mode === "login" ? "Connexion" : "Créer un compte"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login" ? "Connectez-vous pour continuer." : "Renseignez vos informations."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {mode === "register" && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre nom"
                  required
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="mt-2 h-11 text-base" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {mode === "login" ? "Se connecter" : "Créer le compte"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "login" ? "Inscrivez-vous" : "Connectez-vous"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
