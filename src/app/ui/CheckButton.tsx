import { StopIcon as StopIconSolid } from '@heroicons/react/24/solid'
import { StopIcon as StopIconOutline } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

type CheckButtonProps = {
  value: boolean
  onChange: (newValue: boolean) => void
}

export function CheckButton({ value, onChange }: CheckButtonProps) {
  return (
    <Fragment>
      <input
        type='checkbox'
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className='appearance-none'
      />
      {value ? (
        <StopIconOutline className='size-1.5 inline stroke-gray-300 fill-blue-500' />
      ) : (
        <StopIconSolid className='size-1.5 inline fill-gray-300' />
      )}
    </Fragment>
  )
}
