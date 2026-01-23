import { Zap, Globe, Lock, Smartphone } from "lucide-react"

export function BenefitsSection() {
    const benefits = [
        {
            icon: Globe,
            title: "Ingresos en Dólares",
            description: "Protege tu capital invirtiendo en una economía estable y generando flujo de caja en moneda fuerte."
        },
        {
            icon: Lock,
            title: "Activo Real a tu Nombre",
            description: "El vehículo y la empresa son 100% de tu propiedad. Nosotros somos solo tus administradores operativos."
        },
        {
            icon: Smartphone,
            title: "Control Total en la App",
            description: "Monitorea el estado de tu flota, mantenimientos y ganancias en tiempo real desde nuestro panel de inversor."
        },
        {
            icon: Zap,
            title: "Gestión Sin Estrés",
            description: "Olvídate de clientes, seguros o mecánicos. Nuestro equipo se encarga de toda la operativa diaria."
        }
    ]

    return (
        <section id="beneficios" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                            Por qué elegirnos
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Inversión Pasiva, <br />
                            <span className="text-muted-foreground">Tecnología Activa.</span>
                        </h2>
                        <p className="text-lg text-muted-foreground mb-8 text-pretty">
                            Combinamos la seguridad de los bienes raíces con la agilidad del alquiler de autos.
                            Nuestra plataforma tecnológica te da transparencia total sobre tu negocio en Miami.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="p-6 rounded-2xl border border-border bg-card shadow-sm">
                                <benefit.icon className="h-8 w-8 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
