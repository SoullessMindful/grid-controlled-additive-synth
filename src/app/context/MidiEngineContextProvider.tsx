'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react'
import {
  SoundEngineContext,
  SoundEngineContextType,
} from './SoundEngineContextProvider'

export type MidiInputDevice = {
  id: string
  name: string
  device: MIDIInput
}

export type MidiEngineContextType = {
  inputs: MidiInputDevice[]
  selectedInputId: string | undefined
  selectInput: (id: string) => void
  midiSupported: boolean
  refreshDevices: () => void
}

export const MidiEngineContext = createContext<
  MidiEngineContextType | undefined
>(undefined)

export default function MidiEngineContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { midiNoteOn, midiNoteOff } = useContext(
    SoundEngineContext
  ) as SoundEngineContextType

  const [inputs, setInputs] = useState<MidiInputDevice[]>([])
  const [selectedInputId, setSelectedInputId] = useState<string | undefined>(undefined)
  const [midiSupported, setMidiSupported] = useState<boolean>(true)
  const midiAccessRef = useRef<MIDIAccess | undefined>(undefined)

  // Keep latest handlers for MIDI events
  const midiNoteOnRef = useRef(midiNoteOn)
  const midiNoteOffRef = useRef(midiNoteOff)
  useEffect(() => {
    midiNoteOnRef.current = midiNoteOn
    midiNoteOffRef.current = midiNoteOff
  }, [midiNoteOn, midiNoteOff])

  useEffect(() => {
    return () => {
      if (midiAccessRef.current) {
        midiAccessRef.current.removeEventListener('statechange', updateInputs)
      }
    }
  }, [])

  useEffect(() => {
    if (!selectedInputId) return
    const input = inputs.find((i) => i.id === selectedInputId)
    if (!input) return

    const handleMidiMessage = (event: MIDIMessageEvent) => {
      if (!event.data) return

      const [status, note, velocity] = event.data
      const command = status & 0xf0
      // const channel = status & 0x0f

      if (command === 0x90 && velocity > 0) {
        midiNoteOnRef.current(note)
      } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
        midiNoteOffRef.current(note)
      }
    }

    input.device.addEventListener('midimessage', handleMidiMessage)
    return () => {
      input.device.removeEventListener('midimessage', handleMidiMessage)
    }
  }, [selectedInputId, inputs])

  const updateInputs = useCallback(() => {
    if (!midiAccessRef.current) return

    const inputArr: MidiInputDevice[] = []
    midiAccessRef.current.inputs.forEach((device) => {
      inputArr.push({
        id: device.id,
        name: device.name || 'Unknown MIDI Device',
        device,
      })
    })
    setInputs(inputArr)

    if (
      inputArr.length &&
      (!selectedInputId || !inputArr.some((i) => i.id === selectedInputId))
    ) {
      setSelectedInputId(inputArr[0].id)
    }

    if (!inputArr.length) setSelectedInputId(undefined)
  }, [selectedInputId])


  const refreshDevices = useCallback(() => {
    if (!navigator.requestMIDIAccess) {
      setMidiSupported(false)
      return
    }

    if (midiAccessRef.current) {
      updateInputs()
      return
    }

    navigator
      .requestMIDIAccess({ sysex: false })
      .then((access) => {
        midiAccessRef.current = access
        updateInputs()
        access.addEventListener('statechange', updateInputs)
      })
      .catch(() => {
        setMidiSupported(false)
      })
  }, [updateInputs])

  const selectInput = useCallback((id: string) => {
    setSelectedInputId(id)
  }, [])

  return (
    <MidiEngineContext.Provider
      value={{
        inputs,
        selectedInputId,
        selectInput,
        midiSupported,
        refreshDevices,
      }}
    >
      {children}
    </MidiEngineContext.Provider>
  )
}
