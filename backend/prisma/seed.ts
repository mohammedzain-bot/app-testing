import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Plumber', iconUrl: '🔧' } }),
    prisma.category.create({ data: { name: 'Electrician', iconUrl: '⚡' } }),
    prisma.category.create({ data: { name: 'Mechanic', iconUrl: '🔩' } }),
    prisma.category.create({ data: { name: 'Carpenter', iconUrl: '🪵' } }),
    prisma.category.create({ data: { name: 'AC Repair', iconUrl: '❄️' } }),
    prisma.category.create({ data: { name: 'Appliance Repair', iconUrl: '📺' } }),
    prisma.category.create({ data: { name: 'Cleaner', iconUrl: '🧹' } }),
    prisma.category.create({ data: { name: 'Painter', iconUrl: '🎨' } }),
    prisma.category.create({ data: { name: 'Mobile Repair', iconUrl: '📱' } }),
    prisma.category.create({ data: { name: 'Computer Repair', iconUrl: '💻' } }),
    prisma.category.create({ data: { name: 'Pest Control', iconUrl: '🐛' } }),
    prisma.category.create({ data: { name: 'Water Tank Cleaning', iconUrl: '💧' } }),
    prisma.category.create({ data: { name: 'Home Maintenance', iconUrl: '🏠' } }),
    prisma.category.create({ data: { name: 'Other', iconUrl: '⚙️' } }),
  ]);

  // Services under each category
  const services = await Promise.all([
    prisma.service.create({ data: { name: 'Pipe Leak Repair', categoryId: categories[0].id } }),
    prisma.service.create({ data: { name: 'Tap Installation', categoryId: categories[0].id } }),
    prisma.service.create({ data: { name: 'Wiring Repair', categoryId: categories[1].id } }),
    prisma.service.create({ data: { name: 'Switch Installation', categoryId: categories[1].id } }),
    prisma.service.create({ data: { name: 'AC Service', categoryId: categories[4].id } }),
    prisma.service.create({ data: { name: 'AC Installation', categoryId: categories[4].id } }),
    prisma.service.create({ data: { name: 'Deep Home Cleaning', categoryId: categories[6].id } }),
    prisma.service.create({ data: { name: 'Furniture Repair', categoryId: categories[3].id } }),
  ]);

  // Admin
  const admin = await prisma.user.create({
    data: { name: 'Admin', email: 'admin@servenow.com', phone: '+919999999999', role: 'ADMIN' },
  });

  // Customer
  const customer = await prisma.user.create({
    data: { name: 'Arjun Sharma', email: 'arjun@email.com', phone: '+919876543210', role: 'CUSTOMER' },
  });

  // Providers
  const providerUsers = await Promise.all([
    prisma.user.create({ data: { name: 'Rajesh Kumar', phone: '+919876500001', role: 'PROVIDER' } }),
    prisma.user.create({ data: { name: 'Suresh Verma', phone: '+919876500002', role: 'PROVIDER' } }),
    prisma.user.create({ data: { name: 'Amit Singh', phone: '+919876500003', role: 'PROVIDER' } }),
    prisma.user.create({ data: { name: 'Ravi Mehta', phone: '+919876500004', role: 'PROVIDER' } }),
    prisma.user.create({ data: { name: 'Sunil Das', phone: '+919876500005', role: 'PROVIDER' } }),
  ]);

  const profiles = await Promise.all([
    prisma.providerProfile.create({ data: { userId: providerUsers[0].id, isVerified: true, experience: 8, bio: 'Expert plumber with 8 years of experience. Specializing in leak repairs and pipe installations.', available: true, rating: 4.8, totalJobs: 312, lat: 12.9716, lng: 77.5946 } }),
    prisma.providerProfile.create({ data: { userId: providerUsers[1].id, isVerified: true, experience: 5, bio: 'Certified electrician. Expert in wiring, panel upgrades, and appliance connections.', available: true, rating: 4.6, totalJobs: 245, lat: 12.9750, lng: 77.5900 } }),
    prisma.providerProfile.create({ data: { userId: providerUsers[2].id, isVerified: true, experience: 10, bio: 'AC specialist with expertise in all brands. Service, repair, and installation.', available: true, rating: 4.9, totalJobs: 189, lat: 12.9680, lng: 77.6000 } }),
    prisma.providerProfile.create({ data: { userId: providerUsers[3].id, isVerified: true, experience: 4, bio: 'Professional home cleaning services.', available: true, rating: 4.5, totalJobs: 120, lat: 12.9800, lng: 77.5850 } }),
    prisma.providerProfile.create({ data: { userId: providerUsers[4].id, isVerified: true, experience: 6, bio: 'Furniture repair and custom woodwork.', available: true, rating: 4.7, totalJobs: 98, lat: 12.9650, lng: 77.6100 } }),
  ]);

  // Provider Services
  await Promise.all([
    prisma.providerService.create({ data: { providerProfileId: profiles[0].id, serviceId: services[0].id, basePrice: 299 } }),
    prisma.providerService.create({ data: { providerProfileId: profiles[0].id, serviceId: services[1].id, basePrice: 399 } }),
    prisma.providerService.create({ data: { providerProfileId: profiles[1].id, serviceId: services[2].id, basePrice: 349 } }),
    prisma.providerService.create({ data: { providerProfileId: profiles[1].id, serviceId: services[3].id, basePrice: 199 } }),
    prisma.providerService.create({ data: { providerProfileId: profiles[2].id, serviceId: services[4].id, basePrice: 499 } }),
    prisma.providerService.create({ data: { providerProfileId: profiles[2].id, serviceId: services[5].id, basePrice: 1499 } }),
    prisma.providerService.create({ data: { providerProfileId: profiles[3].id, serviceId: services[6].id, basePrice: 199 } }),
    prisma.providerService.create({ data: { providerProfileId: profiles[4].id, serviceId: services[7].id, basePrice: 399 } }),
  ]);

  // Sample bookings
  const booking1 = await prisma.booking.create({
    data: {
      customerId: customer.id, providerId: providerUsers[0].id, serviceId: services[0].id,
      status: 'COMPLETED', description: 'Kitchen pipe leaking', address: '123 MG Road, Bengaluru',
      lat: 12.9716, lng: 77.5946, price: 499, commission: 49.9,
      completedAt: new Date('2026-08-15'),
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      customerId: customer.id, providerId: providerUsers[1].id, serviceId: services[2].id,
      status: 'ACCEPTED', description: 'Wiring issue in bedroom', address: '456 Anna Nagar, Chennai',
      lat: 13.0850, lng: 80.2101, price: 349, commission: 34.9,
      scheduledFor: new Date('2026-08-19T10:00:00'),
    },
  });

  // Payment for completed booking
  await prisma.payment.create({
    data: { bookingId: booking1.id, amount: 499, status: 'COMPLETED', transactionId: 'TXN_001', paymentMethod: 'UPI' },
  });

  // Review for completed booking
  await prisma.review.create({
    data: { bookingId: booking1.id, authorId: customer.id, subjectId: providerUsers[0].id, rating: 5, comment: 'Excellent work! Very professional and prompt.' },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`   Admin ID:    ${admin.id}`);
  console.log(`   Customer ID: ${customer.id}`);
  console.log(`   Providers:   ${providerUsers.length}`);
  console.log(`   Categories:  ${categories.length}`);
  console.log(`   Services:    ${services.length}`);
  console.log(`   Bookings:    2`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
