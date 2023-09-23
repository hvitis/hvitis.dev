export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA4_TRACKING_ID

export const pageview = (url) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  })
}

export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

export const trackMosaicClick = (actionName, value = null) => {
  let trackObj = { action: 'Click', category: 'Mosaic', label: actionName }
  if (value) trackObj.value = value
  event(trackObj)
}
