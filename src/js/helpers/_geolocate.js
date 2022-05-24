export default async function geolocate() {
  const geocode = localStorage.getItem('geocode')
  const defaultCode = 'US'

  if (!geocode) {
    let code = defaultCode

    try {
      const data = await fetch('https://f1rb7jac1m.execute-api.us-east-2.amazonaws.com/default/geolocate').then(res => res.json())
      code = data.country_code ? data.country_code : defaultCode
    } catch {
      code = defaultCode
    }

    localStorage.setItem('geocode', code)

    return code
  }

  return geocode || defaultCode
}
