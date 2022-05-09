import React from 'react'
import { categories } from '../../utils/categories';

import { 
    Amount,
    Category,
    CategoryName,
    Container,
    Date,
    Footer,
    Icon,
    Title
} from './styles'

interface CategoryProps{
    name: string;
    icon:  string;
}

export interface TransactionCardProps{
    type:       'positive' | 'negative'
    name:      string;
    amount:     string;
    category:   string;
    date:       string
}

interface DataProps{
    data: TransactionCardProps
}


export function TransactionCard({data}: DataProps) {
  const [ category ] = categories.filter( item => item.key === data.category)
  return (
    <Container>
        <Title>{data.name}</Title>
        <Amount type={data.type}>
           {data.type === 'negative' ? `- ${data.amount}` : data.amount}
        </Amount>
        <Footer>
            <Category>
                <Icon name={category.icon}/>
                <CategoryName>{category.name}</CategoryName>
            </Category>
            <Date>{data.date}</Date>
        </Footer>
    </Container>
  )
}
