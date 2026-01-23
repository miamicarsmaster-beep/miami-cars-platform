-- Insert demo admin user (you'll need to create this user in Supabase Auth first)
-- This is just a placeholder - the actual user will be created via Supabase Auth UI

-- Insert demo vehicles
INSERT INTO vehicles (make, model, year, license_plate, vin, status, purchase_date, purchase_price, mileage, location) VALUES
('Chevrolet', 'Tahoe', 2023, 'MIA-9982', '1GNSKCKC5NR123456', 'rented', '2023-06-15', 65000.00, 12450, 'Miami Airport'),
('Tesla', 'Model 3', 2024, 'EV-8821', '5YJ3E1EA8PF123456', 'available', '2024-01-10', 48000.00, 5200, 'Brickell HQ'),
('Toyota', 'Corolla', 2022, 'JFK-234', '2T1BURHE5NC123456', 'maintenance', '2022-03-20', 28000.00, 35000, 'Service Center'),
('Ford', 'Explorer', 2023, 'MIA-5544', '1FM5K8D84NGA12345', 'available', '2023-09-01', 52000.00, 8900, 'Miami Beach');

-- Insert demo financial records
INSERT INTO financial_records (vehicle_id, type, category, amount, date, description) VALUES
((SELECT id FROM vehicles WHERE license_plate = 'MIA-9982'), 'income', 'Renta Mensual', 1200.00, '2024-01-01', 'Alquiler mes de Enero'),
((SELECT id FROM vehicles WHERE license_plate = 'MIA-9982'), 'expense', 'Mantenimiento', 150.00, '2024-01-15', 'Cambio de aceite y filtros'),
((SELECT id FROM vehicles WHERE license_plate = 'EV-8821'), 'expense', 'Seguro', 280.00, '2024-01-05', 'Pago mensual de seguro'),
((SELECT id FROM vehicles WHERE license_plate = 'JFK-234'), 'expense', 'Mantenimiento', 450.00, '2024-01-18', 'Reparación de frenos');

-- Insert demo maintenances
INSERT INTO maintenances (vehicle_id, service_type, cost, date, notes, next_service_date, next_service_mileage, status) VALUES
((SELECT id FROM vehicles WHERE license_plate = 'MIA-9982'), 'Cambio de aceite', 150.00, '2024-01-15', 'Aceite sintético 5W-30', '2024-04-15', 15450, 'completed'),
((SELECT id FROM vehicles WHERE license_plate = 'JFK-234'), 'Reparación de frenos', 450.00, '2024-01-18', 'Reemplazo de pastillas delanteras', '2024-07-18', 40000, 'completed'),
((SELECT id FROM vehicles WHERE license_plate = 'EV-8821'), 'Inspección general', 0.00, '2024-01-20', 'Revisión de batería y sistema eléctrico', '2024-07-20', 15200, 'pending');

-- Note: To fully test, you need to:
-- 1. Create users in Supabase Auth Dashboard
-- 2. Assign one user role='admin' in profiles table
-- 3. Assign vehicles to investor users using assigned_investor_id
