import Router from 'next/router'

const Home = () => {
  if (process.env.NODE_ENV === 'production') {
    return Router.push('/user')
  }

  return (
    <>
      <h1>TopPage</h1>
    </>
  )
}

export default Home
