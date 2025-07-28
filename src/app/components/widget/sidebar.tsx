"use client";

interface SidebarProps {
  selectedWidget: string;
  setSelectedWidget: (widget: string) => void;
}

export default function Sidebar({ selectedWidget, setSelectedWidget }: SidebarProps) {
  const widgetItems = ["Weather", "Analytics", "Dashboard"];

  const setWidgetItem = (index: number) => {
    const newItem = widgetItems[index];
    if (newItem) {
      setSelectedWidget(newItem);
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 border-r border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-foreground mb-6">Dashboard</h3>
      <ul className="space-y-2">
        {widgetItems.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => setWidgetItem(index)}
              className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                item === selectedWidget 
                  ? "bg-primary text-white font-medium shadow-md" 
                  : "bg-gray-50 dark:bg-gray-700 text-foreground hover:bg-gray-100 dark:hover:bg-gray-600"
              }`}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
