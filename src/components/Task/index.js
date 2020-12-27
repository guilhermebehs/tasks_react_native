import React from 'react';
import {View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import commonStyles from '../../commonStyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import 'moment/locale/pt-br';

export default (props) => {
  const doneOrNotStyle =
    props.doneAt != null ? {textDecorationLine: 'line-through'} : {};

  const date = props.doneAt ? props.doneAt : props.estimateAt;
  const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM');

  const getRightContent = () =>{
       return (
         <TouchableOpacity style={styles.right} onPress={()=> props.onDelete && props.onDelete(props.id)}>
           <Icon name="trash" size={30} color='#FFF' />
         </TouchableOpacity>
       )
  }

  const getLeftContent = () =>{
    return (
      <View style={styles.left}>
        <Icon style={styles.excludeIcon} name="trash" size={30} color='#FFF' />
        <Text style={styles.excludeText}>Excluir</Text>
      </View>
    )
  }

  return (
    <Swipeable renderRightActions={getRightContent} renderLeftActions={getLeftContent}
    onSwipeableLeftOpen={()=>{props.onDelete && props.onDelete(props.id)}}>
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => props.toogleTask(props.id)}>
        <View style={styles.checkContainer}>{getCheckView(props.doneAt)}</View>
      </TouchableWithoutFeedback>
        <View style={styles.containerDate}>
          <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
    </View>
    </Swipeable>
  );
};

const getCheckView = (doneAt) => {
  if (doneAt != null && doneAt !== undefined) {
    return (
      <View style={styles.done}>
        <Icon  name="check" size={20} color={'#FFF'} />
      </View>
    );
  } else {
    return <View style={styles.pending} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF'
  },
  checkContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pending: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#555',
  },
  done: {
    height: 25,
    width: 25,
    borderRadius: 13,
    backgroundColor: '#4D7031',
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.mainText,
    fontSize: 15,
  },
  containerDate: {
    flex: 1,
  },
  date: {
    fontFamily: commonStyles.fontFamily,
    color: commonStyles.colors.subText,
  },
  right:{
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20
  },
  left:{
      backgroundColor: 'red',
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1
  },
  excludeText:{
       fontFamily: commonStyles.fontFamily,
       color: '#FFF',
       fontSize: 20,
       margin: 10
  },
  excludeIcon:{
    marginLeft: 10
  }
});
