import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'

import { getFirebaseStore } from '~/libs/firebase'
import { RecipeType } from '~/types'

export const createRecipe = async (value: RecipeType[]) => {
  const db = getFirebaseStore()

  return setDoc(doc(db, 'recipes'), {
    ...value,
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

export const deleteReciepe = async (recipeId: string) => {
  const db = getFirebaseStore()
  const recipeRef = doc(db, 'recipes', recipeId)

  return deleteDoc(recipeRef)
}
