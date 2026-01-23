"use client"

import { useState } from "react"
import { Vehicle, Profile } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, MapPin, Gauge, Calendar, Upload, Car, Eye } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { VehicleManagementPanel } from "./VehicleManagementPanel"

interface VehiclesGridProps {
    vehicles: Vehicle[]
    investors: Profile[]
}

export function VehiclesGrid({ vehicles: initialVehicles, investors }: VehiclesGridProps) {
    const [vehicles, setVehicles] = useState(initialVehicles)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [showDetailPanel, setShowDetailPanel] = useState(false)
    const [detailVehicle, setDetailVehicle] = useState<Vehicle | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        make: "",
        model: "",
        year: new Date().getFullYear(),
        license_plate: "",
        vin: "",
        status: "available" as Vehicle["status"],
        assigned_investor_id: "",
        purchase_date: "",
        purchase_price: "",
        mileage: "0",
        location: "",
        image_url: "",
        daily_rental_price: "",
    })

    const resetForm = () => {
        setFormData({
            make: "",
            model: "",
            year: new Date().getFullYear(),
            license_plate: "",
            vin: "",
            status: "available",
            assigned_investor_id: "",
            purchase_date: "",
            purchase_price: "",
            mileage: "0",
            location: "",
            image_url: "",
            daily_rental_price: "",
        })
        setImageUrl("")
    }

    const generatePlaceholderImage = (make: string, model: string) => {
        // Usar un servicio de placeholder de autos
        const carName = `${make} ${model}`.replace(/\s+/g, '+')
        return `https://source.unsplash.com/800x600/?${carName},car`
    }

    const handleAdd = async () => {
        setIsLoading(true)
        try {
            const finalImageUrl = imageUrl || generatePlaceholderImage(formData.make, formData.model)

            const { data, error } = await supabase
                .from("vehicles")
                .insert([{
                    ...formData,
                    year: Number(formData.year),
                    purchase_price: formData.purchase_price ? Number(formData.purchase_price) : null,
                    mileage: Number(formData.mileage),
                    assigned_investor_id: formData.assigned_investor_id || null,
                    image_url: finalImageUrl,
                }])
                .select()
                .single()

            if (error) throw error

            setVehicles([data, ...vehicles])
            setIsAddOpen(false)
            resetForm()
            router.refresh()
        } catch (error) {
            console.error("Error adding vehicle:", error)
            alert("Error al agregar vehículo")
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = async () => {
        if (!selectedVehicle) return
        setIsLoading(true)
        try {
            const finalImageUrl = imageUrl || formData.image_url || generatePlaceholderImage(formData.make, formData.model)

            const { error } = await supabase
                .from("vehicles")
                .update({
                    ...formData,
                    year: Number(formData.year),
                    purchase_price: formData.purchase_price ? Number(formData.purchase_price) : null,
                    mileage: Number(formData.mileage),
                    assigned_investor_id: formData.assigned_investor_id || null,
                    image_url: finalImageUrl,
                })
                .eq("id", selectedVehicle.id)

            if (error) throw error

            setVehicles(vehicles.map(v =>
                v.id === selectedVehicle.id
                    ? {
                        ...v,
                        ...formData,
                        year: Number(formData.year),
                        image_url: finalImageUrl,
                        mileage: Number(formData.mileage),
                        purchase_price: formData.purchase_price ? Number(formData.purchase_price) : null,
                        daily_rental_price: formData.daily_rental_price ? Number(formData.daily_rental_price) : null,
                    } as Vehicle
                    : v
            ))
            setIsEditOpen(false)
            setSelectedVehicle(null)
            resetForm()
            router.refresh()
        } catch (error) {
            console.error("Error updating vehicle:", error)
            alert("Error al actualizar vehículo")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este vehículo?")) return

        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("vehicles")
                .delete()
                .eq("id", id)

            if (error) throw error

            setVehicles(vehicles.filter(v => v.id !== id))
            router.refresh()
        } catch (error) {
            console.error("Error deleting vehicle:", error)
            alert("Error al eliminar vehículo")
        } finally {
            setIsLoading(false)
        }
    }

    const openEditDialog = (vehicle: Vehicle) => {
        setSelectedVehicle(vehicle)
        setFormData({
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            license_plate: vehicle.license_plate || "",
            vin: vehicle.vin || "",
            status: vehicle.status,
            assigned_investor_id: vehicle.assigned_investor_id || "",
            purchase_date: vehicle.purchase_date || "",
            purchase_price: vehicle.purchase_price?.toString() || "",
            mileage: vehicle.mileage?.toString() || "0",
            location: vehicle.location || "",
            image_url: vehicle.image_url || "",
            daily_rental_price: vehicle.daily_rental_price?.toString() || "",
        })
        setImageUrl(vehicle.image_url || "")
        setIsEditOpen(true)
    }

    const getStatusBadge = (status: Vehicle["status"]) => {
        const variants: Record<Vehicle["status"], { label: string; className: string }> = {
            available: { label: "Disponible", className: "bg-blue-500" },
            rented: { label: "Alquilado", className: "bg-emerald-500" },
            maintenance: { label: "Mantenimiento", className: "bg-orange-500" },
            inactive: { label: "Inactivo", className: "bg-gray-500" },
        }
        return <Badge className={variants[status].className}>{variants[status].label}</Badge>
    }

    const VehicleForm = () => (
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Image Upload Section */}
            <div className="space-y-2">
                <Label htmlFor="image_url">Imagen del Vehículo</Label>

                {/* File Upload Button */}
                <div className="flex gap-2">
                    <Input
                        id="image_url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg o sube un archivo"
                    />
                    <div className="relative">
                        <Input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return

                                // Validate file size (max 5MB)
                                if (file.size > 5 * 1024 * 1024) {
                                    alert('La imagen debe ser menor a 5MB')
                                    return
                                }

                                setIsLoading(true)
                                try {
                                    // Create unique filename
                                    const fileExt = file.name.split('.').pop()
                                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
                                    const filePath = `vehicles/${fileName}`

                                    // Upload to Supabase Storage
                                    const { data, error } = await supabase.storage
                                        .from('vehicle-images')
                                        .upload(filePath, file, {
                                            cacheControl: '3600',
                                            upsert: false
                                        })

                                    if (error) {
                                        console.error('Upload error:', error)
                                        alert('Error al subir imagen. Asegúrate de que el bucket "vehicle-images" existe en Supabase Storage.')
                                        return
                                    }

                                    // Get public URL
                                    const { data: { publicUrl } } = supabase.storage
                                        .from('vehicle-images')
                                        .getPublicUrl(filePath)

                                    setImageUrl(publicUrl)
                                } catch (error) {
                                    console.error('Upload error:', error)
                                    alert('Error al subir la imagen')
                                } finally {
                                    setIsLoading(false)
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            title="Subir imagen desde tu computadora"
                            disabled={isLoading}
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <p className="text-xs text-muted-foreground">
                    Pega una URL o sube una imagen desde tu computadora (máx. 5MB). Si no agregas ninguna, se generará automáticamente.
                </p>

                {/* Image Preview */}
                {(imageUrl || (formData.make && formData.model)) && (
                    <div className="mt-2 rounded-lg overflow-hidden border">
                        <img
                            src={imageUrl || generatePlaceholderImage(formData.make, formData.model)}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.currentTarget.src = generatePlaceholderImage(formData.make || "Car", formData.model || "Vehicle")
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="make">Marca *</Label>
                    <Input
                        id="make"
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        placeholder="Toyota"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="Corolla"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="year">Año *</Label>
                    <Input
                        id="year"
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="license_plate">Placa</Label>
                    <Input
                        id="license_plate"
                        value={formData.license_plate}
                        onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                        placeholder="ABC-123"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                    id="vin"
                    value={formData.vin}
                    onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                    placeholder="1HGBH41JXMN109186"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={formData.status} onValueChange={(value: Vehicle["status"]) => setFormData({ ...formData, status: value })}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="available">Disponible</SelectItem>
                            <SelectItem value="rented">Alquilado</SelectItem>
                            <SelectItem value="maintenance">Mantenimiento</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="investor">Asignar a Inversor</Label>
                    <Select
                        value={formData.assigned_investor_id || undefined}
                        onValueChange={(value) => setFormData({ ...formData, assigned_investor_id: value === "none" ? "" : value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sin asignar" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Sin asignar</SelectItem>
                            {investors.map((inv) => (
                                <SelectItem key={inv.id} value={inv.id}>
                                    {inv.full_name || inv.email}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="purchase_price">Precio de Compra ($)</Label>
                    <Input
                        id="purchase_price"
                        type="number"
                        value={formData.purchase_price}
                        onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                        placeholder="25000"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mileage">Millaje</Label>
                    <Input
                        id="mileage"
                        type="number"
                        value={formData.mileage}
                        onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                        placeholder="0"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Miami Airport"
                />
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">Flota de Vehículos</h3>
                    <p className="text-sm text-muted-foreground">{vehicles.length} vehículos en total</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Agregar Vehículo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Agregar Nuevo Vehículo</DialogTitle>
                            <DialogDescription>
                                Completa la información del vehículo a agregar a la flota.
                            </DialogDescription>
                        </DialogHeader>
                        <VehicleForm />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleAdd} disabled={isLoading || !formData.make || !formData.model}>
                                {isLoading ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {vehicles.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No hay vehículos registrados</p>
                        <p className="text-sm mt-2">Agrega tu primer vehículo para comenzar</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <Card key={vehicle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative bg-muted">
                                <img
                                    src={vehicle.image_url || generatePlaceholderImage(vehicle.make, vehicle.model)}
                                    alt={`${vehicle.make} ${vehicle.model}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = generatePlaceholderImage(vehicle.make, vehicle.model)
                                    }}
                                />
                                <div className="absolute top-2 right-2">
                                    {getStatusBadge(vehicle.status)}
                                </div>
                            </div>

                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <div>
                                        <div className="text-lg">{vehicle.make} {vehicle.model}</div>
                                        <div className="text-sm font-normal text-muted-foreground">{vehicle.year}</div>
                                    </div>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Placa: {vehicle.license_plate || "Sin placa"}</span>
                                </div>
                                {vehicle.location && (
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>{vehicle.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Gauge className="h-4 w-4" />
                                    <span>{vehicle.mileage?.toLocaleString() || 0} millas</span>
                                </div>
                                {vehicle.assigned_investor && (
                                    <div className="pt-2 border-t">
                                        <p className="text-xs text-muted-foreground">Asignado a:</p>
                                        <p className="font-medium">{vehicle.assigned_investor.full_name || vehicle.assigned_investor.email}</p>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="bg-muted/50 flex justify-between gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => {
                                        setDetailVehicle(vehicle)
                                        setShowDetailPanel(true)
                                    }}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver Detalles
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(vehicle)}>
                                        <Pencil className="h-4 w-4 mr-2" />
                                        Editar
                                    </Button>
                                    <Button variant="ghost" size="sm" onClick={() => handleDelete(vehicle.id)} className="text-red-600 hover:text-red-700">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Eliminar
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Editar Vehículo</DialogTitle>
                        <DialogDescription>
                            Actualiza la información del vehículo.
                        </DialogDescription>
                    </DialogHeader>
                    <VehicleForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleEdit} disabled={isLoading}>
                            {isLoading ? "Actualizando..." : "Actualizar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Vehicle Management Panel - Unified View/Edit */}
            {showDetailPanel && detailVehicle && (
                <VehicleManagementPanel
                    vehicle={detailVehicle}
                    investors={investors}
                    onClose={() => {
                        setShowDetailPanel(false)
                        setDetailVehicle(null)
                        router.refresh()
                    }}
                    onUpdate={(updatedVehicle) => {
                        setVehicles(vehicles.map(v =>
                            v.id === updatedVehicle.id ? updatedVehicle : v
                        ))
                        setDetailVehicle(updatedVehicle)
                    }}
                    onDelete={(vehicleId) => {
                        setVehicles(vehicles.filter(v => v.id !== vehicleId))
                        setShowDetailPanel(false)
                        setDetailVehicle(null)
                    }}
                />
            )}
        </div>
    )
}
