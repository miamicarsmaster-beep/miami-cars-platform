import { Button } from "@/components/ui/button"
import { Bell, Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
    return (
        <div className="border-b bg-background/95 backdrop-blur z-30 flex items-center h-16 px-6 gap-4 sticky top-0">
            <div className="hidden md:flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-md w-full max-w-md">
                <Search className="w-4 h-4" />
                <Input
                    placeholder="Buscar inversor, vehículo o contrato..."
                    className="border-none shadow-none focus-visible:ring-0 bg-transparent h-auto p-0 placeholder:text-muted-foreground/70"
                />
            </div>

            <div className="ml-auto flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 border-2 border-background"></span>
                </Button>

                <div className="flex items-center gap-2 border-l pl-4 border-border/50">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none">Administrador</p>
                        <p className="text-xs text-muted-foreground">admin@miamicars.com</p>
                    </div>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}
