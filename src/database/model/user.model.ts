import mongoose from 'mongoose'

import BycryptHelper from '../../utilities/bcrypt-helper'

export interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId
  firstName: string
  lastName: string
  username: string
  email: string
  avatar: string
  password: string
}

const UserSchema: mongoose.Schema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true},
  password: { type: String, required: true },
  avatar: { type: String }
}, { timestamps: true })

// Encrypt user password before saving
UserSchema.pre('save', async function() {
  if(this.isModified('password')) {
    // hash user password
    const password = await BycryptHelper.encryptPassword(this.get('password'))
    this.set({ password })
  }
})

export default mongoose.model<UserDocument>('User', UserSchema)
