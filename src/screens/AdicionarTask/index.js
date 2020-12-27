import React, {Component} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import commonStyles from '../../commonStyles';
import moment from 'moment';

const initialState = {
  desc: '',
  date: new Date(),
  showDatePicker: false,
};

export default class AddTask extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    ...initialState,
  };

  save = ()=>{
    const newTask = {...this.state }

    this.props.onSave && this.props.onSave(newTask)

    this.setState({...initialState})
  }

  getDatePicker = () =>{
    let datePicker = <DateTimePicker  mode="date" value={this.state.date} onChange={(_, date)=> this.setState({date, showDatePicker: false })} />
    const dateString = moment(this.state.date).format('DD/MM/YYYY')
    if(Platform.OS === 'android')
       datePicker = <View><TouchableOpacity onPress={()=> this.setState({showDatePicker: true})} >
           <Text style={styles.date}>
            {dateString}
            </Text>
         </TouchableOpacity>
         {this.state.showDatePicker && datePicker}
         </View>
    return datePicker  }

  render() {
    return (
      <Modal
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={this.props.onCancel}
        animationType="slide">
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.container}>
          <Text style={styles.header}>Nova Tarefa</Text>
          <TextInput 
            style={styles.input}
            placeholder="Informe a Descrição..."
            onChangeText={(desc) => this.setState({desc})}
            values={this.state.desc}
          />
          {this.getDatePicker()}
          <View style={styles.buttons}>
            <TouchableOpacity onPress={this.props.onCancel}>
              <Text style={styles.button}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.save}>
              <Text style={styles.button}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={this.props.onCancel}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    backgroundColor: '#FFF',
  },
  header: {
    fontFamily: commonStyles.fontFamily,
    backgroundColor: commonStyles.colors.today,
    color: commonStyles.colors.secondary,
    fontSize: 15,
    textAlign: 'center',
    padding: 13,
  },
  input: {
    fontFamily: commonStyles.fontFamily,
    width: '90%',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 6,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    margin: 20,
    marginRight: 30,
    color: commonStyles.colors.today,
  },
  date:{
    fontFamily: commonStyles.fontFamily,
    fontSize: 15,
    marginTop: 10,
    marginLeft: 15,

  }
});
