import React, {useEffect, useState}from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Keyboard} from 'react-native';

import Picker from './src/Components/Picker';
import api from './src/services/api';

export default function App(){
    const [moedas, setMoedas] = useState([]);
    const [loading, setLoading] = useState(true);

    const [moedaSelecionada, setMoedaSelecionada] = useState(null);
    const [moedaValor, setMoedaValor] = useState(0);

    const [valorMoeda, setValorMoeda] = useState(null);
    const[valorConvertido, setValorConvertido] = useState(0)


    useEffect( () => {
        async function loadMoedas(){
            const response = await api.get('all');
           
            let arrayMoedas =[]

            Object.keys(response.data).map( (key)=> {
                arrayMoedas.push({
                    key: key,
                    label: key,
                    value: key
                })
            })
            setMoedas(arrayMoedas);
            setLoading(false);
        }
        loadMoedas();

    }, [])

    async function converter(){
        if(moedaSelecionada === null || moedaValor === 0 ){
            alert('Por favor, preencha todos os campos.');
            return;
        }

        const response = await api.get(`all/${moedaSelecionada}-BRL`);
        //console.log(response.data[moedaSelecionada].ask);

        let resultado = response.data[moedaSelecionada].ask * parseFloat(moedaValor);
        setValorConvertido(`R$ ${resultado.toFixed(2)}`);
        setValorMoeda(moedaValor);
    
        //Aqui ele vai fechar o teclado
        Keyboard.dismiss()
    }

    if(loading){
        return(
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator color='#FFF' size={45}/>
            </View>
        )
       
    }else{

        return( 
            <View style ={ styles.container}>
                <View style={styles.areaMoeda}>
                    <Text style ={styles.titulo}>Selecione sua moeda</Text>
                   <Picker moedas = {moedas} onChange={(moeda)=> setMoedaSelecionada(moeda) } />
                </View>
    
                <View style={styles.areaValor}>
                    <Text style ={styles.titulo}>Digite um valor para converter em (R$) </Text>
                    <TextInput
                    placeholder='Ex: 150'
                    style={styles.input}
                    keyboardType='numeric'
                    onChangeText={(valor) => setMoedaValor(valor)}
                    />
                </View>
    
                <TouchableOpacity style={styles.areaBotao} onPress={converter}>
                    <Text style={styles.textoBotao}> Converter</Text>
                </TouchableOpacity>

                {valorConvertido !== 0 && (
                    <View style={styles.areaResultado}>
                        <Text style={styles.valorConvertido}>{moedaValor} {moedaSelecionada}</Text>
                        <Text style={[styles.valorConvertido, {fontSize: 20, margin: 10}]}> Corresponde a </Text>
                        <Text style={styles.valorConvertido}>{valorConvertido}</Text>
        
                    </View>
                )}

            </View>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor: '#101215',
        paddingTop: 40,
    },
    areaMoeda:{
        width: '90%',
        backgroundColor: '#FFF',
        paddingTop: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginBottom: 1
    },
    titulo:{
        color:'#000',
        fontSize: 15,
        paddingTop: 5,
        paddingLeft: 5,
    },
    areaValor:{
        width:'90%',
        backgroundColor:'#FFF',
        padding:10,
        paddingTop:10
    },
    input:{
        width: '100%',
        padding:10,
        height: 45,
        fontSize: 15,
        marginTop: 5
    },
    areaBotao:{
        width: '90%',
        backgroundColor: 'green',
        height: 45,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent:'center',
        alignItems: 'center'
    },
    textoBotao:{
        fontSize: 18,
        color: '#FFF',
        fontWeight:'bold'
    },
    areaResultado:{
        width:'90%',
        backgroundColor: '#FFF',
        marginTop: 35,
        borderRadius: 10,
        alignItems:'center',
        justifyContent:'center',
        padding: 20
    },
    valorConvertido:{
        fontSize: 30,
        color:'#000',
    }
})