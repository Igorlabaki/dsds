import React from 'react'
import { 
    Amount,
    Container,
    Footer,
    Header,
    Icon,
    LastTransaction,
    Title 
} from './style'

interface HighLigthCardProps{
    title: string;
    amount: string;
    lastTransaction: string;
    type: 'up' | 'down' | 'total';
}

const icon = {
    up:     'arrow-up-circle',
    down:   'arrow-down-circle',
    total:  'dollar-sign',
}

export  function HighLigthCard({
    type,
    title,
    amount,
    lastTransaction
}: HighLigthCardProps) {

  return (
    <Container type={type}>
        <Header>
            <Title type={type}>{title}</Title>
            <Icon name={icon[type]} type={type}></Icon>
        </Header>
        <Footer>
            <Amount type={type}>R$ {amount}</Amount>
            <LastTransaction type={type} >{lastTransaction}</LastTransaction>
        </Footer>
    </Container>
  )
}
