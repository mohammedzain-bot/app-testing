import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS } from '../constants';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  function handleSendOtp() {
    if (phone.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setStep('otp');
  }

  function handleVerifyOtp() {
    const otpStr = otp.join('');
    if (otpStr.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }
    // Demo: any OTP works
    navigation.replace('MainTabs');
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Top brand section */}
      <View style={styles.topSection}>
        <View style={styles.logoWrap}>
          <Text style={{ fontSize: 40 }}>🛠️</Text>
        </View>
        <Text style={styles.appName}>ServeNow</Text>
        <Text style={styles.tagline}>Trusted Professionals, On Demand</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        {step === 'phone' ? (
          <>
            <Text style={styles.cardTitle}>Welcome Back 👋</Text>
            <Text style={styles.cardSubtitle}>Login or create an account with your mobile number</Text>

            <View style={styles.phoneRow}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="Mobile Number"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOtp}>
              <Text style={styles.primaryBtnText}>Send OTP</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>— or —</Text>

            <TouchableOpacity style={styles.googleBtn}>
              <Text style={{ fontSize: 20, marginRight: 10 }}>G</Text>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ProviderRegister')}>
              <Text style={styles.providerLink}>Are you a professional? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Join as Provider</Text></Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setStep('phone')} style={{ marginBottom: 10 }}>
              <Text style={{ color: COLORS.primary, fontSize: 13 }}>← Change Number</Text>
            </TouchableOpacity>
            <Text style={styles.cardTitle}>Enter OTP</Text>
            <Text style={styles.cardSubtitle}>We sent a 6-digit OTP to +91 {phone}</Text>

            <View style={styles.otpRow}>
              {otp.map((digit, idx) => (
                <TextInput
                  key={idx}
                  style={styles.otpBox}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(val) => {
                    const newOtp = [...otp];
                    newOtp[idx] = val;
                    setOtp(newOtp);
                  }}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOtp}>
              <Text style={styles.primaryBtnText}>Verify OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSendOtp} style={{ marginTop: 12 }}>
              <Text style={{ textAlign: 'center', color: COLORS.textLight, fontSize: 13 }}>
                Didn't receive OTP? <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Resend</Text>
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to our{' '}
        <Text style={{ color: COLORS.primary }}>Terms of Service</Text> &amp;{' '}
        <Text style={{ color: COLORS.primary }}>Privacy Policy</Text>
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.primary },
  topSection: { alignItems: 'center', paddingTop: 70, paddingBottom: 36 },
  logoWrap: {
    width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  appName: { fontSize: 32, fontWeight: '900', color: '#fff' },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 6 },
  card: {
    backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    flex: 1, paddingHorizontal: 24, paddingTop: 30,
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text, marginBottom: 6 },
  cardSubtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 24, lineHeight: 20 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  countryCode: {
    backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 14,
    marginRight: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  countryCodeText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  phoneInput: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 14, fontSize: 15, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  orText: { textAlign: 'center', color: COLORS.textLight, fontSize: 13, marginVertical: 16 },
  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: COLORS.border,
    marginBottom: 16,
  },
  googleBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  providerLink: { textAlign: 'center', fontSize: 13, color: COLORS.textLight, marginTop: 8 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  otpBox: {
    width: 46, height: 54, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border,
    textAlign: 'center', fontSize: 22, fontWeight: '800', color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  terms: { textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.7)', paddingHorizontal: 16, paddingBottom: 20 },
});
