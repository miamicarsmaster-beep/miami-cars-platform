"use client"

import { useState } from "react"
import { FinancialRecord, Vehicle } from "@/types/database"
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
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface FinancialTableProps {
    records: FinancialRecord[]
    vehicles: Vehicle[]
}

export function FinancialTable({ records: initialRecords, vehicles }: FinancialTableProps) {
    const [records, setRecords] = useState(initialRecords)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const [formData, setFormData] = useState({
        vehicle_id: "",
        type: "expense" as FinancialRecord["type"],
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        description: "",
    })

    const resetForm = () => {
        setFormData({
            vehicle_id: "",
            type: "expense",
            category: "",
            amount: "",
            date: new Date().toISOString().split('T')[0],
            description: "",
        })
    }

    const handleAdd = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase
                .from("financial_records")
                .insert([{
                    ...formData,
                    amount: Number(formData.amount),
                }])
                .select(`
          *,
          vehicle:vehicles(id, make, model, year, license_plate)
        `)
                .single()

            if (error) throw error

            setRecords([data, ...records])
            setIsAddOpen(false)
            resetForm()
            router.refresh()
        } catch (error) {
            console.error("Error adding financial record:", error)
            alert("Error al agregar registro financiero")
        } finally {
            setIsLoading(false)
        }
    }

    const getTypeBadge = (type: FinancialRecord["type"]) => {
        if (type === "income") {
            return (
                <Badge className="bg-emerald-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Ingreso
                </Badge>
            )
        }
        return (
            <Badge className="bg-red-500">
                <TrendingDown className="h-3 w-3 mr-1" />
                Gasto
            </Badge>
        )
    }

    const getTotals = () => {
        const income = records.filter(r => r.type === 'income').reduce((sum, r) => sum + Number(r.amount), 0)
        const expenses = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + Number(r.amount), 0)
        return { income, expenses, net: income - expenses }
    }

    const totals = getTotals()

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-emerald-50 dark:bg-emerald-950/20">
                    <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-emerald-600">${totals.income.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950/20">
                    <p className="text-sm text-muted-foreground">Gastos Totales</p>
                    <p className="text-2xl font-bold text-red-600">${totals.expenses.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-sm text-muted-foreground">Balance Neto</p>
                    <p className="text-2xl font-bold text-blue-600">${totals.net.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Registros Financieros ({records.length})</h3>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="mr-2 h-4 w-4" /> Registrar Transacción
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Transacción</DialogTitle>
                            <DialogDescription>
                                Agrega un ingreso o gasto a la flota.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="vehicle">Vehículo *</Label>
                                <Select value={formData.vehicle_id} onValueChange={(value) => setFormData({ ...formData, vehicle_id: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar vehículo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehicles.map((v) => (
                                            <SelectItem key={v.id} value={v.id}>
                                                {v.year} {v.make} {v.model} ({v.license_plate || v.vin})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo *</Label>
                                    <Select value={formData.type} onValueChange={(value: FinancialRecord["type"]) => setFormData({ ...formData, type: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="income">Ingreso</SelectItem>
                                            <SelectItem value="expense">Gasto</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Monto ($) *</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        placeholder="1200.00"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Categoría *</Label>
                                    <Input
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Renta Mensual, Mantenimiento, etc"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Fecha *</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Detalles adicionales..."
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleAdd}
                                disabled={isLoading || !formData.vehicle_id || !formData.amount || !formData.category}
                            >
                                {isLoading ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Vehículo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Descripción</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                    No hay registros financieros
                                </TableCell>
                            </TableRow>
                        ) : (
                            records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="font-medium">
                                        {record.vehicle?.year} {record.vehicle?.make} {record.vehicle?.model}
                                    </TableCell>
                                    <TableCell>{getTypeBadge(record.type)}</TableCell>
                                    <TableCell>{record.category}</TableCell>
                                    <TableCell className="max-w-xs truncate">{record.description || "—"}</TableCell>
                                    <TableCell className={`text-right font-semibold ${record.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {record.type === 'income' ? '+' : '-'}${Number(record.amount).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
