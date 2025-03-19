// tests/supabase/seed.ts
import fs from 'fs';
import path from 'path';

const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
// tests/supabase/seed.ts
export default {
  users: [
    {id: 1, email: 'test@example.com', password: 'password123' },
  ]
};