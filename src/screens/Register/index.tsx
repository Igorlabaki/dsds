import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from 'react-native'
import { Button } from '../../components/Forms/Button'
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton'
import { InputForm } from '../../components/Forms/InputForm'
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton'
import { CategorySelect } from '../CategorySelect'
import { yupResolver } from '@hookform/resolvers/yup'
import  AsyncStorage  from '@react-native-async-storage/async-storage'
import  uuid  from 'react-native-uuid'
import * as Yup from 'yup'
import { 
  Container,
  Fields, 
  Form,
  Header,
  Title, 
  TransactionTypes
} from './style'
import { useNavigation } from '@react-navigation/native'

interface FormData{
  name: string
  amount: string
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome e obrigatorio'),
  amount: Yup.number().typeError('Informe um valor numerico').positive('O valor nao pode ser negativo')
})

export  function Register() {

  const [transactionType, setTransactionType] = useState('')

  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  })

  const navigation = useNavigation()

  const dataKey = '@gofinances:transactions'


  const {control,reset , handleSubmit, formState: {errors}} = useForm({
    resolver: yupResolver(schema)
  })

  function handleTransactinType(type: 'positive' | 'negative'){
    setTransactionType(type)
  }

  function handleOpenSlectCategory(){
    setCategoryModalOpen(true)
  }
  function handleCloseSlectCategory(){
    setCategoryModalOpen(false)
  }

  async function handleRegister(form: FormData){

    if(!transactionType){
      return Alert.alert('Selecione o tipo da transacao')
    }

    if(category.key === 'category'){
      return Alert.alert('Selecione a categoria')
    }

    const newTransaction = {
        id:       String(uuid.v4()),
        name:     form.name,
        amount:   form.amount,
        date:     new Date(),
        category: category.key,
        type: transactionType
    }

    try {
      const data = await AsyncStorage.getItem(dataKey)
      const currentData = data ? JSON.parse(data) : []

      const dataFormates = [
        ...currentData,
        newTransaction
      ]

      await AsyncStorage.setItem(dataKey,JSON.stringify(dataFormates))
      setTransactionType('')
      setCategory({
        key: 'category',
        name: 'Categoria'
      }) 

      reset()   

      navigation.navigate('Listagem')
    } catch (error) {
      console.log(error)
      Alert.alert('Nao foi possivel salvar.')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
          <Header>
              <Title>Cadastrar</Title>
          </Header>
          <Form>
            <Fields>
              <InputForm control={control} name='name' placeholder='Nome' autoCapitalize='sentences' autoCorrect={false} error={errors.name && errors.name.message} />
              <InputForm control={control} name='amount' placeholder='Preco' keyboardType='numeric' error={errors.amount && errors.amount.message}/>
            <TransactionTypes>
              <TransactionTypeButton type='up' title='Income' onPress={() => handleTransactinType('positive')} isActive={transactionType === 'positive'}/>
              <TransactionTypeButton type='down' title='Outcome' onPress={() => handleTransactinType('negative')} isActive={transactionType === 'negative'}/>
            </TransactionTypes>
            <CategorySelectButton title={category.name} onPress={handleOpenSlectCategory}/>
            </Fields>
            <Button title='Enviar' onPress={handleSubmit(handleRegister)}/>
          </Form>
          <Modal visible={categoryModalOpen}>
            <CategorySelect 
              category={category}
              setCategory={setCategory}
              closeSelectCategory={() => handleCloseSlectCategory()}
              />
          </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
