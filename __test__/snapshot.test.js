import React from 'react'
import TestRenderer from 'react-test-renderer'
import intl from '@gem-mine/intl'
import BasicRouter from '@/export/component'

test('Error renderer', async (done) => {
  await intl.init({
    locale: 'zz',
    locales: {
      zz: {}
    }
  })
  const renderer = TestRenderer.create(
    <BasicRouter />
  )
  expect(renderer.toJSON()).toMatchSnapshot()
  done()
})