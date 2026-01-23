-- Agregar nuevas tablas y campos para el panel de vehículo mejorado

-- 1. Agregar campo de precio de alquiler a vehicles
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS daily_rental_price DECIMAL(10, 2);

-- 2. Crear tabla de historial de millaje
CREATE TABLE IF NOT EXISTS mileage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    mileage INTEGER NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Actualizar tabla maintenances para incluir imágenes de comprobantes
ALTER TABLE maintenances ADD COLUMN IF NOT EXISTS receipt_images TEXT[]; -- Array de URLs de imágenes

-- 4. Crear tabla de reservas/alquileres
CREATE TABLE IF NOT EXISTS rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    platform TEXT, -- 'turo', 'getaround', 'manual', etc
    daily_rate DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    status TEXT DEFAULT 'confirmed', -- 'confirmed', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Actualizar tabla documents para mejor organización
ALTER TABLE documents ADD COLUMN IF NOT EXISTS category TEXT; -- 'registration', 'insurance', 'inspection', 'other'
ALTER TABLE documents ADD COLUMN IF NOT EXISTS expiry_date DATE;

-- 6. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_mileage_history_vehicle ON mileage_history(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_mileage_history_date ON mileage_history(date);
CREATE INDEX IF NOT EXISTS idx_rentals_vehicle ON rentals(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_rentals_dates ON rentals(start_date, end_date);

-- 7. Triggers para updated_at
CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. RLS Policies para nuevas tablas

-- Mileage History
ALTER TABLE mileage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors can view own vehicle mileage"
    ON mileage_history FOR SELECT
    TO authenticated
    USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE assigned_investor_id = auth.uid()
        )
        OR
        public.get_my_role() = 'admin'
    );

CREATE POLICY "Admins can manage mileage"
    ON mileage_history FOR ALL
    TO authenticated
    USING (public.get_my_role() = 'admin')
    WITH CHECK (public.get_my_role() = 'admin');

-- Rentals
ALTER TABLE rentals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors can view own vehicle rentals"
    ON rentals FOR SELECT
    TO authenticated
    USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE assigned_investor_id = auth.uid()
        )
        OR
        public.get_my_role() = 'admin'
    );

CREATE POLICY "Admins can manage rentals"
    ON rentals FOR ALL
    TO authenticated
    USING (public.get_my_role() = 'admin')
    WITH CHECK (public.get_my_role() = 'admin');
