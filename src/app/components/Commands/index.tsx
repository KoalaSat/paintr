import { Drawer } from 'antd'
import * as React from 'react'

export const Commands: () => JSX.Element = () => {
  return (
    <Drawer placement='bottom' closable={false} open={true} mask={false} height={150}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Drawer>
  )
}
