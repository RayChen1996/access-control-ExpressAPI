// models/cooperativeExpert.ts
import mongoose, { Schema } from 'mongoose'
import { Cards } from '../models/Cards'
export interface Readers {
  id: string
  name: string
  connection: {
    ip: string
    port: number
  }
  cards: Cards[]
  accessList: {
    listName: string
    cards: Cards[]
  }[]
  picture: string // Assuming this is a URL or file path
}
const ReaderSchema: Schema = new Schema({
  id: String,
  name: String,
  connection: {
    ip: String,
    port: Number
  },
  accessList: [
    {
      listName: { type: String, required: true },
      cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }]
    }
  ],
  cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
  createDT: { type: Date, default: Date.now },
  updateDT: { type: Date, default: Date.now }
})

// export default mongoose.model<Cards>('Cards', CardsSchema)
export const ReadersModel = mongoose.model<Readers>('Readers', ReaderSchema) // Create the model
