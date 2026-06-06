import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NoteGest — Gestion des notes des candidats',
    short_name: 'NoteGest',
    description: 'Recherchez un candidat par matricule, consultez et corrigez ses notes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2d8c3c',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
