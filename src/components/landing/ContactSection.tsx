import { Button } from "@/components/ui/button"
import { Send, Mail } from "lucide-react"

export function ContactSection() {
    return (
        <section id="contacto" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">¿Listo para Capitalizarte?</h2>
                <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10">
                    Agenda una asesoría gratuita con nuestro equipo para analizar tu perfil de inversor y
                    explicarte los siguientes pasos.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" variant="secondary" className="h-14 px-8 text-base font-semibold w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
                        <Send className="mr-2 h-4 w-4" /> Contactar por WhatsApp
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold w-full sm:w-auto bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                        <Mail className="mr-2 h-4 w-4" /> Enviar Email
                    </Button>
                </div>
            </div>
        </section>
    )
}
