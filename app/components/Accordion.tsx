import type { ReactNode } from "react";
import { createContext, useContext, useId, useState } from "react";
import { cn } from "~/utils";

interface AccordionContextType {
  activeItems: string[];
  toggleItem: (id: string) => void;
  isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(undefined);

const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion components must be used within an Accordion");
  return context;
};

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion = ({
  children,
  defaultOpen,
  allowMultiple = false,
  className = "",
}: AccordionProps) => {
  const [activeItems, setActiveItems] = useState<string[]>(defaultOpen ? [defaultOpen] : []);

  const toggleItem = (id: string) => {
    setActiveItems((prev) => {
      if (allowMultiple) {
        return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      }
      return prev.includes(id) ? [] : [id];
    });
  };

  const isItemActive = (id: string) => activeItems.includes(id);

  return (
    <AccordionContext.Provider value={{ activeItems, toggleItem, isItemActive }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export const AccordionItem = ({ id, children, className = "" }: AccordionItemProps) => (
  <div className={cn("overflow-hidden border-b border-gray-100", className)} data-item-id={id}>
    {children}
  </div>
);

interface AccordionHeaderProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionHeader = ({ itemId, children, className = "" }: AccordionHeaderProps) => {
  const { toggleItem, isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);
  const panelId = `accordion-panel-${itemId}`;

  return (
    <button
      type="button"
      onClick={() => toggleItem(itemId)}
      aria-expanded={isActive}
      aria-controls={panelId}
      className={cn(
        "w-full px-4 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 rounded-lg",
        "transition-colors duration-200 flex items-center justify-between cursor-pointer",
        className
      )}
    >
      <div className="flex items-center space-x-3 flex-1">{children}</div>
      <svg
        className={cn("w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-2", {
          "rotate-180": isActive,
        })}
        fill="none"
        stroke="#98A2B3"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

interface AccordionContentProps {
  itemId: string;
  children: ReactNode;
  className?: string;
}

export const AccordionContent = ({ itemId, children, className = "" }: AccordionContentProps) => {
  const { isItemActive } = useAccordion();
  const isActive = isItemActive(itemId);
  const panelId = `accordion-panel-${itemId}`;

  return (
    <div
      id={panelId}
      role="region"
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      <div className="px-4 py-3">{children}</div>
    </div>
  );
};
