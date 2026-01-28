"use client"

import { Vehicle } from "@/types/database"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gauge, MapPin, Settings, Trash2 } from "lucide-react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"

interface VehicleCardProps {
    vehicle: Vehicle
    onDelete: (id: string) => void
    onManage?: (vehicle: Vehicle) => void
}

export function VehicleCard({ vehicle, onDelete, onManage }: VehicleCardProps) {
    const generatePlaceholderImage = (make: string, model: string) => {
        const carName = `${make} ${model}`.replace(/\s+/g, '+')
        return `https://source.unsplash.com/800x600/?${carName},car`
    }

    const getStatusBadge = (status: Vehicle["status"]) => {
        const variants: Record<Vehicle["status"], { label: string; className: string }> = {
            available: { label: "Disponible", className: "bg-emerald-500 hover:bg-emerald-600" },
            rented: { label: "Alquilado", className: "bg-blue-500 hover:bg-blue-600" },
            maintenance: { label: "Mantenimiento", className: "bg-amber-500 hover:bg-amber-600" },
            inactive: { label: "Inactivo", className: "bg-slate-500 hover:bg-slate-600" },
        }
        return <Badge className={variants[status].className}>{variants[status].label}</Badge>
    }

    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="aspect-video relative bg-muted overflow-hidden">
                <ImageWithFallback
                    src={vehicle.image_url || generatePlaceholderImage(vehicle.make, vehicle.model)}
                    fallbackSrc={generatePlaceholderImage(vehicle.make, vehicle.model)}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                    className="flex-1"
                    onClick={() => onManage?.(vehicle)}
                >
                    <Settings className="h-4 w-4 mr-2" />
                    Administrar
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-700 flex-shrink-0"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    )
}
