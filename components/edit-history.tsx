"use client"

import type { EditRecord } from "@/lib/types"
import { SUBJECT_LABELS } from "@/lib/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { History, ArrowRight } from "lucide-react"

export function EditHistory({ edits }: { edits: EditRecord[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b p-5">
        <History className="size-5 text-primary" />
        <h2 className="text-base font-semibold">Historique des modifications</h2>
        <Badge variant="secondary" className="ml-auto">
          {edits.length}
        </Badge>
      </div>

      {edits.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted-foreground">
          Aucune note n&apos;a encore été modifiée.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidat</TableHead>
                <TableHead>Matricule</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Changement</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {edits.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{e.matricule}</TableCell>
                  <TableCell>{SUBJECT_LABELS[e.subject]}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 tabular-nums">
                      <span className="text-muted-foreground line-through">{e.oldValue}</span>
                      <ArrowRight className="size-3.5 text-primary" />
                      <span className="font-semibold text-foreground">{e.newValue}</span>
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(e.editedAt).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
