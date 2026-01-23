-- Arreglar políticas RLS para evitar recursión en todas las tablas

-- =====================================================
-- VEHICLES POLICIES (Fixed)
-- =====================================================

DROP POLICY IF EXISTS "Investors can view assigned vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can insert vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can update vehicles" ON vehicles;
DROP POLICY IF EXISTS "Admins can delete vehicles" ON vehicles;

-- Investors can view their assigned vehicles
CREATE POLICY "Investors can view assigned vehicles"
    ON vehicles FOR SELECT
    TO authenticated
    USING (
        assigned_investor_id = auth.uid()
        OR
        public.get_my_role() = 'admin'
    );

-- Admins can manage vehicles
CREATE POLICY "Admins can insert vehicles"
    ON vehicles FOR INSERT
    TO authenticated
    WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Admins can update vehicles"
    ON vehicles FOR UPDATE
    TO authenticated
    USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can delete vehicles"
    ON vehicles FOR DELETE
    TO authenticated
    USING (public.get_my_role() = 'admin');

-- =====================================================
-- FINANCIAL RECORDS POLICIES (Fixed)
-- =====================================================

DROP POLICY IF EXISTS "Investors can view own vehicle finances" ON financial_records;
DROP POLICY IF EXISTS "Admins can insert financial records" ON financial_records;
DROP POLICY IF EXISTS "Admins can update financial records" ON financial_records;
DROP POLICY IF EXISTS "Admins can delete financial records" ON financial_records;

-- Investors can view financial records of their vehicles
CREATE POLICY "Investors can view own vehicle finances"
    ON financial_records FOR SELECT
    TO authenticated
    USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE assigned_investor_id = auth.uid()
        )
        OR
        public.get_my_role() = 'admin'
    );

-- Admins can manage financial records
CREATE POLICY "Admins can insert financial records"
    ON financial_records FOR INSERT
    TO authenticated
    WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Admins can update financial records"
    ON financial_records FOR UPDATE
    TO authenticated
    USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can delete financial records"
    ON financial_records FOR DELETE
    TO authenticated
    USING (public.get_my_role() = 'admin');

-- =====================================================
-- MAINTENANCES POLICIES (Fixed)
-- =====================================================

DROP POLICY IF EXISTS "Investors can view own vehicle maintenance" ON maintenances;
DROP POLICY IF EXISTS "Admins can insert maintenances" ON maintenances;
DROP POLICY IF EXISTS "Admins can update maintenances" ON maintenances;
DROP POLICY IF EXISTS "Admins can delete maintenances" ON maintenances;

-- Investors can view maintenance of their vehicles
CREATE POLICY "Investors can view own vehicle maintenance"
    ON maintenances FOR SELECT
    TO authenticated
    USING (
        vehicle_id IN (
            SELECT id FROM vehicles WHERE assigned_investor_id = auth.uid()
        )
        OR
        public.get_my_role() = 'admin'
    );

-- Admins can manage maintenances
CREATE POLICY "Admins can insert maintenances"
    ON maintenances FOR INSERT
    TO authenticated
    WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Admins can update maintenances"
    ON maintenances FOR UPDATE
    TO authenticated
    USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can delete maintenances"
    ON maintenances FOR DELETE
    TO authenticated
    USING (public.get_my_role() = 'admin');

-- =====================================================
-- DOCUMENTS POLICIES (Fixed)
-- =====================================================

DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Admins can insert documents" ON documents;
DROP POLICY IF EXISTS "Admins can update documents" ON documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON documents;

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
    ON documents FOR SELECT
    TO authenticated
    USING (
        owner_id = auth.uid()
        OR
        vehicle_id IN (
            SELECT id FROM vehicles WHERE assigned_investor_id = auth.uid()
        )
        OR
        public.get_my_role() = 'admin'
    );

-- Admins can manage documents
CREATE POLICY "Admins can insert documents"
    ON documents FOR INSERT
    TO authenticated
    WITH CHECK (public.get_my_role() = 'admin');

CREATE POLICY "Admins can update documents"
    ON documents FOR UPDATE
    TO authenticated
    USING (public.get_my_role() = 'admin');

CREATE POLICY "Admins can delete documents"
    ON documents FOR DELETE
    TO authenticated
    USING (public.get_my_role() = 'admin');
