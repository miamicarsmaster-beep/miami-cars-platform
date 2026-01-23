// Extended types for vehicle panel
import { Vehicle, Maintenance, Document } from './database'

export interface MileageHistory {
    id: string
    vehicle_id: string
    mileage: number
    date: string
    notes: string | null
    created_by: string | null
    created_at: string
}

export interface Rental {
    id: string
    vehicle_id: string
    start_date: string
    end_date: string
    customer_name: string | null
    customer_email: string | null
    customer_phone: string | null
    platform: string | null
    daily_rate: number | null
    total_amount: number | null
    status: 'confirmed' | 'completed' | 'cancelled'
    notes: string | null
    created_at: string
    updated_at: string
}

// Update Vehicle interface to include new fields
export interface VehicleExtended extends Vehicle {
    mileage_history?: MileageHistory[]
    rentals?: Rental[]
    maintenances_with_receipts?: Maintenance[]
    documents_by_category?: Document[]
}
