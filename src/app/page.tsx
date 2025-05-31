'use client'
import { useContext } from 'react'
import {
  MainAppContext,
  MainAppContextType,
} from './context/MainAppContextProvider'

export default function Home() {
  const { state, setState } = useContext(MainAppContext) as MainAppContextType
  return <div>Grid</div>
}
