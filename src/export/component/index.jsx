import React from 'react'
import intl from '@gem-mine/intl'
import useI18n from '@/export/i18n'
import Eg from './eg'

export default function EgComponent() {
  const { isInited } = useI18n()
  return (
    isInited &&
      (
        <div>
          <div>
            {intl.get('welcome')}
          </div>
          <Eg />
        </div>
      )
  )
}
