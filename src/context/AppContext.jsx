import React, { createContext, useContext, useState } from 'react'
import { buildings, incidents, policies, cdUnits, violations, licenses, drones, policyRules, trainingPrograms, campaigns, products } from '../data/seed'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [lang, setLang] = useState('ar')
  const [portal, setPortal] = useState('landing') // 'landing' | 'commercial' | 'cd' | 'insurance'
  const [cdUnitsState, setCdUnitsState] = useState(cdUnits)
  const [buildingsState, setBuildingsState] = useState(buildings)
  const [simulatingEvent, setSimulatingEvent] = useState(false)
  const [riskEventActive, setRiskEventActive] = useState(false)
  const [insuranceFlag, setInsuranceFlag] = useState(false)

  // Risk event simulation — sprinkler pressure drop on bld-009 (Al Jubail Industrial Facility)
  const simulateRiskEvent = () => {
    setSimulatingEvent(true)
    setRiskEventActive(true)
    setBuildingsState(prev =>
      prev.map(b =>
        b.id === 'bld-009'
          ? {
              ...b,
              // Demo: simulate score change 88 → 96 and add two critical alerts
              riskScore: 96,
              activeAlerts: b.activeAlerts + 2,
              status: 'sla-active',
            }
          : b
      )
    )
    setTimeout(() => setSimulatingEvent(false), 2000)
  }

  const resetRiskEvent = () => {
    setRiskEventActive(false)
    setBuildingsState(prev =>
      prev.map(b =>
        b.id === 'bld-009'
          ? {
              ...b,
              // Reset to original seed state for Al Jubail Industrial Facility
              riskScore: 88,
              activeAlerts: 6,
              status: 'sla-active',
            }
          : b
      )
    )
  }

  const dispatchUnit = (unitId, incidentId) => {
    setCdUnitsState(prev =>
      prev.map(u =>
        u.id === unitId
          ? { ...u, status: 'deployed', incidentId, eta: `${Math.floor(Math.random() * 15) + 5} min` }
          : u
      )
    )
  }

  const t = (str) => {
    if (!str || typeof str === 'string') return str ?? ''
    return str[lang] ?? str.en ?? ''
  }

  return (
    <AppContext.Provider value={{
      lang, setLang,
      portal, setPortal,
      buildings: buildingsState,
      incidents,
      policies,
      cdUnits: cdUnitsState,
      violations,
      licenses,
      drones,
      policyRules,
      trainingPrograms,
      campaigns,
      products,
      simulateRiskEvent,
      resetRiskEvent,
      simulatingEvent,
      riskEventActive,
      insuranceFlag,
      setInsuranceFlag,
      dispatchUnit,
      t,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
