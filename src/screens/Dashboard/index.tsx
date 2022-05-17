import { useCallback, useEffect, useState } from 'react'
import { HighLigthCard } from '../../components/HighLigthCard'
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCrad'
import {
  Container,
  Header,
  HighLigthCards,
  Icon,
  Photo,
  User,
  UserGreeting,
  UserInfo,
  UserName,
  UserWraper,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer
} from './styles'

import  AsyncStorage  from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import { ActivityIndicator } from 'react-native'
import  {useTheme}  from 'styled-components'

export interface DataListProps extends TransactionCardProps{
  id: string
}

interface HighLigthProps{
  amount: string,
  lastTransaction: string
}

interface HighLigthData{
  entries   :HighLigthProps
  expenseve :HighLigthProps
  total: HighLigthProps
}

export  function Dashboard(){
  
  const [peokrepokroep, setData] = useState<DataListProps[]>([])
  const [highLigthData, setHighLigthData] = useState<HighLigthData>( {} as HighLigthData)
  const [isLoading, setIsLoading] = useState(true)

  const theme = useTheme()
  
  function getListTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ){
    const lasTransaction = new Date(
      Math.max.apply(Math, collection
        .filter( (transaction : DataListProps) => transaction.type === 'positive')
        .map( (transaction: DataListProps) => new Date(transaction.date).getTime())
      )
    ) 
    return `${lasTransaction.getDate()} de ${lasTransaction.toLocaleString('pt-BR', {
      month: 'long'
    })}`
  }

  async function loadTransaction(){
    const dataKey = '@gofinances:transactions'
    const response = await AsyncStorage.getItem(dataKey)
    const transactions = response ? JSON.parse(response) : []

    let entriesTotal    = 0
    let expeseveTotal    = 0

    const transactionsFormated : DataListProps[] = transactions.map((item : DataListProps) => {


      if(item.type == 'positive'){
        entriesTotal += Number(item.amount)
      }else{
        expeseveTotal += Number(item.amount)
      }


      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      })

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).format(new Date(item.date))


      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date,
      }
    })

    setData(transactionsFormated)

    const lastTransactionsEntries   = getListTransactionDate(transactions, 'positive')
    const lastTransactionsExpensive = getListTransactionDate(transactions, 'negative')
    const totalInterval             = ` 01 a ${lastTransactionsExpensive}`

    const total = entriesTotal - expeseveTotal
    
    setHighLigthData({
      entries:{
        amount:entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Ultima entrada dia ${lastTransactionsEntries}`
      },
      expenseve: {
        amount:expeseveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Ultima saida dia ${lastTransactionsExpensive}`
      },
      total:{
        amount:total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })
    setIsLoading(false)
  }
  
  useEffect(() => {
    loadTransaction()
  }, [])
  
  useFocusEffect(
    useCallback(() => {
      loadTransaction()
    },[])
  )
  
  return (
      <Container>
        {
          isLoading ? 
          <LoadContainer>
            <ActivityIndicator  color={theme.colors.primary} size="large"/> 
          </LoadContainer>
          : 
          <>
            <Header>
              <UserWraper>
                <UserInfo>
                  <Photo source={{uri: 'https://avatars.githubusercontent.com/u/62656936?v=4'}}/>
                  <User>
                    <UserGreeting>Ola,</UserGreeting>
                    <UserName>Igor Goncalo</UserName>
                  </User>
                </UserInfo>
                <LogoutButton onPress={() => {}}>
                  <Icon name="power"/>
                </LogoutButton>
              </UserWraper>
            </Header>
            <HighLigthCards>
              <HighLigthCard 
                type='up' 
                title='Entrada' 
                amount={highLigthData.entries.amount}
                lastTransaction={highLigthData.entries.lastTransaction}
              />
              <HighLigthCard  
                type='down'
                title='Saidas' 
                amount={highLigthData.expenseve.amount}
                lastTransaction={highLigthData.expenseve.lastTransaction}
              />
              <HighLigthCard
                type='total'
                title='Total' 
                amount={highLigthData.total.amount} 
                lastTransaction={highLigthData.total.lastTransaction}  
              />
            </HighLigthCards>
            <Transactions>
              <Title>
                  Listagem
              </Title>
              <TransactionList 
                data={peokrepokroep}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => <TransactionCard data={item}/> }
              />
            </Transactions>
          </>
        }
      </Container>
    )
}
