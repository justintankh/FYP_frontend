import React from 'react'
import {Animated, View, Text, StyleSheet, Dimensions,Image,Button} from 'react-native'

const RecipeList = ({info}) => {
    const {recipe,img_url, ingredients, url} = info;

    const Devicewidth = Math.round(Dimensions.get('window').width)
    const styles = StyleSheet.create({
    cardContainer:{
        width: Devicewidth / 2,
        height: Devicewidth / 3,
        // borderRaidus: 20,
        shadowColor: "black",
        shadowOffset:{
            width:20,
            height:20
        },
        shadowRadius:5,
        shadowOpacity: 20,
    },
    imageStyle:{
        height: Devicewidth / 4,
        width: Devicewidth / 4,
    },
    titleStyle:{
        left: Devicewidth / 3.8,
        bottom: Devicewidth / 4.2,
        fontSize: 18,
    },
    detailsStyle:{
        left: Devicewidth / 3.8,
        bottom: Devicewidth / 4.2,
        fontSize: 12,
        fontWeight: "200",
        color:'black',
    },
    imageStyle:{
        height: Devicewidth / 4,
        width: Devicewidth / 4,
    },
})
    return (
    <View style={styles.cardContainer}>
        <Image source={{uri: img_url}} style={styles.imageStyle}/>
        <Text style={styles.titleStyle}>{recipe}</Text>
        {/* <Text style={styles.detailsStyle}>{ingredients}</Text> */}
        <Text style={styles.detailsStyle}>{url}</Text>
    </View>
    ) 
}

export default RecipeList