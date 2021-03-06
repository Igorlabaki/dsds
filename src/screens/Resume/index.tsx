import React, { useEffect, useState } from 'react'
import { Container, Header, Title } from './styles'
import { HistoryCard } from '../../components/HistoryCard'
import  AsyncStorage  from '@react-native-async-storage/async-storage'
import { categories } from '../../utils/categories'

interface TransactionProps{
  type:       'positive' | 'negative'
  name:       string;
  amount:     string;
  category:   string;
  date:       string
}

interface CategoryData{
  name  : string,
  total : string
}

export  function Resume() {
  
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  
  async function loadData() {
    const dataKey = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const responseFormatted = response ? JSON.parse(response) : []

    const expensives = responseFormatted.
    filter((expensive : TransactionProps) => expensive.type === 'negative')

    const totalByCategory : CategoryData[] = []

    categories.forEach( category => {
      let categorySum = 0

      expensives.forEach((expensive : TransactionProps) => {
        if(expensive.category === category.key){
          categorySum += Number(expensive.amount)
        }
      });

      if(categorySum > 0) {
        const total = categorySum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })

        totalByCategory.push({
          name: category.name,
          total
        })
      }
      setTotalByCategories(totalByCategory)
    })
  }

  useEffect(() => {
    loadData()
  }, [])
  

  return (
    <Container>
        <Header>
            <Title>Resumo por categoria</Title>
        </Header>
        {
          totalByCategories.map((category: CategoryData) => {
            return(
              <HistoryCard 
                title={category.name}
                amount={category.total}
                color='red'
                key={category.name}
              />
            )
          })
        }
    </Container>

  )
}
