// routes/cooperativeExperts.ts
import express from 'express'
import { getHistorys, createHistorys, updateHistorys, deleteHistorys } from '../controllers/HistorysController'

const router = express.Router()

router.get('/', getHistorys)

router.post('/', createHistorys)

router.put('/:id', updateHistorys)

router.delete('/:id', deleteHistorys)

export default router
