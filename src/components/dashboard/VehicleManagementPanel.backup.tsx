"use client"

import { useState } from "react"
import { Vehicle } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// Switch component not needed for now
import {
    Camera,
    Car,
    FileText,
    Gauge,
    MapPin,
    Settings,
    Wrench,
    X,
    CalendarDays,
    Activity,
    CreditCard,
    Info,
    CheckCircle2,
    Edit3,
    Save,
    Upload,
    Trash2,
    Plus,
    DollarSign,
    AlertCircle
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

export function VehicleManagementPanel({
    vehicle,
    investors,
    onClose,
    onUpdate,
    onDelete
}: VehicleManagementPanelProps) {
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

            if (onUpdate && data) {
                onUpdate(data as Vehicle)
            }

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
            const { error } = await supabase
                .from("vehicles")
                .delete()
                .eq("id", vehicle.id)

            if (error) throw error

            if (onDelete) {
                onDelete(vehicle.id)
            }

            onClose()
            router.refresh()
        } catch (error) {
            console.error("Error deleting vehicle:", error)
            alert("Error al eliminar el vehículo")
        }
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="!max-w-[95vw] !w-[95vw] md:!w-[1600px] h-[92vh] p-0 flex flex-col bg-background overflow-hidden rounded-xl border shadow-2xl gap-0">

                {/* HEADER */}
                <div className="flex-shrink-0 px-8 py-5 border-b bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                                {isEditMode ? (
                                    <div className="flex items-center gap-3 flex-1">
                                        <Input
                                            value={formData.year}
                                            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                            className="w-24 text-2xl font-bold"
                                            type="number"
                                        />
                                        <Input
                                            value={formData.make}
                                            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                                            className="flex-1 text-2xl font-bold"
                                        />
                                        <Input
                                            value={formData.model}
                                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            className="flex-1 text-2xl font-bold"
                                        />
                                    </div>
                                ) : (
                                    <h1 className="text-3xl font-bold tracking-tight">
                                        {formData.year} {formData.make} {formData.model}
                                    </h1>
                                )}

                                {isEditMode ? (
                                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as any })}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Disponible</SelectItem>
                                            <SelectItem value="rented">Alquilado</SelectItem>
                                            <SelectItem value="maintenance">Mantenimiento</SelectItem>
                                            <SelectItem value="inactive">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Badge className={`px-4 py-2 text-sm font-medium uppercase tracking-wide rounded-md ${getStatusColor(formData.status)}`}>
                                        {formData.status}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-2">
                                    <Car className="h-4 w-4" />
                                    {isEditMode ? (
                                        <Input
                                            value={formData.license_plate}
                                            onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                                            className="h-7 w-32 font-mono text-xs"
                                            placeholder="Placa"
                                        />
                                    ) : (
                                        <span className="font-mono">{formData.license_plate || "Sin Placa"}</span>
                                    )}
                                </div>
                                <div className="h-4 w-[1px] bg-border" />
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    {isEditMode ? (
                                        <Input
                                            value={formData.vin}
                                            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                                            className="h-7 w-48 font-mono text-xs"
                                            placeholder="VIN"
                                        />
                                    ) : (
                                        <span className="font-mono">VIN: {formData.vin || "N/A"}</span>
                                    )}
                                </div>
                                <div className="h-4 w-[1px] bg-border" />
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    {isEditMode ? (
                                        <Input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="h-7 w-40 text-xs"
                                            placeholder="Ubicación"
                                        />
                                    ) : (
                                        <span>{formData.location || "Sin ubicación"}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {isEditMode ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setIsEditMode(false)
                                            setFormData({
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
                                        }}
                                        disabled={isSaving}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancelar
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {isSaving ? "Guardando..." : "Guardar"}
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditMode(true)}
                                >
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Editar
                                </Button>
                            )}

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="h-10 w-10 rounded-full"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* TABS & CONTENT */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    orientation="vertical"
                    className="flex flex-1 overflow-hidden"
                >

                    {/* SIDEBAR NAVIGATION */}
                    <div className="w-64 flex-shrink-0 border-r bg-muted/10 hidden md:block">
                        <TabsList className="h-full flex flex-col p-4 space-y-2 bg-transparent justify-start">
                            {[
                                { value: "overview", label: "Visión General", icon: Settings },
                                { value: "photos", label: "Galería & Daños", icon: Camera },
                                { value: "mileage", label: "Historial Millaje", icon: Gauge },
                                { value: "maintenance", label: "Mantenimiento", icon: Wrench },
                                { value: "rentals", label: "Alquileres", icon: CalendarDays },
                                { value: "documents", label: "Documentación", icon: FileText },
                            ].map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="w-full justify-start px-4 py-3 text-sm font-medium rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                                >
                                    <tab.icon className="h-4 w-4 mr-3" />
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="flex-1 overflow-y-auto p-8 bg-muted/5">

                        {/* OVERVIEW TAB */}
                        <TabsContent value="overview" className="space-y-8 max-w-7xl mx-auto mt-0 h-full border-0 p-0">

                            {/* STATS ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <MetricCard
                                    label="Millaje Actual"
                                    value={formData.mileage.toLocaleString()}
                                    unit="mi"
                                    icon={Gauge}
                                    isEditMode={isEditMode}
                                    onEdit={(val) => setFormData({ ...formData, mileage: Number(val) })}
                                />
                                <MetricCard
                                    label="Tarifa Diaria"
                                    value={`$${formData.daily_rental_price.toLocaleString()}`}
                                    unit="/día"
                                    icon={CreditCard}
                                    highlight
                                    isEditMode={isEditMode}
                                    onEdit={(val) => setFormData({ ...formData, daily_rental_price: Number(val.replace(/\D/g, '')) })}
                                />
                                <MetricCard
                                    label="Estado Salud"
                                    value="Excelente"
                                    unit=""
                                    icon={Activity}
                                    status="success"
                                />
                                <MetricCard
                                    label="Valor Compra"
                                    value={`$${formData.purchase_price.toLocaleString()}`}
                                    unit="USD"
                                    icon={DollarSign}
                                    isEditMode={isEditMode}
                                    onEdit={(val) => setFormData({ ...formData, purchase_price: Number(val.replace(/\D/g, '')) })}
                                />
                            </div>

                            {/* MAIN GRID */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* LEFT: IMAGE & ACTIONS */}
                                <div className="lg:col-span-2 space-y-6">
                                    <Card className="overflow-hidden border shadow-sm">
                                        <div className="aspect-[21/9] bg-muted relative group">
                                            <img
                                                src={formData.image_url || `https://source.unsplash.com/1600x900/?${formData.make}+${formData.model},car`}
                                                alt={`${formData.make} ${formData.model}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {isEditMode && (
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="secondary" size="lg">
                                                        <Upload className="h-5 w-5 mr-2" />
                                                        Cambiar Imagen
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4">
                                                <Badge className={`${getStatusColor(formData.status)} shadow-lg`}>
                                                    {formData.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* QUICK ACTIONS */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <ActionButton icon={CheckCircle2} label="Check-in" />
                                        <ActionButton icon={Wrench} label="Reportar Daño" variant="destructive" />
                                        <ActionButton icon={CalendarDays} label="Ver Agenda" />
                                        <ActionButton icon={FileText} label="Subir Doc" />
                                    </div>

                                    {/* DANGER ZONE */}
                                    {isEditMode && (
                                        <Card className="border-destructive/50 bg-destructive/5">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="text-base flex items-center gap-2 text-destructive">
                                                    <AlertCircle className="h-4 w-4" />
                                                    Zona de Peligro
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Button
                                                    variant="destructive"
                                                    onClick={handleDelete}
                                                    className="w-full"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar Vehículo Permanentemente
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* RIGHT: DETAILS */}
                                <div className="space-y-6">
                                    <Card className="border shadow-sm">
                                        <CardHeader className="bg-muted/30 border-b py-4">
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                <Info className="h-4 w-4" />
                                                Ficha Técnica
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="divide-y">
                                                <DetailRow label="Marca" value={formData.make} />
                                                <DetailRow label="Modelo" value={formData.model} />
                                                <DetailRow label="Año" value={formData.year.toString()} />
                                                <DetailRow label="Placa" value={formData.license_plate || "N/A"} />
                                                <DetailRow label="VIN" value={formData.vin || "N/A"} mono />
                                                <DetailRow label="Ubicación" value={formData.location || "N/A"} />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border shadow-sm">
                                        <CardHeader className="bg-muted/30 border-b py-4">
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                <DollarSign className="h-4 w-4" />
                                                Información Financiera
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="divide-y">
                                                <DetailRow
                                                    label="Precio Compra"
                                                    value={`$${formData.purchase_price.toLocaleString()}`}
                                                />
                                                <DetailRow
                                                    label="Tarifa Diaria"
                                                    value={`$${formData.daily_rental_price.toLocaleString()}`}
                                                />
                                                <DetailRow
                                                    label="Ingresos Estimados/Mes"
                                                    value={`$${(formData.daily_rental_price * 20).toLocaleString()}`}
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border shadow-sm">
                                        <CardHeader className="bg-muted/30 border-b py-4">
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                <Car className="h-4 w-4" />
                                                Inversor Asignado
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-5">
                                            {isEditMode ? (
                                                <div className="space-y-2">
                                                    <Label>Seleccionar Inversor</Label>
                                                    <Select
                                                        value={formData.assigned_investor_id}
                                                        onValueChange={(value) => setFormData({ ...formData, assigned_investor_id: value })}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Sin asignar" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="">Sin asignar</SelectItem>
                                                            {investors.map((inv) => (
                                                                <SelectItem key={inv.id} value={inv.id}>
                                                                    {inv.full_name} ({inv.email})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <p className="font-semibold text-lg">
                                                        {vehicle.assigned_investor?.full_name || "Sin Asignar"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {vehicle.assigned_investor?.email || ""}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        {/* OTHER TABS - PLACEHOLDERS */}
                        {["photos", "mileage", "maintenance", "rentals", "documents"].map((tab) => (
                            <TabsContent key={tab} value={tab} className="h-full m-0 p-0 border-0">
                                <div className="h-full flex items-center justify-center text-muted-foreground bg-white rounded-xl border border-dashed">
                                    <div className="text-center">
                                        <Settings className="h-16 w-16 mx-auto opacity-20 mb-4" />
                                        <h3 className="text-xl font-semibold capitalize">{tab}</h3>
                                        <p className="text-sm mt-2">Módulo en desarrollo</p>
                                    </div>
                                </div>
                            </TabsContent>
                        ))}

                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

/* HELPER COMPONENTS */

function MetricCard({ label, value, unit, icon: Icon, trend, highlight, status, isEditMode, onEdit }: { label: string; value: string; unit?: string; icon: any; trend?: string; highlight?: boolean; status?: string; isEditMode?: boolean; onEdit?: (val: string) => void }) {
    return (
        <Card className={`border shadow-sm transition-all hover:shadow-md h-full flex flex-col justify-between ${highlight ? 'border-primary/20 bg-primary/5' : ''}`}>
            <CardContent className="p-5 flex flex-col h-full justify-between gap-2">
                <div className="flex justify-between items-start w-full">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate mr-2">{label}</p>
                    <div className={`p-2 rounded-lg flex-shrink-0 ${highlight ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>
                <div>
                    {isEditMode && onEdit ? (
                        <Input
                            value={value}
                            onChange={(e) => onEdit(e.target.value)}
                            className="text-2xl font-bold h-auto py-1"
                        />
                    ) : (
                        <div className="flex items-baseline gap-1 flex-wrap">
                            <h3 className={`text-2xl lg:text-3xl font-bold tracking-tight ${highlight ? 'text-primary' : 'text-foreground'}`}>
                                {value}
                            </h3>
                            {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
                        </div>
                    )}
                    {trend && (
                        <p className="mt-1 text-xs font-medium text-emerald-600 flex items-center gap-1 truncate">
                            {trend}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex justify-between items-center px-5 py-4 hover:bg-muted/30 transition-colors">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className={`text-sm font-semibold text-foreground ${mono ? 'font-mono' : ''}`}>
                {value}
            </span>
        </div>
    )
}

function ActionButton({ icon: Icon, label, variant = "secondary" }: { icon: any; label: string; variant?: string }) {
    return (
        <Button variant={variant as any} className="h-auto py-4 flex flex-col gap-2 rounded-xl shadow-sm hover:shadow-md transition-all">
            <Icon className="h-6 w-6" />
            <span className="text-xs font-semibold">{label}</span>
        </Button>
    )
}
