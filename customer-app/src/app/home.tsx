import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ScrollView, Animated, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#6C63FF', primaryDark: '#4B44CC', primaryLight: '#EEF0FF',
  background: '#F8F9FE', card: '#FFFFFF', text: '#1A1A2E',
  textLight: '#6B7280', border: '#E5E7EB', star: '#FBBF24',
};

const CATEGORIES = [
  { id: '1', name: 'Plumber', icon: '🔧', color: '#3B82F6' },
  { id: '2', name: 'Electrician', icon: '⚡', color: '#F59E0B' },
  { id: '3', name: 'Mechanic', icon: '🔩', color: '#6B7280' },
  { id: '4', name: 'Carpenter', icon: '🪵', color: '#92400E' },
  { id: '5', name: 'AC Repair', icon: '❄️', color: '#06B6D4' },
  { id: '6', name: 'Appliance Repair', icon: '📺', color: '#8B5CF6' },
  { id: '7', name: 'Cleaner', icon: '🧹', color: '#10B981' },
  { id: '8', name: 'Painter', icon: '🎨', color: '#F97316' },
  { id: '9', name: 'Mobile Repair', icon: '📱', color: '#EC4899' },
  { id: '10', name: 'Computer Repair', icon: '💻', color: '#3B82F6' },
  { id: '11', name: 'Pest Control', icon: '🐛', color: '#84CC16' },
  { id: '12', name: 'Water Tank', icon: '💧', color: '#0EA5E9' },
  { id: '13', name: 'Home Maintenance', icon: '🏠', color: '#6C63FF' },
  { id: '14', name: 'Other', icon: '⚙️', color: '#9CA3AF' },
];

const PROVIDERS = [
  { id: 'p1', name: 'Rajesh Kumar', rating: 4.8, jobs: 312, exp: 8, price: 299, service: 'Plumber', dist: '1.2 km' },
  { id: 'p2', name: 'Suresh Verma', rating: 4.6, jobs: 245, exp: 5, price: 349, service: 'Electrician', dist: '0.8 km' },
  { id: 'p3', name: 'Amit Singh', rating: 4.9, jobs: 189, exp: 10, price: 499, service: 'AC Repair', dist: '2.1 km' },
];

const BANNERS = [
  { id: '1', title: '50% OFF First Booking', sub: 'Use code: FIRST50', bg: '#6C63FF' },
  { id: '2', title: 'Verified Professionals', sub: 'All experts background-checked', bg: '#FF6584' },
  { id: '3', title: 'Same Day Service', sub: 'Book now, get help today', bg: '#06B6D4' },
];

export default function HomePage() {
  const router = useRouter();
  const [banner, setBanner] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setInterval(() => {
      Animated.sequence([
        Animated.timing(fade, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      setBanner((b) => (b + 1) % BANNERS.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const b = BANNERS[banner];

  return (
    <View style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.greeting}>Good morning 👋</Text>
          <View style={s.locRow}>
            <Text style={s.locText}>📍 Bengaluru, Karnataka ▾</Text>
          </View>
        </View>
        <TouchableOpacity style={s.notifBtn}>
          <Text style={{ fontSize: 22 }}>🔔</Text>
          <View style={s.dot} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={{ fontSize: 18, marginRight: 8 }}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="What service do you need?"
          placeholderTextColor={COLORS.textLight}
          onFocus={() => router.push('/search' as any)}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Banner */}
        <Animated.View style={[s.banner, { opacity: fade, backgroundColor: b.bg }]}>
          <View>
            <Text style={s.bannerTitle}>{b.title}</Text>
            <Text style={s.bannerSub}>{b.sub}</Text>
          </View>
          <Text style={{ fontSize: 48 }}>🛠️</Text>
        </Animated.View>
        <View style={s.dotsRow}>
          {BANNERS.map((_, i) => (
            <View key={i} style={[s.dot2, i === banner && s.dotActive]} />
          ))}
        </View>

        {/* Categories */}
        <View style={s.secHeader}>
          <Text style={s.secTitle}>Service Categories</Text>
          <Text style={s.seeAll}>See All</Text>
        </View>
        <FlatList
          data={CATEGORIES.slice(0, 8)}
          keyExtractor={(i) => i.id}
          numColumns={4}
          scrollEnabled={false}
          style={{ paddingHorizontal: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={s.catItem}
              onPress={() => router.push({ pathname: '/search', params: { category: item.name } } as any)}
            >
              <View style={[s.catIcon, { backgroundColor: item.color + '22' }]}>
                <Text style={{ fontSize: 26 }}>{item.icon}</Text>
              </View>
              <Text style={s.catName} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* More services chips */}
        <View style={s.secHeader}>
          <Text style={s.secTitle}>More Services</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {CATEGORIES.slice(8).map((c) => (
            <TouchableOpacity key={c.id} style={s.chip} onPress={() => router.push({ pathname: '/search', params: { category: c.name } } as any)}>
              <Text>{c.icon}</Text>
              <Text style={s.chipText}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby */}
        <View style={s.secHeader}>
          <Text style={s.secTitle}>Nearby Providers</Text>
          <TouchableOpacity onPress={() => router.push('/search' as any)}>
            <Text style={s.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {PROVIDERS.map((p) => (
          <TouchableOpacity
            key={p.id}
            style={s.card}
            onPress={() => router.push({ pathname: '/provider-profile', params: { id: p.id, name: p.name, rating: p.rating, jobs: p.jobs, exp: p.exp, price: p.price, service: p.service, dist: p.dist } } as any)}
            activeOpacity={0.85}
          >
            <View style={s.avatar}>
              <Text style={s.avatarText}>{p.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.pName}>{p.name}</Text>
              <Text style={s.pSvc}>{p.service}</Text>
              <View style={{ flexDirection: 'row' }}>
                {[1,2,3,4,5].map(i => <Text key={i} style={{ color: i <= p.rating ? '#FBBF24' : '#D1D5DB', fontSize: 12 }}>★</Text>)}
                <Text style={{ fontSize: 12, color: COLORS.textLight, marginLeft: 4 }}>{p.rating} ({p.jobs} jobs)</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.price}>₹{p.price}</Text>
              <Text style={s.dist}>{p.dist}</Text>
              <View style={s.avail}><Text style={s.availTxt}>Available</Text></View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Top Rated */}
        <View style={s.secHeader}>
          <Text style={s.secTitle}>⭐ Top Rated</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {[...PROVIDERS].sort((a, b) => b.rating - a.rating).map((p) => (
            <TouchableOpacity
              key={p.id}
              style={s.topCard}
              onPress={() => router.push({ pathname: '/provider-profile', params: { id: p.id, name: p.name, rating: p.rating, jobs: p.jobs, exp: p.exp, price: p.price, service: p.service, dist: p.dist } } as any)}
            >
              <View style={[s.topAvatar, { backgroundColor: COLORS.primary }]}>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>{p.name.charAt(0)}</Text>
              </View>
              <Text style={s.topName} numberOfLines={1}>{p.name}</Text>
              <Text style={s.topSvc}>{p.service}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                {[1,2,3,4,5].map(i => <Text key={i} style={{ color: i <= p.rating ? '#FBBF24' : '#D1D5DB', fontSize: 11 }}>★</Text>)}
              </View>
              <Text style={s.topPrice}>from ₹{p.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={s.nav}>
        {[
          { icon: '🏠', label: 'Home', path: '/home' },
          { icon: '🔍', label: 'Search', path: '/search' },
          { icon: '📋', label: 'Bookings', path: '/my-bookings' },
          { icon: '👤', label: 'Profile', path: '/profile' },
        ].map((n) => (
          <TouchableOpacity key={n.path} style={s.navItem} onPress={() => router.push(n.path as any)}>
            <Text style={{ fontSize: 22 }}>{n.icon}</Text>
            <Text style={[s.navLabel, n.path === '/home' && { color: COLORS.primary }]}>{n.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16 },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  notifBtn: { padding: 8, position: 'relative' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FF6584', position: 'absolute', top: 8, right: 8 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  banner: { marginHorizontal: 16, borderRadius: 16, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 4 },
  dot2: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border, marginHorizontal: 3 },
  dotActive: { backgroundColor: COLORS.primary, width: 18 },
  secHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 22, marginBottom: 12 },
  secTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  catItem: { flex: 1, alignItems: 'center', marginBottom: 12 },
  catIcon: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  catName: { fontSize: 11, color: COLORS.text, textAlign: 'center', fontWeight: '600' },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 10 },
  chipText: { fontSize: 13, color: COLORS.primary, marginLeft: 6, fontWeight: '600' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  pName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  pSvc: { fontSize: 12, color: COLORS.textLight, marginBottom: 3 },
  price: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  dist: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  avail: { backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 },
  availTxt: { fontSize: 10, color: '#16A34A', fontWeight: '700' },
  topCard: { width: 140, backgroundColor: '#fff', borderRadius: 16, padding: 14, marginRight: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  topAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  topName: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  topSvc: { fontSize: 11, color: COLORS.textLight, marginBottom: 6 },
  topPrice: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginTop: 6 },
  nav: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: 10 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  navLabel: { fontSize: 10, fontWeight: '700', color: '#9CA3AF', marginTop: 2 },
});
