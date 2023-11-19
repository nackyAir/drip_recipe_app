import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { getFirebaseStore } from '~/libs/firebase'
import { RecipeType } from '~/types'

export const createRecipe = async (data: RecipeType) => {
  const db = getFirebaseStore()
  const recipeRef = doc(db, 'recipes')

  return setDoc(recipeRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export const getRecipeById = async (recipeId: string) => {
  const db = getFirebaseStore()
  const recipeRef = doc(db, 'recipes', recipeId)

  return getDoc(recipeRef)
}

export const updateRecipe = async ({
  recipeId,
  value,
}: {
  recipeId: string
  value: RecipeType[]
}) => {
  const db = getFirebaseStore()
  const recipeRef = doc(db, 'recipes', recipeId)

  return updateDoc(recipeRef, {
    ...value,
    updatedAt: serverTimestamp(),
  })
}

export const deleteReciep = async (recipeId: string) => {
  const db = getFirebaseStore()
  const recipeRef = doc(db, 'recipes', recipeId)

  return updateDoc(recipeRef, {
    isDeleted: true,
    updatedAt: serverTimestamp(),
  })
}
