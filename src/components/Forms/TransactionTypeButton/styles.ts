import styled, { css } from "styled-components/native";
import Feather from 'react-native-vector-icons/Feather'
import { RFValue } from "react-native-responsive-fontsize";

interface IconsProps  {
    type:  'up' | 'down'
}

interface ContainerProps {
    type:  'up' | 'down'
    isActive: boolean
}

export const Container = styled.TouchableOpacity<ContainerProps>`
    width: 48%;
    flex-direction: row;
    align-items: center;
    border-width:  ${({isActive, type}) => isActive ? 0 : 1.5}px;
    border-style: solid;
    border-color: ${({theme}) => theme.colors.text};
    border-radius: 5px;
    padding: 16px;
    justify-content: center;
    
    ${({isActive, type}) => isActive && type === 'down' && css`
        background-color: ${({theme}) => theme.colors.attencion_ligth} ;
    ` }

    ${({isActive, type}) => isActive && type === 'up' && css`
        background-color: ${({theme}) => theme.colors.sucess_light} ;
    ` }
`
export const Icon = styled(Feather)<IconsProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;
    color: ${({theme, type}) => type === 'up' ? theme.colors.sucess : theme.colors.attention};
`
export const Title = styled.Text`
    font-size: ${RFValue(14)}px;
    font-family: ${({theme}) => theme.fonts.regular};
`