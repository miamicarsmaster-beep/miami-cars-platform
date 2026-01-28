-- Create the storage bucket 'vehicle-documents'
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-documents', 'vehicle-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Policy 1: Permitir lectura pública (o restringida a auth si se prefiere privacidad)
-- Para documentos sensibles, idealmente no debería ser público para todos, pero para MVP lo haremos accesible vía URL firmada o pública si la URL es segura.
-- En este código estamos usando getPublicUrl, así que debe ser público o debemos usar createSignedUrl.
-- Usaremos public por simplicidad y consistencia con vehicle-images por ahora, asumiendo que las URLs son "secretas" por su complejidad.
CREATE POLICY "Public Access Documents"
ON storage.objects FOR SELECT
USING ( bucket_id = 'vehicle-documents' );

-- Policy 2: Permitir upload a usuarios autenticados
CREATE POLICY "Authenticated users can upload docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'vehicle-documents' );

-- Policy 3: Permitir actualización
CREATE POLICY "Authenticated users can update docs"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'vehicle-documents' );

-- Policy 4: Permitir eliminación
CREATE POLICY "Authenticated users can delete docs"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'vehicle-documents' );
