import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert,
} from 'react-native';
import { COLORS } from '../constants';

const TIMES = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

function getNextDays(n: number) {
  const days = [];
  const labels = ['Today', 'Tomorrow'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label: labels[i] || dayNames[d.getDay()],
      date: d.getDate(),
      full: d.toISOString().split('T')[0],
    });
  }
  return days;
}

export default function BookingScreen({ navigation, route }: any) {
  const { provider } = route.params;
  const days = getNextDays(7);

  const [selectedDay, setSelectedDay] = useState(days[0].full);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const commission = Math.round(provider.basePrice * 0.1);
  const total = provider.basePrice + 49; // + platform fee

  function handleConfirm() {
    if (!address.trim()) {
      Alert.alert('Address Required', 'Please enter your service address.');
      return;
    }
    navigation.navigate('Payment', { provider, total, selectedDay, selectedTime, address, description });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Step Indicator */}
      <View style={styles.stepRow}>
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
              <Text style={[styles.stepNum, step >= s && { color: '#fff' }]}>{s}</Text>
            </View>
            {s < 3 && <View style={[styles.stepLine, step > s && styles.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Provider summary */}
        <View style={styles.providerSummary}>
          <View style={styles.provAvatar}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.primary }}>{provider.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.provName}>{provider.name}</Text>
            <Text style={styles.provService}>{provider.service}</Text>
          </View>
        </View>

        {step === 1 && (
          <>
            {/* Date Selection */}
            <Text style={styles.sectionLabel}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
              {days.map((d) => (
                <TouchableOpacity
                  key={d.full}
                  style={[styles.dayBtn, selectedDay === d.full && styles.dayBtnActive]}
                  onPress={() => setSelectedDay(d.full)}
                >
                  <Text style={[styles.dayLabel, selectedDay === d.full && { color: '#fff' }]}>{d.label}</Text>
                  <Text style={[styles.dayNum, selectedDay === d.full && { color: '#fff' }]}>{d.date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Time Selection */}
            <Text style={styles.sectionLabel}>Select Time</Text>
            <View style={styles.timeGrid}>
              {TIMES.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeBtn, selectedTime === t && styles.timeBtnActive]}
                  onPress={() => setSelectedTime(t)}
                >
                  <Text style={[styles.timeText, selectedTime === t && { color: '#fff' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.sectionLabel}>Service Address</Text>
            <View style={styles.inputWrap}>
              <Text style={{ fontSize: 20, marginRight: 10 }}>📍</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full address"
                placeholderTextColor={COLORS.textLight}
                value={address}
                onChangeText={setAddress}
                multiline
              />
            </View>

            <Text style={styles.sectionLabel}>Describe the Problem</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the issue in detail (optional)"
              placeholderTextColor={COLORS.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 16 }}>
              <TouchableOpacity style={styles.backBtnAlt} onPress={() => setStep(1)}>
                <Text style={styles.backBtnAltText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nextBtn, { flex: 1, marginHorizontal: 0 }]} onPress={() => setStep(3)}>
                <Text style={styles.nextBtnText}>Next →</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.sectionLabel}>Order Summary</Text>
            <View style={styles.summaryCard}>
              <Row label="Service" value={provider.service} />
              <Row label="Provider" value={provider.name} />
              <Row label="Date & Time" value={`${selectedDay} at ${selectedTime}`} />
              <Row label="Address" value={address} />
              <View style={styles.divider} />
              <Row label="Service Charge" value={`₹${provider.basePrice}`} />
              <Row label="Platform Fee" value="₹49" />
              <View style={styles.divider} />
              <Row label="Total" value={`₹${total}`} bold />
            </View>

            <View style={styles.noteBox}>
              <Text style={{ fontSize: 18 }}>ℹ️</Text>
              <Text style={styles.noteText}>Payment after service completion. You can cancel for free up to 30 minutes before the scheduled time.</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 16 }}>
              <TouchableOpacity style={styles.backBtnAlt} onPress={() => setStep(2)}>
                <Text style={styles.backBtnAltText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nextBtn, { flex: 1, marginHorizontal: 0 }]} onPress={handleConfirm}>
                <Text style={styles.nextBtnText}>Proceed to Pay</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
      <Text style={{ fontSize: 13, color: COLORS.textLight }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: bold ? '800' : '600', color: bold ? COLORS.primary : COLORS.text, flex: 1, textAlign: 'right' }}>
        {value}
      </Text>
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
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.border,
    alignItems: 'center', justifyContent: 'center',
  },
  stepCircleActive: { backgroundColor: COLORS.primary },
  stepNum: { fontSize: 14, fontWeight: '800', color: COLORS.textLight },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, maxWidth: 60 },
  stepLineActive: { backgroundColor: COLORS.primary },
  providerSummary: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    margin: 16, borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  provAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  provName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  provService: { fontSize: 12, color: COLORS.textLight },
  sectionLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text, paddingHorizontal: 16, marginTop: 18, marginBottom: 10 },
  dayBtn: {
    alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 18,
    paddingVertical: 12, marginRight: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  dayBtnActive: { backgroundColor: COLORS.primary },
  dayLabel: { fontSize: 11, color: COLORS.textLight, fontWeight: '600' },
  dayNum: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 4 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  timeBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border,
  },
  timeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  nextBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginHorizontal: 16, marginTop: 20,
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff',
    borderRadius: 14, padding: 14, marginHorizontal: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  input: { flex: 1, fontSize: 14, color: COLORS.text },
  textArea: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginHorizontal: 16,
    fontSize: 14, color: COLORS.text, textAlignVertical: 'top', minHeight: 100,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  summaryCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  noteBox: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.primaryLight,
    borderRadius: 12, padding: 14, marginHorizontal: 16, marginTop: 12, gap: 10,
  },
  noteText: { flex: 1, fontSize: 12, color: COLORS.primary, lineHeight: 18 },
  backBtnAlt: {
    borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center',
    backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border,
  },
  backBtnAltText: { fontSize: 14, fontWeight: '700', color: COLORS.text },
});
