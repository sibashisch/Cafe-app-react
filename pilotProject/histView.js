import React, {Component} from 'react';
import { StyleSheet, FlatList, Text, View, TextInput, KeyboardAvoidingView, Alert, TouchableOpacity } from 'react-native';
import {AsyncStorage} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

class Loader extends Component {
    render () {
        if (this.props.showstate) {
            return (
                <View style={styles.loaderStyleShown}>
                    <Text style={{color: 'white', fontWeight: 'bold',}}>{this.props.loadTxt}</Text>
                </View>
            );
        } else {
            return null;
        }
    }
}

class HistThread extends Component {
    
    componentDidMount () {
        const { navigation } = this.props;
        const datatoken = navigation.getParam('datatoken', '01/01/1951');
        this._readData (datatoken);
        this.setState({working: false});
    }
    
    state = {};
    
    _cleanDate (timestamp) {
        let d = new Date (timestamp);
        return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    }
    
    _readData = async (dateToken) => {
        this.setState ({loading: true, loadTxt: 'Reading Data!'});
        let savedState = null;
        try {
            await AsyncStorage.getItem(dateToken).then((value) => {
                savedState = JSON.parse(value);
                this.setState (savedState);
                this.setState ({loading: false});
            });
        } catch (error) {
            console.log (error);
            this.setState ({loading: false});
        }
    };
    
    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                
                <View style={styles.headerSpace}>
                    <Text style={styles.headerSpaceTxt}>PCC POS</Text>
                </View>
      
                <FlatList
                    style={{alignSelf: 'stretch',}}
                    data={this.state.convo}
                    renderItem={({item}) => 
                        <View>
                            <View style={item.resp.startsWith("ERROR")?styles.itemWrapperResErr:styles.itemWrapperRes}>
                                <Text style={styles.itemTimeRes}> {this._cleanDate(parseInt(item.timeRes.trim()))} </Text>
                                <Text style={styles.itemRes}> {item.resp} </Text>
                            </View>
                            <View style={styles.itemWrapperReq}>
                                <Text style={styles.itemTimeReq}> {this._cleanDate(parseInt(item.timeReq.trim()))} </Text>
                                <Text style={styles.itemReq}> {item.sent} </Text>
                            </View>
                        </View>
                    }
                />
            
                <Loader showstate={this.state.loading} loadTxt={this.state.loadTxt} />
                
            </KeyboardAvoidingView>
            
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //alignItems: 'center',
        //justifyContent: 'center',
    },
    headerSpace: {
        backgroundColor: 'darkslategrey',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerSpaceTxt: {
        color: 'white',
        fontWeight: 'bold',
        alignItems: 'center',
        padding: 10,
        marginTop: 15,
    },
    itemWrapperReq: {
        borderColor: 'darkblue',
        backgroundColor: 'blue',
        borderWidth: 1,
        alignSelf: 'stretch',
        marginBottom: 5,
        marginLeft: 5,
        marginRight: 20,
        marginTop: 1,
        padding: 5,
        borderBottomRightRadius: 10,
        textAlign: 'right',
    },
    itemTimeReq: {
        fontSize: 10,
        color: 'white',
    },
    itemReq: {
        fontSize: 15,
        color: 'white',
    },
    itemWrapperRes: {
        borderColor: 'darkgreen',
        backgroundColor: 'green',
        borderWidth: 1,
        alignSelf: 'stretch',
        marginBottom: 1,
        marginLeft: 20,
        marginRight: 5,
        marginTop: 5,
        padding: 5,
        borderTopLeftRadius: 10,
        textAlign: 'right',
        alignItems: 'flex-end',
    },
    itemWrapperResErr: {
        borderColor: 'darkred',
        backgroundColor: 'red',
        borderWidth: 1,
        alignSelf: 'stretch',
        marginBottom: 1,
        marginLeft: 20,
        marginRight: 5,
        marginTop: 5,
        padding: 5,
        borderTopLeftRadius: 10,
        textAlign: 'right',
        alignItems: 'flex-end',
    },
    itemTimeRes: {
        fontSize: 10,
        color: 'white',
    },
    itemRes: {
        fontSize: 15,
        color: 'white',
    },
    loaderStyleShown: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        opacity: .9,
    },
    loaderStyleShown: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        opacity: .9,
    },
});

//export default SavedThreadList;
module.exports = {Component: HistThread};
