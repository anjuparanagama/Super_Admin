import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  trendPositive?: boolean
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  trendPositive = true,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm hover:border-slate-700/80 transition-all flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`font-semibold ${
                  trendPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend}
              </span>
            )}
            {subtitle && <span className="text-slate-400">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
