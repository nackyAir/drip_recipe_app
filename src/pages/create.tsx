import { Button, Text } from '@mantine/core'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

import { Layout } from '~/Layout/layout'
import { getFirebaseStore } from '~/libs/firebase'

type Props = {
  id: number
  city: string
}

const Home = () => {
  const db = getFirebaseStore()
  const [country, setcountry] = useState<Props[]>([])

  const getRecipe = async () => {
    const countryRef = collection(db, 'country')
    const q = query(countryRef, where('id', '==', 1))
    const countrySnap = await getDocs(q)

    let data: Props[] = []

    countrySnap.forEach((docs) => {
      data.push(docs.data() as Props)
    })

    setcountry(data)
  }

  useEffect(() => {
    getRecipe()
  })

  const createRecipe = async () => {
    const countryRef = doc(db, 'country', '2')
    await setDoc(countryRef, {
      id: 2,
      city: 'ニューヨーク',
    })
  }

  return (
    <Layout>
      <Button onClick={createRecipe}>Add Data</Button>
      {country.map((data: Props) => {
        return (
          <div key={data.id}>
            <Text>{data.city}</Text>
          </div>
        )
      })}
    </Layout>
  )
}

export default Home
