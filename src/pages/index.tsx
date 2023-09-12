import { Container, Text } from '@mantine/core'

import { RecipeCard } from '~/components/mol/Card/recipeCard'

const Home = () => {
  return (
    <Container>
      <Text>Recipe List</Text>
      <RecipeCard />
    </Container>
  )
}

export default Home
