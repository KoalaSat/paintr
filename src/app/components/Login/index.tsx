import { Button, Card, Col, Input, Modal, notification, Row, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import { RelayPoolContext } from 'app/contexts/relayPoolContext'
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Login: () => JSX.Element = () => {
  const { t } = useTranslation()
  const { setPrivateKey, setPublicKey } = React.useContext(RelayPoolContext)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
  const [isModalRelaysOpen, setIsModalRelaysOpen] = useState<boolean>(false)
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
      title={t('login.login')}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText={t('login.cancelText')}
      okText={t('login.okText')}
      maskClosable={false}
      width='80%'
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Modal
            title={t('login.faqRelaysTitle')}
            open={isModalRelaysOpen}
            maskClosable={false}
            width='60%'
            onOk={() => setIsModalRelaysOpen(false)}
            onCancel={() => setIsModalRelaysOpen(false)}
          >
            <p>{t('login.faqRelaysDescription1')}</p>
            <p>{t('login.faqRelaysDescription2')}</p>
            <Typography.Text strong>{t('login.faqRelaysDescription3')}</Typography.Text>
          </Modal>
          <Card title={t('login.title1')} bordered={false}>
            <Typography.Text underline>{t('login.warning')}</Typography.Text>
            <Title level={4}>{t('login.title2')}</Title>
            <p>{t('login.description')}</p>
            <Typography.Link onClick={() => setIsModalRelaysOpen(true)}>
              {t('login.faqRelays')}
            </Typography.Link>
            <p>
              {t('login.footer')}
              <Typography.Link href='https://github.com/KoalaSat' target='_blank'>
                KoalaSat
              </Typography.Link>
            </p>
          </Card>
        </Col>
        <Col span={24}>
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
        </Col>
      </Row>
    </Modal>
  )
}
