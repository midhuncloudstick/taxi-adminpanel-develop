
import { ReactNode } from "react";
import { Header } from "./Header";

interface PageContainerProps {
  children: ReactNode;
  title: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <Header title={title} />
      <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
        {children}
      </div>
    </div>
  );
}
