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

class SavedThreadList extends Component {
    
    componentDidMount () {
        this._getThreadList ();
        this.setState({working: false});
    }
    
    state = {working: true};
    
    _generateDateToken = () => {
        let currTimeStamp = Date.now();
        let currDate = new Date (currTimeStamp);
        let dateToken = currDate.getDate() + '/' + currDate.getMonth() + '/' + currDate.getFullYear();
        return dateToken;
    };
    
    _getThreadList = async () => {
        try {
            this.setState({working: true});
            await AsyncStorage.getAllKeys().then ((values) => {
                //console.log(values);
                values.sort(function(x,y) {
                    let a = parseInt(x.split('/')[2]*10000) + parseInt(x.split('/')[1]*100) + parseInt(x.split('/')[0]);
                    let b = parseInt(y.split('/')[2]*10000) + parseInt(y.split('/')[1]*100) + parseInt(y.split('/')[0]);
                    return b - a;
                });
                let rows = [];
                let i = 0;
                values.forEach ((value) => {
                    rows.push (
                        <View key={i + 'v'} style={styles.oneThreadWrap}>
                            <TouchableOpacity 
                                key={i + 't'} 
                                style={styles.oneThreadTxtWrap}
                                data-key={value} 
                                onPress={(evt) => {this._showHist(evt, value)}}
                            >
                                <Text style={styles.oneThreadTxt} key={i}> {value} </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                key={i + 'd'} 
                                style={styles.oneThreadBtnWrap} 
                                data-key={value} 
                                onPress={(evt) => {this._removeHist(evt, value)}}
                            >
                                <Text style={styles.oneThreadBtn} key={i + 'dt'}> Delete </Text>
                            </TouchableOpacity>
                        </View>
                    );
                    i ++;
                });
                
                this.setState({list: rows});
                //console.log (rows);
                this.setState({working: false});
            });
        } catch (error) {
            console.log (error);
            this.setState({working: false});
        }
    };
    
    _removeHist = (evt, data) => {
        this.setState({working: true});
        Alert.alert (
            'Delete Thread: ' + data,
            'Are you sure?',
            [
                {text: 'yes', onPress: async () => {
                    try {
                        await AsyncStorage.removeItem (data).then (() => {
                            this._getThreadList ();
                            this.setState({working: false});
                        });
                    } catch (error) {
                        console.log (error);
                        this._getThreadList ();
                        this.setState({working: false});
                    }
                }},
                {text: 'no', onPress: () => {
                    this._getThreadList ();
                    this.setState({working: false});
                }}
            ],
            {cancellable: false}
        );
    };    
    
    _showHist = (evt, data) => {
        this.props.navigation.navigate('HistOne', {datatoken: data});
    };
    
    render () {
        if (this.state.working) {
            return (
                <Loader showstate={this.state.loading} loadTxt="Working!"/>
            );
        } else {
            return (
                <KeyboardAvoidingView style={styles.container}>
                
                    <View style={styles.headerSpace}>
                        <Text style={styles.headerSpaceTxt}>PCC POS</Text>
                    </View>
                    
                    <View style={styles.oldThreadWrapper}>{this.state.list}</View>
                
                </KeyboardAvoidingView>
            );
        }
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
    oldThreadWrapper: {
        flex: 1,
    },
    oneThreadWrap: {
        flexDirection: 'row',
        //flex: 1,
    },
    oneThreadTxtWrap: {
        borderColor: 'indigo',
        backgroundColor: 'white',
        borderWidth: 1,
        margin: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        alignSelf: 'stretch',
        flex: 3,
    },
    oneThreadTxt: {
        color: 'darkblue',
        fontWeight: 'bold',
        padding: 5,
        fontSize: 20,
    },
    oneThreadBtnWrap: {
        borderColor: 'darkred',
        backgroundColor: 'white',
        borderWidth: 1,
        margin: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        alignSelf: 'stretch',
        flex: 1,
        alignItems: 'center',
    },
    oneThreadBtn: {
        color: 'darkred',
        fontWeight: 'bold',
        padding: 5,
        fontSize: 20,
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
module.exports = {Component: SavedThreadList};
