import { useState, useEffect } from 'react'
import intl from '@gem-mine/intl'
import LANGUAGE from './language'

const locales = {}
Object.keys(LANGUAGE).forEach(key => {
  // 如果语言包很小，建议全部使用本地化
  locales[key] = require(`./${key}`)
})

export default function useI18n() {
  const [isInited, setIsInited] = useState(false)

  useEffect(() => {
    intl.init({ locales }).then(() => {
      setIsInited(true)
    })
  }, [])

  return {
    isInited
  }
}

// formatMessage 和 FormattedMessage 都是为了兼容 react-intl的语法
export const formatMessage = ({ id, defaultMessage }) => intl.get(id) || defaultMessage

export function FormattedMessage({ id, defaultValue }) {
  return intl.get(id) || defaultValue || id
}
