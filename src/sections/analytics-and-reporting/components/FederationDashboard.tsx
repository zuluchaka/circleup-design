import type { FederationDashboardProps, AssociationBenchmark, RegionalBreakdown } from '@/../product/sections/analytics-and-reporting/types'
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  CircleDot,
  Download,
  Wallet,
  MapPin,
  BarChart3,
  Shield,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Globe
} from 'lucide-react'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(amount)
}

function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `CHF ${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `CHF ${(amount / 1000).toFixed(0)}K`
  }
  return formatCurrency(amount)
}

function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  iconColor = 'text-indigo-500',
  iconBg = 'bg-indigo-100 dark:bg-indigo-900/30'
}: {
  icon: typeof Users
  label: string
  value: string | number
  subValue?: string
  trend?: number
  iconColor?: string
  iconBg?: string
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
            trend > 0
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : trend < 0
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
          }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : null}
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      {subValue && (
        <p className="text-xs text-slate-400 mt-1">{subValue}</p>
      )}
    </div>
  )
}

function RegionalCard({ region, onView }: { region: RegionalBreakdown; onView?: () => void }) {
  return (
    <button
      onClick={onView}
      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md transition-all group text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 transition-colors">
            <MapPin className="w-4 h-4 text-slate-500 group-hover:text-indigo-500 transition-colors" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {region.region}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {region.associations} associations
            </p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
        <div>
          <p className="text-xs text-slate-400">Members</p>
          <p className="font-semibold text-slate-900 dark:text-white">{region.members.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Funds</p>
          <p className="font-semibold text-slate-900 dark:text-white">{formatCompactCurrency(region.fundsUnderManagement)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Collection</p>
          <p className={`font-semibold ${region.collectionRate >= 95 ? 'text-emerald-600' : region.collectionRate >= 90 ? 'text-amber-600' : 'text-red-600'}`}>
            {region.collectionRate}%
          </p>
        </div>
      </div>
    </button>
  )
}

function BenchmarkRow({ benchmark, rank, onView }: { benchmark: AssociationBenchmark; rank: number; onView?: () => void }) {
  return (
    <tr
      className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
      onClick={onView}
    >
      <td className="px-4 py-3">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
          rank === 1
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            : rank === 2
            ? 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
            : rank === 3
            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
        }`}>
          {rank}
        </div>
      </td>
      <td className="px-4 py-3">
        <div>
          <p className="font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {benchmark.associationName}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{benchmark.region}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-sm text-slate-600 dark:text-slate-300">{benchmark.members}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-sm text-slate-600 dark:text-slate-300">{benchmark.circles}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`text-sm font-medium ${
          benchmark.collectionRate >= 98 ? 'text-emerald-600' : benchmark.collectionRate >= 95 ? 'text-slate-600 dark:text-slate-300' : 'text-amber-600'
        }`}>
          {benchmark.collectionRate}%
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`text-sm font-medium ${
          benchmark.onTimeRate >= 95 ? 'text-emerald-600' : benchmark.onTimeRate >= 90 ? 'text-slate-600 dark:text-slate-300' : 'text-amber-600'
        }`}>
          {benchmark.onTimeRate}%
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`text-sm font-medium ${
          benchmark.defaultRate <= 1 ? 'text-emerald-600' : benchmark.defaultRate <= 3 ? 'text-slate-600 dark:text-slate-300' : 'text-red-600'
        }`}>
          {benchmark.defaultRate}%
        </span>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <div className="w-12 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                benchmark.engagementScore >= 85 ? 'bg-emerald-500' : benchmark.engagementScore >= 70 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${benchmark.engagementScore}%` }}
            />
          </div>
          <span className="text-xs text-slate-500 w-8">{benchmark.engagementScore}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <span className={`text-sm font-medium ${
          benchmark.kycCompletionRate >= 95 ? 'text-emerald-600' : benchmark.kycCompletionRate >= 80 ? 'text-amber-600' : 'text-red-600'
        }`}>
          {benchmark.kycCompletionRate}%
        </span>
      </td>
    </tr>
  )
}

export function FederationDashboard({
  metrics,
  benchmarks,
  onViewAssociation,
  onExportReport,
  onViewComplianceDetails
}: FederationDashboardProps) {
  const sortedBenchmarks = [...benchmarks].sort((a, b) => a.rank - b.rank)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {metrics.federationName}
              </h1>
              <p className="text-slate-500 dark:text-slate-400">
                Federation-wide Analytics
              </p>
            </div>
          </div>
          <button
            onClick={() => onExportReport?.('pdf')}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Building2}
            label="Total Associations"
            value={metrics.totalAssociations}
            trend={metrics.growthTrends.associationGrowthRate}
            iconColor="text-indigo-500"
            iconBg="bg-indigo-100 dark:bg-indigo-900/30"
          />
          <StatCard
            icon={CircleDot}
            label="Total Circles"
            value={metrics.totalCircles.toLocaleString()}
            iconColor="text-emerald-500"
            iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <StatCard
            icon={Users}
            label="Total Members"
            value={metrics.totalMembers.toLocaleString()}
            trend={metrics.growthTrends.memberGrowthRate}
            iconColor="text-amber-500"
            iconBg="bg-amber-100 dark:bg-amber-900/30"
          />
          <StatCard
            icon={Wallet}
            label="Funds Under Management"
            value={formatCompactCurrency(metrics.totalFundsUnderManagement)}
            trend={metrics.growthTrends.fundsGrowthRate}
            iconColor="text-purple-500"
            iconBg="bg-purple-100 dark:bg-purple-900/30"
          />
        </div>

        {/* Performance + Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Performance Metrics */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Performance Overview
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Federation-wide metrics</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Collection Rate</p>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {metrics.averageCollectionRate}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Default Rate</p>
                <p className={`text-2xl font-bold ${
                  metrics.averageDefaultRate <= 2 ? 'text-emerald-600' : metrics.averageDefaultRate <= 4 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {metrics.averageDefaultRate}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1">KYC Completion</p>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                  {metrics.kycCompletionRate}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">Contributions (2025)</p>
                <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {formatCompactCurrency(metrics.totalContributionsThisYear)}
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Status */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Compliance
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Association status</p>
                </div>
              </div>
              <button
                onClick={onViewComplianceDetails}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                Details
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Fully Compliant</span>
                </div>
                <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                  {metrics.complianceStatus.associationsFullyCompliant}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Pending Review</span>
                </div>
                <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {metrics.complianceStatus.associationsPendingReview}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">Requires Action</span>
                </div>
                <span className="text-xl font-bold text-red-700 dark:text-red-300">
                  {metrics.complianceStatus.associationsRequiringAction}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <MapPin className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Regional Performance
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Breakdown by region</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.regionalBreakdown.map(region => (
              <RegionalCard key={region.region} region={region} />
            ))}
          </div>
        </div>

        {/* Association Benchmarks Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Building2 className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Association Benchmarks
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ranked by overall performance</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Association
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Circles
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Collection
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    On-Time
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Default
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    KYC
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {sortedBenchmarks.map((benchmark, index) => (
                  <BenchmarkRow
                    key={benchmark.associationId}
                    benchmark={benchmark}
                    rank={index + 1}
                    onView={() => onViewAssociation?.(benchmark.associationId)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
