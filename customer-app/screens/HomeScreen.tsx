import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS, CATEGORIES, SAMPLE_PROVIDERS } from '../constants';

const { width } = Dimensions.get('window');

const BANNER_MESSAGES = [
  { id: '1', title: '50% OFF First Booking', sub: 'Use code: FIRST50', color: ['#6C63FF', '#4B44CC'] },
  { id: '2', title: 'Verified Professionals', sub: 'All experts are background-checked', color: ['#FF6584', '#CC4466'] },
  { id: '3', title: 'Same Day Service', sub: 'Book now, get help today', color: ['#06B6D4', '#0284C7'] },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ color: i <= Math.round(rating) ? '#FBBF24' : '#D1D5DB', fontSize: 12 }}>
          ★
        </Text>
      ))}
      <Text style={{ fontSize: 12, color: COLORS.textLight, marginLeft: 4 }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function ProviderCard({ provider, onPress }: { provider: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.providerCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.providerAvatar}>
        <Text style={styles.providerAvatarText}>{provider.name.charAt(0)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.providerName}>{provider.name}</Text>
        <Text style={styles.providerService}>{provider.service}</Text>
        <StarRating rating={provider.rating} />
        <Text style={styles.providerJobs}>{provider.totalJobs} jobs · {provider.experience} yrs exp</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.providerPrice}>₹{provider.basePrice}</Text>
        <Text style={styles.providerDistance}>{provider.distance}</Text>
        <View style={styles.availableBadge}>
          <Text style={styles.availableText}>Available</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: any) {
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [search, setSearch] = useState('');
  const bannerIndex = useRef(0);
  const [currentBanner, setCurrentBanner] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      bannerIndex.current = (bannerIndex.current + 1) % BANNER_MESSAGES.length;
      setCurrentBanner(bannerIndex.current);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const banner = BANNER_MESSAGES[currentBanner];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Good morning 👋</Text>
          <TouchableOpacity style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{location}</Text>
            <Text style={styles.locationIcon}>▾</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
          <Text style={{ fontSize: 22 }}>🔔</Text>
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="What service do you need?"
          placeholderTextColor={COLORS.textLight}
          value={search}
          onChangeText={setSearch}
          onFocus={() => navigation.navigate('Search')}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Promo Banner */}
        <Animated.View style={[styles.banner, { opacity: fadeAnim, backgroundColor: banner.color[0] }]}>
          <View>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSub}>{banner.sub}</Text>
          </View>
          <Text style={{ fontSize: 48 }}>🛠️</Text>
        </Animated.View>

        {/* Banner dots */}
        <View style={styles.dotsRow}>
          {BANNER_MESSAGES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === currentBanner && styles.dotActive]}
            />
          ))}
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Service Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={CATEGORIES.slice(0, 8)}
          keyExtractor={(item) => item.id}
          numColumns={4}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.catItem}
              onPress={() => navigation.navigate('Search', { category: item.name })}
              activeOpacity={0.8}
            >
              <View style={[styles.catIconWrap, { backgroundColor: item.color + '22' }]}>
                <Text style={styles.catIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.catName} numberOfLines={2}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Popular Services - more categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>More Services</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {CATEGORIES.slice(8).map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.chipBtn}
              onPress={() => navigation.navigate('Search', { category: cat.name })}
            >
              <Text>{cat.icon}</Text>
              <Text style={styles.chipText}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby Providers */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Providers</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {SAMPLE_PROVIDERS.map((p) => (
          <ProviderCard
            key={p.id}
            provider={p}
            onPress={() => navigation.navigate('ProviderProfile', { provider: p })}
          />
        ))}

        {/* Top Rated */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⭐ Top Rated</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16 }}>
          {[...SAMPLE_PROVIDERS].sort((a, b) => b.rating - a.rating).map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.topRatedCard}
              onPress={() => navigation.navigate('ProviderProfile', { provider: p })}
              activeOpacity={0.85}
            >
              <View style={[styles.topRatedAvatar, { backgroundColor: COLORS.primary }]}>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>{p.name.charAt(0)}</Text>
              </View>
              <Text style={styles.topRatedName} numberOfLines={1}>{p.name}</Text>
              <Text style={styles.topRatedService}>{p.service}</Text>
              <StarRating rating={p.rating} />
              <Text style={styles.topRatedPrice}>from ₹{p.basePrice}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  locationIcon: { color: '#fff', fontSize: 14 },
  locationText: { color: '#fff', fontSize: 15, fontWeight: '700', marginHorizontal: 4 },
  notifBtn: { padding: 8, position: 'relative' },
  notifDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#FF6584', position: 'absolute', top: 8, right: 8,
  },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', margin: 16, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 4,
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  scroll: { flex: 1 },
  banner: {
    marginHorizontal: 16, borderRadius: 16, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  bannerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 10, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border, marginHorizontal: 3 },
  dotActive: { backgroundColor: COLORS.primary, width: 18 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginTop: 22, marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.text },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  catItem: { flex: 1, alignItems: 'center', marginBottom: 12 },
  catIconWrap: {
    width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  catIcon: { fontSize: 26 },
  catName: { fontSize: 11, color: COLORS.text, textAlign: 'center', fontWeight: '600' },
  chipBtn: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primaryLight,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 10,
  },
  chipText: { fontSize: 13, color: COLORS.primary, marginLeft: 6, fontWeight: '600' },
  providerCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 16, marginBottom: 12, borderRadius: 16, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  providerAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  providerAvatarText: { fontSize: 22, fontWeight: '800', color: COLORS.primary },
  providerName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  providerService: { fontSize: 12, color: COLORS.textLight, marginBottom: 3 },
  providerJobs: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  providerPrice: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  providerDistance: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  availableBadge: {
    backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4,
  },
  availableText: { fontSize: 10, color: '#16A34A', fontWeight: '700' },
  topRatedCard: {
    width: 140, backgroundColor: '#fff', borderRadius: 16, padding: 14,
    marginRight: 12, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  topRatedAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  topRatedName: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  topRatedService: { fontSize: 11, color: COLORS.textLight, marginBottom: 6 },
  topRatedPrice: { fontSize: 12, fontWeight: '700', color: COLORS.primary, marginTop: 6 },
});
