// @ts-nocheck
import currencies from '@/data/currencies'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Helper from './Helper'

const BRICK_LINK_URL = 'https://www.bricklink.com/v2/catalog/catalogitem.page?P=98138#T=C'
interface StatisticsInterface {
  size: { width: string; height: string }
  studsAvailable: number
  children: React.ReactNode
}

const Statistics = ({ size, studsAvailable, children }: StatisticsInterface) => {
  const [currency, setCurrency] = useState(currencies['EUR'])
  const [rates, setRates] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [price, setPrice] = useState(size.height * size.height * 0.04)
  const [priceInCurrency, setPriceInCurrency] = useState(null)

  const getExchangeRates = async (currency) => {
    const data = await fetch(`api/exchange/${currency}`)
    const json = await data.json()
    return json.rates // Always for EUR anyway
  }

  useEffect(() => {
    setPrice(size.height * size.height * 0.04)
    setPriceInCurrency(null)
    setCurrency(currencies['EUR'])
  }, [size])

  const calculateExchangeRateTo = async (currency) => {
    let data
    if (!rates) {
      setIsLoading(true)
      data = await getExchangeRates(currency)
      setRates(data)
    }
    setPriceInCurrency(price * (rates ? rates[currency] : data[currency]))
    setCurrency(currencies[currency])
    setIsLoading(false)
  }

  const roundUp = (num) => {
    return Math.round(num * 100) / 100
  }

  return (
    <div className="my-5 stats bg-primary text-primary flex lg:flex-row flex-col">
      <div className="stat lg:px-20">
        <div className="stat-title">Colors used</div>
        <div className="stat-value">{children.length}</div>
        <div className="stat-actions flex flex-row flex-wrap">{children}</div>
      </div>
      <div className="stat">
        <div className="stat-title">Max price</div>
        <div className="stat-value">
          {!isLoading && (
            <span className="flex justify-center">
              {roundUp(priceInCurrency || price)} {currency.sign}
              <Helper
                title="Price estimation"
                text="That is maximum cost of studs if bought separately."
                color="alert"
              ></Helper>
            </span>
          )}
          {isLoading && <span className="loading loading-dots loading-lg"></span>}
        </div>
        <div className="stat-actions">
          {Object.keys(currencies).map((currencyName) => {
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
        <div className="stat-value flex justify-center">
          {size.height * size.height}
          {studsAvailable != 0 && studsAvailable < size.height * size.height && (
            <Helper
              title="Studs count high"
              text={`Selected set has ${studsAvailable} studs. You might not have enough to finish this setup.`}
            />
          )}
        </div>
        <div className="stat-actions mt-max">
          <Link href={BRICK_LINK_URL} target="_blank" className="btn btn-sm btn-success">
            Buy studs
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Statistics
