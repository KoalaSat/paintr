import { Button, Input, Modal, notification } from 'antd'
import { RelayPoolContext } from 'app/contexts/relayPoolContext'
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Login: () => JSX.Element = () => {
  const { t } = useTranslation()
  const { setPrivateKey, setPublicKey } = React.useContext(RelayPoolContext)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
  const [nsec, setNsec] = useState<string>()

  const handleOk: () => void = () => {
    if (nsec) {
      try {
        const { data } = nip19.decode(nsec)
        const pk = getPublicKey(data as string)
        setPrivateKey(data as string)
        setPublicKey(pk)
        setIsModalOpen(false)
      } catch {
        notification.error({
          message: t('login.invalidNsec'),
        })
      }
    }
  }

  const handleCancel: () => void = () => {
    const sk = generatePrivateKey()
    const pk = getPublicKey(sk)
    setPublicKey(pk)
    setIsModalOpen(false)
  }

  return (
    <Modal
      title='Basic Modal'
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Input.Group compact>
        <Button>nsec</Button>
        <Input
          style={{ width: 'calc(100% - 65px)' }}
          value={nsec}
          onChange={(event) => setNsec(event.target.value)}
          hidden
          placeholder={t('login.secretKey')}
        />
      </Input.Group>
    </Modal>
  )
}
