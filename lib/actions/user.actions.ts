// lib/actions/user.actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import User from '@/lib/database/models/user.model'
import { connectToDatabase } from '@/lib/database/mongoose'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()
    const newUser = await User.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    throw new Error(`User creation failed: ${error}`)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase()
    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true
    })
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    throw new Error(`User update failed: ${error}`)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()
    const userToDelete = await User.findOne({ clerkId })
    if (!userToDelete) return null
    await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')
    return JSON.parse(JSON.stringify(userToDelete))
  } catch (error) {
    throw new Error(`User deletion failed: ${error}`)
  }
}

type CreateUserParams = {
  clerkId: string
  email: string
  username: string
  firstName: string
  lastName: string
  photo: string
}

type UpdateUserParams = {
  username: string | undefined
  firstName: string | undefined
  lastName: string | undefined
  photo: string | undefined
}