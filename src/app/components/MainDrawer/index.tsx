import { Col, Drawer, Row } from 'antd'
import { Commands } from '../Commands'
import { PixelData } from '../PixelData'

export const MainDrawer: () => JSX.Element = () => {
  return (
    <Drawer
      placement='bottom'
      closable={false}
      open={true}
      mask={false}
      height={window.innerWidth > 770 ? 135 : 235}
    >
      <Row gutter={[16, 16]}>
        <Col sm={24} md={16}>
          <Commands />
        </Col>
        <Col sm={24} md={8}>
          <PixelData />
        </Col>
      </Row>
    </Drawer>
  )
}
