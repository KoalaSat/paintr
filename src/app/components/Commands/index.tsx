import Icon from '@ant-design/icons'
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon'
import { Button, Col, Radio, Row } from 'antd'
import { PixelBoardContext } from 'app/contexts/pixelBoardContext'
import { RelayPoolContext } from 'app/contexts/relayPoolContext'
import { getUnixTime } from 'date-fns'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Relays } from '../Relays'

export const Commands: () => JSX.Element = () => {
  const { t } = useTranslation()
  const { publish, publicKey, privateKey } = React.useContext(RelayPoolContext)
  const { selectedPixel, authors } = React.useContext(PixelBoardContext)
  const [selectedColor, setSelectedColor] = React.useState<string>()
  const [countDownDate, setCountDownDate] = React.useState<number>()
  const [countDown, setCountDown] = React.useState(-1)

  const remaninigTime: () => number = () => {
    if (!authors[publicKey]) return -1
    return authors[publicKey] + 60 - getUnixTime(new Date())
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(remaninigTime())
    }, 1000)

    return () => clearInterval(interval)
  }, [countDownDate])

  const pointSvg: () => JSX.Element = () => (
    <svg width='1.5em' height='1.5em' fill='currentColor' viewBox='0 0 2048 2048'>
      <circle cx='1024' cy='1200' r='700' stroke='black' strokeWidth='15' />
    </svg>
  )

  const PointIcon: (props: Partial<CustomIconComponentProps>) => JSX.Element = (props) => (
    <Icon component={pointSvg} {...props} />
  )

  const onPlace: () => void = () => {
    if (selectedPixel && selectedColor) {
      publish(`${selectedPixel.x}:${selectedPixel.y}:${selectedColor}`)
      setCountDownDate(getUnixTime(new Date()))
    }
  }

  const palette = React.useMemo(() => {
    const colors = [
      '#fff100',
      '#ff8c00',
      '#e81123',
      '#ec008c',
      '#68217a',
      '#00188f',
      '#00bcf2',
      '#00b294',
      '#009e49',
      '#bad80a',
      '#ffffff',
      '#000000',
    ]
    return colors.map((color) => {
      return {
        value: color,
        label: <PointIcon style={{ color }} />,
      }
    })
  }, [])

  return (
    <Row justify='space-between' gutter={[0, 16]}>
      <Col span={24}>
        <Row justify='space-around'>
          <Radio.Group
            options={palette}
            onChange={(value) => setSelectedColor(value.target.value)}
            value={selectedColor}
            optionType='button'
            buttonStyle='solid'
            disabled={!privateKey}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Row justify='space-around'>
          <Col>
            <Relays />
          </Col>
          <Col>
            <Button
              type='primary'
              size='large'
              disabled={!privateKey || !selectedPixel || !selectedColor || remaninigTime() > 0}
              onClick={onPlace}
            >
              {countDown > 0 ? `${t('commands.place')} (${countDown})` : t('commands.place')}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
