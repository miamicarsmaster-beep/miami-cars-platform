"use client"

import "@/styles/dialog-fix.css"
import { useState } from "react"
import { Vehicle } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
    Camera, Car, FileText, Gauge, MapPin, Settings, Wrench, X, CalendarDays,
    Activity, CreditCard, Info, CheckCircle2, Edit3, Save, Upload, Trash2, DollarSign, AlertCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface VehicleManagementPanelProps {
    vehicle: Vehicle
    investors: Array<{ id: string; full_name: string | null; email: string | null }>
    onClose: () => void
    onUpdate?: (vehicle: Vehicle) => void
    onDelete?: (vehicleId: string) => void
}

export function VehicleManagementPanel({ vehicle, investors, onClose, onUpdate, onDelete }: VehicleManagementPanelProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const [isEditMode, setIsEditMode] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState({
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        license_plate: vehicle.license_plate || "",
        vin: vehicle.vin || "",
        mileage: vehicle.mileage || 0,
        location: vehicle.location || "",
        status: vehicle.status,
        daily_rental_price: vehicle.daily_rental_price || 0,
        purchase_price: vehicle.purchase_price || 0,
        assigned_investor_id: vehicle.assigned_investor_id || "",
        image_url: vehicle.image_url || ""
    })

    const router = useRouter()
    const supabase = createClient()

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            available: "bg-blue-600 text-white",
            rented: "bg-emerald-600 text-white",
            maintenance: "bg-orange-500 text-white",
            inactive: "bg-slate-500 text-white",
        }
        return colors[status] || "bg-slate-500 text-white"
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const { data, error } = await supabase
                .from("vehicles")
                .update({
                    make: formData.make,
                    model: formData.model,
                    year: formData.year,
                    license_plate: formData.license_plate,
                    vin: formData.vin,
                    mileage: formData.mileage,
                    location: formData.location,
                    status: formData.status,
                    daily_rental_price: formData.daily_rental_price,
                    purchase_price: formData.purchase_price,
                    assigned_investor_id: formData.assigned_investor_id || null,
                    image_url: formData.image_url
                })
                .eq("id", vehicle.id)
                .select()
                .single()

            if (error) throw error
            if (onUpdate && data) onUpdate(data as Vehicle)
            setIsEditMode(false)
            router.refresh()
        } catch (error) {
            console.error("Error updating vehicle:", error)
            alert("Error al actualizar el vehículo")
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar este vehículo?")) return
        try {
            const { error } = await supabase.from("vehicles").delete().eq("id", vehicle.id)
            if (error) throw error
            if (onDelete) onDelete(vehicle.id)
            onClose()
            router.refresh()
        } catch (error) {
            console.error("Error deleting vehicle:", error)
            alert("Error al eliminar el vehículo")
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent
                className="!max-w-[96vw] !w-[96vw] h-[94vh] p-0 gap-0 overflow-hidden bg-white dark:bg-slate-950 z-[100]"
                style={{ maxWidth: '96vw', width: '96vw', zIndex: 100 }}
            >
                {/* HEADER */}
                <div className="flex-shrink-0 px-10 py-6 border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-3xl font-bold truncate">
                                    {formData.year} {formData.make} {formData.model}
                                </h1>
                                <Badge className={`${getStatusColor(formData.status)} px-4 py-2 text-sm flex-shrink-0`}>
                                    {formData.status.toUpperCase()}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <span className="font-mono">{formData.license_plate || "Sin Placa"}</span>
                                <span>•</span>
                                <span className="font-mono text-xs">VIN: {formData.vin || "N/A"}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {formData.location || "Sin ubicación"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                            {isEditMode ? (
                                <>
                                    <Button variant="outline" size="sm" onClick={() => setIsEditMode(false)} disabled={isSaving}>
                                        Cancelar
                                    </Button>
                                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {isSaving ? "Guardando..." : "Guardar"}
                                    </Button>
                                </>
                            ) : (
                                <Button variant="outline" size="sm" onClick={() => setIsEditMode(true)}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 rounded-full flex-shrink-0">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-hidden flex flex-col">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">

                        {/* HORIZONTAL TABS NAVIGATION */}
                        <div className="flex-shrink-0 border-b bg-white dark:bg-slate-950 px-8">
                            <TabsList className="h-14 w-full justify-start gap-2 bg-transparent p-0">
                                {[
                                    { value: "overview", label: "General", icon: Settings },
                                    { value: "photos", label: "Fotos", icon: Camera },
                                    { value: "mileage", label: "Millaje", icon: Gauge },
                                    { value: "maintenance", label: "Mantenimiento", icon: Wrench },
                                    { value: "rentals", label: "Alquileres", icon: CalendarDays },
                                    { value: "documents", label: "Documentos", icon: FileText },
                                ].map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="flex items-center gap-2 px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:bg-muted/50 transition-all"
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        <span className="font-medium">{tab.label}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
                            <TabsContent value="overview" className="m-0 p-6 space-y-5">

                                {/* TOP ROW: Image + Key Metrics Side by Side */}
                                <div className="grid grid-cols-12 gap-5">
                                    {/* Image - 7 columns */}
                                    <div className="col-span-7">
                                        <Card className="overflow-hidden h-[320px] shadow-lg border-2">
                                            <div className="relative h-full group">
                                                <img
                                                    src={formData.image_url || `https://source.unsplash.com/1600x900/?${formData.make}+${formData.model},car`}
                                                    alt={`${formData.make} ${formData.model}`}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <h3 className="text-white text-2xl font-bold mb-2">{formData.year} {formData.make} {formData.model}</h3>
                                                    <div className="flex items-center gap-4 text-white/90 text-sm">
                                                        <span className="font-mono">{formData.license_plate}</span>
                                                        <span>•</span>
                                                        <span>{formData.mileage.toLocaleString()} mi</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {formData.location || "Sin ubicación"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="absolute top-4 right-4">
                                                    <Badge className={`${getStatusColor(formData.status)} text-sm px-3 py-1.5 shadow-xl`}>
                                                        {formData.status.toUpperCase()}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Key Metrics - 5 columns */}
                                    <div className="col-span-5 grid grid-rows-2 gap-5">
                                        {/* Tarifa Diaria - Destacada */}
                                        <Card className="p-6 flex flex-col justify-between bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg border-0 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                                            <div className="relative z-10">
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Tarifa Diaria</p>
                                                    <CreditCard className="h-6 w-6 text-emerald-200" />
                                                </div>
                                                <p className="text-5xl font-bold mb-1">${formData.daily_rental_price.toLocaleString()}</p>
                                                <p className="text-emerald-100 text-sm">por día de alquiler</p>
                                            </div>
                                        </Card>

                                        {/* Valor Compra */}
                                        <Card className="p-6 flex flex-col justify-between shadow-md border-2">
                                            <div className="flex items-center justify-between mb-3">
                                                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Valor de Compra</p>
                                                <DollarSign className="h-6 w-6 text-muted-foreground/30" />
                                            </div>
                                            <div>
                                                <p className="text-4xl font-bold mb-1">${formData.purchase_price.toLocaleString()}</p>
                                                <p className="text-sm text-muted-foreground">Inversión inicial</p>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* METRICS ROW - 4 Cards */}
                                <div className="grid grid-cols-4 gap-5">
                                    <Card className="p-5 shadow-md hover:shadow-lg transition-shadow border-2">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Millaje</p>
                                            <Gauge className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <p className="text-3xl font-bold mb-1">{formData.mileage.toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">millas recorridas</p>
                                    </Card>

                                    <Card className="p-5 shadow-md hover:shadow-lg transition-shadow border-2">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</p>
                                            <Activity className="h-5 w-5 text-emerald-500" />
                                        </div>
                                        <p className="text-3xl font-bold mb-1">Excelente</p>
                                        <p className="text-sm text-emerald-600">100% operativo</p>
                                    </Card>

                                    <Card className="p-5 shadow-md hover:shadow-lg transition-shadow border-2">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ingresos/Mes</p>
                                            <DollarSign className="h-5 w-5 text-amber-500" />
                                        </div>
                                        <p className="text-3xl font-bold mb-1">${(formData.daily_rental_price * 20).toLocaleString()}</p>
                                        <p className="text-sm text-muted-foreground">estimado</p>
                                    </Card>

                                    <Card className="p-5 shadow-md hover:shadow-lg transition-shadow border-2 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-slate-900">
                                        <div className="flex items-center justify-between mb-3">
                                            <p className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">ROI Anual</p>
                                            <Activity className="h-5 w-5 text-purple-500" />
                                        </div>
                                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                                            {((formData.daily_rental_price * 240 / formData.purchase_price) * 100).toFixed(1)}%
                                        </p>
                                        <p className="text-sm text-purple-600/70 dark:text-purple-400/70">retorno estimado</p>
                                    </Card>
                                </div>

                                {/* DETAILS SECTION - 2 Columns */}
                                <div className="grid grid-cols-12 gap-5">

                                    {/* LEFT: Specs + Actions - 8 columns */}
                                    <div className="col-span-8 space-y-5">

                                        {/* Technical Specs */}
                                        <Card className="shadow-md border-2">
                                            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-4">
                                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                    <Car className="h-5 w-5 text-primary" />
                                                    Especificaciones Técnicas
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <div className="grid grid-cols-3 gap-6">
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Marca</p>
                                                        <p className="text-xl font-bold">{formData.make}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Modelo</p>
                                                        <p className="text-xl font-bold">{formData.model}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Año</p>
                                                        <p className="text-xl font-bold">{formData.year}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Placa</p>
                                                        <p className="text-lg font-mono font-bold">{formData.license_plate || "N/A"}</p>
                                                    </div>
                                                    <div className="col-span-2 space-y-1">
                                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">VIN</p>
                                                        <p className="text-sm font-mono bg-muted px-3 py-2 rounded font-semibold">{formData.vin || "N/A"}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Quick Actions */}
                                        <Card className="shadow-md border-2">
                                            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-4">
                                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                                    <Settings className="h-5 w-5 text-primary" />
                                                    Acciones Rápidas
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5">
                                                <div className="grid grid-cols-4 gap-3">
                                                    <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-emerald-50 hover:border-emerald-300 transition-all">
                                                        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                                                        <span className="text-xs font-semibold">Check-in</span>
                                                    </Button>
                                                    <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300 transition-all">
                                                        <Wrench className="h-6 w-6 text-orange-600" />
                                                        <span className="text-xs font-semibold">Mantenimiento</span>
                                                    </Button>
                                                    <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all">
                                                        <CalendarDays className="h-6 w-6 text-blue-600" />
                                                        <span className="text-xs font-semibold">Agenda</span>
                                                    </Button>
                                                    <Button variant="outline" className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all">
                                                        <FileText className="h-6 w-6 text-purple-600" />
                                                        <span className="text-xs font-semibold">Documentos</span>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* RIGHT: Sidebar Info - 4 columns */}
                                    <div className="col-span-4 space-y-5">

                                        {/* Location */}
                                        <Card className="shadow-md border-2">
                                            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-3">
                                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-primary" />
                                                    Ubicación
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5">
                                                <div className="flex items-start gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                                                        <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Actual</p>
                                                        <p className="text-base font-bold">{formData.location || "Sin ubicación"}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Investor */}
                                        <Card className="shadow-md border-2">
                                            <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-3">
                                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                                    <Car className="h-4 w-4 text-primary" />
                                                    Inversor
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-md">
                                                        <span className="text-xl font-bold text-white">
                                                            {vehicle.assigned_investor?.full_name?.charAt(0) || "?"}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-bold truncate text-base">{vehicle.assigned_investor?.full_name || "Sin Asignar"}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{vehicle.assigned_investor?.email || ""}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Financial Summary */}
                                        <Card className="shadow-md border-2 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                                            <CardHeader className="border-b py-3">
                                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-primary" />
                                                    Resumen Financiero
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-0">
                                                <div className="divide-y">
                                                    <div className="flex justify-between items-center px-5 py-3">
                                                        <span className="text-xs font-medium text-muted-foreground uppercase">Inversión</span>
                                                        <span className="text-sm font-bold">${formData.purchase_price.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center px-5 py-3">
                                                        <span className="text-xs font-medium text-muted-foreground uppercase">Tarifa/Día</span>
                                                        <span className="text-sm font-bold text-emerald-600">${formData.daily_rental_price.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center px-5 py-3">
                                                        <span className="text-xs font-medium text-muted-foreground uppercase">Ingresos/Mes</span>
                                                        <span className="text-sm font-bold">${(formData.daily_rental_price * 20).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center px-5 py-3 bg-primary/5">
                                                        <span className="text-xs font-bold text-primary uppercase">ROI Anual</span>
                                                        <span className="text-base font-bold text-primary">
                                                            {((formData.daily_rental_price * 240 / formData.purchase_price) * 100).toFixed(1)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* OTHER TABS */}
                            {["photos", "mileage", "maintenance", "rentals", "documents"].map((tab) => (
                                <TabsContent key={tab} value={tab} className="m-0 p-8 h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <Settings className="h-16 w-16 mx-auto opacity-20 mb-4" />
                                        <h3 className="text-xl font-semibold capitalize mb-2">{tab}</h3>
                                        <p className="text-sm text-muted-foreground">Módulo en desarrollo</p>
                                    </div>
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}
