
import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="py-4 px-6 border-b border-gray-200 bg-white flex flex-col sm:flex-row justify-between gap-4">
      <h1 className="text-2xl font-bold text-taxi-blue">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className={cn("relative flex items-center", "w-full sm:w-auto")}>
          <Search className="absolute left-3 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 text-sm bg-slate-50 border-slate-200 focus:ring-taxi-teal"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-taxi-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
    </div>
  );
}
