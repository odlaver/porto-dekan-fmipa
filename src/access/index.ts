import type { Access } from 'payload'

export const publik: Access = () => true

export const masuk: Access = ({ req }) => Boolean(req.user)
