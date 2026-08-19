import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS } from '../constants';

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={{ color: i <= Math.round(rating) ? '#FBBF24' : '#D1D5DB', fontSize: size }}>★</Text>
      ))}
      <Text style={{ fontSize: size - 2, color: COLORS.textLight, marginLeft: 4 }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const SAMPLE_REVIEWS = [
  { id: '1', author: 'Priya M.', rating: 5, comment: 'Excellent work! Very professional and prompt.', date: '2 days ago' },
  { id: '2', author: 'Arun K.', rating: 4, comment: 'Good service, came on time and fixed the issue quickly.', date: '1 week ago' },
  { id: '3', author: 'Meera S.', rating: 5, comment: 'Highly recommend! Very knowledgeable and neat work.', date: '2 weeks ago' },
];

export default function ProviderProfileScreen({ navigation, route }: any) {
  const { provider } = route.params;
  const [activeTab, setActiveTab] = useState<'about' | 'reviews'>('about');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Provider Profile</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Text style={{ color: '#fff', fontSize: 18 }}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{provider.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{provider.name}</Text>
          <Text style={styles.service}>{provider.service}</Text>
          <StarRating rating={provider.rating} size={18} />

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{provider.totalJobs}</Text>
              <Text style={styles.statLabel}>Jobs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{provider.experience} yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{provider.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>

          {/* Contact buttons */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: COLORS.primaryLight }]}>
              <Text style={{ fontSize: 20 }}>💬</Text>
              <Text style={[styles.contactText, { color: COLORS.primary }]}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#DCFCE7' }]}>
              <Text style={{ fontSize: 20 }}>📞</Text>
              <Text style={[styles.contactText, { color: '#16A34A' }]}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['about', 'reviews'] as const).map((t) => (
            <TouchableOpacity key={t} style={[styles.tab, activeTab === t && styles.tabActive]} onPress={() => setActiveTab(t)}>
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'about' ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{provider.bio}</Text>

            <Text style={styles.sectionTitle}>Services & Pricing</Text>
            <View style={styles.priceCard}>
              <View>
                <Text style={styles.serviceName}>{provider.service}</Text>
                <Text style={styles.serviceDesc}>Starting price</Text>
              </View>
              <Text style={styles.servicePrice}>₹{provider.basePrice}</Text>
            </View>

            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
              <Text style={{ fontSize: 32 }}>📍</Text>
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.locText}>Service area within 10 km</Text>
                <Text style={styles.locSub}>Distance from you: {provider.distance}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            {SAMPLE_REVIEWS.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAvatar}>
                    <Text style={{ color: COLORS.primary, fontWeight: '700' }}>{r.author.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <StarRating rating={r.rating} size={13} />
                  </View>
                </View>
                <Text style={styles.reviewComment}>{r.comment}</Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Book CTA */}
      <View style={styles.bookBar}>
        <View>
          <Text style={{ color: COLORS.textLight, fontSize: 13 }}>Starting from</Text>
          <Text style={{ color: COLORS.primary, fontSize: 22, fontWeight: '800' }}>₹{provider.basePrice}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() => navigation.navigate('Booking', { provider })}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingTop: 52, paddingBottom: 16,
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  shareBtn: { padding: 4 },
  profileCard: {
    backgroundColor: '#fff', margin: 16, borderRadius: 20, padding: 20, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 16, elevation: 4,
  },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 34, fontWeight: '800', color: COLORS.primary },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  service: { fontSize: 14, color: COLORS.textLight, marginBottom: 8 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 12 },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textLight, marginTop: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: COLORS.border },
  contactRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  contactBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 12, paddingVertical: 12, gap: 8,
  },
  contactText: { fontSize: 14, fontWeight: '700' },
  tabRow: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textLight },
  tabTextActive: { color: '#fff' },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 10, marginTop: 10 },
  bio: { fontSize: 14, color: COLORS.textLight, lineHeight: 22 },
  priceCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  serviceName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  serviceDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  servicePrice: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  locationCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  locText: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  locSub: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  reviewCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewAvatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  reviewAuthor: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  reviewDate: { fontSize: 11, color: COLORS.textLight },
  reviewComment: { fontSize: 13, color: COLORS.textLight, lineHeight: 20 },
  bookBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#fff', padding: 16, paddingBottom: 30,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16, elevation: 10,
  },
  bookBtn: {
    backgroundColor: COLORS.primary, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14,
  },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
