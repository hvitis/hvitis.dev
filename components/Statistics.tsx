// @ts-nocheck
import { InfoIcon } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface StatisticsInterface {
  size: number
  children: any
}

const CURRENCIES = {
  EUR: {
    name: 'EUR',
    sign: '€',
  },
  PLN: {
    name: 'PLN',
    sign: 'zł',
  },
  DKK: {
    name: 'DKK',
    sign: 'kr.',
  },
  USD: {
    name: 'USD',
    sign: '$',
  },
}

const Statistics = ({ size = 10, children }: StatisticsInterface) => {
  const [currency, setCurrency] = useState(CURRENCIES['EUR'])
  const [rates, setRates] = useState(null)
  const [price, setPrice] = useState(size * size * 0.04)
  const [priceInCurrency, setPriceInCurrency] = useState(null)

  const getExchangeRates = async (currency) => {
    const data = await fetch(`api/exchange/${currency}`)
    const json = await data.json()
    return json.rates // Always for EUR anyway
  }

  useEffect(() => {
    setPrice(size * size * 0.04)
    setPriceInCurrency(null)
    setCurrency(CURRENCIES['EUR'])
  }, [size])

  const calculateExchangeRateTo = async (currency) => {
    let data
    if (!rates) {
      data = await getExchangeRates(currency)
      setRates(data)
    }
    setPriceInCurrency(price * (rates ? rates[currency] : data[currency]))
    setCurrency(CURRENCIES[currency])
  }

  const roundUp = (num) => {
    return Math.round(num * 100) / 100
  }

  return (
    <div className="my-5 stats bg-primary text-primary flex lg:flex-row flex-col">
      <div className="stat lg:px-20">
        <div className="stat-title">Colors</div>
        <div className="stat-value">{children.length}</div>
        <div className="stat-actions flex flex-row flex-wrap">{children}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Approximated price</div>
        <div className="stat-value">
          {roundUp(priceInCurrency || price)} {currency.sign}
        </div>
        <div className="stat-actions">
          {Object.keys(CURRENCIES).map((currencyName) => {
            return (
              <button
                key={currencyName}
                onClick={() => calculateExchangeRateTo(currencyName)}
                className="btn btn-sm mx-1"
              >
                {currencyName}
              </button>
            )
          })}
        </div>
      </div>
      <div className="stat">
        <div className="stat-title">Studs</div>
        <div className="stat-value">{size * size}</div>
        <div className="stat-actions">
          <Link
            href={'https://www.bricklink.com/v2/catalog/catalogitem.page?P=4073#T=C'}
            target="_blank"
            className="btn btn-sm btn-success"
          >
            Buy studs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Statistics
