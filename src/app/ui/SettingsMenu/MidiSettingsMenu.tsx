import { Fragment, useContext } from 'react'
import { CheckButton } from '../CheckButton'
import {
  MidiEngineContext,
  MidiEngineContextType,
} from '@/app/context/MidiEngineContextProvider'

export default function MidiSettingsMenu() {
  const { inputs, selectedInputId, selectInput, refreshInputs, midiSupported } =
    useContext(MidiEngineContext) as MidiEngineContextType

  return (
    <div className='w-20 p-1'>
      <div className='w-full text-center text-2xl font-bold mb-2'>Midi</div>
      {!midiSupported ? (
        <div>
          <div className='w-full text-center text-red-500 mb-1'>
            Not supported
          </div>
          <button
            onClick={refreshInputs}
            className='w-full px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
          >
            Load MIDI devices
          </button>
        </div>
      ) : (
        <Fragment>
          <div className='mb-4'>
            <label className='block mb-1'>MIDI devices</label>
            <select
              value={selectedInputId ?? '__none__'}
              onChange={(e) => {
                const id = e.target.value

                if (inputs.some((input) => input.id === id)) {
                  selectInput(id)
                }
              }}
              className='w-full px-2 py-1 mb-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
            >
              <option
                value={'__none__'}
                hidden
              >
                None
              </option>
              {inputs.map((input) => (
                <option
                  key={input.id}
                  value={input.id}
                >
                  {input.name}
                </option>
              ))}
            </select>
            <button
              onClick={refreshInputs}
              className='w-full px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700'
            >
              Load MIDI devices
            </button>
          </div>
        </Fragment>
      )}
    </div>
  )
}
