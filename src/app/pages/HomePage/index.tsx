import { Col, Row } from 'antd'
import CanvasLayerOne from 'app/components/CanvasLayerOne'
import CanvasLayerTwo from 'app/components/CanvasLayerTwo'
import { Commands } from 'app/components/Commands'
import * as React from 'react'

export const HomePage: () => JSX.Element = () => {
  return (
    <Row>
      <Col>
        <div style={{ position: 'relative', height: 340, width: 340 }}>
          <CanvasLayerTwo />
          <CanvasLayerOne />
        </div>
      </Col>
      <Commands />
    </Row>
  )
}
