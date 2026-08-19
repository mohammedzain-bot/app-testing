import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const COLORS = {
  primary: '#6C63FF', primaryLight: '#EEF0FF',
  text: '#1A1A2E', textLight: '#6B7280',
  background: '#F8F9FE', border: '#E5E7EB',
};

const METHODS = [
  { id: 'upi', label: 'UPI', icon: '📲', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, MasterCard, Rupay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
  { id: 'wallet', label: 'Wallet', icon: '👛', desc: 'Paytm, Mobikwik' },
  { id: 'cod', label: 'Pay After Service', icon: '💵', desc: 'Pay cash on completion' },
];

export default function PaymentPage() {
  const router = useRouter();
  const p = useLocalSearchParams();
  const [selected, setSelected] = useState('upi');
  const [loading, setLoading] = useState(false);
  const total = Number(p.total) || 548;

  function handlePay() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const bookingId = 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase();
      router.replace({ pathname: '/booking-confirmation', params: { ...p, bookingId } } as any);
    }, 1800);
  }

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ fontSize: 22 }}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={s.amountCard}>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Total Amount</Text>
        <Text style={s.amount}>₹{total}</Text>
        <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 6 }}>
          For {p.service} with {p.name}
        </Text>
      </View>

      <Text style={s.secLabel}>Choose Payment Method</Text>

      {METHODS.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[s.methodCard, selected === m.id && s.methodActive]}
          onPress={() => setSelected(m.id)}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 26, marginRight: 14 }}>{m.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s.mLabel, selected === m.id && { color: COLORS.primary }]}>{m.label}</Text>
            <Text style={s.mDesc}>{m.desc}</Text>
          </View>
          <View style={[s.radio, selected === m.id && s.radioActive]}>
            {selected === m.id && <View style={s.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}

      <View style={s.secureRow}>
        <Text style={{ fontSize: 16 }}>🔒</Text>
        <Text style={s.secureTxt}>100% Secure Payment. Your data is encrypted and never stored.</Text>
      </View>

      <View style={{ flex: 1 }} />

      <TouchableOpacity
        style={[s.payBtn, loading && { opacity: 0.7 }]}
        onPress={handlePay}
        disabled={loading}
      >
        <Text style={s.payTxt}>{loading ? '⏳ Processing...' : `Pay ₹${total}`}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  amountCard: { backgroundColor: COLORS.primary, margin: 16, borderRadius: 20, padding: 24, alignItems: 'center' },
  amount: { color: '#fff', fontSize: 40, fontWeight: '800', marginTop: 4 },
  secLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text, paddingHorizontal: 16, marginBottom: 10 },
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 14, borderWidth: 1.5, borderColor: 'transparent', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  methodActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  mLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  mDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: COLORS.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  secureRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  secureTxt: { fontSize: 12, color: COLORS.textLight, flex: 1 },
  payBtn: { backgroundColor: COLORS.primary, margin: 16, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 36 },
  payTxt: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
