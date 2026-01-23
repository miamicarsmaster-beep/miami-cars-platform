import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold tracking-tighter text-foreground">
                        MIAMI<span className="text-primary">CARS</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <Link href="#como-funciona" className="hover:text-primary transition-colors">
                        Cómo funciona
                    </Link>
                    <Link href="#beneficios" className="hover:text-primary transition-colors">
                        Beneficios
                    </Link>
                    <Link href="#contacto" className="hover:text-primary transition-colors">
                        Contacto
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="outline" className="hidden sm:flex border-primary/20 hover:bg-primary/5 hover:text-primary">
                            Area Inversor
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button className="font-semibold shadow-lg shadow-primary/20">
                            Iniciar Sesión
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
