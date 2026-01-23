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
    MapPin,
    Plus,
    Settings,
    Upload,
    Wrench,
    X,
    CalendarDays,
    Camera,
    AlertTriangle,
    Car,
    CreditCard,
    Clock,
    CheckCircle2,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface VehicleDetailPanelProps {
    vehicle: Vehicle
    onClose: () => void
}

interface DamageMarker {
    x: number
    y: number
    label: string
    description?: string
}

interface VehiclePhoto {
    id: string
    image_url: string
    caption: string | null
    has_damage: boolean
    damage_markers: DamageMarker[] | null
}

export function VehicleDetailPanel({ vehicle, onClose }: VehicleDetailPanelProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const [photos, setPhotos] = useState<VehiclePhoto[]>([])
    const [selectedPhoto, setSelectedPhoto] = useState<VehiclePhoto | null>(null)
    const [isMarkingDamage, setIsMarkingDamage] = useState(false)
    const [damageMarkers, setDamageMarkers] = useState<DamageMarker[]>([])
    const router = useRouter()
    const supabase = createClient()

    const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>, photo: VehiclePhoto) => {
        if (!isMarkingDamage) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        const newMarker: DamageMarker = {
            x,
            y,
            label: "Detalle",
            description: prompt("Descripción del detalle:") || ""
        }

        setDamageMarkers([...damageMarkers, newMarker])
    }

    const saveDamageMarkers = async () => {
        if (!selectedPhoto) return

        try {
            const { error } = await supabase
                .from("vehicle_photos")
                .update({
                    has_damage: damageMarkers.length > 0,
                    damage_markers: damageMarkers
                })
                .eq("id", selectedPhoto.id)

            if (error) throw error

            alert("Marcadores guardados")
            setIsMarkingDamage(false)
            setDamageMarkers([])
        } catch (error) {
            console.error("Error saving markers:", error)
            alert("Error al guardar marcadores")
        }
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            available: "bg-blue-500",
            rented: "bg-emerald-500",
            maintenance: "bg-orange-500",
            inactive: "bg-gray-500",
        }
        return colors[status] || "bg-gray-500"
    }

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            available: "Disponible",
            rented: "Alquilado",
            maintenance: "Mantenimiento",
            inactive: "Inactivo",
        }
        return labels[status] || status
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-[98vw] w-[1600px] max-h-[98vh] p-0 gap-0 overflow-hidden">
                {/* Header Section - Fixed */}
                <DialogHeader className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                                <DialogTitle className="text-4xl font-bold tracking-tight">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </DialogTitle>
                                <Badge className={`${getStatusColor(vehicle.status)} text-white px-4 py-1.5 text-sm`}>
                                    {getStatusLabel(vehicle.status)}
                                </Badge>
                            </div>
                            <div className="flex gap-6 items-center text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    <span className="font-medium">Placa: {vehicle.license_plate || "Sin placa"}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">VIN: {vehicle.vin || "N/A"}</span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{vehicle.location || "Sin ubicación"}</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Content Section - Scrollable */}
                <div className="overflow-y-auto max-h-[calc(98vh-120px)]">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="sticky top-0 z-10 bg-background border-b px-8 pt-4">
                            <TabsList className="grid w-full grid-cols-6 h-14">
                                <TabsTrigger value="overview" className="text-sm">
                                    <Settings className="h-4 w-4 mr-2" />
                                    General
                                </TabsTrigger>
                                <TabsTrigger value="photos" className="text-sm">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Fotos ({10})
                                </TabsTrigger>
                                <TabsTrigger value="mileage" className="text-sm">
                                    <Gauge className="h-4 w-4 mr-2" />
                                    Millaje
                                </TabsTrigger>
                                <TabsTrigger value="maintenance" className="text-sm">
                                    <Wrench className="h-4 w-4 mr-2" />
                                    Mantenimiento
                                </TabsTrigger>
                                <TabsTrigger value="rentals" className="text-sm">
                                    <CalendarDays className="h-4 w-4 mr-2" />
                                    Alquileres
                                </TabsTrigger>
                                <TabsTrigger value="documents" className="text-sm">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Documentos
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="px-8 py-6">
                            {/* OVERVIEW TAB */}
                            <TabsContent value="overview" className="mt-0 space-y-6">
                                {/* Top Stats Grid */}
                                <div className="grid grid-cols-4 gap-4">
                                    <Card className="border-l-4 border-l-blue-500">
                                        <CardHeader className="pb-3">
                                            <CardDescription className="text-xs font-medium">Millaje Actual</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold">{vehicle.mileage?.toLocaleString()}</span>
                                                <span className="text-muted-foreground">mi</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-emerald-500">
                                        <CardHeader className="pb-3">
                                            <CardDescription className="text-xs font-medium">Precio Alquiler/Día</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold text-emerald-600">
                                                    ${vehicle.daily_rental_price?.toLocaleString() || "0"}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-purple-500">
                                        <CardHeader className="pb-3">
                                            <CardDescription className="text-xs font-medium">Precio de Compra</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-bold">
                                                    ${vehicle.purchase_price?.toLocaleString() || "N/A"}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-l-4 border-l-orange-500">
                                        <CardHeader className="pb-3">
                                            <CardDescription className="text-xs font-medium">Inversor Asignado</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm font-medium truncate">
                                                {vehicle.assigned_investor?.full_name || "Sin asignar"}
                                            </div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {vehicle.assigned_investor?.email || ""}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-3 gap-6">
                                    {/* Vehicle Image - 2 columns */}
                                    <Card className="col-span-2">
                                        <CardHeader>
                                            <CardTitle>Imagen del Vehículo</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="aspect-video rounded-xl overflow-hidden bg-muted border-2">
                                                <img
                                                    src={vehicle.image_url || `https://source.unsplash.com/1200x600/?${vehicle.make}+${vehicle.model},car`}
                                                    alt={`${vehicle.make} ${vehicle.model}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Quick Actions & Info - 1 column */}
                                    <div className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3 pt-0">
                                                <Button className="w-full justify-start" variant="outline">
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Registrar Millaje
                                                </Button>
                                                <Button className="w-full justify-start" variant="outline">
                                                    <Wrench className="h-4 w-4 mr-2" />
                                                    Nuevo Mantenimiento
                                                </Button>
                                                <Button className="w-full justify-start" variant="outline">
                                                    <CalendarDays className="h-4 w-4 mr-2" />
                                                    Nueva Reserva
                                                </Button>
                                                <Button className="w-full justify-start" variant="outline">
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Subir Documento
                                                </Button>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Estado del Vehículo</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4 pt-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Último Servicio</span>
                                                    <span className="text-sm font-medium">Hace 2 meses</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Próximo Servicio</span>
                                                    <span className="text-sm font-medium text-orange-600">En 1 mes</span>
                                                </div>
                                                <Separator />
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-muted-foreground">Ocupación (30d)</span>
                                                    <span className="text-sm font-medium text-emerald-600">85%</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Detailed Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Información Detallada</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-5 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Marca</p>
                                                <p className="text-lg font-semibold">{vehicle.make}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Modelo</p>
                                                <p className="text-lg font-semibold">{vehicle.model}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Año</p>
                                                <p className="text-lg font-semibold">{vehicle.year}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Placa</p>
                                                <p className="text-lg font-semibold font-mono">{vehicle.license_plate || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Estado</p>
                                                <Badge className={`${getStatusColor(vehicle.status)} text-white`}>
                                                    {getStatusLabel(vehicle.status)}
                                                </Badge>
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="grid grid-cols-5 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">VIN</p>
                                                <p className="text-sm font-mono">{vehicle.vin || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Fecha de Compra</p>
                                                <p className="text-sm">{vehicle.purchase_date || "N/A"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Ubicación</p>
                                                <p className="text-sm flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {vehicle.location || "N/A"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Millaje</p>
                                                <p className="text-sm">{vehicle.mileage?.toLocaleString()} mi</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide">Precio Compra</p>
                                                <p className="text-sm font-semibold">${vehicle.purchase_price?.toLocaleString() || "N/A"}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* PHOTOS TAB */}
                            <TabsContent value="photos" className="mt-0 space-y-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-2xl font-bold">Galería de Fotos del Vehículo</h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Hasta 10 fotos • Click en una foto para ampliarla y marcar detalles
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedPhoto && (
                                            <>
                                                <Button
                                                    variant={isMarkingDamage ? "destructive" : "outline"}
                                                    onClick={() => setIsMarkingDamage(!isMarkingDamage)}
                                                >
                                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                                    {isMarkingDamage ? "Cancelar Marcado" : "Marcar Detalles"}
                                                </Button>
                                                {isMarkingDamage && damageMarkers.length > 0 && (
                                                    <Button onClick={saveDamageMarkers}>
                                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                                        Guardar Marcadores ({damageMarkers.length})
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                        <Button>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Subir Foto
                                        </Button>
                                    </div>
                                </div>

                                {/* Grid de Fotos */}
                                <div className="grid grid-cols-5 gap-4">
                                    {[...Array(10)].map((_, i) => (
                                        <Card
                                            key={i}
                                            className={`cursor-pointer hover:shadow-xl transition-all hover:scale-105 ${selectedPhoto?.id === `photo-${i}` ? 'ring-2 ring-primary' : ''
                                                }`}
                                            onClick={() => setSelectedPhoto({
                                                id: `photo-${i}`,
                                                image_url: `https://source.unsplash.com/600x400/?car,${i}`,
                                                caption: null,
                                                has_damage: false,
                                                damage_markers: null
                                            })}
                                        >
                                            <CardContent className="p-0">
                                                <div className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                                                    <img
                                                        src={`https://source.unsplash.com/600x400/?car,${i}`}
                                                        alt={`Foto ${i + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                                                        Foto {i + 1}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Vista Ampliada de Foto Seleccionada */}
                                {selectedPhoto && (
                                    <Card className="mt-8">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <span>Foto Seleccionada</span>
                                                {isMarkingDamage && (
                                                    <Badge variant="destructive" className="animate-pulse">
                                                        Click en la imagen para marcar detalles
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div
                                                className={`relative max-w-5xl mx-auto rounded-xl overflow-hidden ${isMarkingDamage ? 'cursor-crosshair' : 'cursor-default'
                                                    }`}
                                                onClick={(e) => handlePhotoClick(e, selectedPhoto)}
                                            >
                                                <img
                                                    src={selectedPhoto.image_url}
                                                    alt="Foto ampliada"
                                                    className="w-full rounded-xl shadow-2xl"
                                                />
                                                {/* Marcadores de Daño */}
                                                {damageMarkers.map((marker, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="absolute w-10 h-10 -ml-5 -mt-5 bg-red-600 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-125 transition-transform animate-bounce"
                                                        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                                                        title={marker.description}
                                                    >
                                                        !
                                                    </div>
                                                ))}
                                            </div>
                                            {damageMarkers.length > 0 && (
                                                <div className="mt-6 p-6 bg-red-50 dark:bg-red-950/20 rounded-xl border-2 border-red-200 dark:border-red-800">
                                                    <h4 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                                                        <AlertTriangle className="h-5 w-5" />
                                                        Detalles Marcados ({damageMarkers.length})
                                                    </h4>
                                                    <ul className="space-y-2">
                                                        {damageMarkers.map((marker, idx) => (
                                                            <li key={idx} className="text-sm flex items-start gap-2">
                                                                <span className="font-bold text-red-600">#{idx + 1}</span>
                                                                <span><strong>{marker.label}:</strong> {marker.description}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}
                            </TabsContent>

                            {/* Other tabs with placeholder content */}
                            <TabsContent value="mileage" className="mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Historial de Millaje</CardTitle>
                                        <CardDescription>Próximamente - Registro cronológico del millaje</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-96 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            <Gauge className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                            <p>Funcionalidad en desarrollo</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="maintenance" className="mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Historial de Mantenimientos</CardTitle>
                                        <CardDescription>Próximamente - Servicios y reparaciones</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-96 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            <Wrench className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                            <p>Funcionalidad en desarrollo</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="rentals" className="mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Calendario de Alquileres</CardTitle>
                                        <CardDescription>Próximamente - Gestión de reservas</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-96 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            <CalendarDays className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                            <p>Funcionalidad en desarrollo</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="documents" className="mt-0">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Documentos del Vehículo</CardTitle>
                                        <CardDescription>Próximamente - Registro, seguro, inspecciones</CardDescription>
                                    </CardHeader>
                                    <CardContent className="h-96 flex items-center justify-center">
                                        <div className="text-center text-muted-foreground">
                                            <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                            <p>Funcionalidad en desarrollo</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
