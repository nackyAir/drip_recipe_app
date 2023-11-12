import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { Nopage } from '~/components/org/noPage'
import { PageExist } from '~/components/org/pageExist'
import { getFirebaseStore } from '~/libs/firebase'

export const Home = () => {
  const router = useRouter()
  const [pageComponent, setPageComponent] = useState<JSX.Element | null>(<></>)
  const url = router.query.id

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    getRecipeById(url as string).then((data) => {
      setPageComponent(data)
    })

    if (url === undefined) {
      router.push('/')
    }
  }, [router, url])

  return (
    <div>
      <h1>Recipe</h1>
      {pageComponent}
    </div>
  )
}

export const getRecipeById = async (url: string) => {
  const db = getFirebaseStore()
  const docRef = doc(db, 'recipes', url)

  const docSnap = await getDoc(docRef)

  if (!docSnap.exists()) {
    return <PageExist />
  }
  return <Nopage />
}

export default Home
