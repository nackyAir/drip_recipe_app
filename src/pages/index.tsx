import Router from 'next/router'

const Home = () => {
  if (typeof window !== 'undefined') Router.push('/user')

  return (
    <>
      <h1>TopPage</h1>
    </>
  )
}

export default Home
