import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const COLORS = {
  primary: '#6C63FF', primaryLight: '#EEF0FF',
  text: '#1A1A2E', textLight: '#6B7280',
  background: '#F8F9FE', border: '#E5E7EB',
};

const REVIEWS = [
  { id: '1', author: 'Priya M.', rating: 5, comment: 'Excellent work! Very professional and prompt.', date: '2 days ago' },
  { id: '2', author: 'Arun K.', rating: 4, comment: 'Good service, came on time.', date: '1 week ago' },
  { id: '3', author: 'Meera S.', rating: 5, comment: 'Highly recommend! Very knowledgeable.', date: '2 weeks ago' },
];

export default function ProviderProfilePage() {
  const router = useRouter();
  const p = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: '#fff', fontSize: 22 }}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Provider Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.card}>
          <View style={s.avatar}><Text style={s.avatarTxt}>{String(p.name || 'P').charAt(0)}</Text></View>
          <Text style={s.name}>{p.name}</Text>
          <Text style={s.svc}>{p.service}</Text>
          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {[1,2,3,4,5].map(i => <Text key={i} style={{ color: i <= Number(p.rating) ? '#FBBF24' : '#D1D5DB', fontSize: 16 }}>★</Text>)}
            <Text style={{ fontSize: 14, color: COLORS.textLight, marginLeft: 6 }}>{p.rating}</Text>
          </View>
          <View style={s.statsRow}>
            <View style={s.stat}><Text style={s.statVal}>{p.jobs}</Text><Text style={s.statLabel}>Jobs</Text></View>
            <View style={s.statDiv} />
            <View style={s.stat}><Text style={s.statVal}>{p.exp} yrs</Text><Text style={s.statLabel}>Experience</Text></View>
            <View style={s.statDiv} />
            <View style={s.stat}><Text style={s.statVal}>{p.dist}</Text><Text style={s.statLabel}>Distance</Text></View>
          </View>
          <View style={s.contactRow}>
            <TouchableOpacity style={[s.cBtn, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={{ fontSize: 20 }}>💬</Text>
              <Text style={[s.cTxt, { color: COLORS.primary }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.cBtn, { backgroundColor: '#DCFCE7' }]}>
              <Text style={{ fontSize: 20 }}>📞</Text>
              <Text style={[s.cTxt, { color: '#16A34A' }]}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={s.tabRow}>
          {(['about', 'reviews'] as const).map((t) => (
            <TouchableOpacity key={t} style={[s.tab, activeTab === t && s.tabActive]} onPress={() => setActiveTab(t)}>
              <Text style={[s.tabTxt, activeTab === t && { color: '#fff' }]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'about' ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={s.secTitle}>About</Text>
            <Text style={s.bio}>{p.bio || 'Experienced professional ready to help you.'}</Text>
            <Text style={s.secTitle}>Services & Pricing</Text>
            <View style={s.priceCard}>
              <View><Text style={s.priceSvc}>{p.service}</Text><Text style={{ fontSize: 12, color: COLORS.textLight }}>Starting price</Text></View>
              <Text style={s.priceVal}>₹{p.price}</Text>
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            {REVIEWS.map((r) => (
              <View key={r.id} style={s.review}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View style={s.rAvatar}><Text style={{ color: COLORS.primary, fontWeight: '700' }}>{r.author.charAt(0)}</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{r.author}</Text>
                    <Text style={{ fontSize: 11, color: COLORS.textLight }}>{r.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    {[1,2,3,4,5].map(i => <Text key={i} style={{ color: i <= r.rating ? '#FBBF24' : '#D1D5DB', fontSize: 12 }}>★</Text>)}
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: COLORS.textLight }}>{r.comment}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={s.bookBar}>
        <View>
          <Text style={{ color: COLORS.textLight, fontSize: 13 }}>Starting from</Text>
          <Text style={{ color: COLORS.primary, fontSize: 22, fontWeight: '800' }}>₹{p.price}</Text>
        </View>
        <TouchableOpacity style={s.bookBtn} onPress={() => router.push({ pathname: '/booking', params: { ...p } } as any)}>
          <Text style={s.bookTxt}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  card: { backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarTxt: { fontSize: 34, fontWeight: '800', color: COLORS.primary },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  svc: { fontSize: 14, color: COLORS.textLight, marginBottom: 8 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 12, width: '100%', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  statDiv: { width: 1, height: 36, backgroundColor: COLORS.border },
  contactRow: { flexDirection: 'row', gap: 12, marginTop: 8, width: '100%' },
  cBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 12, paddingVertical: 12, gap: 8 },
  cTxt: { fontSize: 14, fontWeight: '700' },
  tabRow: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabTxt: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  secTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 10, marginTop: 10 },
  bio: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
  priceCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  priceSvc: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  priceVal: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  review: { backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  rAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  bookBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, paddingBottom: 30, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16, elevation: 10 },
  bookBtn: { backgroundColor: COLORS.primary, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14 },
  bookTxt: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
