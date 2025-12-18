import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const PrimaryButton = ({ title, onPress, variant = 'primary', style, textStyle }) => (
  <TouchableOpacity
    style={[styles.base, variant === 'secondary' ? styles.secondary : styles.primary, style]}
    onPress={onPress}
    activeOpacity={0.9}
  >
    <Text style={[styles.text, textStyle]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#a855f7',
  },
  secondary: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#334155',
  },
  text: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default PrimaryButton;
