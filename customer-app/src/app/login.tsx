import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const COLORS = {
  primary: '#6C63FF', primaryLight: '#EEF0FF',
  text: '#1A1A2E', textLight: '#6B7280',
  background: '#F8F9FE', border: '#E5E7EB',
};

// Backend deployed on Render
const API_URL = 'https://servenow-backend-16sw.onrender.com/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/send-otp`, { email });
      setStep('otp');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter all 6 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/verify-otp`, { 
        email, 
        code: otp,
        role: 'CUSTOMER' 
      });
      console.log('Login success:', res.data);
      router.replace('/home');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.topSection}>
        <View style={styles.logoWrap}>
          <Text style={{ fontSize: 40 }}>🛠️</Text>
        </View>
        <Text style={styles.appName}>ServeNow</Text>
        <Text style={styles.tagline}>Trusted Professionals, On Demand</Text>
      </View>

      <View style={styles.card}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {step === 'email' ? (
          <>
            <Text style={styles.cardTitle}>Welcome Back 👋</Text>
            <Text style={styles.cardSubtitle}>Login with your email address</Text>

            <View style={styles.phoneRow}>
              <TextInput
                style={styles.emailInput}
                placeholder="Email Address"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOtp} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Send OTP</Text>}
            </TouchableOpacity>

            <Text style={styles.orText}>— or —</Text>

            <TouchableOpacity style={styles.googleBtn}>
              <Text style={{ fontSize: 20, marginRight: 10, fontWeight: 'bold', color: '#4285F4' }}>G</Text>
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/provider-register' as any)}>
              <Text style={styles.providerLink}>
                Are you a professional?{' '}
                <Text style={{ color: COLORS.primary, fontWeight: '700' }}>Join as Provider</Text>
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setStep('email')}>
              <Text style={{ color: COLORS.primary, fontSize: 13, marginBottom: 10 }}>← Change Email</Text>
            </TouchableOpacity>
            <Text style={styles.cardTitle}>Enter OTP</Text>
            <Text style={styles.cardSubtitle}>We sent a 6-digit code to {email}</Text>

            <TextInput
              style={styles.singleOtpBox}
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
              placeholder="••••••"
              placeholderTextColor="#CBD5E1"
            />

            <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOtp} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Verify & Login</Text>}
            </TouchableOpacity>
          </>
        )}
        </ScrollView>
      </View>
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
  cardSubtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 24 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  emailInput: {
    flex: 1, backgroundColor: COLORS.background, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
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
  singleOtpBox: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    textAlign: 'center',
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
});
