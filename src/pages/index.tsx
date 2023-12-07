import Router from 'next/router'

const Home = () => {
  if (process.env.NODE_ENV === 'production') Router.push('/user')

  return <></>
}

export default Home
