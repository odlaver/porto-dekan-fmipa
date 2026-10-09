import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Pengguna', plural: 'Pengguna admin' },
  admin: {
    useAsTitle: 'email',
    group: 'Sistem',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}
