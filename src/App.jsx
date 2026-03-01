import { AppProvider, useApp } from './context/AppContext'
import Landing from './portals/Landing'
import CommercialPortal from './portals/CommercialPortal'
import CDPortal from './portals/CDPortal'
import InsurancePortal from './portals/InsurancePortal'

function PortalRouter() {
  const { portal, lang } = useApp()

  return (
    <div dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {portal === 'landing'    && <Landing />}
      {portal === 'commercial' && <CommercialPortal />}
      {portal === 'cd'         && <CDPortal />}
      {portal === 'insurance'  && <InsurancePortal />}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <PortalRouter />
    </AppProvider>
  )
}
