import React from 'react'
import { storiesOf } from '@storybook/react'
import { AngledButton } from './AngledButton'
import { action } from '@storybook/addon-actions'
import { AngleDirection } from './AngledPanel'

storiesOf('Components/Angled Button', module).add('with text', () => {
  const style = { margin: '5px' }
  return (
    <div>
      <div style={style}>
        <AngledButton onClick={action('Clicked 1')}>Test Me 1</AngledButton>
      </div>
      <div style={style}>
        <AngledButton leftSide={AngleDirection.Right} onClick={action('Clicked 2')}>
          Test Me 2
        </AngledButton>
      </div>
      <div style={style}>
        <AngledButton leftSide={AngleDirection.Right} rightSide={AngleDirection.Right} onClick={action('Clicked 3')}>
          Test Me 3
        </AngledButton>
      </div>
    </div>
  )
})
