import React from 'react';
import { Image, Keyboard, StyleSheet, SafeAreaView, ScrollView, Text, View, TextInput } from 'react-native';
import Button from 'react-native-button';
import { RoundedCard } from '../components';
import { LoginStyle } from '../styles';
import { LinearGradient } from 'expo';

export default class FeedScreen extends React.Component {
	componentDidMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount () {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow () {
    // alert('Keyboard Shown');
  }

  _keyboardDidHide () {
    // alert('Keyboard Hidden');
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end', height: '100%' }}>
      	<LinearGradient
          colors={['#FFFFFF', '#53B7FD']}
          style={{ padding: 24, alignItems: 'center', height: '100%' }}
          start={[0.33,0.33]}>
          <SafeAreaView style={{ alignItems: 'center', height: '100%', width:'100%' }}>
          	<Image style={{ marginTop: 43, marginBottom: 30 }} width={113} height={132} source={require('../assets/sis_man.png')} />
	          <RoundedCard style={{padding:23}}>
	          	<Text style={[LoginStyle.rensselaerText]}>Rensselaer's</Text>
	          	<Text style={[LoginStyle.sisText]}>Student Information System</Text>
	          	<View style={[LoginStyle.textInputContainer]}>
	          		<TextInput placeholderTextColor='#BCE0FD' style={[LoginStyle.textInput]} placeholder='RIN' autoCorrect={false} />
	          	</View>
	          	<View style={[LoginStyle.textInputContainer]}>
	          		<TextInput placeholderTextColor='#BCE0FD' style={[LoginStyle.textInput]} placeholder='Password' autoCorrect={false} secureTextEntry={true}/>
	          	</View>
          		<Button 
          			activeOpacity={0.7}
          			color='#FFFFFF' 
          			style={[LoginStyle.button]} 
          			containerStyle={[LoginStyle.buttonContainer]}
          			onPress={()=>{}}
          		>
          			LOGIN
          		</Button>
          		<View style={{justifyContent: 'center', alignItems: 'center'}}>
		          	<Text style={[LoginStyle.privacy]}>By logging into SIS, you agree to our</Text>
		          	<Text style={[LoginStyle.privacy]}>Terms of Service and Privacy Policy</Text>
	          	</View>
	          </RoundedCard>
	        </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }
} 