'use client'

/**
 * Vocal façon WhatsApp :
 *  - VoiceComposer : champ texte + micro. Maintenir le micro pour parler,
 *    glisser à gauche pour annuler, glisser vers le haut pour verrouiller.
 *  - VoiceBubble   : bulle de lecture avec onde et progression.
 */

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronUp, Lock, Mic, Pause, Play, Send, Trash2 } from 'lucide-react'
import { ServiceRequest } from '@/types'

/** Vocal côté client : `blob` est présent tant qu'il n'a pas été envoyé au serveur. */
export type VoiceNoteData = NonNullable<ServiceRequest['voiceNote']> & { blob?: Blob }

const ACCENT = '#2d7ff9'
const CANCEL_DISTANCE = 110 // px vers la gauche
const LOCK_DISTANCE = 80    // px vers le haut
const MIN_DURATION_MS = 800
const BUBBLE_BARS = 36

export function formatDuration(sec: number) {
  const s = Math.max(0, Math.round(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

/** Réduit une liste de niveaux à `count` barres (moyenne par tranche). */
function downsample(levels: number[], count: number) {
  if (!levels.length) return Array.from({ length: count }, () => 0.15)
  return Array.from({ length: count }, (_, i) => {
    const start = Math.floor((i * levels.length) / count)
    const end = Math.max(start + 1, Math.floor(((i + 1) * levels.length) / count))
    const slice = levels.slice(start, end)
    return slice.reduce((a, b) => a + b, 0) / slice.length
  })
}

// ── Enregistreur ──────────────────────────────────────────────────────────────
type RecState = 'idle' | 'starting' | 'recording' | 'locked'

function useVoiceRecorder(onDone: (note: VoiceNoteData) => void) {
  const [state, setState] = useState<RecState>('idle')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [levels, setLevels] = useState<number[]>([])
  const [error, setError] = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startedAtRef = useRef(0)
  const levelsRef = useRef<number[]>([])
  const keepRef = useRef(true)
  const abortRef = useRef(false) // relâché avant que le micro soit prêt

  const cleanup = () => {
    if (tickRef.current) clearInterval(tickRef.current)
    tickRef.current = null
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
  }

  useEffect(() => () => {
    keepRef.current = false
    recorderRef.current?.state === 'recording' && recorderRef.current.stop()
    cleanup()
  }, [])

  const start = async () => {
    if (state !== 'idle') return
    setError(null)
    abortRef.current = false
    setState('starting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (abortRef.current) { stream.getTracks().forEach(t => t.stop()); setState('idle'); return }
      streamRef.current = stream

      // Niveau du micro pour l'onde en direct
      const ctx = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 512
      ctx.createMediaStreamSource(stream).connect(analyser)
      audioCtxRef.current = ctx
      const buf = new Uint8Array(analyser.fftSize)

      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      recorder.ondataavailable = e => chunks.push(e.data)
      recorder.onstop = () => {
        const duration = Date.now() - startedAtRef.current
        cleanup()
        setState('idle')
        setElapsedMs(0)
        setLevels([])
        if (!keepRef.current) return
        if (duration < MIN_DURATION_MS) {
          setError('Maintenez le micro pour enregistrer, relâchez pour terminer.')
          return
        }
        const blob = new Blob(chunks, { type: recorder.mimeType })
        onDone({
          blob,
          url: URL.createObjectURL(blob),
          durationSec: Math.max(1, Math.round(duration / 1000)),
          waveform: downsample(levelsRef.current, BUBBLE_BARS),
        })
      }

      keepRef.current = true
      levelsRef.current = []
      startedAtRef.current = Date.now()
      recorder.start()
      recorderRef.current = recorder
      setState(s => (s === 'locked' ? 'locked' : 'recording'))

      tickRef.current = setInterval(() => {
        analyser.getByteTimeDomainData(buf)
        let sum = 0
        for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v }
        const level = Math.min(1, Math.sqrt(sum / buf.length) * 4)
        levelsRef.current.push(level)
        setLevels(prev => [...prev.slice(-39), level])
        setElapsedMs(Date.now() - startedAtRef.current)
      }, 90)
    } catch {
      setState('idle')
      setError('Autorisez l’accès au micro pour enregistrer un vocal.')
    }
  }

  const finish = (keep: boolean) => {
    if (state === 'starting') { abortRef.current = true; setState('idle'); return }
    keepRef.current = keep
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const lock = () => setState(s => (s === 'recording' || s === 'starting' ? 'locked' : s))

  return { state, elapsedMs, levels, error, setError, start, finish, lock }
}

function LiveWave({ levels }: { levels: number[] }) {
  const bars = [...Array.from({ length: Math.max(0, 40 - levels.length) }, () => 0), ...levels]
  return (
    <div className="flex h-7 flex-1 items-center gap-[2px] overflow-hidden">
      {bars.map((l, i) => (
        <span key={i} className="w-[3px] flex-shrink-0 rounded-full bg-[var(--text-secondary)] transition-[height] duration-75" style={{ height: `${12 + l * 88}%`, opacity: l ? 0.85 : 0.25 }} />
      ))}
    </div>
  )
}

// ── Composer (texte + micro) ──────────────────────────────────────────────────
export function VoiceComposer({ text, onTextChange, onVoice, onSendText, placeholder = 'Écrire une description…', disabledVoice }: {
  text: string
  onTextChange: (value: string) => void
  onVoice: (note: VoiceNoteData) => void
  /** Si fourni : quand du texte est saisi, le micro devient un bouton d'envoi (comme WhatsApp). */
  onSendText?: () => void
  placeholder?: string
  disabledVoice?: boolean
}) {
  const rec = useVoiceRecorder(onVoice)
  const [drag, setDrag] = useState({ x: 0, y: 0 })
  const origin = useRef<{ x: number; y: number } | null>(null)
  const active = rec.state === 'recording' || rec.state === 'starting'
  const locked = rec.state === 'locked'

  useEffect(() => {
    if (!rec.error) return
    const t = setTimeout(() => rec.setError(null), 2600)
    return () => clearTimeout(t)
  }, [rec.error]) // eslint-disable-line react-hooks/exhaustive-deps

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabledVoice || locked) return
    e.currentTarget.setPointerCapture(e.pointerId)
    origin.current = { x: e.clientX, y: e.clientY }
    setDrag({ x: 0, y: 0 })
    rec.start()
  }

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!origin.current || !active) return
    const x = Math.min(0, e.clientX - origin.current.x)
    const y = Math.min(0, e.clientY - origin.current.y)
    if (-x > CANCEL_DISTANCE) { origin.current = null; setDrag({ x: 0, y: 0 }); rec.finish(false); return }
    if (-y > LOCK_DISTANCE) { origin.current = null; setDrag({ x: 0, y: 0 }); rec.lock(); return }
    // On ne suit qu'un axe à la fois, comme WhatsApp
    setDrag(Math.abs(x) > Math.abs(y) ? { x, y: 0 } : { x: 0, y })
  }

  const onPointerUp = () => {
    if (!origin.current) return
    origin.current = null
    setDrag({ x: 0, y: 0 })
    if (active) rec.finish(true)
  }

  const cancelProgress = Math.min(1, -drag.x / CANCEL_DISTANCE)

  // Mode verrouillé : on peut lâcher le doigt
  if (locked) {
    return (
      <div className="rounded-3xl bg-[var(--bg-card)] p-3 shadow-[0_-2px_16px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3 px-1">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
          <span className="w-10 text-[15px] font-medium tabular-nums text-[var(--text-primary)]">{formatDuration(rec.elapsedMs / 1000)}</span>
          <LiveWave levels={rec.levels} />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <button onClick={() => rec.finish(false)} aria-label="Supprimer l’enregistrement" className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] active:bg-[var(--bg-surface)]">
            <Trash2 size={22} />
          </button>
          <button onClick={() => rec.finish(true)} aria-label="Terminer l’enregistrement" className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_6px_14px_rgba(45,127,249,0.3)]" style={{ backgroundColor: ACCENT }}>
            <Send size={20} className="-ml-0.5" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {rec.error && (
        <div className="absolute -top-12 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1f2937] px-4 py-2 text-[12px] font-medium text-white shadow-lg">
          {rec.error}
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Zone gauche : texte, ou état d'enregistrement */}
        <div className="flex min-h-[50px] flex-1 items-center rounded-[26px] bg-[var(--bg-card)] px-4 shadow-[0_2px_12px_rgba(15,23,42,0.07)] dark:border dark:border-white/10">
          {active ? (
            <div className="flex w-full items-center gap-3 py-3">
              <span className="flex items-center gap-2">
                <Mic size={18} className="animate-pulse text-red-500" />
                <span className="w-10 text-[15px] tabular-nums text-[var(--text-primary)]">{formatDuration(rec.elapsedMs / 1000)}</span>
              </span>
              <span
                className="ml-auto flex items-center gap-0.5 text-[13px] text-[var(--text-muted)] transition-opacity"
                style={{ opacity: 1 - cancelProgress * 0.8, transform: `translateX(${drag.x * 0.4}px)` }}
              >
                <ChevronLeft size={16} className="animate-pulse" /> Glisser pour annuler
              </span>
            </div>
          ) : (
            <textarea
              value={text}
              onChange={e => onTextChange(e.target.value)}
              rows={Math.min(4, Math.max(1, text.split('\n').length))}
              placeholder={placeholder}
              className="w-full resize-none bg-transparent py-3.5 text-[15px] leading-snug text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            />
          )}
        </div>

        {onSendText && text.trim() && !active ? (
          <button
            type="button"
            onClick={onSendText}
            aria-label="Envoyer"
            className="flex h-[50px] w-[50px] flex-shrink-0 items-center justify-center rounded-full text-white shadow-[0_6px_14px_rgba(45,127,249,0.3)] active:scale-95"
            style={{ backgroundColor: ACCENT }}
          >
            <Send size={20} className="-ml-0.5" />
          </button>
        ) : (
        // Micro : maintenir pour parler
        <div className="relative flex-shrink-0">
          {active && (
            <div
              className="absolute bottom-full left-1/2 mb-3 flex -translate-x-1/2 flex-col items-center gap-1 rounded-full bg-[var(--bg-card)] px-2 py-3 text-[var(--text-secondary)] shadow-[0_4px_14px_rgba(15,23,42,0.12)]"
              style={{ transform: `translate(-50%, ${Math.max(drag.y * 0.5, -30)}px)` }}
            >
              <Lock size={16} />
              <ChevronUp size={16} className="animate-bounce" />
            </div>
          )}
          <button
            type="button"
            disabled={disabledVoice}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onContextMenu={e => e.preventDefault()}
            aria-label="Maintenir pour enregistrer un vocal"
            className="flex h-[50px] w-[50px] touch-none select-none items-center justify-center rounded-full text-white shadow-[0_6px_14px_rgba(45,127,249,0.3)] transition-transform duration-150 disabled:opacity-40"
            style={{
              backgroundColor: ACCENT,
              transform: active ? `translate(${drag.x}px, ${drag.y}px) scale(1.55)` : undefined,
            }}
          >
            <Mic size={22} strokeWidth={2.2} />
          </button>
        </div>
        )}
      </div>
    </div>
  )
}

// ── Bulle de lecture ──────────────────────────────────────────────────────────
export function VoiceBubble({ note, onDelete }: { note: VoiceNoteData; onDelete?: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0..1
  const bars = note.waveform?.length ? note.waveform : downsample([], BUBBLE_BARS)
  const peak = Math.max(0.05, ...bars)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) audio.pause()
    else audio.play()
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * note.durationSec
    setProgress(ratio)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      {onDelete && (
        <button onClick={onDelete} aria-label="Supprimer le vocal" className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--text-muted)] active:bg-red-500/10 active:text-red-500">
          <Trash2 size={18} />
        </button>
      )}
      <div className="relative w-[82%] max-w-[300px] rounded-2xl rounded-tr-md bg-[#dbe9ff] px-3 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.08)] dark:bg-[#1e3a66]">
        <audio
          ref={audioRef}
          src={note.url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setProgress(0) }}
          onTimeUpdate={e => setProgress(e.currentTarget.currentTime / note.durationSec)}
        />
        <div className="flex items-center gap-2.5">
          <button onClick={toggle} aria-label={playing ? 'Pause' : 'Écouter'} className="flex h-9 w-9 flex-shrink-0 items-center justify-center text-[#2d7ff9] dark:text-white">
            {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
          </button>
          <div className="flex h-8 flex-1 cursor-pointer items-center gap-[2px]" onClick={seek}>
            {bars.map((l, i) => (
              <span
                key={i}
                className="w-[3px] flex-1 rounded-full transition-colors"
                style={{
                  height: `${14 + (l / peak) * 86}%`,
                  backgroundColor: i / bars.length < progress ? ACCENT : 'rgba(45,127,249,0.35)',
                }}
              />
            ))}
          </div>
          <span className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-white" style={{ backgroundColor: ACCENT }}>
            <Mic size={17} />
          </span>
        </div>
        <p className="mt-0.5 pl-12 text-[11px] tabular-nums text-[var(--text-secondary)]">
          {playing || progress > 0 ? formatDuration(progress * note.durationSec) : formatDuration(note.durationSec)}
        </p>
      </div>
    </div>
  )
}
