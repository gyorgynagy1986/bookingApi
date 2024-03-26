import React from 'react'
import GetApp from '../../../components/dashboard/(user)/getMyAppoitements/GetMyAppoitements'
import GetServices from '../../../components/dashboard/(user)/getMyservices/GetMyservices'

const page = () => {

  return (
    <div>
        <GetApp />
        <GetServices />
    </div>
  )
}

export default page