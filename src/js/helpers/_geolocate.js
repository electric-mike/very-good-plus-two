export default async function geolocate() {
  const geocode = localStorage.getItem('geocode')
  const defaultCode = 'US'

  if (!geocode) {
    const data = await fetch('https://freegeoip.app/json/').then(res => res.json())
    const code = data.country_code ? data.country_code : defaultCode

    localStorage.setItem('geocode', code)

    return code
  }

  return geocode || defaultCode
}
