import mongoose, { Schema, Document } from 'mongoose'
export interface Cards extends Document {
  Name: string
  cardNum: string
  createDT: Date
  updateDT: Date
}

const CardsSchema: Schema = new Schema({
  cardNum: String,
  Name: { type: String, required: true },
  createDT: { type: Date, default: Date.now },
  updateDT: { type: Date, default: Date.now }
})

export const CardsModel = mongoose.model<Cards>('Cards', CardsSchema)
