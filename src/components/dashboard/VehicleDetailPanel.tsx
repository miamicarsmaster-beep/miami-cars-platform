"use client"

import { useState } from "react"
import { Vehicle } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Calendar,
    DollarSign,
    FileText,
    Gauge,
    History,
    MapPin,
    Plus,
    Settings,
    Upload,
    Wrench,
    X,
    CalendarDays,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface VehicleDetailPanelProps {
    vehicle: Vehicle
    onClose: () => void
}

export function VehicleDetailPanel({ vehicle, onClose }: VehicleDetailPanelProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const [isAddMileageOpen, setIsAddMileageOpen] = useState(false)
    const [isAddMaintenanceOpen, setIsAddMaintenanceOpen] = useState(false)
    const [isAddRentalOpen, setIsAddRentalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    // Mileage form
    const [mileageForm, setMileageForm] = useState({
        mileage: vehicle.mileage?.toString() || "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
    })

    // Maintenance form
    const [maintenanceForm, setMaintenanceForm] = useState({
        service_type: "",
        cost: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
        next_service_date: "",
        next_service_mileage: "",
    })

    // Rental form
    const [rentalForm, setRentalForm] = useState({
        start_date: "",
        end_date: "",
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        platform: "",
        daily_rate: vehicle.daily_rental_price?.toString() || "",
        notes: "",
    })

    const handleAddMileage = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("mileage_history")
                .insert([{
                    vehicle_id: vehicle.id,
                    mileage: Number(mileageForm.mileage),
                    date: mileageForm.date,
                    notes: mileageForm.notes || null,
                }])

            if (error) throw error

            // Update vehicle current mileage
            await supabase
                .from("vehicles")
                .update({ mileage: Number(mileageForm.mileage) })
                .eq("id", vehicle.id)

            setIsAddMileageOpen(false)
            setMileageForm({
                mileage: "",
                date: new Date().toISOString().split('T')[0],
                notes: "",
            })
            router.refresh()
        } catch (error) {
            console.error("Error adding mileage:", error)
            alert("Error al registrar millaje")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddMaintenance = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("maintenances")
                .insert([{
                    vehicle_id: vehicle.id,
                    service_type: maintenanceForm.service_type,
                    cost: maintenanceForm.cost ? Number(maintenanceForm.cost) : null,
                    date: maintenanceForm.date,
                    notes: maintenanceForm.notes || null,
                    next_service_date: maintenanceForm.next_service_date || null,
                    next_service_mileage: maintenanceForm.next_service_mileage ? Number(maintenanceForm.next_service_mileage) : null,
                    status: 'completed',
                }])

            if (error) throw error

            setIsAddMaintenanceOpen(false)
            setMaintenanceForm({
                service_type: "",
                cost: "",
                date: new Date().toISOString().split('T')[0],
                notes: "",
                next_service_date: "",
                next_service_mileage: "",
            })
            router.refresh()
        } catch (error) {
            console.error("Error adding maintenance:", error)
            alert("Error al registrar mantenimiento")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddRental = async () => {
        setIsLoading(true)
        try {
            const days = Math.ceil(
                (new Date(rentalForm.end_date).getTime() - new Date(rentalForm.start_date).getTime()) / (1000 * 60 * 60 * 24)
            )
            const totalAmount = days * Number(rentalForm.daily_rate)

            const { error } = await supabase
                .from("rentals")
                .insert([{
                    vehicle_id: vehicle.id,
                    start_date: rentalForm.start_date,
                    end_date: rentalForm.end_date,
                    customer_name: rentalForm.customer_name || null,
                    customer_email: rentalForm.customer_email || null,
                    customer_phone: rentalForm.customer_phone || null,
                    platform: rentalForm.platform || null,
                    daily_rate: Number(rentalForm.daily_rate),
                    total_amount: totalAmount,
                    notes: rentalForm.notes || null,
                    status: 'confirmed',
                }])

            if (error) throw error

            setIsAddRentalOpen(false)
            setRentalForm({
                start_date: "",
                end_date: "",
                customer_name: "",
                customer_email: "",
                customer_phone: "",
                platform: "",
                daily_rate: vehicle.daily_rental_price?.toString() || "",
                notes: "",
            })
            router.refresh()
        } catch (error) {
            console.error("Error adding rental:", error)
            alert("Error al registrar alquiler")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <DialogTitle className="text-2xl">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </DialogTitle>
                            <DialogDescription>
                                Placa: {vehicle.license_plate || "Sin placa"} • VIN: {vehicle.vin || "N/A"}
                            </DialogDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="overview">
                            <Settings className="h-4 w-4 mr-2" />
                            General
                        </TabsTrigger>
                        <TabsTrigger value="mileage">
                            <Gauge className="h-4 w-4 mr-2" />
                            Millaje
                        </TabsTrigger>
                        <TabsTrigger value="maintenance">
                            <Wrench className="h-4 w-4 mr-2" />
                            Mantenimiento
                        </TabsTrigger>
                        <TabsTrigger value="rentals">
                            <CalendarDays className="h-4 w-4 mr-2" />
                            Alquileres
                        </TabsTrigger>
                        <TabsTrigger value="documents">
                            <FileText className="h-4 w-4 mr-2" />
                            Documentos
                        </TabsTrigger>
                    </TabsList>

                    {/* OVERVIEW TAB */}
                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Información General</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Marca</p>
                                    <p className="font-medium">{vehicle.make}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Modelo</p>
                                    <p className="font-medium">{vehicle.model}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Año</p>
                                    <p className="font-medium">{vehicle.year}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Estado</p>
                                    <Badge>{vehicle.status}</Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Millaje Actual</p>
                                    <p className="font-medium">{vehicle.mileage?.toLocaleString()} mi</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Ubicación</p>
                                    <p className="font-medium">{vehicle.location || "No especificada"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Precio de Compra</p>
                                    <p className="font-medium">${vehicle.purchase_price?.toLocaleString() || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Precio de Alquiler/Día</p>
                                    <p className="font-medium text-emerald-600">${vehicle.daily_rental_price?.toLocaleString() || "No configurado"}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* MILEAGE TAB */}
                    <TabsContent value="mileage" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Historial de Millaje</h3>
                                <p className="text-sm text-muted-foreground">Registra el millaje para llevar un control preciso</p>
                            </div>
                            <Button onClick={() => setIsAddMileageOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Registrar Millaje
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    Funcionalidad de historial de millaje próximamente
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* MAINTENANCE TAB */}
                    <TabsContent value="maintenance" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Mantenimientos</h3>
                                <p className="text-sm text-muted-foreground">Historial de servicios y reparaciones</p>
                            </div>
                            <Button onClick={() => setIsAddMaintenanceOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Mantenimiento
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    No hay mantenimientos registrados
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* RENTALS TAB */}
                    <TabsContent value="rentals" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Calendario de Alquileres</h3>
                                <p className="text-sm text-muted-foreground">Gestiona las reservas del vehículo</p>
                            </div>
                            <Button onClick={() => setIsAddRentalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nueva Reserva
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    No hay alquileres programados
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* DOCUMENTS TAB */}
                    <TabsContent value="documents" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold">Documentos del Vehículo</h3>
                                <p className="text-sm text-muted-foreground">Registro, seguro, inspecciones, etc.</p>
                            </div>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                Subir Documento
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    No hay documentos cargados
                                </p>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Add Mileage Dialog */}
                <Dialog open={isAddMileageOpen} onOpenChange={setIsAddMileageOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Millaje</DialogTitle>
                            <DialogDescription>
                                Actualiza el millaje actual del vehículo
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mileage">Millaje *</Label>
                                    <Input
                                        id="mileage"
                                        type="number"
                                        value={mileageForm.mileage}
                                        onChange={(e) => setMileageForm({ ...mileageForm, mileage: e.target.value })}
                                        placeholder="35000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mileage_date">Fecha *</Label>
                                    <Input
                                        id="mileage_date"
                                        type="date"
                                        value={mileageForm.date}
                                        onChange={(e) => setMileageForm({ ...mileageForm, date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="mileage_notes">Notas</Label>
                                <Textarea
                                    id="mileage_notes"
                                    value={mileageForm.notes}
                                    onChange={(e) => setMileageForm({ ...mileageForm, notes: e.target.value })}
                                    placeholder="Ej: Actualización después de viaje largo"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddMileageOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleAddMileage} disabled={isLoading || !mileageForm.mileage}>
                                {isLoading ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Maintenance Dialog */}
                <Dialog open={isAddMaintenanceOpen} onOpenChange={setIsAddMaintenanceOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Registrar Mantenimiento</DialogTitle>
                            <DialogDescription>
                                Agrega un nuevo servicio o reparación
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="service_type">Tipo de Servicio *</Label>
                                    <Input
                                        id="service_type"
                                        value={maintenanceForm.service_type}
                                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, service_type: e.target.value })}
                                        placeholder="Cambio de aceite"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cost">Costo ($)</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        value={maintenanceForm.cost}
                                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, cost: e.target.value })}
                                        placeholder="150.00"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="maintenance_date">Fecha del Servicio *</Label>
                                    <Input
                                        id="maintenance_date"
                                        type="date"
                                        value={maintenanceForm.date}
                                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="next_service_date">Próximo Servicio</Label>
                                    <Input
                                        id="next_service_date"
                                        type="date"
                                        value={maintenanceForm.next_service_date}
                                        onChange={(e) => setMaintenanceForm({ ...maintenanceForm, next_service_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maintenance_notes">Notas</Label>
                                <Textarea
                                    id="maintenance_notes"
                                    value={maintenanceForm.notes}
                                    onChange={(e) => setMaintenanceForm({ ...maintenanceForm, notes: e.target.value })}
                                    placeholder="Detalles del servicio realizado"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddMaintenanceOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleAddMaintenance} disabled={isLoading || !maintenanceForm.service_type}>
                                {isLoading ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Add Rental Dialog */}
                <Dialog open={isAddRentalOpen} onOpenChange={setIsAddRentalOpen}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Nueva Reserva</DialogTitle>
                            <DialogDescription>
                                Registra un nuevo alquiler del vehículo
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start_date">Fecha Inicio *</Label>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={rentalForm.start_date}
                                        onChange={(e) => setRentalForm({ ...rentalForm, start_date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end_date">Fecha Fin *</Label>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={rentalForm.end_date}
                                        onChange={(e) => setRentalForm({ ...rentalForm, end_date: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_name">Cliente</Label>
                                    <Input
                                        id="customer_name"
                                        value={rentalForm.customer_name}
                                        onChange={(e) => setRentalForm({ ...rentalForm, customer_name: e.target.value })}
                                        placeholder="Nombre del cliente"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="platform">Plataforma</Label>
                                    <Input
                                        id="platform"
                                        value={rentalForm.platform}
                                        onChange={(e) => setRentalForm({ ...rentalForm, platform: e.target.value })}
                                        placeholder="Turo, Getaround, etc"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="daily_rate">Tarifa Diaria ($) *</Label>
                                    <Input
                                        id="daily_rate"
                                        type="number"
                                        value={rentalForm.daily_rate}
                                        onChange={(e) => setRentalForm({ ...rentalForm, daily_rate: e.target.value })}
                                        placeholder="75.00"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Total Estimado</Label>
                                    <p className="text-2xl font-bold text-emerald-600">
                                        ${rentalForm.start_date && rentalForm.end_date && rentalForm.daily_rate
                                            ? (Math.ceil((new Date(rentalForm.end_date).getTime() - new Date(rentalForm.start_date).getTime()) / (1000 * 60 * 60 * 24)) * Number(rentalForm.daily_rate)).toFixed(2)
                                            : "0.00"}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rental_notes">Notas</Label>
                                <Textarea
                                    id="rental_notes"
                                    value={rentalForm.notes}
                                    onChange={(e) => setRentalForm({ ...rentalForm, notes: e.target.value })}
                                    placeholder="Información adicional sobre la reserva"
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddRentalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleAddRental}
                                disabled={isLoading || !rentalForm.start_date || !rentalForm.end_date || !rentalForm.daily_rate}
                            >
                                {isLoading ? "Guardando..." : "Guardar Reserva"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </DialogContent>
        </Dialog>
    )
}
