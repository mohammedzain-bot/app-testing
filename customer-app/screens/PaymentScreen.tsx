import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { COLORS } from '../constants';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: '📲', desc: 'Google Pay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit/Debit Card', icon: '💳', desc: 'Visa, MasterCard, Rupay' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks' },
  { id: 'wallet', label: 'Wallet', icon: '👛', desc: 'Paytm, Mobikwik' },
  { id: 'cod', label: 'Pay After Service', icon: '💵', desc: 'Pay cash on completion' },
];

export default function PaymentScreen({ navigation, route }: any) {
  const { provider, total, selectedDay, selectedTime, address } = route.params;
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  function handlePay() {
    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      navigation.replace('BookingConfirmation', {
        provider,
        total,
        selectedDay,
        selectedTime,
        address,
        paymentMethod: selectedMethod,
        bookingId: 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      });
    }, 1800);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Amount Summary */}
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amount}>₹{total}</Text>
        <Text style={styles.amountSub}>For {provider.service} with {provider.name}</Text>
      </View>

      <Text style={styles.sectionLabel}>Choose Payment Method</Text>

      {PAYMENT_METHODS.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[styles.methodCard, selectedMethod === m.id && styles.methodCardActive]}
          onPress={() => setSelectedMethod(m.id)}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 26, marginRight: 14 }}>{m.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.methodLabel, selectedMethod === m.id && { color: COLORS.primary }]}>{m.label}</Text>
            <Text style={styles.methodDesc}>{m.desc}</Text>
          </View>
          <View style={[styles.radio, selectedMethod === m.id && styles.radioActive]}>
            {selectedMethod === m.id && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      ))}

      {/* Secure note */}
      <View style={styles.secureRow}>
        <Text style={{ fontSize: 16 }}>🔒</Text>
        <Text style={styles.secureText}>100% Secure Payment. Your data is encrypted and never stored.</Text>
      </View>

      <View style={{ flex: 1 }} />

      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.payBtn, loading && { opacity: 0.7 }]}
        onPress={handlePay}
        disabled={loading}
      >
        <Text style={styles.payBtnText}>
          {loading ? '⏳ Processing...' : `Pay ₹${total}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  amountCard: {
    backgroundColor: COLORS.primary, margin: 16, borderRadius: 20, padding: 24, alignItems: 'center',
  },
  amountLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  amount: { color: '#fff', fontSize: 40, fontWeight: '800', marginTop: 4 },
  amountSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 6 },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text, paddingHorizontal: 16, marginBottom: 10 },
  methodCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 16, marginBottom: 10, borderRadius: 14, padding: 14,
    borderWidth: 1.5, borderColor: 'transparent',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  methodCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  methodLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  methodDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  secureRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8,
  },
  secureText: { fontSize: 12, color: COLORS.textLight, flex: 1 },
  payBtn: {
    backgroundColor: COLORS.primary, margin: 16, borderRadius: 16, paddingVertical: 18, alignItems: 'center',
    marginBottom: 36,
  },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
