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
import 'moment/locale/pt-br';
import commonStyles from '../../commonStyles';
import Task from '../../components/Task';
import AddTask from '../../screens/AdicionarTask';
import Icon from 'react-native-vector-icons/FontAwesome';

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

  componentDidMount = async() => {
    const stateStr = await asyncStorage.getItem('state')
    const state = JSON.parse(stateStr) || initialState 
    console.log(state)
    this.setState(state, this.filterTasks )
    
  };
  toogleTask = (taskId) => {
    const tasks = [...this.state.tasks];
    tasks.forEach((task) => {
      if (task.id === taskId) {
        task.doneAt = task.doneAt ? null : new Date();
      }
    });
    this.setState({tasks}, this.filterTasks);
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
    asyncStorage.setItem('state', JSON.stringify(this.state))
  };

  addTask = (newTask) =>{
    if(!newTask.desc || !newTask.desc.trim()){
       Alert('Dados Inválidos', 'Descrição não informada!')
       return
    }

    const tasks = [...this.state.tasks]
    tasks.push({
      id: Math.random(),
      desc: newTask.desc,
      estimateAt: newTask.date,
      doneAt: null
    })

    this.setState({tasks, showAdicionarTask: false}, this.filterTasks)
  }

  deleteTask = (id)=>{
    const tasks = this.state.tasks.filter(t => t.id !== id)
    this.setState({tasks}, this.filterTasks)
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
          <ImageBackground source={todayImage} style={styles.background}>
            <View style={styles.iconBar}>
              <TouchableOpacity onPress={this.toogleFilter}>
                <Icon
                  name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                  size={20}
                  color={commonStyles.colors.secondary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.titleBar}>
              <Text style={styles.title}>Hoje</Text>
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
        <TouchableOpacity activeOpacity={0.7} style={styles.addButton} onPress={() =>this.setState({showAdicionarTask: true})}>
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
    justifyContent: 'flex-end',
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
