"use client";

import React from "react";

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface NavigationTabsProps {
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

const tabs: Tab[] = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "settlements", label: "Settlements", icon: "💰" },
  { id: "management", label: "Management", icon: "⚙️" },
];

export default function NavigationTabs({
  activeTab,
  onActiveTabChange,
}: NavigationTabsProps) {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onActiveTabChange(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-violet-500 text-violet-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
