import React from 'react'
import IngredientForm from '../src/components/IngredientForm'
import AgentRoster from '../src/components/AgentRoster'
import LoadingCabinet from '../src/components/LoadingCabinet'
import ChefSummary from '../src/components/ChefSummary'
import ParsedInventoryView from '../src/components/ParsedInventory'
import CandidateRecipes from '../src/components/CandidateRecipes'
import AgentScorecard from '../src/components/AgentScorecard'
import EliminatedRecipes from '../src/components/EliminatedRecipes'
import FinalRecommendations from '../src/components/FinalRecommendations'
import ErrorMessage from '../src/components/ErrorMessage'
import CabinetMeeting from '../src/components/CabinetMeeting'
import { CabinetResponse, FormInput } from '../src/types'

export default function Home() {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [data, setData] = React.useState<CabinetResponse | null>(null)
  const [selectedAgents, setSelectedAgents] = React.useState<string[]>([
    'protein',
    'nutrition',
    'time',
  ])

  // Refs for scroll behavior and form submission
  const step2Ref = React.useRef<HTMLDivElement>(null)
  const step3Ref = React.useRef<HTMLDivElement>(null)
  const step4Ref = React.useRef<HTMLDivElement>(null)
  const ingredientFormRef = React.useRef<HTMLFormElement>(null)

  async function handleSubmit(v: FormInput) {
    if (loading) return

    setError(null)
    setData(null)
    if (!v.ingredients || v.ingredients.trim() === '') {
      setError('The cabinet needs at least a few ingredients before it can start arguing.')
      return
    }
    if (!selectedAgents || selectedAgents.length === 0) {
      setError('Choose at least one agent before calling the cabinet.')
      return
    }

    setLoading(true)

    // Smooth scroll to Step 3 when loading starts
    if (step3Ref.current) {
      setTimeout(() => {
        step3Ref.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...v, selected_agents: selectedAgents }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'The cabinet dropped a spoon. Please try again.')
        setLoading(false)
      } else {
        setData(json as CabinetResponse)
        setLoading(false)
        // Optionally scroll to Step 4 after response
        if (step4Ref.current) {
          setTimeout(() => {
            step4Ref.current?.scrollIntoView({ behavior: 'smooth' })
          }, 300)
        }
      }
    } catch (err) {
      setError('The cabinet dropped a spoon. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 md:p-12 bg-slate-50">
      <header className="max-w-3xl mx-auto mb-8 sm:mb-10">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-amber-800">
          Agentic meal planning for home cooks
        </p>
        <h1 className="hero-title font-extrabold mt-3 sm:mt-4">Kitchen Cabinet</h1>
        <p className="text-lg sm:text-xl mt-3 sm:mt-4 muted leading-8">
          Your ingredients enter. The agents debate. Dinner emerges.
        </p>
        <p className="text-xs sm:text-sm muted mt-3 sm:mt-4 max-w-2xl leading-6">
          A warm, no-login kitchen assistant that shows how cooking agents discuss your pantry, shortlist recipes, and pick the final meal.
        </p>
      </header>

      <main className="max-w-4xl mx-auto grid gap-6">
        {/* STEP 1: Kitchen Inventory */}
        <section>
          <IngredientForm
            ref={ingredientFormRef}
            onSubmit={handleSubmit}
            loading={loading}
            canGenerate={selectedAgents.length > 0}
            hideButton={true}
            onNextStep={() => {
              step2Ref.current?.scrollIntoView({ behavior: 'smooth' })
            }}
          />
        </section>

        {/* STEP 2: Choose Agents */}
        <section ref={step2Ref} className="card card-strong space-y-6">
          <div>
            <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Step 2</p>
            <h2 className="text-2xl font-semibold text-slate-900 mt-2">Choose your agents</h2>
            <p className="text-sm text-slate-600 mt-2">Pick up to 3 specialists to evaluate your ingredients and recipe options.</p>
          </div>

          <div>
            <AgentRoster
              selectedIds={selectedAgents}
              onToggle={(id) => {
                if (selectedAgents.includes(id)) {
                  setSelectedAgents((prev) => prev.filter((p) => p !== id))
                  setError(null)
                } else {
                  if (selectedAgents.length >= 3) {
                    setError('The cabinet has three seats today. Deselect one agent first.')
                    return
                  }
                  setError(null)
                  setSelectedAgents((prev) => [...prev, id])
                }
              }}
            />
          </div>

          <div>
            <button
              onClick={() => {
                if (selectedAgents.length === 0) {
                  setError('Choose at least one agent before calling the cabinet.')
                  return
                }
                setError(null)
                const form = ingredientFormRef.current
                if (form) {
                  if (typeof form.requestSubmit === 'function') {
                    form.requestSubmit()
                  } else {
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
                  }
                }
              }}
              disabled={loading || selectedAgents.length === 0}
              type="button"
              className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed w-full"
            >
              {loading ? 'Cabinet in session...' : 'Call the Cabinet'}
            </button>
            {selectedAgents.length === 0 && (
              <p className="mt-3 text-sm text-rose-700">Choose at least one agent before calling the cabinet.</p>
            )}
          </div>
        </section>

        {/* Error messages can appear here */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* STEP 3: Cabinet in Session */}
        <section ref={step3Ref} className="card card-strong space-y-6">
          <div>
            <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Step 3</p>
            <h2 className="text-2xl font-semibold text-slate-900 mt-2">Cabinet in session</h2>
          </div>

          {!loading && !data && (
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              <p className="text-sm">Once you call the cabinet, the agents take the floor and debate what makes dinner worth cooking.</p>
            </div>
          )}

          {loading && (
            <div>
              <LoadingCabinet selectedIds={selectedAgents} />
            </div>
          )}

          {data && !loading && (
            <div className="space-y-6">
              {data.cabinet_meeting ? (
                <div>
                  <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em] mb-4">Cabinet Debate</p>
                  <CabinetMeeting meeting={data.cabinet_meeting} />
                </div>
              ) : (
                <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                  <p className="text-sm">Concise mode selected. The cabinet kept the debate short and moved straight to the conclusions.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* STEP 4: Conclusions */}
        <section ref={step4Ref} className="card card-strong space-y-6">
          <div>
            <p className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Step 4</p>
            <h2 className="text-2xl font-semibold text-slate-900 mt-2">The cabinet&apos;s conclusion</h2>
          </div>

          {!data && (
            <div className="rounded-[1.25rem] border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
              <p className="text-sm">The final recipe cards will appear here after the cabinet has voted.</p>
            </div>
          )}

          {data && (
            <div className="space-y-5 sm:space-y-6">
              <div className="card">
                <div className="text-sm text-amber-800 font-semibold uppercase tracking-[0.3em]">Selected Cabinet</div>
                <div className="mt-3 flex flex-wrap gap-3 items-center">
                  {data.selected_agents && data.selected_agents.length > 0 ? (
                    data.selected_agents.map((a) => (
                      <div key={a.id} className="rounded-full px-3 py-1.5 bg-amber-100 text-amber-900 text-sm font-semibold">
                        {a.icon} {a.name}
                      </div>
                    ))
                  ) : (
                    selectedAgents.map((id) => (
                      <div key={id} className="rounded-full px-3 py-1.5 bg-amber-100 text-amber-900 text-sm font-semibold">
                        {id}
                      </div>
                    ))
                  )}
                  <div className="ml-2 text-sm text-slate-600">Moderator: Cabinet Moderator 👨‍🍳</div>
                </div>
              </div>

              <ParsedInventoryView inventory={data.parsed_inventory} />
              <CandidateRecipes list={data.candidate_recipes} />
              <AgentScorecard legacyItems={data.agent_scorecard} evaluations={data.recipe_evaluations} />
              <EliminatedRecipes items={data.eliminated_recipes} />
              <FinalRecommendations items={data.final_recommendations} />
              <ChefSummary text={data.cabinet_summary} />
            </div>
          )}
        </section>
      </main>
      <footer className="max-w-4xl mx-auto mt-8 text-xs leading-5 text-slate-500">
        Kitchen Cabinet is an AI demo. Check allergens, ingredient freshness, and food safety before cooking.
      </footer>
    </div>
  )
}

