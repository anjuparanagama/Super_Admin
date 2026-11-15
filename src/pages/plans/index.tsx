import React, { useEffect, useState } from 'react'
import {
  AlertCircle,
  Check,
  Edit2,
  Layers,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { Modal } from '../../components/ui/modal.tsx'
import type {
  PricingPlan,
  PricingPlanCreatePayload,
  PricingPlanUpdatePayload,
} from '../../interface/plan.types.ts'
import { plansService } from '../../services/plans.service.ts'

export const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null)

  // Form states
  const [formName, setFormName] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formMonthly, setFormMonthly] = useState<number>(0)
  const [formYearly, setFormYearly] = useState<number>(0)
  const [formBranches, setFormBranches] = useState<number>(1)
  const [formStaff, setFormStaff] = useState<number>(5)
  const [formServices, setFormServices] = useState<number>(50)
  const [formFeaturesText, setFormFeaturesText] = useState('')
  const [formIsActive, setFormIsActive] = useState(true)
  const [formIsPopular, setFormIsPopular] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reloadKey, setReloadKey] = useState<number>(0)

  useEffect(() => {
    let active = true
    plansService
      .getPlans()
      .then((data) => {
        if (active) {
          setPlans(data)
          setError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to fetch pricing plans.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadKey])

  const triggerReload = () => {
    setLoading(true)
    setReloadKey((k) => k + 1)
  }

  const resetForm = () => {
    setFormName('')
    setFormCode('')
    setFormDesc('')
    setFormMonthly(0)
    setFormYearly(0)
    setFormBranches(1)
    setFormStaff(5)
    setFormServices(50)
    setFormFeaturesText('')
    setFormIsActive(true)
    setFormIsPopular(false)
    setSelectedPlan(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setIsCreateOpen(true)
  }

  const handleOpenEdit = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setFormName(plan.name)
    setFormCode(plan.code)
    setFormDesc(plan.description || '')
    setFormMonthly(plan.price_monthly)
    setFormYearly(plan.price_yearly)
    setFormBranches(plan.max_branches)
    setFormStaff(plan.max_staff)
    setFormServices(plan.max_services)
    setFormFeaturesText((plan.features || []).join('\n'))
    setFormIsActive(plan.is_active)
    setFormIsPopular(plan.is_popular)
    setIsEditOpen(true)
  }

  const handleOpenDelete = (plan: PricingPlan) => {
    setSelectedPlan(plan)
    setIsDeleteOpen(true)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const featuresList = formFeaturesText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    const payload: PricingPlanCreatePayload = {
      name: formName.trim(),
      code: formCode.trim().toLowerCase(),
      description: formDesc.trim() || undefined,
      price_monthly: Number(formMonthly),
      price_yearly: Number(formYearly),
      currency: 'LKR',
      max_branches: Number(formBranches),
      max_staff: Number(formStaff),
      max_services: Number(formServices),
      features: featuresList,
      is_active: formIsActive,
      is_popular: formIsPopular,
    }

    try {
      await plansService.createPlan(payload)
      setSuccessMsg(`Plan '${formName}' created successfully!`)
      setIsCreateOpen(false)
      triggerReload()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create plan.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPlan) return

    setSubmitting(true)
    setError(null)

    const featuresList = formFeaturesText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    const payload: PricingPlanUpdatePayload = {
      name: formName.trim(),
      code: formCode.trim().toLowerCase(),
      description: formDesc.trim() || undefined,
      price_monthly: Number(formMonthly),
      price_yearly: Number(formYearly),
      max_branches: Number(formBranches),
      max_staff: Number(formStaff),
      max_services: Number(formServices),
      features: featuresList,
      is_active: formIsActive,
      is_popular: formIsPopular,
    }

    try {
      await plansService.updatePlan(selectedPlan.id, payload)
      setSuccessMsg(`Plan '${formName}' updated successfully!`)
      setIsEditOpen(false)
      triggerReload()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to update plan.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedPlan) return
    setSubmitting(true)
    setError(null)

    try {
      await plansService.deletePlan(selectedPlan.id)
      setSuccessMsg(`Plan '${selectedPlan.name}' deleted successfully!`)
      setIsDeleteOpen(false)
      triggerReload()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to delete plan.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (plan: PricingPlan) => {
    try {
      await plansService.togglePlanStatus(plan.id, { is_active: !plan.is_active })
      setPlans((prev) =>
        prev.map((p) => (p.id === plan.id ? { ...p, is_active: !p.is_active } : p))
      )
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      }
    }
  }

  const formatPrice = (val: number) => {
    return `LKR ${Number(val).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">SaaS Pricing Plans</h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure subscription tiers, monthly and yearly rates, quotas, and feature flags available to salon owners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerReload}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>
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

      {/* Plan Cards Grid */}
      {loading && plans.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center gap-2 text-slate-400">
          <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
          <span className="text-xs font-mono">Loading pricing plans...</span>
        </div>
      ) : plans.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">No Pricing Plans Configured</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Get started by creating your first subscription tier (e.g. Starter, Professional, or Enterprise).
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Plan</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                plan.is_popular
                  ? 'bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900 border-indigo-500/50 shadow-xl shadow-indigo-500/10'
                  : 'bg-slate-900/90 border-slate-800 shadow-sm'
              }`}
            >
              <div>
                {/* Badges Bar */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-semibold uppercase text-slate-400">
                    CODE: {plan.code}
                  </span>
                  <div className="flex items-center gap-2">
                    {plan.is_popular && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Popular
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleActive(plan)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer transition-colors ${
                        plan.is_active
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60 hover:bg-slate-700'
                      }`}
                    >
                      {plan.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                {/* Plan Name & Desc */}
                <h3 className="text-lg font-bold text-white tracking-tight">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[32px]">
                  {plan.description || 'General commercial salon subscription tier.'}
                </p>

                {/* Pricing Block */}
                <div className="mt-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-white tracking-tight">
                      {formatPrice(plan.price_monthly)}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Yearly: {formatPrice(plan.price_yearly)} / year
                  </div>
                </div>

                {/* Quotas */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="font-bold text-white">{plan.max_branches}</div>
                    <div className="text-[10px] text-slate-400">Branches</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="font-bold text-white">{plan.max_staff}</div>
                    <div className="text-[10px] text-slate-400">Staff Limit</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-800/40 border border-slate-800">
                    <div className="font-bold text-white">{plan.max_services}</div>
                    <div className="text-[10px] text-slate-400">Services</div>
                  </div>
                </div>

                {/* Features list */}
                <div className="mt-5 space-y-2">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Included Features
                  </span>
                  {plan.features && plan.features.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {plan.features.slice(0, 5).map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                      {plan.features.length > 5 && (
                        <li className="text-[11px] text-slate-400 italic">
                          +{plan.features.length - 5} more features
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div className="text-xs text-slate-400 italic">No specific features listed.</div>
                  )}
                </div>
              </div>

              {/* Bottom Actions & Subscriber Count */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {plan.subscriber_count} subscriber{plan.subscriber_count !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(plan)}
                    title="Edit Plan"
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(plan)}
                    title="Delete Plan"
                    className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New SaaS Pricing Tier"
        subtitle="Define new commercial plan for salons"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Plan Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Professional Growth"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Unique Code (Slug)
              </label>
              <input
                type="text"
                required
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                placeholder="e.g. pro-growth"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <input
              type="text"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Short tagline or summary for this tier"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Price (LKR)</label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={formMonthly}
                onChange={(e) => setFormMonthly(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Yearly Price (LKR)</label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={formYearly}
                onChange={(e) => setFormYearly(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Max Branches</label>
              <input
                type="number"
                min="1"
                required
                value={formBranches}
                onChange={(e) => setFormBranches(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Max Staff Limit</label>
              <input
                type="number"
                min="1"
                required
                value={formStaff}
                onChange={(e) => setFormStaff(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Max Services</label>
              <input
                type="number"
                min="1"
                required
                value={formServices}
                onChange={(e) => setFormServices(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Features (One per line)
            </label>
            <textarea
              rows={4}
              value={formFeaturesText}
              onChange={(e) => setFormFeaturesText(e.target.value)}
              placeholder="Multi-Branch Management&#10;WhatsApp Digital Receipt&#10;Inventory Tracking&#10;Commission Analytics"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0"
              />
              <span>Plan is Active (Available for purchase)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={formIsPopular}
                onChange={(e) => setFormIsPopular(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0"
              />
              <span>Highlight as "Popular"</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Plan: ${selectedPlan?.name}`}
        subtitle="Modify pricing, quotas, and feature flags"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Plan Name</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Unique Code (Slug)
              </label>
              <input
                type="text"
                required
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <input
              type="text"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Price (LKR)</label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={formMonthly}
                onChange={(e) => setFormMonthly(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Yearly Price (LKR)</label>
              <input
                type="number"
                min="0"
                step="500"
                required
                value={formYearly}
                onChange={(e) => setFormYearly(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Max Branches</label>
              <input
                type="number"
                min="1"
                required
                value={formBranches}
                onChange={(e) => setFormBranches(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Max Staff Limit</label>
              <input
                type="number"
                min="1"
                required
                value={formStaff}
                onChange={(e) => setFormStaff(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Max Services</label>
              <input
                type="number"
                min="1"
                required
                value={formServices}
                onChange={(e) => setFormServices(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Features (One per line)
            </label>
            <textarea
              rows={4}
              value={formFeaturesText}
              onChange={(e) => setFormFeaturesText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={formIsActive}
                onChange={(e) => setFormIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0"
              />
              <span>Plan is Active</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
              <input
                type="checkbox"
                checked={formIsPopular}
                onChange={(e) => setFormIsPopular(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-700 focus:ring-0"
              />
              <span>Popular Tag</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Plan Deletion"
        subtitle="Permanent removal of plan template"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed">
            Are you sure you want to permanently delete plan{' '}
            <strong className="text-white">"{selectedPlan?.name}"</strong>?
          </p>

          {selectedPlan && selectedPlan.subscriber_count > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
              ⚠️ Warning: This plan currently has{' '}
              <strong>{selectedPlan.subscriber_count} active subscriber(s)</strong>. The system will
              prevent deletion while active subscriptions exist. Please deactivate instead.
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
