import { Button, Input, Modal, Steps } from 'antd'
import { RelayPoolContext } from 'app/contexts/relayPoolContext'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export const Relays: () => JSX.Element = () => {
  const { t } = useTranslation()
  const { relayUrls, addRelays } = React.useContext(RelayPoolContext)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [inputRelay, setInputRelay] = React.useState<string>('')
  const [newRelays, setNewRelays] = React.useState<string[]>([])

  const handleOk: () => void = () => {
    addRelays(newRelays)
    setNewRelays([])
    setOpenModal(false)
  }

  const handleCancel: () => void = () => {
    setNewRelays([])
    setOpenModal(false)
  }

  const handleaddRelay: () => void = () => {
    setNewRelays((prev) => {
      prev.push(inputRelay)
      return prev
    })
    setInputRelay('')
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
        <Steps
          progressDot
          current={relayUrls.length - 1}
          direction='vertical'
          items={[...relayUrls, ...newRelays].map((relay) => {
            return {
              title: relay,
            }
          })}
        />
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 135px)' }}
            value={inputRelay}
            onChange={(event) => setInputRelay(event.target.value)}
          />
          <Button type='primary' onClick={handleaddRelay}>
            {t('relays.addRelay')}
          </Button>
        </Input.Group>
      </Modal>
    </>
  )
}
