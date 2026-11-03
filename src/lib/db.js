
const fs = require('fs');
const path = require('path');

let prismaClient = null;
let usePrisma = false;


if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres')) {
  try {
    const { PrismaClient } = require('@prisma/client');
    prismaClient = new PrismaClient();
    usePrisma = true;
    console.log('[Database] Connected to PostgreSQL via Prisma');
  } catch (err) {
    console.warn(`[Database] Prisma initialization error: ${err.message}. Using fallback store.`);
    usePrisma = false;
  }
}


if (!global._inMemoryDb) {
  global._inMemoryDb = {
    clients: [
      {
        id: 'client_pune_dental_1',
        name: 'Pune Dental Care Clinic',
        email: 'contact@example-dental-clinic.com',
        phone: '+919876543210',
        domain: 'https://example-dental-clinic.com',
        businessType: 'Dental Clinic',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    audits: []
  };
}


const isVercel = process.env.VERCEL === '1' || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const DATA_DIR = isVercel ? path.join('/tmp', '.data') : path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(global._inMemoryDb, null, 2));
    }
  } catch (e) {

  }
}

function readData() {
  ensureDataFile();
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      global._inMemoryDb = parsed;
      return parsed;
    }
  } catch (_) {}
  return global._inMemoryDb;
}

function writeData(data) {
  global._inMemoryDb = data;
  try {
    ensureDataFile();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (_) {}
}

const db = {
  client: {
    async findMany() {
      if (usePrisma && prismaClient) return await prismaClient.client.findMany({ include: { audits: true } });
      return readData().clients;
    },
    async findUnique({ where }) {
      if (usePrisma && prismaClient) return await prismaClient.client.findUnique({ where, include: { audits: true } });
      return readData().clients.find(c => c.id === where.id) || null;
    },
    async create({ data }) {
      if (usePrisma && prismaClient) return await prismaClient.client.create({ data });
      const state = readData();
      const newClient = {
        id: data.id || `client_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.clients.push(newClient);
      writeData(state);
      return newClient;
    }
  },
  audit: {
    async findMany({ orderBy } = {}) {
      if (usePrisma && prismaClient) return await prismaClient.audit.findMany({ orderBy: orderBy || { createdAt: 'desc' } });
      const data = readData();
      return [...data.audits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async findUnique({ where }) {
      if (usePrisma && prismaClient) return await prismaClient.audit.findUnique({ where });
      return readData().audits.find(a => a.id === where.id) || null;
    },
    async create({ data }) {
      if (usePrisma && prismaClient) return await prismaClient.audit.create({ data });
      const state = readData();
      const newAudit = {
        id: data.id || `audit_${Date.now()}`,
        status: 'PENDING',
        progress: 0,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      state.audits.push(newAudit);
      writeData(state);
      return newAudit;
    },
    async update({ where, data }) {
      if (usePrisma && prismaClient) return await prismaClient.audit.update({ where, data });
      const state = readData();
      const index = state.audits.findIndex(a => a.id === where.id);
      if (index === -1) throw new Error(`Audit with id ${where.id} not found`);
      const updated = {
        ...state.audits[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      state.audits[index] = updated;
      writeData(state);
      return updated;
    }
  }
};

module.exports = { db, prisma: prismaClient };