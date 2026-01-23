# Configuración de Base de Datos - Miami Cars

## Pasos para ejecutar las migraciones

### Opción 1: SQL Editor en Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **SQL Editor** en el menú lateral
3. Ejecuta los archivos SQL en este orden:

#### Paso 1: Schema Inicial
Copia y pega el contenido de `supabase/migrations/20260121_initial_schema.sql` y ejecuta.

#### Paso 2: Políticas RLS
Copia y pega el contenido de `supabase/migrations/20260121_rls_policies.sql` y ejecuta.

#### Paso 3: Datos de Prueba (Opcional)
Copia y pega el contenido de `supabase/migrations/20260121_seed_data.sql` y ejecuta.

---

### Opción 2: Supabase CLI (Avanzado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref kwcwifrqskmkingtdkqy

# Ejecutar migraciones
supabase db push
```

---

## Configurar Storage Buckets

Ve a **Storage** en Supabase Dashboard y crea estos buckets:

### 1. `vehicle-images`
- **Public:** ✅ Sí
- **Allowed MIME types:** `image/jpeg, image/png, image/webp`
- **Max file size:** 5 MB

### 2. `receipts`
- **Public:** ❌ No (solo accesible con autenticación)
- **Allowed MIME types:** `image/jpeg, image/png, application/pdf`
- **Max file size:** 10 MB

### 3. `documents`
- **Public:** ❌ No
- **Allowed MIME types:** `application/pdf`
- **Max file size:** 20 MB

---

## Crear Usuario Admin de Prueba

1. Ve a **Authentication > Users** en Supabase
2. Click en **Add User**
3. Email: `admin@miamicars.com`
4. Password: (elige una segura)
5. Después de crear, ve a **SQL Editor** y ejecuta:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@miamicars.com';
```

---

## Crear Usuario Inversor de Prueba

1. Crea otro usuario: `inversor@miamicars.com`
2. Asigna un vehículo al inversor:

```sql
UPDATE vehicles 
SET assigned_investor_id = (SELECT id FROM profiles WHERE email = 'inversor@miamicars.com')
WHERE license_plate = 'MIA-9982';
```

---

## Verificar que todo funciona

Ejecuta esta query en SQL Editor:

```sql
SELECT 
    p.email,
    p.role,
    COUNT(v.id) as total_vehicles
FROM profiles p
LEFT JOIN vehicles v ON v.assigned_investor_id = p.id
GROUP BY p.id, p.email, p.role;
```

Deberías ver tus usuarios con sus vehículos asignados.

---

## ✅ Checklist Final

- [ ] Ejecutar `20260121_initial_schema.sql`
- [ ] Ejecutar `20260121_rls_policies.sql`
- [ ] Ejecutar `20260121_seed_data.sql`
- [ ] Crear buckets de Storage
- [ ] Crear usuario admin
- [ ] Crear usuario inversor
- [ ] Asignar vehículo a inversor
- [ ] Verificar con query de prueba

Una vez completado, la aplicación estará lista para conectarse a la base de datos real.
