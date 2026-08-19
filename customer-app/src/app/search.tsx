import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, StatusBar, ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const COLORS = {
  primary: '#6C63FF', primaryLight: '#EEF0FF',
  text: '#1A1A2E', textLight: '#6B7280',
  background: '#F8F9FE', border: '#E5E7EB',
};

const CATEGORIES = [
  { id: '1', name: 'Plumber', icon: '🔧' }, { id: '2', name: 'Electrician', icon: '⚡' },
  { id: '3', name: 'Mechanic', icon: '🔩' }, { id: '4', name: 'Carpenter', icon: '🪵' },
  { id: '5', name: 'AC Repair', icon: '❄️' }, { id: '6', name: 'Appliance Repair', icon: '📺' },
  { id: '7', name: 'Cleaner', icon: '🧹' }, { id: '8', name: 'Painter', icon: '🎨' },
  { id: '9', name: 'Mobile Repair', icon: '📱' }, { id: '10', name: 'Computer Repair', icon: '💻' },
  { id: '11', name: 'Pest Control', icon: '🐛' }, { id: '12', name: 'Water Tank', icon: '💧' },
  { id: '13', name: 'Home Maintenance', icon: '🏠' }, { id: '14', name: 'Other', icon: '⚙️' },
];

const ALL_PROVIDERS = [
  { id: 'p1', name: 'Rajesh Kumar', rating: 4.8, jobs: 312, exp: 8, price: 299, service: 'Plumber', dist: '1.2 km', bio: 'Expert plumber with 8 years of experience.' },
  { id: 'p2', name: 'Suresh Verma', rating: 4.6, jobs: 245, exp: 5, price: 349, service: 'Electrician', dist: '0.8 km', bio: 'Certified electrician, expert in wiring.' },
  { id: 'p3', name: 'Amit Singh', rating: 4.9, jobs: 189, exp: 10, price: 499, service: 'AC Repair', dist: '2.1 km', bio: 'AC specialist for all brands.' },
  { id: 'p4', name: 'Ravi Mehta', rating: 4.5, jobs: 120, exp: 4, price: 199, service: 'Cleaner', dist: '0.5 km', bio: 'Professional home cleaning.' },
  { id: 'p5', name: 'Sunil Das', rating: 4.7, jobs: 98, exp: 6, price: 399, service: 'Carpenter', dist: '3.0 km', bio: 'Furniture repair and custom woodwork.' },
];

export default function SearchPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(params.category as string || null);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');

  const filtered = ALL_PROVIDERS.filter((p) => {
    const matchCat = selectedCat ? p.service.toLowerCase().includes(selectedCat.toLowerCase()) : true;
    const matchQ = query ? p.name.toLowerCase().includes(query.toLowerCase()) || p.service.toLowerCase().includes(query.toLowerCase()) : true;
    return matchCat && matchQ;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.price - b.price;
    return parseFloat(a.dist) - parseFloat(b.dist);
  });

  return (
    <View style={s.container}>
      <StatusBar barStyle="dark-content" />
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <View style={s.searchBox}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: COLORS.text }}
            placeholder="Search services or providers"
            placeholderTextColor={COLORS.textLight}
            value={query}
            onChangeText={(t) => { setQuery(t); setSelectedCat(null); }}
            autoFocus={!params.category}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={{ fontSize: 18, color: COLORS.textLight }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[s.chip, selectedCat === c.name && s.chipActive]}
            onPress={() => setSelectedCat(selectedCat === c.name ? null : c.name)}
          >
            <Text>{c.icon}</Text>
            <Text style={[s.chipText, selectedCat === c.name && { color: '#fff' }]}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort */}
      <View style={s.sortRow}>
        <Text style={{ fontSize: 13, color: COLORS.textLight, marginRight: 10 }}>Sort:</Text>
        {(['rating', 'price', 'distance'] as const).map((sv) => (
          <TouchableOpacity key={sv} style={[s.sortBtn, sortBy === sv && s.sortBtnActive]} onPress={() => setSortBy(sv)}>
            <Text style={[s.sortTxt, sortBy === sv && { color: '#fff' }]}>{sv.charAt(0).toUpperCase() + sv.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={s.count}>{sorted.length} providers found</Text>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={s.card}
            onPress={() => router.push({ pathname: '/provider-profile', params: { ...item } } as any)}
            activeOpacity={0.85}
          >
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>{item.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.pName}>{item.name}</Text>
              <Text style={s.pSvc}>{item.service}</Text>
              <View style={{ flexDirection: 'row' }}>
                {[1,2,3,4,5].map(i => <Text key={i} style={{ color: i <= item.rating ? '#FBBF24' : '#D1D5DB', fontSize: 12 }}>★</Text>)}
                <Text style={{ fontSize: 11, color: COLORS.textLight, marginLeft: 4 }}>{item.rating}</Text>
              </View>
              <Text style={s.meta}>{item.jobs} jobs · {item.exp} yrs exp</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.price}>₹{item.price}</Text>
              <Text style={s.dist}>{item.dist}</Text>
              <TouchableOpacity
                style={s.bookBtn}
                onPress={() => router.push({ pathname: '/booking', params: { ...item } } as any)}
              >
                <Text style={s.bookTxt}>Book</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 48 }}>🔍</Text>
            <Text style={{ fontSize: 16, color: COLORS.textLight, marginTop: 12 }}>No providers found</Text>
          </View>
        }
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  backBtn: { marginRight: 10, padding: 4 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  catScroll: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10 },
  chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8 },
  chipActive: { backgroundColor: COLORS.primary },
  chipText: { fontSize: 12, color: COLORS.text, marginLeft: 4, fontWeight: '600' },
  sortRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  sortBtn: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: COLORS.border, marginRight: 6 },
  sortBtnActive: { backgroundColor: COLORS.primary },
  sortTxt: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  count: { fontSize: 13, color: COLORS.textLight, paddingHorizontal: 16, marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarTxt: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  pName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  pSvc: { fontSize: 12, color: COLORS.textLight, marginBottom: 3 },
  meta: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  price: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  dist: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  bookBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6, marginTop: 6 },
  bookTxt: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
