-- Agregar tabla de fotos del vehículo con marcado de detalles

CREATE TABLE IF NOT EXISTS vehicle_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    photo_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    -- Marcado de detalles en la foto
    has_damage BOOLEAN DEFAULT false,
    damage_markers JSONB, -- Array de {x, y, label, description}
    uploaded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_vehicle ON vehicle_photos(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_photos_order ON vehicle_photos(vehicle_id, photo_order);

-- Trigger
CREATE TRIGGER update_vehicle_photos_updated_at BEFORE UPDATE ON vehicle_photos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE vehicle_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Investors can view own vehicle photos"
    ON vehicle_photos FOR SELECT
    TO authenticated
    USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE assigned_investor_id = auth.uid()
        )
        OR
        public.get_my_role() = 'admin'
    );

CREATE POLICY "Admins can manage vehicle photos"
    ON vehicle_photos FOR ALL
    TO authenticated
    USING (public.get_my_role() = 'admin')
    WITH CHECK (public.get_my_role() = 'admin');
