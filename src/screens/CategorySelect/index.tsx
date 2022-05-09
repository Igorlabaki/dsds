import React from 'react'
import { FlatList } from 'react-native'
import { Button } from '../../components/Forms/Button'
import { categories } from '../../utils/categories'
import { ButtonText, Category, Container, Footer, Header, Icon, Name, Separator, Title } from './styles'

interface Category{
    key:string
    name:string
}

interface Props {
    category: Category
    setCategory: (item:Category) => void
    closeSelectCategory: () => void
}

export  function CategorySelect({
    category,
    setCategory,
    closeSelectCategory
}: Props) {

  function handleCategorySelect(item: Category){
    setCategory(item)
  }

  return (
    <Container>
        <Header>
            <Title>Category</Title>
        </Header>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.key}
        renderItem={({item}) => (
            <Category
              onPress={() => handleCategorySelect(item)}
              isActive={category.key === item.key}
            >
                <Icon name={item.icon}/>
                <Name>{item.name}</Name>
            </Category>
        )}
        ItemSeparatorComponent={() => 
          <Separator/>
        }
      />
      <Footer>
        <Button title='Selecionar' onPress={() => closeSelectCategory()}>
          <ButtonText></ButtonText>
        </Button>
      </Footer>
    </Container>
  )
}
