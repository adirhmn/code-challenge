import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: 'MacBook Pro 16-inch M3 Max',
    description: 'Apple M3 Max chip with 16-core CPU and 40-core GPU, 32GB Unified Memory, 1TB SSD Storage.',
    price: 3499.00,
    category: 'ELECTRONICS',
    status: 'ACTIVE',
    stock: 15,
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise-canceling headphones with two processors and 8 microphones.',
    price: 398.00,
    category: 'ELECTRONICS',
    status: 'ACTIVE',
    stock: 45,
  },
  {
    name: 'Ergonomic Mesh Office Chair',
    description: 'High-back ergonomic desk chair with adjustable lumbar support and 3D armrests.',
    price: 249.99,
    category: 'HOME',
    status: 'ACTIVE',
    stock: 20,
  },
  {
    name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    description: 'Classic software engineering book by Robert C. Martin.',
    price: 42.50,
    category: 'BOOKS',
    status: 'ACTIVE',
    stock: 100,
  },
  {
    name: 'Design Patterns: Elements of Reusable Object-Oriented Software',
    description: 'Gang of Four classic design patterns reference book.',
    price: 54.99,
    category: 'BOOKS',
    status: 'ACTIVE',
    stock: 80,
  },
  {
    name: 'Merino Wool Minimalist Hoodie',
    description: '100% Australian Merino wool hoodie designed for comfort and durability.',
    price: 120.00,
    category: 'CLOTHING',
    status: 'DRAFT',
    stock: 0,
  },
  {
    name: 'Pro Carbon Fiber Tennis Racket',
    description: 'Professional grade tennis racquet engineered for high power and control.',
    price: 189.00,
    category: 'SPORTS',
    status: 'OUT_OF_STOCK',
    stock: 0,
  },
  {
    name: 'Mechanical Gaming Keyboard RGB',
    description: 'Hot-swappable mechanical switches with per-key RGB backlighting.',
    price: 129.50,
    category: 'ELECTRONICS',
    status: 'ACTIVE',
    stock: 30,
  },
];

async function main() {
  console.log('Starting database seeding...');
  
  // Clear existing products
  await prisma.product.deleteMany();

  for (const product of sampleProducts) {
    const created = await prisma.product.create({
      data: product,
    });
    console.log(`Created product: ${created.name} (${created.id})`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
