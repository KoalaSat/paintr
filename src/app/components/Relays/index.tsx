import { Button, Input, List, Modal, Row, Col } from 'antd'
import { RelayPoolContext } from 'app/contexts/relayPoolContext'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export const Relays: () => JSX.Element = () => {
  const { t } = useTranslation()
  const { relayUrls, addRelays } = React.useContext(RelayPoolContext)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [inputRelay, setInputRelay] = React.useState<string>('')
  const [newRelays, setNewRelays] = React.useState<string[]>(relayUrls)

  React.useEffect(() => {
    if (openModal) setNewRelays(relayUrls)
  }, [openModal])

  const handleOk: () => void = () => {
    addRelays(newRelays)
    setNewRelays([])
    setOpenModal(false)
  }

  const handleCancel: () => void = () => {
    setNewRelays([])
    setOpenModal(false)
  }

  const handleAddRelay: () => void = () => {
    setNewRelays((prev) => {
      prev.push(inputRelay)
      return prev
    })
    setInputRelay('')
  }

  const handleDeleteRelay: (url: string) => void = (url) => {
    setNewRelays((prev) => prev.filter((item) => item !== url))
  }

  return (
    <>
      <Button type='default' size='large' onClick={() => setOpenModal(!openModal)}>
        {t('relays.button')}
      </Button>
      <Modal
        title={t('relays.title')}
        open={openModal}
        onOk={handleOk}
        okText={t('relays.reload')}
        onCancel={handleCancel}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <List
              bordered
              dataSource={newRelays}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta title={item} />
                  <Button type='primary' danger onClick={() => handleDeleteRelay(item)}>
                    {t('relays.delete')}
                  </Button>
                </List.Item>
              )}
            />
          </Col>
          <Col span={24}>
            <Input.Group compact>
              <Input
                style={{ width: 'calc(100% - 135px)' }}
                value={inputRelay}
                onChange={(event) => setInputRelay(event.target.value)}
              />
              <Button type='primary' onClick={handleAddRelay}>
                {t('relays.addRelay')}
              </Button>
            </Input.Group>
          </Col>
        </Row>
      </Modal>
    </>
  )
}
