import { Container, Text } from '@mantine/core';

import { RecipeCard } from '~/components/mol/Card/recipeCard';

export default function Home() {
  return (
    <Container>
      <Text>Recipe List</Text>
      <RecipeCard />
    </Container>
  );
}
