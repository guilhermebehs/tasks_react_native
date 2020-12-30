import React, {Component} from 'react';
import {ImageBackground, Text,View,TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import backgroundImage from '../../../assets/imgs/login.jpg';
import commonStyles from '../../commonStyles';
import AuthInput from '../../components/AuthInput';
import {server, showSucess, showError} from '../../common';
import axios from 'axios';
import storage from '@react-native-community/async-storage'

const initialState={

  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  signup: false,
  loading: false,

}

export default class Auth extends Component {
constructor(props){
  super(props);
}

state={
  ...initialState
}

signinOrSignup = ()=>{
  if(this.state.signup)
     this.signup()
  else
     this.signin()
}

signup = async()=>{
  try{
    await axios.post(`${server}/signup`, {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    })
    showSucess('Usuário cadastrado!')
    this.setState({...initialState})
  }
  catch(e){
    showError(e)
  }
}

signin = async()=>{
  this.setState({loading: true})
  try{
     const res = await axios.post(`${server}/signin`,{
       email: this.state.email,
       password: this.state.password
     })

     axios.defaults.headers.common['Authorization'] = `bearer ${res.data.token}`
     await storage.setItem('userData', JSON.stringify(res.data))
     this.setState({loading: false})
     this.props.navigation.navigate('Home', res.data)
  }
  catch(e){
    this.setState({loading: false})
    showError(e)
  }


}

render(){
    
    const validations = []
    validations.push(this.state.email && this.state.email.includes('@'))
    validations.push(this.state.password && this.state.password.length >= 6)

    if(this.state.signup){
      validations.push(this.state.name && this.state.name.trim().length >= 3 )
      validations.push(this.state.password === this.state.confirmPassword)
    }

    const validForm = validations.reduce((t, a) => t && a)

    return (
    <ImageBackground source={backgroundImage} style={styles.background}> 
      <Text style={styles.title}>Tasks</Text>
      <View style={styles.formContainer}>
      <Text style={styles.subTitle}>{this.state.signup? 'Crie a sua conta': 'Informe seus dados'}</Text>
        {this.state.signup &&
             <AuthInput icon='user' placeholder='Nome' value={this.state.name} 
             style={styles.input} 
             onChangeText={(name) => this.setState({name})} />
  
          
        }
        <AuthInput icon='at' placeholder='E-mail' value={this.state.email} 
           style={styles.input} 
           onChangeText={(email) => this.setState({email})} />
        <AuthInput icon='lock' placeholder='Senha' value={this.state.password} 
           style={styles.input} secureTextEntry={true}
           onChangeText={(password) => this.setState({password})} />
         {this.state.signup &&
             <AuthInput icon='lock' placeholder='Confirme a senha' value={this.state.confirmPassword} 
             style={styles.input} 
             onChangeText={(confirmPassword) => this.setState({confirmPassword})}  
              secureTextEntry={true}/>
        }
           <TouchableOpacity onPress={this.signinOrSignup} disabled={!validForm}>
             <View style={[styles.button,validForm ? {} : {backgroundColor: '#AAA'}]} >
               <Text style={styles.buttonText}>
                  {this.state.signup? 'Registrar': 'Entrar'}  
                 
               </Text>
             </View>
           </TouchableOpacity>
      </View>
      <TouchableOpacity style={{padding: 10}}   
          onPress={()=> { 
                         this.setState({...initialState});
                         this.setState({signup: !this.state.signup})}}>
             <Text style={styles.buttonText}>{
                this.state.signup? 'Já possui conta?': 'Ainda não possui conta?'}  
               
              </Text>
      </TouchableOpacity>
           {this.state.loading &&
            <View style={styles.loading}>
                <ActivityIndicator size='small' color="#4b85fa"  />
            </View>
            }
    </ImageBackground>
)}
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 70,
        marginBottom: 10
    },
    subTitle:{
       fontFamily: commonStyles.fontFamily,
       color: 'white',
       fontSize: 20,
       textAlign: 'center',
       marginBottom: 10
    },
    input:{
      marginTop: 10,
      backgroundColor : 'white'

    },
    formContainer:{
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: 20,
      width: '80%',
    },
    button:{
      backgroundColor:'#080',
      marginTop: 10,
      padding: 10,
      alignItems: 'center',
      borderRadius: 7
    },
    buttonText:{
      fontFamily: commonStyles.fontFamily,
      color: '#FFF',
      fontSize: 20
    },
    loading: {
      justifyContent: 'center',
      alignItems:  'center',
      backgroundColor: 'rgba(52, 52, 52, 0.1)'
  }
})