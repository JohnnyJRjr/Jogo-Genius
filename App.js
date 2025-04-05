import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'cyan', 'pink', 'lime'];
const levels = [
  { name: 'Fácil', speed: 1000, steps: 3 },
  { name: 'Médio', speed: 700, steps: 5 },
  { name: 'Difícil', speed: 400, steps: 7 }
];

export default function GeniusGame() {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [level, setLevel] = useState(0);
  const [highlighted, setHighlighted] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (playing) {
      showSequence();
    }
  }, [sequence]);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setCurrentStep(0);
    setLevel(0);
    setMessage('');
    generateNextStep();
    setPlaying(true);
  };

  const generateNextStep = () => {
    setSequence(prev => [...prev, Math.floor(Math.random() * 9)]);
  };

  const showSequence = () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setHighlighted(sequence[i]);
        setTimeout(() => setHighlighted(null), levels[level].speed / 2);
        i++;
      } else {
        clearInterval(interval);
      }
    }, levels[level].speed);
  };

  const handlePress = (index) => {
    if (!playing) return;
    setPlayerSequence(prev => [...prev, index]);
    if (sequence[currentStep] === index) {
      if (currentStep + 1 === sequence.length) {
        if (sequence.length >= levels[level].steps && level < levels.length - 1) {
          setLevel(level + 1);
        }
        setPlayerSequence([]);
        setCurrentStep(0);
        generateNextStep();
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setMessage('Olha avião, errouuuuu');
      setPlaying(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#222' }]}> 
      {!playing ? (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startText}>Iniciar Jogo</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.grid}>
          {colors.map((color, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.square, { backgroundColor: highlighted === index ? 'white' : color }]} 
              onPress={() => handlePress(index)}
            />
          ))}
        </View>
      )}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startButton: {
    padding: 20,
    backgroundColor: 'orange',
    borderRadius: 10
  },
  startText: {
    fontSize: 20,
    color: 'white'
  },
  grid: {
    width: 310,
    height: 310,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  square: {
    width: 90,
    height: 90,
    margin: 5,
    borderRadius: 10
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: 'white'
  }
});