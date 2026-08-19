import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS, SAMPLE_BOOKINGS } from '../constants';

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  REQUESTED:  { bg: '#FEF9C3', text: '#92400E', icon: '⏳' },
  ACCEPTED:   { bg: '#DCFCE7', text: '#15803D', icon: '✅' },
  ON_THE_WAY: { bg: '#DBEAFE', text: '#1D4ED8', icon: '🚗' },
  STARTED:    { bg: '#EDE9FE', text: '#6D28D9', icon: '🛠️' },
  COMPLETED:  { bg: '#F0FDF4', text: '#16A34A', icon: '🎉' },
  CANCELLED:  { bg: '#FEF2F2', text: '#DC2626', icon: '❌' },
};

const TABS = ['All', 'Active', 'Completed', 'Cancelled'];

export default function MyBookingsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = SAMPLE_BOOKINGS.filter((b) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return ['REQUESTED', 'ACCEPTED', 'ON_THE_WAY', 'STARTED'].includes(b.status);
    if (activeTab === 'Completed') return b.status === 'COMPLETED';
    if (activeTab === 'Cancelled') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, activeTab === t && styles.tabActive]}
            onPress={() => setActiveTab(t)}
          >
            <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const s = STATUS_COLORS[item.status] || STATUS_COLORS.REQUESTED;
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('BookingDetails', { booking: item })}
              activeOpacity={0.85}
            >
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.serviceName}>{item.service}</Text>
                  <Text style={styles.providerName}>{item.providerName}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                  <Text style={{ fontSize: 14 }}>{s.icon}</Text>
                  <Text style={[styles.statusText, { color: s.text }]}>
                    {item.status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBottom}>
                <Text style={styles.metaText}>📅 {item.date}</Text>
                <Text style={styles.metaText}>📍 {item.address}</Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.price}>₹{item.price}</Text>
                <View style={styles.actions}>
                  {item.status === 'ACCEPTED' && (
                    <TouchableOpacity style={styles.trackBtn}>
                      <Text style={styles.trackBtnText}>Track</Text>
                    </TouchableOpacity>
                  )}
                  {item.status === 'COMPLETED' && (
                    <TouchableOpacity style={[styles.trackBtn, { backgroundColor: COLORS.primaryLight }]}
                      onPress={() => navigation.navigate('Review', { booking: item })}>
                      <Text style={[styles.trackBtnText, { color: COLORS.primary }]}>Review</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 56 }}>📋</Text>
            <Text style={{ fontSize: 16, color: COLORS.textLight, marginTop: 12 }}>No bookings yet</Text>
            <TouchableOpacity
              style={{ marginTop: 20, backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={{ color: '#fff', fontWeight: '700' }}>Book a Service</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 54, paddingBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  tabsRow: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 12, paddingBottom: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textLight },
  tabTextActive: { color: '#fff' },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  serviceName: { fontSize: 16, fontWeight: '800', color: COLORS.text },
  providerName: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, gap: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  cardBottom: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 10, gap: 4 },
  metaText: { fontSize: 12, color: COLORS.textLight },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  price: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  actions: { flexDirection: 'row', gap: 8 },
  trackBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 },
  trackBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
