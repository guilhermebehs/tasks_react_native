import {Alert} from 'react-native';

const server = 'http://192.168.3.109:3000'


function showError(err){
    if(err.response && err.response.data)
       Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err.response.data}`)
    else{
       Alert.alert('Ops! Ocorreu um problema!', `Erro inesperado!`)
    }
}


function showSucess(msg){
    Alert.alert('Sucesso!', msg)
}


export {showError, showSucess, server}