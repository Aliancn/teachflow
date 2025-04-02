"use client";
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { useDashboardStore } from '@/lib/stores/dashboardStore';

export default function DashboardPage() {
  const { features } = useDashboardStore();

  return (
    <div className="min-h-screen px-4 pt-24">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-12 text-3xl font-bold text-slate-800">教学功能中心</h1>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.path}
              className="transition-transform hover:scale-105 duration-300"
            >
              <Card
                shadow="lg"
                padding="lg"
                className="h-full cursor-pointer border-2 border-purple-50 bg-gradient-to-b from-purple-50 to-white hover:border-purple-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex h-full flex-col items-center space-y-4 p-6 text-center">
                  <feature.icon className="h-12 w-12 text-purple-500" />
                  <h3 className="text-xl font-semibold text-slate-800">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}