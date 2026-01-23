"use client"

import { useState } from "react"
import { Vehicle } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent } from "@/components/ui/dialog"
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
    CheckCircle2
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface VehicleDetailPanelProps {
    vehicle: Vehicle
    onClose: () => void
}

export function VehicleDetailPanel({ vehicle, onClose }: VehicleDetailPanelProps) {
    const [activeTab, setActiveTab] = useState("overview")

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            available: "bg-blue-600 text-white border-blue-600",
            rented: "bg-emerald-600 text-white border-emerald-600",
            maintenance: "bg-orange-500 text-white border-orange-500",
            inactive: "bg-slate-500 text-white border-slate-500",
        }
        return colors[status] || "bg-slate-500 text-white"
    }

    return (
        <Dialog open={true} onOpenChange={onClose}>
            {/* 
                UX FIX: Usamos max-w-[95vw] w-full para forzar el ancho casi total de la pantalla.
                Eliminamos restricciones de max-w-lg por defecto.
            */}
            <DialogContent className="!max-w-[95vw] !w-[95vw] md:!w-[1400px] h-[90vh] p-0 flex flex-col bg-background overflow-hidden rounded-xl border shadow-2xl">

                {/* 1. HEADER WIDE: Espacioso, con info clave visible de un vistazo */}
                <div className="flex-shrink-0 px-8 py-5 border-b bg-card">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </h1>
                                <Badge className={`px-3 py-1 text-sm font-medium uppercase tracking-wide rounded-md border ${getStatusColor(vehicle.status)}`}>
                                    {vehicle.status}
                                </Badge>
                            </div>

                            <div className="mt-2 flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-muted rounded-md">
                                        <Car className="h-4 w-4 text-foreground" />
                                    </div>
                                    <span className="font-mono">{vehicle.license_plate || "Sin Placa"}</span>
                                </div>
                                <div className="h-4 w-[1px] bg-border" />
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-muted rounded-md">
                                        <Info className="h-4 w-4 text-foreground" />
                                    </div>
                                    <span className="font-mono">VIN: {vehicle.vin || "N/A"}</span>
                                </div>
                                <div className="h-4 w-[1px] bg-border" />
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-muted rounded-md">
                                        <MapPin className="h-4 w-4 text-foreground" />
                                    </div>
                                    <span>{vehicle.location || "Ubicación desconocida"}</span>
                                </div>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-10 w-10 text-muted-foreground hover:bg-muted rounded-full"
                        >
                            <X className="h-6 w-6" />
                        </Button>
                    </div>
                </div>

                {/* 2. LAYOUT FLEXIBLE: Sidebar de Tabs + Contenido Principal */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    orientation="vertical"
                    className="flex flex-1 overflow-hidden"
                >

                    {/* SIDEBAR TABS: Navegación vertical profesional */}
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

                    {/* MAIN CONTENT AREA */}
                    <div className="flex-1 overflow-y-auto p-8 bg-muted/5">
                        {/* Mobile Tabs Fallback (Horizontal) */}
                        <div className="md:hidden mb-6 overflow-x-auto pb-2">
                            {/* ... mobile tabs logic ... */}
                        </div>

                        <TabsContent value="overview" className="space-y-8 max-w-7xl mx-auto mt-0 h-full border-0 p-0 placeholder:mt-0">
                            {/* TOP STATS ROW */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <MetricCard
                                    label="Millaje Actual"
                                    value={vehicle.mileage?.toLocaleString() || "0"}
                                    unit="mi"
                                    icon={Gauge}
                                    trend="+120 mi este mes"
                                />
                                <MetricCard
                                    label="Tarifa Diaria"
                                    value={`$${vehicle.daily_rental_price?.toLocaleString() || "0"}`}
                                    unit="/día"
                                    icon={CreditCard}
                                    highlight
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
                                    value={`$${vehicle.purchase_price?.toLocaleString() || "N/A"}`}
                                    unit="USD"
                                    icon={DollarSign}
                                />
                            </div>

                            {/* MAIN DASHBOARD GRID */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">

                                {/* Left Column: Big Visuals (2/3 width) */}
                                <div className="lg:col-span-2 space-y-6">
                                    <Card className="overflow-hidden border shadow-sm">
                                        <div className="aspect-[21/9] bg-muted relative group">
                                            <img
                                                src={vehicle.image_url || `https://source.unsplash.com/1600x900/?${vehicle.make}+${vehicle.model},car`}
                                                alt={`${vehicle.make} ${vehicle.model}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                            <div className="absolute bottom-6 left-6 text-white">
                                                <p className="font-medium text-lg shadow-black drop-shadow-md">Fotografía Principal</p>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Quick Actions Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <ActionButton icon={CheckCircle2} label="Check-in" />
                                        <ActionButton icon={Wrench} label="Reportar Daño" variant="destructive" />
                                        <ActionButton icon={CalendarDays} label="Ver Agenda" />
                                        <ActionButton icon={FileText} label="Subir Doc" />
                                    </div>
                                </div>

                                {/* Right Column: Details Sidebar (1/3 width) */}
                                <div className="space-y-6">
                                    <Card className="h-full border shadow-sm">
                                        <CardHeader className="bg-muted/30 border-b py-4">
                                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                <Info className="h-4 w-4" />
                                                Ficha Técnica
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-0">
                                            <div className="divide-y">
                                                <DetailRow label="Marca" value={vehicle.make} />
                                                <DetailRow label="Modelo" value={vehicle.model} />
                                                <DetailRow label="Año" value={vehicle.year.toString()} />
                                                <DetailRow label="Color" value="N/A" />
                                                <DetailRow label="Inversor" value={vehicle.assigned_investor?.full_name || "Sin Asignar"} truncate />
                                                <DetailRow label="Email" value={vehicle.assigned_investor?.email || "-"} truncate />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="photos" className="h-full m-0 p-0 border-0">
                            <div className="h-full flex items-center justify-center text-muted-foreground bg-white rounded-xl border border-dashed">
                                <div className="text-center">
                                    <Camera className="h-16 w-16 mx-auto opacity-20 mb-4" />
                                    <h3 className="text-xl font-semibold">Galería de Fotos</h3>
                                    <p>Funcionalidad completa de carga y visualización aquí.</p>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Placeholders for other tabs */}
                        {["mileage", "maintenance", "rentals", "documents"].map((tab) => (
                            <TabsContent key={tab} value={tab} className="h-full m-0 p-0 border-0">
                                <div className="h-full flex items-center justify-center text-muted-foreground bg-white rounded-xl border border-dashed">
                                    <div className="text-center">
                                        <Settings className="h-16 w-16 mx-auto opacity-20 mb-4" />
                                        <h3 className="text-xl font-semibold capitalize">{tab}</h3>
                                        <p>Módulo en desarrollo.</p>
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

/* HELPER COMPONENTS FOR CLEANER CODE */

function MetricCard({ label, value, unit, icon: Icon, trend, highlight, status }: any) {
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
                    <div className="flex items-baseline gap-1 flex-wrap">
                        <h3 className={`text-2xl lg:text-3xl font-bold tracking-tight ${highlight ? 'text-primary' : 'text-foreground'}`}>
                            {value}
                        </h3>
                        {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
                    </div>
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

function DetailRow({ label, value, truncate }: any) {
    return (
        <div className="flex justify-between items-center px-5 py-4 hover:bg-muted/30 transition-colors">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className={`text-sm font-semibold text-foreground ${truncate ? 'truncate max-w-[150px]' : ''}`}>
                {value}
            </span>
        </div>
    )
}

function ActionButton({ icon: Icon, label, variant = "secondary" }: any) {
    return (
        <Button variant={variant as any} className="h-auto py-4 flex flex-col gap-2 rounded-xl shadow-sm hover:shadow-md transition-all">
            <Icon className="h-6 w-6" />
            <span className="text-xs font-semibold">{label}</span>
        </Button>
    )
}

// Icon helper needed for component above
import { DollarSign } from "lucide-react"
