import React, {Component} from 'react';
import {
  FlatList,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import asyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import todayImage from '../../../assets/imgs/today.jpg';
import weekImage from '../../../assets/imgs/week.jpg';
import tomorrowImage from '../../../assets/imgs/tomorrow.jpg';
import monthImage from '../../../assets/imgs/month.jpg';
import 'moment/locale/pt-br';
import commonStyles from '../../commonStyles';
import Task from '../../components/Task';
import AddTask from '../../screens/AdicionarTask';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import {server, showError, showSucess} from '../../common';

const initialState ={
   
  showDoneTasks: true,
    visibleTasks: [],
    showAdicionarTask: false,
    tasks: []
}


export default class TaskList extends Component {
  constructor(props) {
    super(props);
  }

  state={
    ...initialState
  }

  getImage = ()=>{
    switch(this.props.daysAhead){
      case 0: return todayImage
      case 1: return tomorrowImage
      case 7: return weekImage
      default: return monthImage
    }
  }

  getColor = ()=>{
    switch(this.props.daysAhead){
      case 0: return commonStyles.colors.today
      case 1: return commonStyles.colors.tomorrow
      case 7: return commonStyles.colors.week
      default: return commonStyles.colors.month
    }
  }

  componentDidMount = async() => {
    const stateStr = await asyncStorage.getItem('state')
    const savedState = JSON.parse(stateStr) || initialState 
    this.setState({showDoneTasks: savedState.showDoneTasks})
    this.loadTasks();
  };

  loadTasks = async()=>{
      try{
         const maxDate = moment().add({days:this.props.daysAhead}).format('YYYY-MM-DD 23:59:59')
         const res = await axios.get(`${server}/tasks?date=${maxDate}`)
         this.setState({tasks: res.data}, this.filterTasks)
      }
      catch(e){
        showError(e)
      }
  }


  toogleTask = async(taskId) => {
     try{
        await axios.put(`${server}/tasks/${taskId}/toogle`)
        this.loadTasks()
     }
     catch(e){
       showError(e)
     }
  };

  toogleFilter = () => {
    this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
  };

  filterTasks = () => {
    let visibleTasks = null;
    if (this.state.showDoneTasks) {
      visibleTasks = [...this.state.tasks];
    } else {
      const pending = (task) =>
        task.doneAt === null || task.doneAt === undefined;
      visibleTasks = this.state.tasks.filter(pending);
    }
    this.setState({visibleTasks});
    asyncStorage.setItem('state', JSON.stringify({showDoneTasks: this.state.showDoneTasks}))
  };

  addTask = async(newTask) =>{
    if(!newTask.desc || !newTask.desc.trim()){
       Alert('Dados Inválidos', 'Descrição não informada!')
       return
    }

    try{
       await axios.post(`${server}/tasks`,{
         desc: newTask.desc,
         estimateAt: newTask.date
       })
       this.setState({showAdicionarTask: false}, this.loadTasks)

    }
    catch(e){
      showError(e)
    }

  }

  deleteTask = async(id)=>{
    try{
       await axios.delete(`${server}/tasks/${id}`)
      this.loadTasks()
    }
    catch(e){
      
    }
  }

  render() {
    const hoje = moment().locale('pt-br').format('ddd, D [de] MMMM');
    return (
      <View style={styles.container}>
        <View style={styles.background}>
          <AddTask
            isVisible={this.state.showAdicionarTask}
            onCancel={() => this.setState({showAdicionarTask: false})}
            onSave={this.addTask}
          />
          <ImageBackground source={this.getImage()} style={styles.background}>
            <View style={styles.iconBar}>

            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                <Icon
                  name='bars'
                  size={20}
                  color={commonStyles.colors.secondary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.toogleFilter}>
                <Icon
                  name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                  size={20}
                  color={commonStyles.colors.secondary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleBar}>
              <Text style={styles.title}>{this.props.title}</Text>
              <Text style={styles.subtitle}>{hoje}</Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.taskList}>
          <FlatList
            data={this.state.visibleTasks}
            keyExtractor={(item) => `${item.id}`}
            renderItem={({item}) => (
              <Task {...item} toogleTask={this.toogleTask} onDelete={this.deleteTask} />
            )}
          />
        </View>
        <TouchableOpacity activeOpacity={0.7} style={[styles.addButton,{backgroundColor: this.getColor()}]} onPress={() =>this.setState({showAdicionarTask: true})}>
           <Icon name="plus" size={20} color={commonStyles.colors.secondary}  />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 3,
  },
  taskList: {
    flex: 7,
  },
  titleBar: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: commonStyles.fontFamily,
    fontSize: 50,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 20,
  },
  subtitle: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.secondary,
    marginLeft: 20,
    marginBottom: 20,
    fontSize: 20,
  },
  iconBar: {
    flexDirection: 'row',
    marginHorizontal: 25,
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  addButton:{
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: commonStyles.colors.today,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
