import React, {Component} from 'react';
import { StyleSheet, FlatList, Text, View, TextInput, KeyboardAvoidingView, Alert, Button, TouchableOpacity } from 'react-native';
import {AsyncStorage} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
//var SavedThreadList = require('./ThreadView.js').Component;

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

class CurrentThread extends Component {
    constructor (props) {
        super(props);
        this.inputPlaceHolder = 'Type here';
    }   
    
    componentDidMount () {
        this._retrieveThread (this._generateDateToken());
    }
    
    state = {
        loading: false, 
        loadTxt: 'Loading!', 
        convo: [{key:'0', sent:'Start', resp:'Ready', timeReq: Date.now() + ' ', timeRes: Date.now() + ' '}]
    };
    
    _cleanDate (timestamp) {
        let d = new Date (timestamp);
        return d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
    }
    
    _addConvo (info) {
        let i=0;
        info.key = this.state.convo.length + ' ';
        let newConvo = this.state.convo.slice(); 
        newConvo.unshift(info);
        this.setState ({convo: newConvo});
        //console.log (this.state);
        this._saveThread();
    }
    
    _onSubmitText = (evt) => {
        this.setState ({loading: true, loadTxt: 'Loading!'});
        let infoBox = {sent: evt.nativeEvent.text};
        infoBox.timeReq = Date.now() + ' ';
        let completeUrl = 'http://192.168.101.56:8080/mob_svc/svc.jsp?str=' + evt.nativeEvent.text;
        fetch (completeUrl)
        .then((response) => response.json())
        .then((responseJson) => {
            //console.log (responseJson);
            if (!responseJson.billval) {
                console.log (responseJson);
                Alert.alert ('Some Error Occurred');
                infoBox.resp = 'Error';
                infoBox.timeRes = Date.now() + ' ';
            } else {
                infoBox.resp = responseJson.billval;
                infoBox.timeRes = Date.now() + ' ';
            }
            this._addConvo (infoBox);
            this.setState ({loading: false});
        })
        .catch((error) => {
            console.error (error);
            Alert.alert ('Some Error Occurred');
            infoBox.resp = 'Error';
            infoBox.timeRes = Date.now() + ' ';
            this._addConvo (infoBox);
            this.setState ({loading: false});
        });
    }
    
    _showThreads = () => {
        this.props.navigation.navigate('Hist');
    };
    
    render() {
        return (
            <KeyboardAvoidingView style={styles.container}>
                
                <View style={styles.headerSpace}>
                    <Text style={styles.headerSpaceTxt}>Cafe-App (Sibashis)</Text>
                </View>
                
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.inputStyle}
                        placeholder={this.inputPlaceHolder}
                        onSubmitEditing={this._onSubmitText}
                    />
                </View>
      
                <FlatList
                    style={{alignSelf: 'stretch',}}
                    data={this.state.convo}
                    renderItem={({item}) => 
                        <View>
                            <View style={item.resp.toLowerCase().startsWith("error")?styles.itemWrapperResErr:styles.itemWrapperRes}>
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
                
                <TouchableOpacity onPress={this._showThreads} style={styles.oldThreadBtn}>
                    <Text style={styles.oldThreadBtnTxt}>Show History</Text>
                </TouchableOpacity>
                
            </KeyboardAvoidingView>
            
            
        );
    }
    
    // The following portion deals with the persistance of data
    
    _generateDateToken = () => {
        let currTimeStamp = Date.now();
        let currDate = new Date (currTimeStamp);
        let dateToken = currDate.getDate() + '/' + currDate.getMonth() + '/' + currDate.getFullYear();
        return dateToken;
    };
    
    _retrieveThreadNames = async () => {
        this.setState ({loading: true, loadTxt: 'Retrieving Threads!'});
        let values = null;
        try {
            values = await AsyncStorage.getAllKeys();
            this.setState ({loading: false});
        } catch (error) {
            console.log (error);
            this.setState ({loading: false});
            values = null;
        }
    };
    
    _saveThread = async () => {
        this.setState ({loading: true, loadTxt: 'Saving Data!'});
        try {
            let dateToken = this._generateDateToken();
            await AsyncStorage.setItem (dateToken, JSON.stringify(this.state));
            this.setState ({loading: false});
        } catch (error) {
            console.log (error);
            this.setState ({loading: false});
        }
    };
    
    _retrieveThread = async (dateToken) => {
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
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
    inputWrapper: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        alignSelf: 'stretch',
        margin: 5,
    },
    inputStyle: {
        height: 40,
        alignSelf: 'stretch',
        padding: 5,
        borderColor: 'blue',
        borderWidth: 1,
    },
    itemWrapperReq: {
        borderColor: 'darkblue',
        backgroundColor: 'white',
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
        color: 'black',
    },
    itemReq: {
        fontSize: 15,
        color: 'black',
    },
    itemWrapperRes: {
        borderColor: 'green',
        backgroundColor: 'white',
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
        backgroundColor: 'white',
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
        color: 'black',
    },
    itemRes: {
        fontSize: 15,
        color: 'black',
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
    oldThreadBtn: {
        backgroundColor: 'darkslategrey',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    oldThreadBtnTxt: {
        color: 'white',
        fontWeight: 'bold',
        alignItems: 'center',
        padding: 10,
    },
});

module.exports = {Component: CurrentThread};
