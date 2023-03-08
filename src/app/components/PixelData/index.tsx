import { CopyOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Input, Modal, QRCode, Row, Tooltip, Typography } from 'antd'
import { PixelBoardContext } from 'app/contexts/pixelBoardContext'
import { RelayPoolContext } from 'app/contexts/relayPoolContext'
import { lightningInvoice } from 'app/Functions/ZapInvoice'
import { formatDistanceToNow, fromUnixTime } from 'date-fns'
import { Kind, Event, nip19 } from 'nostr-tools'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

export const PixelData: () => JSX.Element = () => {
  const { t } = useTranslation()
  const { get, metadata, addMetadata, relayUrls, privateKey, publicKey } =
    React.useContext(RelayPoolContext)
  const { selectedPixel } = React.useContext(PixelBoardContext)
  const [openModal, setOpenModal] = React.useState<boolean>(false)
  const [meta, setMeta] = React.useState<Event | null>()
  const [zapLud, setZapLud] = React.useState<string | null>()
  const [zapAmount, setZapAmount] = React.useState<number>(100)
  const [invoice, setInvoice] = React.useState<string>()
  const [username, setUsername] = React.useState<string | null>()
  const [picture, setPicture] = React.useState<string | null>()
  const [npub, setNpub] = React.useState<string | null>()

  React.useEffect(() => {
    setMeta(null)
    setUsername(null)
    setPicture(null)
    setZapLud(null)
    if (selectedPixel) {
      setNpub(nip19.npubEncode(selectedPixel.author))
      if (metadata[selectedPixel.author]) {
        setMeta(metadata[selectedPixel.author])
        const content = JSON.parse(metadata[selectedPixel.author].content)
        setUsername(content.name)
        setPicture(content.picture)
        setZapLud(content.lud06 && content.lud06 !== '' ? content.lud06 : content.lud16)
      } else if (selectedPixel.author && selectedPixel.author !== '') {
        get({
          kinds: [Kind.Metadata],
          authors: [selectedPixel.author],
        })
          .then((event) => {
            if (event) {
              setMeta(event)
              addMetadata(event)
            }
          })
          .catch(() => setMeta(null))
      }
    }
  }, [selectedPixel])

  const handleZap: () => void = () => {
    setOpenModal(true)
  }

  const handleOk: () => void = () => {
    setOpenModal(false)
  }

  const handleCancel: () => void = () => {
    setOpenModal(false)
    setInvoice(undefined)
  }

  const handleaCopyInvoice: () => void = () => {
    if (invoice) navigator.clipboard.writeText(invoice)
  }

  const handleaZapRequest: () => void = async () => {
    if (zapLud && privateKey && selectedPixel && meta) {
      lightningInvoice(
        relayUrls,
        zapLud,
        zapAmount,
        privateKey,
        publicKey,
        meta?.pubkey,
        `pixel ${selectedPixel.x}:${selectedPixel.y}`,
      ).then((value) => {
        if (value) setInvoice(value)
      })
    }
  }

  return (
    <Row>
      <Col span={24}>
        {selectedPixel && (
          <>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Avatar
                  shape='square'
                  size={64}
                  src={picture}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: selectedPixel.color }}
                >
                  {username ?? selectedPixel?.author}
                </Avatar>
              </Col>
              <Col span={12}>
                <Row>
                  <Typography.Text>{username}</Typography.Text>
                </Row>
                {selectedPixel?.author && (
                  <>
                    <Row>
                      <Typography.Text type='secondary'>
                        {`${npub?.slice(5, 13)}:${npub?.slice(-8)}`}
                      </Typography.Text>
                    </Row>
                    <Row>
                      {selectedPixel?.created_at && (
                        <Typography.Text keyboard>
                          {formatDistanceToNow(fromUnixTime(selectedPixel.created_at), {
                            addSuffix: true,
                          })}
                        </Typography.Text>
                      )}
                    </Row>
                  </>
                )}
              </Col>
              <Col span={6}>
                <Row justify='end'>
                  <Button
                    type='primary'
                    onClick={handleZap}
                    disabled={!privateKey || !zapLud || zapLud === ''}
                  >
                    {t('pixelData.zap')}
                  </Button>
                </Row>
              </Col>
            </Row>
          </>
        )}
      </Col>
      <Modal title={t('pixelData.zap')} open={openModal} onCancel={handleCancel} onOk={handleOk}>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input.Group compact>
                <Input
                  style={{ width: 'calc(100% - 140px)' }}
                  value={zapAmount}
                  onChange={(event) => setZapAmount(parseInt(event.target.value))}
                  suffix='Sats'
                />
                <Button type='primary' onClick={handleaZapRequest}>
                  {t('pixelData.genreateInvoice')}
                </Button>
              </Input.Group>
            </Col>
            {invoice && (
              <>
                <Col span={24}>
                  <Row justify='space-between'>
                    <QRCode value={invoice} />
                  </Row>
                </Col>
                <Col span={24}>
                  <Input.Group compact>
                    <Input style={{ width: 'calc(100% - 40px)' }} value={invoice} disabled />
                    <Tooltip title={t('pixelData.copyInvoice')}>
                      <Button icon={<CopyOutlined />} onClick={handleaCopyInvoice} />
                    </Tooltip>
                  </Input.Group>
                </Col>
              </>
            )}
          </Row>
        </Col>
      </Modal>
    </Row>
  )
}
