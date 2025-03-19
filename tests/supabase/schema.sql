-- Əsas sxemi yükləmək üçün verilənlər bazasının əsas strukturunu yaradın
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Digər cədvəllər üçün eyni qaydada sxemi əlavə edin

