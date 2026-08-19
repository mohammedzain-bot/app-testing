import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#6C63FF', primaryLight: '#EEF0FF',
  text: '#1A1A2E', textLight: '#6B7280',
  background: '#F8F9FE', border: '#E5E7EB',
};

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  REQUESTED:  { bg: '#FEF9C3', text: '#92400E', icon: '⏳' },
  ACCEPTED:   { bg: '#DCFCE7', text: '#15803D', icon: '✅' },
  ON_THE_WAY: { bg: '#DBEAFE', text: '#1D4ED8', icon: '🚗' },
  STARTED:    { bg: '#EDE9FE', text: '#6D28D9', icon: '🛠️' },
  COMPLETED:  { bg: '#F0FDF4', text: '#16A34A', icon: '🎉' },
  CANCELLED:  { bg: '#FEF2F2', text: '#DC2626', icon: '❌' },
};

const BOOKINGS = [
  { id: 'b1', service: 'Plumber', provider: 'Rajesh Kumar', status: 'COMPLETED', date: '2026-08-15', price: 499, address: '123 MG Road, Bengaluru' },
  { id: 'b2', service: 'Electrician', provider: 'Suresh Verma', status: 'ACCEPTED', date: '2026-08-19', price: 349, address: '456 Anna Nagar, Chennai' },
  { id: 'b3', service: 'AC Repair', provider: 'Amit Singh', status: 'REQUESTED', date: '2026-08-20', price: 599, address: '789 Jubilee Hills, Hyderabad' },
  { id: 'b4', service: 'Cleaner', provider: 'Ravi Mehta', status: 'COMPLETED', date: '2026-08-10', price: 199, address: '101 Koramangala, Bengaluru' },
  { id: 'b5', service: 'Carpenter', provider: 'Sunil Das', status: 'CANCELLED', date: '2026-08-08', price: 799, address: '202 Banjara Hills, Hyderabad' },
];

const TABS = ['All', 'Active', 'Completed', 'Cancelled'];

export default function MyBookingsPage() {
  const router = useRouter();
  const [tab, setTab] = useState('All');

  const filtered = BOOKINGS.filter((b) => {
    if (tab === 'All') return true;
    if (tab === 'Active') return ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status);
    if (tab === 'Completed') return b.status === 'COMPLETED';
    if (tab === 'Cancelled') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Bookings</Text>
      </View>

      <View style={s.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity key={t} style={[s.tab, tab === t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabTxt, tab === t && { color: '#fff' }]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const sc = STATUS_COLORS[item.status] || STATUS_COLORS.REQUESTED;
          return (
            <View style={s.card}>
              <View style={s.cardTop}>
                <View>
                  <Text style={s.svcName}>{item.service}</Text>
                  <Text style={s.provName}>{item.provider}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                  <Text style={{ fontSize: 14 }}>{sc.icon}</Text>
                  <Text style={[s.statusTxt, { color: sc.text }]}>{item.status.replace('_', ' ')}</Text>
                </View>
              </View>
              <View style={s.cardBot}>
                <Text style={s.meta}>📅 {item.date}</Text>
                <Text style={s.meta}>📍 {item.address}</Text>
              </View>
              <View style={s.cardFooter}>
                <Text style={s.price}>₹{item.price}</Text>
                {item.status === 'ACCEPTED' && (
                  <TouchableOpacity style={s.trackBtn}>
                    <Text style={s.trackTxt}>Track</Text>
                  </TouchableOpacity>
                )}
                {item.status === 'COMPLETED' && (
                  <TouchableOpacity style={[s.trackBtn, { backgroundColor: COLORS.primaryLight }]}>
                    <Text style={[s.trackTxt, { color: COLORS.primary }]}>Review</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 56 }}>📋</Text>
            <Text style={{ fontSize: 16, color: COLORS.textLight, marginTop: 12 }}>No bookings yet</Text>
            <TouchableOpacity
              style={{ marginTop: 20, backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
              onPress={() => router.push('/home')}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Book a Service</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 54, paddingBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  tabsRow: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 12, paddingBottom: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  tabActive: { backgroundColor: COLORS.primary },
  tabTxt: { fontSize: 13, fontWeight: '600', color: COLORS.textLight },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  svcName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  provName: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, gap: 4 },
  statusTxt: { fontSize: 11, fontWeight: '700' },
  cardBot: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, gap: 4 },
  meta: { fontSize: 12, color: COLORS.textLight },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  price: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  trackBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  trackTxt: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
