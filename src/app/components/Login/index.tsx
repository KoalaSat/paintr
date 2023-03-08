import { GithubOutlined } from '@ant-design/icons'
import { Button, Card, Col, Input, Modal, notification, Row, Typography } from 'antd'
import Title from 'antd/es/typography/Title'
import { RelayPoolContext } from 'app/contexts/relayPoolContext'
import { generatePrivateKey, getPublicKey, nip19 } from 'nostr-tools'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Login: () => JSX.Element = () => {
  const { t } = useTranslation()
  const { setPrivateKey, setPublicKey, setNip06, nip06Available } =
    React.useContext(RelayPoolContext)
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

  const extensionLogin: () => Promise<null | undefined> = async () => {
    if (!nip06Available) return null
    setPublicKey(await window.nostr.getPublicKey())
    setNip06(true)
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
      style={{
        maxWidth: 520,
      }}
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
            <Typography.Text>{t('login.faqRelaysDescription1')}</Typography.Text>
            <p />
            <Typography.Text>{t('login.faqRelaysDescription2')}</Typography.Text>
            <p />
            <Typography.Text strong>{t('login.faqRelaysDescription3')}</Typography.Text>
          </Modal>
          <Card title={t('login.title1')} bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Typography.Text underline>{t('login.warning')}</Typography.Text>
              </Col>
              <Col span={24}>
                <Title level={4}>
                  <img src='./logoWhite.png' style={{ width: 32, marginRight: 12 }} />
                  {t('login.title2')}
                </Title>
              </Col>
              <Col span={24}>{t('login.description')}</Col>
              <Col span={24}>
                <Typography.Link onClick={() => setIsModalRelaysOpen(true)}>
                  {t('login.faqRelays')}
                </Typography.Link>
              </Col>
              <Col span={24}>
                <Row>
                  <Col span={12}>
                    {t('login.footer')}
                    <Typography.Link href='https://github.com/KoalaSat' target='_blank'>
                      KoalaSat
                    </Typography.Link>
                  </Col>
                  <Col span={12}>
                    <Row justify='end'>
                      <Typography.Link
                        href='https://github.com/KoalaSat/paintr'
                        target='_blank'
                        rel='noreferrer'
                      >
                        <GithubOutlined />
                      </Typography.Link>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Input.Group compact>
            <Button>nsec</Button>
            <Input
              style={{
                width: nip06Available ? 'calc(100% - 165px)' : 'calc(100% - 65px)',
              }}
              value={nsec}
              onChange={(event) => setNsec(event.target.value)}
              hidden
              placeholder={t('login.secretKey')}
            />
            {nip06Available && (
              <Button type='primary' onClick={extensionLogin}>
                {t('login.extension')}
              </Button>
            )}
          </Input.Group>
        </Col>
      </Row>
    </Modal>
  )
}
