import { Col, Row } from 'antd'
import CanvasLayerOne from 'app/components/CanvasLayerOne'
import CanvasLayerTwo from 'app/components/CanvasLayerTwo'
import { Login } from 'app/components/Login'
import { MainDrawer } from 'app/components/MainDrawer'
import { RelayPoolContext } from 'app/contexts/relayPoolContext'
import React from 'react'

export const HomePage: () => JSX.Element = () => {
  const { publicKey } = React.useContext(RelayPoolContext)

  return (
    <Row>
      {publicKey ? (
        <>
          <Col>
            <CanvasLayerTwo />
            <CanvasLayerOne />
          </Col>
          <MainDrawer />
        </>
      ) : (
        <Login />
      )}
    </Row>
  )
}
