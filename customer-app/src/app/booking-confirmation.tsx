import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const COLORS = {
  primary: '#6C63FF', primaryLight: '#EEF0FF',
  text: '#1A1A2E', textLight: '#6B7280',
  background: '#F8F9FE', border: '#E5E7EB',
};

export default function BookingConfirmationPage() {
  const router = useRouter();
  const p = useLocalSearchParams();
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 5 }).start();
  }, []);

  const total = p.total || '548';

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={s.topBg} />

      <View style={s.content}>
        <Animated.View style={[s.successCircle, { transform: [{ scale }] }]}>
          <Text style={{ fontSize: 52 }}>✅</Text>
        </Animated.View>

        <Text style={s.title}>Booking Confirmed!</Text>
        <Text style={s.sub}>Your booking has been placed successfully.</Text>

        <View style={s.badge}>
          <Text style={s.badgeTxt}>Booking ID: {p.bookingId}</Text>
        </View>

        <View style={s.detailCard}>
          {[
            ['👨‍🔧', 'Provider', p.name],
            ['🛠️', 'Service', p.service],
            ['📅', 'Date', p.day],
            ['🕐', 'Time', p.time],
            ['📍', 'Address', p.address],
          ].map(([icon, label, value]) => (
            <View key={label as string} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
              <Text style={{ fontSize: 16, marginRight: 10 }}>{icon}</Text>
              <Text style={{ fontSize: 13, color: COLORS.textLight, width: 80 }}>{label}</Text>
              <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: COLORS.text }}>{value}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
            <Text style={{ fontSize: 16, marginRight: 10 }}>💰</Text>
            <Text style={{ fontSize: 13, color: COLORS.textLight, width: 80 }}>Amount</Text>
            <Text style={{ flex: 1, fontSize: 15, fontWeight: '800', color: COLORS.primary }}>₹{total}</Text>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={s.timeline}>
          {[
            { icon: '✅', label: 'Booking Requested', done: true },
            { icon: '⏳', label: 'Waiting for Provider', active: true },
            { icon: '🚗', label: 'Provider on the Way' },
            { icon: '🛠️', label: 'Service Started' },
            { icon: '🎉', label: 'Completed' },
          ].map((item, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 7 }}>
              <Text style={{ fontSize: 18, marginRight: 12, opacity: item.done || item.active ? 1 : 0.4 }}>{item.icon}</Text>
              <Text style={{ flex: 1, fontSize: 13, color: item.done || item.active ? COLORS.text : COLORS.textLight, fontWeight: item.done || item.active ? '600' : '400' }}>
                {item.label}
              </Text>
              {item.active && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary }} />}
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.homeBtn} onPress={() => router.replace('/home')}>
          <Text style={s.homeTxt}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 200, backgroundColor: COLORS.primary },
  content: { flex: 1, marginTop: 60, alignItems: 'center', paddingHorizontal: 16 },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 20 },
  badgeTxt: { color: '#fff', fontSize: 13, fontWeight: '700' },
  detailCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, width: '100%', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 5, marginBottom: 16 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  timeline: { backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '100%', marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  homeBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', width: '100%', marginBottom: 20 },
  homeTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
