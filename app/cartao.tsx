import React, { Component } from "react";
import { Image, Text, View, StyleSheet } from "react-native";

interface CartaoProps {
  url: string;
  nome: string;
  disciplina: string;
}

export default class Cartao extends Component<CartaoProps> {
  render() {
    const { url, nome, disciplina } = this.props;

    return (
      <View style={area.direcao}>
        <View style={imagem.afastamento}>
          <Image source={{ uri: url }} style={imagem.tamanho} />
        </View>
        <View style={texto.afastamento}>
          <Text style={texto.cor}>{nome}</Text>
          <Text style={texto.cor}>{disciplina}</Text>
        </View>
      </View>
    );
  }
}

const area = StyleSheet.create({
  direcao: { flexDirection: 'row' }
});

const imagem = StyleSheet.create({
  afastamento: { padding: 10 },
  tamanho: { width: 100, height: 100 }
});

const texto = StyleSheet.create({
  afastamento: { top: 30 },
  cor: { color: '#89CFF0' }
});