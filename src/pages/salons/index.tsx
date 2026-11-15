import React, { useEffect, useState } from 'react'
import {
  AlertCircle,
  Check,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Sparkles,
  Store,
  Users,
} from 'lucide-react'
import { Modal } from '../../components/ui/modal.tsx'
import type { PricingPlan } from '../../interface/plan.types.ts'
import type { SuperAdminSalon } from '../../interface/salon.types.ts'
import { plansService } from '../../services/plans.service.ts'
import { salonsService } from '../../services/salons.service.ts'

export const SalonsPage: React.FC = () => {
  const [salons, setSalons] = useState<SuperAdminSalon[]>([])
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Assign plan modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedSalon, setSelectedSalon] = useState<SuperAdminSalon | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [submitting, setSubmitting] = useState(false)

  const [reloadKey, setReloadKey] = useState<number>(0)

  useEffect(() => {
    let active = true
    Promise.all([
      salonsService.getSalons(searchTerm.trim() || undefined),
      plansService.getPlans(true),
    ])
      .then(([salonsRes, plansRes]) => {
        if (active) {
          setSalons(salonsRes.items)
          setPlans(plansRes)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to fetch salons directory.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [searchTerm, reloadKey])

  const triggerReload = () => {
    setLoading(true)
    setReloadKey((k) => k + 1)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearchTerm(search)
  }

  const handleOpenAssign = (salon: SuperAdminSalon) => {
    setSelectedSalon(salon)
    const matchingPlan = plans.find((p) => p.name === salon.current_plan_name)
    setSelectedPlanId(matchingPlan ? matchingPlan.id : (plans[0]?.id || ''))
    setBillingCycle((salon.billing_cycle as 'monthly' | 'yearly') || 'monthly')
    setIsAssignModalOpen(true)
  }

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSalon || !selectedPlanId) return

    setSubmitting(true)
    setError(null)

    try {
      const res = await salonsService.assignSalonPlan(selectedSalon.id, {
        plan_id: selectedPlanId,
        billing_cycle: billingCycle,
        status: 'active',
        auto_renew: true,
      })
      setSuccessMsg(res.message)
      setIsAssignModalOpen(false)
      triggerReload()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to assign subscription plan.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Salons & Tenant Directory</h2>
          <p className="text-xs text-slate-400 mt-1">
            Registered salon businesses, account owners, active staff sizes, and SaaS subscription assignments.
          </p>
        </div>

        <button
          onClick={triggerReload}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-300">
            Dismiss
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-emerald-300">
            Dismiss
          </button>
        </div>
      )}

      {/* Search Toolbar */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search salon name, email, or telephone number..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
        />
      </form>

      {/* Salons Table */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        {loading && salons.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <span className="text-xs font-mono">Fetching salon directory...</span>
          </div>
        ) : salons.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No salon accounts found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Salon Business</th>
                  <th className="py-3.5 px-4">Owner / Contact</th>
                  <th className="py-3.5 px-4">Location / Address</th>
                  <th className="py-3.5 px-4">Staff Count</th>
                  <th className="py-3.5 px-4">Current Plan</th>
                  <th className="py-3.5 px-4">Subscription</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {salons.map((salon) => (
                  <tr key={salon.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Salon Name & Slug */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100">{salon.name}</div>
                          <div className="text-[11px] font-mono text-slate-400">
                            /{salon.slug || 'default'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Owner / Contact */}
                    <td className="py-4 px-4">
                      <div className="text-slate-200 font-medium">{salon.owner_name || 'Admin'}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{salon.email || salon.owner_email || 'No email registered'}</span>
                      </div>
                      {salon.phone && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{salon.phone}</span>
                        </div>
                      )}
                    </td>

                    {/* Address */}
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex items-start gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span className="truncate">{salon.address || 'Sri Lanka'}</span>
                      </div>
                    </td>

                    {/* Staff Count */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-200 font-medium">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{salon.staff_count} active staff</span>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-4">
                      {salon.current_plan_name ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            <Sparkles className="w-2.5 h-2.5" />
                            {salon.current_plan_name}
                          </span>
                          <div className="text-[10px] text-slate-400 capitalize mt-0.5">
                            {salon.billing_cycle || 'monthly'} billing
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">No Plan Assigned</span>
                      )}
                    </td>

                    {/* Subscription Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase font-mono ${
                          salon.subscription_status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                        }`}
                      >
                        {salon.subscription_status || 'NONE'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleOpenAssign(salon)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Assign Plan</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ASSIGN PLAN MODAL */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Assign SaaS Subscription Plan"
        subtitle={`Tenant: ${selectedSalon?.name}`}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAssignSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Select Pricing Plan Tier
            </label>
            <div className="space-y-2">
              {plans.map((p) => (
                <label
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedPlanId === p.id
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="plan_choice"
                      checked={selectedPlanId === p.id}
                      onChange={() => setSelectedPlanId(p.id)}
                      className="text-indigo-600"
                    />
                    <div>
                      <div className="text-xs font-semibold">{p.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {p.max_branches} branch(es) · up to {p.max_staff} staff
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-right font-mono">
                    LKR {Number(p.price_monthly).toLocaleString()}
                    <span className="text-[10px] text-slate-400 font-normal"> /mo</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Billing Cycle</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                Yearly Billing (Discounted)
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedPlanId}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Assigning...' : 'Confirm Subscription'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
