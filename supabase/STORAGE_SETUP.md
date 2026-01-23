# Configurar Storage Bucket para Imágenes de Vehículos

## Paso 1: Crear el Bucket

1. Ve a **Supabase Dashboard → Storage**
2. Click en **"New bucket"**
3. Configura:
   - **Name:** `vehicle-images`
   - **Public bucket:** ✅ Activar (para que las imágenes sean accesibles públicamente)
   - Click en **"Create bucket"**

## Paso 2: Configurar Políticas de Storage

Una vez creado el bucket, ve a **Policies** y agrega estas políticas:

### Política 1: Permitir lectura pública
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'vehicle-images' );
```

### Política 2: Permitir upload a usuarios autenticados
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'vehicle-images' );
```

### Política 3: Permitir actualización a usuarios autenticados
```sql
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'vehicle-images' );
```

### Política 4: Permitir eliminación a admins
```sql
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( 
    bucket_id = 'vehicle-images' 
    AND 
    public.get_my_role() = 'admin'
);
```

## Paso 3: Probar el Upload

1. Ve a **Dashboard Admin → Gestión de Flota**
2. Click en **"Agregar Vehículo"** o **"Editar"** en un vehículo existente
3. Click en el botón de **Upload** (icono de subir)
4. Selecciona una imagen de tu computadora
5. La imagen se subirá automáticamente y verás el preview

## Notas Importantes

- **Tamaño máximo:** 5 MB por imagen
- **Formatos aceptados:** JPG, PNG, WEBP, GIF
- **Ubicación:** Las imágenes se guardan en `vehicle-images/vehicles/`
- **URLs públicas:** Se generan automáticamente y son accesibles sin autenticación

## Troubleshooting

### Error: "Error al subir imagen"
- Verifica que el bucket `vehicle-images` existe
- Verifica que el bucket es público
- Verifica que las políticas están creadas

### La imagen no se muestra
- Verifica que la política de lectura pública está activa
- Verifica la URL en la consola del navegador
- Intenta refrescar la página

### Error de permisos
- Verifica que estás logueado como admin
- Verifica que las políticas de INSERT/UPDATE están creadas
