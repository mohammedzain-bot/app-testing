import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Animated,
} from 'react-native';
import { COLORS } from '../constants';

export default function BookingConfirmationScreen({ navigation, route }: any) {
  const { provider, total, selectedDay, selectedTime, address, bookingId } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1, useNativeDriver: true, tension: 60, friction: 5,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.topBg} />

      <View style={styles.content}>
        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={{ fontSize: 52 }}>✅</Text>
        </Animated.View>

        <Text style={styles.title}>Booking Confirmed!</Text>
        <Text style={styles.subtitle}>Your booking has been placed successfully.</Text>

        <View style={styles.bookingIdBadge}>
          <Text style={styles.bookingIdText}>Booking ID: {bookingId}</Text>
        </View>

        {/* Details */}
        <View style={styles.detailCard}>
          <DetailRow icon="👨‍🔧" label="Provider" value={provider.name} />
          <DetailRow icon="🛠️" label="Service" value={provider.service} />
          <DetailRow icon="📅" label="Date" value={selectedDay} />
          <DetailRow icon="🕐" label="Time" value={selectedTime} />
          <DetailRow icon="📍" label="Address" value={address} />
          <View style={styles.divider} />
          <DetailRow icon="💰" label="Amount Paid" value={`₹${total}`} bold />
        </View>

        {/* Status Timeline */}
        <View style={styles.timeline}>
          <TimelineStep icon="✅" label="Booking Requested" done />
          <TimelineStep icon="⏳" label="Waiting for Provider" active />
          <TimelineStep icon="🚗" label="Provider on the Way" />
          <TimelineStep icon="🛠️" label="Service Started" />
          <TimelineStep icon="🎉" label="Completed" />
        </View>

        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigation.navigate('Tracking', { bookingId, provider })}
        >
          <Text style={styles.trackBtnText}>Track Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function DetailRow({ icon, label, value, bold }: any) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }}>
      <Text style={{ fontSize: 16, marginRight: 10 }}>{icon}</Text>
      <Text style={{ fontSize: 13, color: COLORS.textLight, width: 80 }}>{label}</Text>
      <Text style={{ flex: 1, fontSize: 13, fontWeight: bold ? '800' : '600', color: bold ? COLORS.primary : COLORS.text }}>
        {value}
      </Text>
    </View>
  );
}

function TimelineStep({ icon, label, done, active }: any) {
  return (
    <View style={styles.timelineStep}>
      <Text style={[styles.timelineIcon, done && { opacity: 1 }, active && { opacity: 1 }]}>{icon}</Text>
      <Text style={[styles.timelineLabel, (done || active) && { color: COLORS.text, fontWeight: '600' }]}>
        {label}
      </Text>
      {active && <View style={styles.activeDot} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBg: { position: 'absolute', top: 0, left: 0, right: 0, height: 200, backgroundColor: COLORS.primary },
  content: { flex: 1, marginTop: 60, alignItems: 'center', paddingHorizontal: 16 },
  successCircle: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
  },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  bookingIdBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6, marginBottom: 20,
  },
  bookingIdText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  detailCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 18, width: '100%',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 5, marginBottom: 16,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  timeline: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, width: '100%', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  timelineStep: { flexDirection: 'row', alignItems: 'center', paddingVertical: 7 },
  timelineIcon: { fontSize: 18, marginRight: 12, opacity: 0.4 },
  timelineLabel: { fontSize: 13, color: COLORS.textLight, flex: 1 },
  activeDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary,
  },
  trackBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', width: '100%', marginBottom: 10,
  },
  trackBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  homeBtn: {
    borderRadius: 14, paddingVertical: 16, alignItems: 'center', width: '100%',
    backgroundColor: COLORS.background, borderWidth: 1.5, borderColor: COLORS.border,
  },
  homeBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.text },
});
