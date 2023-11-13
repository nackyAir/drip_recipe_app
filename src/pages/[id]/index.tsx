import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { Layout } from '~/Layout/layout'
import { NoPage } from '~/components/org/noPage'
import { PageExist } from '~/components/org/pageExist'
import { getFirebaseStore } from '~/libs/firebase'
import { RecipeType } from '~/types'

const Home = () => {
  const [pageComponent, setPageComponent] = useState<JSX.Element | null>(null)

  const router = useRouter()
  const url = router.query.id

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    getRecipeById(url as string)
      .then((data) => {
        setPageComponent(data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [router, url])

  return <Layout>{pageComponent}</Layout>
}

export default Home

export const getRecipeById = async (url: string) => {
  const db = getFirebaseStore()
  const docRef = doc(db, 'recipes', url)
  const docSnap = await getDoc(docRef)

  const data = docSnap.data() as RecipeType

  if (!docSnap.exists()) {
    return <NoPage />
  }
  return <PageExist data={data} />
}
