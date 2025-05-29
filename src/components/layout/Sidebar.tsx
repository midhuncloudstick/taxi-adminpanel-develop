
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Car, 
  DollarSign, 
  History, 
  List, 
  Mail, 
  Menu, 
  Search, 
  Settings, 
  Users, 
  X 
} from "lucide-react";

interface SidebarLinkProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarLink = ({ icon: Icon, label, to, isActive, isCollapsed }: SidebarLinkProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 font-normal py-2 px-3 h-12",
          isActive ? "bg-taxi-teal/10 text-taxi-teal" : "hover:bg-slate-100",
          isCollapsed && "justify-center px-0"
        )}
      >
        <Icon size={20} />
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const links = [
    { icon: List, label: "Bookings", to: "/" },
    { icon: Car, label: "Fleet", to: "/fleet" },
    { icon: DollarSign, label: "Pricing", to: "/pricing" },
    { icon: Users, label: "Customers", to: "/customers" },
    { icon: Settings, label: "Drivers", to: "/drivers" },
    { icon: History, label: "History", to: "/history" },
    { icon: Mail, label: "Message", to: "/message" },
   
  ];

  return (
    <div
      className={cn(
        "h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Calendar className="text-taxi-teal" size={24} />
            <span className="font-bold text-lg text-taxi-blue">Brisbane Taxi</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto text-gray-500"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            icon={link.icon}
            label={link.label}
            to={link.to}
            isActive={location.pathname === link.to}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-taxi-teal text-white flex items-center justify-center">
              <span className="text-sm font-medium">BT</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@brisbanetaxi.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
