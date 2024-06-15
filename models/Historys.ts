import mongoose, { Schema } from 'mongoose'

export interface History {
  id: string
  tags: string[]
  cardNum: string
  name: string
  accessDT: Date
  createDT: Date
  updateDT: Date
  recvDT: Date
}

const HistorysSchema: Schema = new Schema({
  id: String,
  cardNum: String,
  reader: { type: Schema.Types.ObjectId, ref: 'Reader', required: true }, // 修改這一行
  name: { type: String, required: true },
  createDT: { type: Date, default: Date.now },
  accessDT: { type: Date, default: Date.now },
  recvDT: { type: Date, default: Date.now },
  updateDT: { type: Date, default: Date.now }
})

export const HistorysModel = mongoose.model<History>('Historys', HistorysSchema) // Create the model
