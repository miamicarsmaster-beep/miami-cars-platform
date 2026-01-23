import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, TrendingUp, CarFront } from "lucide-react"

export function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-background">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -px-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-6 border border-border/50">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                    Plataforma de Inversión Segura en Miami
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto">
                    Gestionamos tu flota, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
                        tú te capitalizas.
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Inversión estratégica en autos de alquiler en Miami.
                    Nos ocupamos de todo el proceso: desde la creación de tu LLC
                    hasta la compra y administración completa de tu vehículo.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link href="#contacto">
                        <Button size="lg" className="h-12 px-8 text-base shadow-xl shadow-primary/20 rounded-full">
                            Comenzar Inversión <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#como-funciona">
                        <Button variant="ghost" size="lg" className="h-12 px-8 text-base rounded-full hover:bg-secondary/50">
                            Ver cómo funciona
                        </Button>
                    </Link>
                </div>

                {/* Stats / Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
                    <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Estructura Legal</h3>
                        <p className="text-sm text-muted-foreground">Gestionamos la creación de tu LLC y cuenta bancaria en USA.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CarFront className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Flota Premium</h3>
                        <p className="text-sm text-muted-foreground">Adquisición estratégica de vehículos de alta rentabilidad.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <TrendingUp className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Rendición Transparente</h3>
                        <p className="text-sm text-muted-foreground">Reportes mensuales detallados con comprobantes y fotos.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
