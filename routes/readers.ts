// routes/houseSymptoms.ts
import express from 'express'
import { createReaders, deleteReaders, getReaders, updateReaders } from '../controllers/ReadersController'

const router = express.Router()

router.get('/', getReaders)

router.post('/', createReaders)

router.put('/:id', updateReaders)

router.delete('/:id', deleteReaders)

export default router
