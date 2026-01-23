# 🔧 Guía de Solución de Errores

## Error Actual: "Login error: {}"

Este error ocurre cuando hay problemas con las políticas RLS (Row Level Security) de Supabase.

### ✅ Solución Completa

Ejecuta estos archivos SQL en **Supabase Dashboard → SQL Editor** en este orden:

#### 1. Fix de Políticas RLS (Ya ejecutado)
✅ `20260121_fix_rls_simple.sql` - Arregla políticas de profiles

#### 2. Fix de Todas las Tablas (NUEVO - Ejecutar ahora)
📝 `20260121_fix_all_rls.sql` - Arregla políticas de:
- vehicles
- financial_records
- maintenances
- documents

---

## 🐛 Problemas Comunes y Soluciones

### 1. Error "infinite recursion detected"
**Causa:** Las políticas RLS están consultando la misma tabla que están protegiendo.

**Solución:** Usar la función helper `public.get_my_role()` que ya creamos.

### 2. Error "permission denied for schema auth"
**Causa:** Intentar crear funciones en el schema `auth` (no permitido).

**Solución:** Crear funciones en el schema `public`.

### 3. Páginas que no cargan / Error 500
**Causa:** Políticas RLS bloqueando queries.

**Solución:** Ejecutar `20260121_fix_all_rls.sql`.

### 4. "Login error: {}" o errores vacíos
**Causa:** Error en la consulta de perfil después del login.

**Solución:** 
1. Ejecutar `20260121_fix_all_rls.sql`
2. Reiniciar el servidor dev (`Ctrl+C` y `npm run dev`)

---

## 📋 Checklist de Verificación

Después de ejecutar los SQL, verifica:

- [ ] Login funciona sin errores
- [ ] Dashboard Admin carga correctamente
- [ ] Dashboard Investor carga correctamente
- [ ] Página de Vehículos carga la tabla
- [ ] Página de Inversores carga la tabla
- [ ] Página de Finanzas carga la tabla
- [ ] Puedes agregar un vehículo
- [ ] Puedes agregar una transacción financiera
- [ ] Logout funciona

---

## 🚀 Próximos Pasos

Una vez que todo funcione:

1. **Crear más datos de prueba** (más vehículos, inversores)
2. **Probar flujos completos** (asignar auto a inversor, registrar gastos)
3. **Implementar features pendientes** (upload de imágenes, documentos)

---

## 💡 Comandos Útiles

```bash
# Reiniciar servidor dev
Ctrl+C
npm run dev

# Ver logs en tiempo real
# (Abre la consola del navegador en DevTools)
```

---

## 📞 Si Aún Hay Errores

Si después de ejecutar `20260121_fix_all_rls.sql` sigues teniendo problemas:

1. Abre la consola del navegador (F12)
2. Copia el error completo
3. Compártelo para diagnóstico específico
