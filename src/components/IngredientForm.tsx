import React from 'react'
import { FormInput, DebateStyle } from '../types'

interface Props {
  onSubmit: (v: FormInput) => void
  loading: boolean
  canGenerate?: boolean
  hideButton?: boolean
  onNextStep?: () => void
}

const MAX_INGREDIENT_TEXT = 280
const COOLDOWN_SECONDS = 10

const IngredientForm = React.forwardRef<HTMLFormElement, Props>(
  ({ onSubmit, loading, canGenerate = true, hideButton = false, onNextStep }, ref) => {
    const [ingredients, setIngredients] = React.useState('')
    const [mealType, setMealType] = React.useState('Any')
    const [timeAvailable, setTimeAvailable] = React.useState('30 minutes')
    const [preference, setPreference] = React.useState('Balanced')
    const [servings, setServings] = React.useState(2)
    const [debateStyle, setDebateStyle] = React.useState<DebateStyle>('concise')
    const [cooldown, setCooldown] = React.useState(0)
    const [warning, setWarning] = React.useState('')

  React.useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => setCooldown((prev) => Math.max(prev - 1, 0)), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (cooldown > 0 || loading) return
    onSubmit({ ingredients, mealType, timeAvailable, preference, servings, debateStyle })
    setCooldown(COOLDOWN_SECONDS)
  }

  function handleIngredientsChange(value: string) {
    if (value.length > MAX_INGREDIENT_TEXT) {
      setWarning(`Ingredients are limited to ${MAX_INGREDIENT_TEXT} characters.`)
      setIngredients(value.slice(0, MAX_INGREDIENT_TEXT))
      return
    }
    setWarning('')
    setIngredients(value)
  }

  return (
    <form ref={ref} onSubmit={submit} className="card card-strong space-y-6">
      <div>
        <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Step 1</p>
        <h2 className="text-2xl font-semibold text-slate-900 mt-2">Kitchen Inventory</h2>
        <p className="text-sm text-slate-600 max-w-xl mt-2">Use simple pantry ingredients and let the cabinet decide the best recipe path.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">Ingredients</label>
        <textarea
          rows={4}
          value={ingredients}
          onChange={(e) => handleIngredientsChange(e.target.value)}
          placeholder="Paneer, eggs, spinach, mushrooms, tomatoes, onion, rice, curd, leftover dal, coriander"
          className="mt-3 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500">
          <span>Shorter ingredient lists keep the cabinet fast and focused.</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-600">{ingredients.length}/{MAX_INGREDIENT_TEXT}</span>
            {ingredients.length >= MAX_INGREDIENT_TEXT ? (
              <span className="label-pill">MAX REACHED</span>
            ) : ingredients.length > MAX_INGREDIENT_TEXT * 0.8 ? (
              <span className="label-pill">Nearly full</span>
            ) : null}
          </div>
        </div>
        {warning ? <div className="mt-3 text-sm text-rose-600">{warning}</div> : null}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="block text-sm font-medium text-slate-900">Meal type</label>
          <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100">
            <option>Any</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snack</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900">Time available</label>
          <select value={timeAvailable} onChange={(e) => setTimeAvailable(e.target.value)} className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100">
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>45 minutes</option>
            <option>60 minutes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900">Preference</label>
          <select value={preference} onChange={(e) => setPreference(e.target.value)} className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100">
            <option>Balanced</option>
            <option>High protein</option>
            <option>Low effort</option>
            <option>Use leftovers</option>
            <option>Healthy</option>
            <option>Comfort food</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-900">Servings</label>
          <select value={servings} onChange={(e) => setServings(Number(e.target.value))} className="mt-2 w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100">
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-900">Debate Style</label>
        <div className="mt-3 flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="debateStyle"
              value="concise"
              checked={debateStyle === 'concise'}
              onChange={(e) => setDebateStyle(e.target.value as DebateStyle)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Concise</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="debateStyle"
              value="verbose"
              checked={debateStyle === 'verbose'}
              onChange={(e) => setDebateStyle(e.target.value as DebateStyle)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">Verbose</span>
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-500">Verbose mode shows the cabinet debating recipes. Concise keeps things quick.</p>
      </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm">
            {cooldown > 0 ? (
              <span className="text-amber-900">Please wait {cooldown}s before calling again.</span>
            ) : (
              <span className="text-slate-500">No login, no save — one session only.</span>
            )}
            {!canGenerate && (
              <div className="text-sm text-rose-700 mt-2">Choose at least one agent before calling the cabinet.</div>
            )}
          </div>
          {!hideButton && (
            <button
              disabled={loading || cooldown > 0 || !canGenerate}
              type="submit"
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {loading ? 'Cabinet in session...' : 'Call the Cabinet'}
            </button>
          )}
          {onNextStep && (
            <button
              type="button"
              onClick={onNextStep}
              className="btn-secondary w-full sm:w-auto"
            >
              Next Step
            </button>
          )}
        </div>
    </form>
  )
})

IngredientForm.displayName = 'IngredientForm'

export default IngredientForm
