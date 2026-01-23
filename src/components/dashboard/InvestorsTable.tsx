"use client"

import { useState } from "react"
import { Profile, Vehicle } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import { Plus, Pencil, Mail, Phone } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface InvestorsTableProps {
    investors: Profile[]
    vehicles: Vehicle[]
}

export function InvestorsTable({ investors: initialInvestors, vehicles }: InvestorsTableProps) {
    const [investors, setInvestors] = useState(initialInvestors)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [selectedInvestor, setSelectedInvestor] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        full_name: "",
        phone: "",
    })

    const resetForm = () => {
        setFormData({
            full_name: "",
            phone: "",
        })
    }

    const handleEdit = async () => {
        if (!selectedInvestor) return
        setIsLoading(true)
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: formData.full_name,
                    phone: formData.phone,
                })
                .eq("id", selectedInvestor.id)

            if (error) throw error

            setInvestors(investors.map(inv =>
                inv.id === selectedInvestor.id
                    ? { ...inv, ...formData }
                    : inv
            ))
            setIsEditOpen(false)
            setSelectedInvestor(null)
            resetForm()
            router.refresh()
        } catch (error) {
            console.error("Error updating investor:", error)
            alert("Error al actualizar inversor")
        } finally {
            setIsLoading(false)
        }
    }

    const openEditDialog = (investor: Profile) => {
        setSelectedInvestor(investor)
        setFormData({
            full_name: investor.full_name || "",
            phone: investor.phone || "",
        })
        setIsEditOpen(true)
    }

    const getVehicleCount = (investorId: string) => {
        return vehicles.filter(v => v.assigned_investor_id === investorId).length
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Inversores ({investors.length})</h3>
                <p className="text-sm text-muted-foreground">
                    Los inversores se crean desde Supabase Auth Dashboard
                </p>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Vehículos Asignados</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {investors.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                    No hay inversores registrados
                                </TableCell>
                            </TableRow>
                        ) : (
                            investors.map((investor) => (
                                <TableRow key={investor.id}>
                                    <TableCell className="font-medium">
                                        {investor.full_name || "Sin nombre"}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            {investor.email}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {investor.phone ? (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                {investor.phone}
                                            </div>
                                        ) : (
                                            "—"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">
                                            {getVehicleCount(investor.id)} vehículos
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(investor)}>
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Inversor</DialogTitle>
                        <DialogDescription>
                            Actualiza la información del inversor.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Nombre Completo</Label>
                            <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Juan Pérez"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 305 123 4567"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email (No editable)</Label>
                            <Input value={selectedInvestor?.email || ""} disabled />
                        </div>
                    </div>
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
        </div>
    )
}
