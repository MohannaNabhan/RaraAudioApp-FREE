export const APP = {
  name: 'RaraAudioApp',
  version: '2.0.0',
  url: 'https://shop.raraaudioapp.com',
  api: 'https://api.raraaudioapp.com',
  domain: 'api.raraaudioapp.com'
}

export const EVENTS = {
  PUSHSTATE: 'pushstate',
  POPSTATE: 'popstate'
}

export const TYPEVOICEMEETER = [
  { id: '1', name: 'Normal' },
  { id: '2', name: 'Banana' },
  { id: '3', name: 'Potato' },
  { id: '4', name: 'Disabled' }
]

export const PRICING = [
  {
    reference: '1',
    name: '1 Month',
    price: 29.99,
    discount: true,
    percent: 50,
    month: 1,
    duration: 'month',
    popularity: false
  },
  {
    reference: '2',
    name: '3 Month',
    price: 24.99,
    discount: true,
    percent: 50,
    month: 3,
    duration: 'month',
    popularity: false
  },
  {
    reference: '3',
    name: '6 Month',
    price: 21.99,
    discount: true,
    percent: 50,
    month: 6,
    duration: 'month',
    popularity: true
  }
]
