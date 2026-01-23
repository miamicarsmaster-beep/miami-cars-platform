import { FileText, Building2, Car, BadgeDollarSign } from "lucide-react"

export function ProcessSection() {
    const steps = [
        {
            icon: Building2,
            title: "1. Estructura Legal",
            description: "Creamos tu LLC en Florida y tramitamos tu EIN para que operes legalmente como empresa en USA."
        },
        {
            icon: FileText,
            title: "2. Cuenta Bancaria",
            description: "Gestionamos la apertura de tu cuenta bancaria corporativa donde recibirás tus ganancias."
        },
        {
            icon: Car,
            title: "3. Adquisición de Flota",
            description: "Compramos vehículos estratégicos o incorporamos tu auto existente a nuestra flota de alquiler."
        },
        {
            icon: BadgeDollarSign,
            title: "4. Gestión y Ganancias",
            description: "Administramos el alquiler, mantenimiento y seguro. Tú recibes reportes y rendimientos mensuales."
        }
    ]

    return (
        <section id="como-funciona" className="py-24 bg-secondary/30 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Tu Camino a la Rentabilidad</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Un proceso simplificado de 4 pasos para comenzar a facturar en dólares.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-6 bg-background rounded-2xl shadow-sm border border-border/50 hover:border-primary/50 transition-colors group">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <step.icon className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
