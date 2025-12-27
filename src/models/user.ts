import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password?: string | null
  isVerified: boolean
  verificationCode?: string
  termsAccepted: boolean // ✅ add this
  provider?: string // ✅ add this (e.g. "google", "facebook")
  name?: string
  picture?: string
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    termsAccepted: { type: Boolean, default: false }, // ✅
    provider: { type: String, default: 'local' }, //
    name: { type: String },
    picture: { type: String }
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
