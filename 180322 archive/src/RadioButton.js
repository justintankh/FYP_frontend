import React from 'react';
import {Pressable,Dimensions, StyleSheet, View, Text } from 'react-native';
import { useState } from "react";

export default function RadioButton({ data, onSelect }) {
    const [userOption, setUserOption] = useState(null);
    const selectHandler = (value) => {
        onSelect(value);
        setUserOption(value);
      };

    return (
    <View>
        {data.map((item) => {
        return (
            <Pressable style={item.value === userOption ? styles.selected : styles.unselected} onPress={() => selectHandler(item.value)}>
            <Text style={styles.CheckBoxtext}> {item.value}</Text>
            </Pressable>
        );
        })}
    </View>
    );
}

const Devicewidth = Math.round(Dimensions.get('window').width)
const Deviceheight = Math.round(Dimensions.get('window').height)
const styles = StyleSheet.create({
    CheckBoxtext:{
        fontSize: 18,
        color: 'black',
    },
    option: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center',
      },
      unselected: {
        height: Deviceheight / 30,
        width: Devicewidth / 3 ,
        marginBottom:10,
        backgroundColor: '#FF7E7E',
        borderRadius: 5,
      },
      selected: {
        height: Deviceheight / 20,
        width: Devicewidth / 3 ,
        marginBottom:10,
        backgroundColor: '#72F56F',
        borderRadius: 5,
      },
})