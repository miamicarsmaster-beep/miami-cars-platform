import { getVehicles } from "@/lib/data/vehicles"
import { getInvestors } from "@/lib/data/profiles"
import { VehiclesGrid } from "@/components/dashboard/VehiclesTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function VehiclesPage() {
    const [vehicles, investors] = await Promise.all([
        getVehicles(),
        getInvestors()
    ])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Gestión de Flota</h2>
                <p className="text-muted-foreground">
                    Administra todos los vehículos de la plataforma
                </p>
            </div>

            <VehiclesGrid vehicles={vehicles} investors={investors} />
        </div>
    )
}
