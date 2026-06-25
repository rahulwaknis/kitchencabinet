import type { NextApiRequest, NextApiResponse } from 'next'
import { SELECTABLE_AGENTS, MODERATOR } from '../../lib/agents'

const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini'
const DEFAULT_MAX_INGREDIENT_INPUT_CHARS = 1000
const DEFAULT_MAX_SELECTED_AGENTS = 5
const DEFAULT_RATE_LIMIT_WINDOW_MS = 60000
const DEFAULT_RATE_LIMIT_MAX_REQUESTS = 5
const CONCISE_MAX_OUTPUT_TOKENS = 3500
const VERBOSE_MAX_OUTPUT_TOKENS = 6000

const ALLOWED_MEAL_TYPES = ['Any', 'Breakfast', 'Lunch', 'Dinner', 'Snack']
const ALLOWED_TIME_AVAILABLE = ['15 minutes', '30 minutes', '45 minutes', '60 minutes']
const ALLOWED_PREFERENCES = ['Balanced', 'High protein', 'Low effort', 'Use leftovers', 'Healthy', 'Comfort food']
const ALLOWED_SERVINGS = [1, 2, 3, 4]
const ALLOWED_DEBATE_STYLES = ['concise', 'verbose'] as const

type DebateStyle = typeof ALLOWED_DEBATE_STYLES[number]

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

function readPositiveIntEnv(name: string, fallback: number): number {
  const value = process.env[name]
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback
}

function getClientIp(req: NextApiRequest): string {
  const forwardedFor = req.headers['x-forwarded-for']
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = req.headers['x-real-ip']
  if (typeof realIp === 'string' && realIp.trim()) {
    return realIp.trim()
  }
  return req.socket.remoteAddress || 'anonymous'
}

function checkRateLimit(req: NextApiRequest): boolean {
  const windowMs = readPositiveIntEnv('APP_RATE_LIMIT_WINDOW_MS', DEFAULT_RATE_LIMIT_WINDOW_MS)
  const maxRequests = readPositiveIntEnv('APP_RATE_LIMIT_MAX_REQUESTS', DEFAULT_RATE_LIMIT_MAX_REQUESTS)
  const now = Date.now()
  const key = getClientIp(req)
  const current = rateLimitStore.get(key)

  // Lightweight hobby-demo guardrail only. In-memory rate limiting is not
  // production-grade abuse protection, especially on serverless platforms.
  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count += 1
  return true
}

function isAllowedValue(value: unknown, allowed: string[]): value is string {
  return typeof value === 'string' && allowed.includes(value)
}

const SYSTEM_PROMPT = `You are Kitchen Cabinet, an agentic AI meal recommendation system.

When called, the user provides a temporary cabinet of selected agents. Only those selected agents should evaluate and score recipes. Chef Kabir is always included as the final moderator and summarizes the cabinet's decision.

Each selectable agent has a clear role and scoring focus which you should follow. The moderator should summarize disagreements and pick final recommendations.

Your job is to: parse the inventory, generate candidate recipes (6-8), have each selected agent score and comment on each recipe, eliminate weak recipes, and have Chef Kabir choose the final top 3 recipes. Return valid JSON only.

Rules:
- Use mostly ingredients provided by the user.
- You may assume basic staples such as salt, oil, water, basic spices, and basic cooking equipment.
- Do not invent rare or expensive ingredients.
- Clearly mention missing ingredients if any.
- Respect the user’s selected meal type, time, preference, and servings.
- If a cabinet lacks a nutrition-focused agent, still make reasonable recipe suggestions but do NOT invent that agent.
- Each selected agent should have a distinct point of view and concise, characterful notes.
- Do not include markdown or extra commentary.
- Chef Kabir must always provide a non-empty cabinet_summary field summarizing the final recommendation and reasoning.

DEBATE STYLE HANDLING:
- If debateStyle is "concise": Keep agent notes short. Do NOT generate cabinet_meeting; omit that field or set it to null.
- If debateStyle is "verbose": Generate a full cabinet_meeting object. Show agents discussing and debating recipes.
  - Include dialogue only from selected agents plus Chef Kabir.
  - Each dialogue line should be 1-2 sentences maximum.
  - Avoid childish jokes. Use personality lightly.
  - Agents should disagree politely.
  - Include selected final recipes and some eliminated recipes in recipe_discussions (2-4 per discussion).
  - Chef Kabir should provide a moderator_decision for each discussed recipe.
  - Keep the total cabinet meeting readable and useful.
`

const JSON_INSTRUCTIONS = `Return strict JSON in exactly this structure:
{
"selected_agents": [
  {"id":"","name":"","role":"","icon":""}
],
"moderator": {"id":"chef-kabir","name":"Chef Kabir","role":"Final Moderator","icon":"👨‍🍳"},
"parsed_inventory": {
  "proteins": [],
  "vegetables": [],
  "carbs": [],
  "dairy": [],
  "leftovers": [],
  "urgent_use": [],
  "assumed_staples": []
},
"candidate_recipes": [
  {"name":"","uses":[],"missing_ingredients":[],"estimated_time_minutes":0,"short_description":""}
],
"recipe_evaluations": [
  {"recipe_name":"","agent_scores":[{"agent_id":"","agent_name":"","agent_icon":"","score":0,"note":""}],"average_score":0,"moderator_note":""}
],
"eliminated_recipes": [{"name":"","reason":"","main_objecting_agent":""}],
"final_recommendations": [{"rank":1,"name":"","why_selected":"","uses":[],"missing_ingredients":[],"estimated_time_minutes":0,"difficulty":"","best_for":"","steps":[]}],
"cabinet_summary":"",
"cabinet_meeting": {
  "opening_note": "",
  "recipe_discussions": [
    {
      "recipe_name": "",
      "status": "selected",
      "supporting_agents": [],
      "objecting_agents": [],
      "dialogue": [
        {"agent_id": "", "agent_name": "", "agent_icon": "", "tone": "", "mood": "", "line": ""}
      ],
      "moderator_decision": ""
    }
  ],
  "closing_note": ""
}
}`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end('Method Not Allowed')
  }

  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: 'The cabinet needs a short breather. Please try again in a minute.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY in server environment' })
  }

  const { ingredients, mealType, timeAvailable, preference, servings, selected_agents, debateStyle } = req.body || {}
  const maxIngredientChars = readPositiveIntEnv('MAX_INGREDIENT_INPUT_CHARS', DEFAULT_MAX_INGREDIENT_INPUT_CHARS)
  const maxSelectedAgents = readPositiveIntEnv('MAX_SELECTED_AGENTS', DEFAULT_MAX_SELECTED_AGENTS)

  if (typeof ingredients !== 'string' || ingredients.trim().length === 0) {
    return res.status(400).json({ error: 'The cabinet needs at least a few ingredients before it can start arguing.' })
  }

  const trimmedIngredients = ingredients.trim()
  if (trimmedIngredients.length > maxIngredientChars) {
    return res.status(400).json({ error: `Ingredients are too long. Please keep the list under ${maxIngredientChars} characters.` })
  }

  if (!isAllowedValue(mealType, ALLOWED_MEAL_TYPES)) {
    return res.status(400).json({ error: 'Choose a valid meal type before calling the cabinet.' })
  }

  if (!isAllowedValue(timeAvailable, ALLOWED_TIME_AVAILABLE)) {
    return res.status(400).json({ error: 'Choose a valid time window before calling the cabinet.' })
  }

  if (!isAllowedValue(preference, ALLOWED_PREFERENCES)) {
    return res.status(400).json({ error: 'Choose a valid cooking preference before calling the cabinet.' })
  }

  const normalizedServings = Number(servings)
  if (!ALLOWED_SERVINGS.includes(normalizedServings)) {
    return res.status(400).json({ error: 'Choose a valid serving count before calling the cabinet.' })
  }

  const normalizedDebateStyle = (debateStyle ?? 'concise') as DebateStyle
  if (!ALLOWED_DEBATE_STYLES.includes(normalizedDebateStyle)) {
    return res.status(400).json({ error: 'Choose either concise or verbose debate mode.' })
  }

  // Validate selected agents from client; sanitize against known roster
  const selected = Array.isArray(selected_agents) ? selected_agents.map(String) : []
  const knownIds = SELECTABLE_AGENTS.map((a) => a.id)
  if (selected.length === 0) {
    return res.status(400).json({ error: 'No valid selected agents provided. Choose at least one agent.' })
  }
  if (selected.length > maxSelectedAgents) {
    return res.status(400).json({ error: `Choose no more than ${maxSelectedAgents} agents for one cabinet session.` })
  }

  const invalidSelected = selected.filter((id) => !knownIds.includes(id))
  if (invalidSelected.length > 0) {
    return res.status(400).json({ error: 'One or more selected agents are not part of this cabinet roster.' })
  }

  const userContent = `User input:\nIngredients: ${trimmedIngredients}\nMeal type: ${mealType}\nTime available: ${timeAvailable}\nPreference: ${preference}\nServings: ${normalizedServings}\nDebate Style: ${normalizedDebateStyle}\n\n${JSON_INSTRUCTIONS}`

  // Build a selected agents block to include in prompt
  const selectedBlock = SELECTABLE_AGENTS.filter((a) => selected.includes(a.id)).map((a) => {
    const focus = a.scoringFocus || a.scoring_focus || 'distinct specialist focus'
    return `- ${a.name} (${a.role}): ${a.personality}. Focus: ${focus}. Speech style: ${a.speechStyle || 'concise and practical'}. Cares about: ${a.caresAbout || 'the most important dinner trade-offs'}. Objects to: ${a.objectsTo || 'weak or unfocused recipe choices'}. Example: ${a.exampleLine || 'Give a short, useful comment that sounds like this.'}`
  }).join('\n')

  const promptHeader = `Selected agents:\n${selectedBlock}\n\nModerator:\n- ${MODERATOR.name} (${MODERATOR.role}): ${MODERATOR.personality}. Speech style: ${MODERATOR.speechStyle || 'clear and balanced'}. Cares about: ${MODERATOR.caresAbout || 'balanced decisions and clear reasons'}. Objects to: ${MODERATOR.objectsTo || 'endless debate or clever but impractical recipes'}. Example: ${MODERATOR.exampleLine || 'The cabinet has heard the objections. This one wins because it is practical, tasty, and uses what matters.'}\n\n`;

  const finalUserContent = promptHeader + userContent

  try {
    const openAiModel = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL
    const maxOutputTokens = normalizedDebateStyle === 'verbose' ? VERBOSE_MAX_OUTPUT_TOKENS : CONCISE_MAX_OUTPUT_TOKENS
    const payload = {
      model: openAiModel,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: finalUserContent }
      ],
      temperature: 0.0,
      response_format: { type: 'json_object' },
      max_tokens: maxOutputTokens
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    if (!r.ok) {
      const text = await r.text()
      return res.status(502).json({ error: 'OpenAI API error', details: text })
    }

    const data = await r.json()
    const raw = data.choices?.[0]?.message?.content ?? data.choices?.[0]?.text
    if (!raw) {
      return res.status(502).json({ error: 'No content from OpenAI' })
    }

    // Ensure response is strict JSON. The model sometimes emits extra
    // commentary or Markdown around the JSON. Try to parse directly,
    // then fall back to extracting the first balanced JSON object.
    function extractFirstJsonBlock(text: string): string | null {
      const start = text.indexOf('{')
      if (start === -1) return null
      let depth = 0
      let inString = false
      let escape = false
      for (let i = start; i < text.length; i++) {
        const ch = text[i]
        if (escape) { escape = false; continue }
        if (ch === '\\') { escape = true; continue }
        if (ch === '"') { inString = !inString; continue }
        if (inString) continue
        if (ch === '{') depth++
        else if (ch === '}') {
          depth--
          if (depth === 0) {
            return text.substring(start, i + 1)
          }
        }
      }
      return null
    }

    let parsed: any
    async function repairJson(rawOutput: string): Promise<any | null> {
      const repairPayload = {
        model: openAiModel,
        messages: [
          {
            role: 'system',
            content: 'You repair malformed JSON. Return only one valid JSON object. Do not add markdown or commentary.'
          },
          {
            role: 'user',
            content: `Repair this Kitchen Cabinet model output into strict valid JSON matching the requested structure. Preserve the content as much as possible.\n\n${rawOutput}`
          }
        ],
        temperature: 0.0,
        response_format: { type: 'json_object' },
        max_tokens: maxOutputTokens
      }

      const repairResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(repairPayload),
      })

      if (!repairResponse.ok) {
        const text = await repairResponse.text()
        console.error('OpenAI JSON repair failed:', text.slice(0, 2000))
        return null
      }

      const repairData = await repairResponse.json()
      const repairedRaw = repairData.choices?.[0]?.message?.content ?? repairData.choices?.[0]?.text
      if (!repairedRaw) return null

      try {
        return JSON.parse(repairedRaw)
      } catch (e) {
        console.error('Failed to parse repaired JSON:', e)
        console.error('Repaired raw (truncated):', repairedRaw.slice(0, 2000))
        return null
      }
    }

    try {
      parsed = JSON.parse(raw)
    } catch (err) {
      const extracted = extractFirstJsonBlock(raw)
      if (!extracted) {
        // If there's a starting '{' but no balanced end, attempt a best-effort repair
        const startIdx = raw.indexOf('{')
        if (startIdx !== -1) {
          // compute remaining depth (unclosed braces) ignoring strings
          let depth = 0
          let inString = false
          let escape = false
          for (let i = startIdx; i < raw.length; i++) {
            const ch = raw[i]
            if (escape) { escape = false; continue }
            if (ch === '\\') { escape = true; continue }
            if (ch === '"') { inString = !inString; continue }
            if (inString) continue
            if (ch === '{') depth++
            else if (ch === '}') depth--
          }
          if (depth > 0) {
            const repaired = raw + '}'.repeat(depth)
            try {
              parsed = JSON.parse(repaired)
              console.warn('Repaired truncated JSON by appending', depth, 'closing brace(s)')
            } catch (e) {
              console.error('Auto-repair parse failed:', e)
              console.error('Repaired (truncated):', repaired.slice(0, 2000))
            }
          }
        }
        if (!parsed) {
          console.error('No JSON block found in model output. Raw (truncated):', raw.slice(0, 2000))
          parsed = await repairJson(raw)
          if (!parsed) return res.status(502).json({ error: 'Invalid JSON from model', raw })
        }
      } else {
        try {
          parsed = JSON.parse(extracted)
        } catch (e) {
          console.error('Failed to parse extracted JSON block:', e)
          console.error('Extracted (truncated):', extracted.slice(0, 2000))
          parsed = await repairJson(raw)
          if (!parsed) return res.status(502).json({ error: 'Invalid JSON from model', raw })
        }
      }
    }

    if (!parsed.cabinet_summary || typeof parsed.cabinet_summary !== 'string' || parsed.cabinet_summary.trim() === '') {
      console.warn('cabinet_summary missing or empty; generating fallback summary')
      if (parsed.cabinet_meeting?.closing_note) {
        parsed.cabinet_summary = parsed.cabinet_meeting.closing_note
      } else if (Array.isArray(parsed.final_recommendations) && parsed.final_recommendations.length > 0) {
        const summaryLines = parsed.final_recommendations.slice(0, 3).map((rec: any) => {
          const name = rec.name || 'a top recipe'
          const why = rec.why_selected || 'because it best fits the user preferences and ingredients'
          return `${name}: ${why}.`
        })
        parsed.cabinet_summary = `Chef Kabir selected the top dishes based on the cabinet's discussion and the available ingredients. ${summaryLines.join(' ')}`
      } else {
        parsed.cabinet_summary = 'Chef Kabir reviewed the cabinet discussion and selected the best recipe recommendations based on the available ingredients, time, and user preferences.'
      }
    }

    return res.status(200).json(parsed)
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' })
  }
}
