import { doc, runTransaction } from 'firebase/firestore'

import { getFirebaseStore } from '~/libs/firebase'

export const generateSequenceNumber = () => {
  const db = getFirebaseStore()

  const recipeRef = doc(db, 'sequenceNumber')

  return runTransaction(db, async (transaction) => {
    const recipeDoc = await transaction.get(recipeRef)

    if (!recipeDoc.exists()) {
      transaction.set(recipeRef, {
        id: 1,
      })
      return 1
    }

    const newId =
      typeof recipeDoc.data()?.id === 'undefined' ? 1 : recipeDoc.data()?.id + 1

    transaction.update(recipeRef, {
      id: newId,
    })

    return newId
  })
}
