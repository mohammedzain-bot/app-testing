import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS, CATEGORIES, SAMPLE_PROVIDERS } from '../constants';

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ color: i <= Math.round(rating) ? '#FBBF24' : '#D1D5DB', fontSize: 12 }}>★</Text>
      ))}
      <Text style={{ fontSize: 12, color: COLORS.textLight, marginLeft: 4 }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export default function SearchScreen({ navigation, route }: any) {
  const [query, setQuery] = useState(route?.params?.category || '');
  const [selectedCat, setSelectedCat] = useState<string | null>(route?.params?.category || null);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');

  const filtered = SAMPLE_PROVIDERS.filter((p) => {
    const matchCat = selectedCat ? p.service.toLowerCase().includes(selectedCat.toLowerCase()) : true;
    const matchQ = query ? p.name.toLowerCase().includes(query.toLowerCase()) || p.service.toLowerCase().includes(query.toLowerCase()) : true;
    return matchCat && matchQ;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price') return a.basePrice - b.basePrice;
    return parseFloat(a.distance) - parseFloat(b.distance);
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      {/* Search bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: COLORS.text }}
            placeholder="Search services or providers"
            placeholderTextColor={COLORS.textLight}
            value={query}
            onChangeText={(t) => { setQuery(t); setSelectedCat(null); }}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setSelectedCat(null); }}>
              <Text style={{ fontSize: 18, color: COLORS.textLight }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category chips */}
      <FlatList
        data={CATEGORIES}
        horizontal
        keyExtractor={(i) => i.id}
        showsHorizontalScrollIndicator={false}
        style={styles.catScroll}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.catChip, selectedCat === item.name && styles.catChipActive]}
            onPress={() => setSelectedCat(selectedCat === item.name ? null : item.name)}
          >
            <Text>{item.icon}</Text>
            <Text style={[styles.catChipText, selectedCat === item.name && { color: '#fff' }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text style={{ fontSize: 13, color: COLORS.textLight, marginRight: 10 }}>Sort by:</Text>
        {(['rating', 'price', 'distance'] as const).map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.sortBtn, sortBy === s && styles.sortBtnActive]}
            onPress={() => setSortBy(s)}
          >
            <Text style={[styles.sortBtnText, sortBy === s && { color: '#fff' }]}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.resultCount}>{sorted.length} providers found</Text>

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ProviderProfile', { provider: item })}
            activeOpacity={0.85}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.svc}>{item.service}</Text>
              <StarRating rating={item.rating} />
              <Text style={styles.meta}>{item.totalJobs} jobs · {item.experience} yrs</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.price}>₹{item.basePrice}</Text>
              <Text style={styles.dist}>{item.distance}</Text>
              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => navigation.navigate('Booking', { provider: item })}
              >
                <Text style={styles.bookBtnText}>Book</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 52, paddingBottom: 12, backgroundColor: '#fff' },
  backBtn: { marginRight: 10, padding: 4 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8,
  },
  catScroll: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8,
  },
  catChipActive: { backgroundColor: COLORS.primary },
  catChipText: { fontSize: 12, color: COLORS.text, marginLeft: 4, fontWeight: '600' },
  sortRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  sortBtn: { borderRadius: 16, paddingHorizontal: 12, paddingVertical: 5, backgroundColor: COLORS.border, marginRight: 6 },
  sortBtnActive: { backgroundColor: COLORS.primary },
  sortBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  resultCount: { fontSize: 13, color: COLORS.textLight, paddingHorizontal: 16, marginBottom: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 16, padding: 14, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  avatar: {
    width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  name: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  svc: { fontSize: 12, color: COLORS.textLight, marginBottom: 3 },
  meta: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  price: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  dist: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  bookBtn: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6, marginTop: 6 },
  bookBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
