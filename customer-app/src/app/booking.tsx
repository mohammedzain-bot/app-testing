import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const COLORS = {
  primary: '#6C63FF', primaryLight: '#EEF0FF',
  text: '#1A1A2E', textLight: '#6B7280',
  background: '#F8F9FE', border: '#E5E7EB',
};

const TIMES = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

function getDays() {
  const labels = ['Today', 'Tomorrow'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return { label: labels[i] || dayNames[d.getDay()], date: d.getDate(), full: d.toISOString().split('T')[0] };
  });
}

export default function BookingPage() {
  const router = useRouter();
  const p = useLocalSearchParams();
  const days = getDays();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [day, setDay] = useState(days[0].full);
  const [time, setTime] = useState('10:00 AM');
  const [address, setAddress] = useState('');
  const [desc, setDesc] = useState('');

  const price = Number(p.price) || 499;
  const total = price + 49;

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ fontSize: 22 }}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Book Service</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Steps */}
      <View style={s.steps}>
        {[1, 2, 3].map((n) => (
          <React.Fragment key={n}>
            <View style={[s.stepCircle, step >= n && s.stepActive]}>
              <Text style={[s.stepNum, step >= n && { color: '#fff' }]}>{n}</Text>
            </View>
            {n < 3 && <View style={[s.stepLine, step > n && s.stepLineActive]} />}
          </React.Fragment>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Provider */}
        <View style={s.provRow}>
          <View style={s.provAvatar}><Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.primary }}>{String(p.name || 'P').charAt(0)}</Text></View>
          <View><Text style={s.provName}>{p.name}</Text><Text style={s.provSvc}>{p.service}</Text></View>
        </View>

        {step === 1 && (
          <>
            <Text style={s.sec}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
              {days.map((d) => (
                <TouchableOpacity key={d.full} style={[s.dayBtn, day === d.full && s.dayBtnActive]} onPress={() => setDay(d.full)}>
                  <Text style={[{ fontSize: 11, color: COLORS.textLight, fontWeight: '600' }, day === d.full && { color: '#fff' }]}>{d.label}</Text>
                  <Text style={[{ fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 4 }, day === d.full && { color: '#fff' }]}>{d.date}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={s.sec}>Select Time</Text>
            <View style={s.timeGrid}>
              {TIMES.map((t) => (
                <TouchableOpacity key={t} style={[s.timeBtn, time === t && s.timeBtnActive]} onPress={() => setTime(t)}>
                  <Text style={[s.timeTxt, time === t && { color: '#fff' }]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={s.nextBtn} onPress={() => setStep(2)}>
              <Text style={s.nextTxt}>Next →</Text>
            </TouchableOpacity>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={s.sec}>Service Address</Text>
            <View style={s.inputWrap}>
              <Text style={{ fontSize: 20, marginRight: 10 }}>📍</Text>
              <TextInput style={{ flex: 1, fontSize: 14, color: COLORS.text }} placeholder="Enter your full address" placeholderTextColor={COLORS.textLight} value={address} onChangeText={setAddress} multiline />
            </View>
            <Text style={s.sec}>Describe the Problem</Text>
            <TextInput style={s.textArea} placeholder="Describe the issue in detail (optional)" placeholderTextColor={COLORS.textLight} value={desc} onChangeText={setDesc} multiline numberOfLines={4} />
            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 16 }}>
              <TouchableOpacity style={s.backBtn} onPress={() => setStep(1)}><Text style={s.backBtnTxt}>← Back</Text></TouchableOpacity>
              <TouchableOpacity style={[s.nextBtn, { flex: 1, marginHorizontal: 0 }]} onPress={() => { if (!address) { Alert.alert('Address required'); return; } setStep(3); }}>
                <Text style={s.nextTxt}>Next →</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={s.sec}>Order Summary</Text>
            <View style={s.summary}>
              {[['Service', p.service], ['Provider', p.name], ['Date', day], ['Time', time], ['Address', address]].map(([l, v]) => (
                <View key={l as string} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                  <Text style={{ fontSize: 13, color: COLORS.textLight }}>{l}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text, flex: 1, textAlign: 'right' }}>{v}</Text>
                </View>
              ))}
              <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>Service Charge</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>₹{price}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>Platform Fee</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.text }}>₹49</Text>
              </View>
              <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 8 }} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text }}>Total</Text>
                <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.primary }}>₹{total}</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginTop: 16 }}>
              <TouchableOpacity style={s.backBtn} onPress={() => setStep(2)}><Text style={s.backBtnTxt}>← Back</Text></TouchableOpacity>
              <TouchableOpacity style={[s.nextBtn, { flex: 1, marginHorizontal: 0 }]} onPress={() => router.push({ pathname: '/payment', params: { ...p, total, day, time, address } } as any)}>
                <Text style={s.nextTxt}>Proceed to Pay</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  steps: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  stepActive: { backgroundColor: COLORS.primary },
  stepNum: { fontSize: 14, fontWeight: '800', color: COLORS.textLight },
  stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, maxWidth: 60 },
  stepLineActive: { backgroundColor: COLORS.primary },
  provRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  provAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  provName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  provSvc: { fontSize: 12, color: COLORS.textLight },
  sec: { fontSize: 15, fontWeight: '700', color: COLORS.text, paddingHorizontal: 16, marginTop: 18, marginBottom: 10 },
  dayBtn: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12, marginRight: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  dayBtnActive: { backgroundColor: COLORS.primary },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  timeBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1, borderColor: COLORS.border },
  timeBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeTxt: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  nextBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginHorizontal: 16, marginTop: 20 },
  nextTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
  inputWrap: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 14, padding: 14, marginHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  textArea: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginHorizontal: 16, fontSize: 14, color: COLORS.text, textAlignVertical: 'top', minHeight: 100 },
  summary: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  backBtn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', backgroundColor: '#fff', borderWidth: 1.5, borderColor: COLORS.border },
  backBtnTxt: { fontSize: 14, fontWeight: '700', color: COLORS.text },
});
