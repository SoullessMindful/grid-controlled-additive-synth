import { PlayIcon as PlayIconSolid } from '@heroicons/react/24/solid'
import { PlayIcon as PlayIconOutline } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

type RadioButtonProps = {
  value: boolean
  onCheck: (newValue: boolean) => void
}

export function RadioButton({ value, onCheck }: RadioButtonProps) {
  return (
    <Fragment>
      <input
        type='radio'
        checked={value}
        onChange={(e) => {
          if (e.target.checked) {
            onCheck(value)
          }
        }}
        className='appearance-none'
      />
      {value ? (
        <PlayIconOutline className='size-1.5 inline stroke-gray-300 fill-blue-500' />
      ) : (
        <PlayIconSolid className='size-1.5 inline fill-gray-300' />
      )}
    </Fragment>
  )
}
