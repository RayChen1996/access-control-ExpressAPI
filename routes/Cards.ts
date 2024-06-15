// routes/recommendationArticles.ts
import express from 'express'
import { createCards, deleteCards, getCards, updateCards } from '../controllers/CardsController'

const router = express.Router()

router.get('/', getCards)

router.post('/', createCards)

router.put('/:id', updateCards)

router.delete('/:id', deleteCards)

export default router
