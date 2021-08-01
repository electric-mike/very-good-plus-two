export default function currency(str) {
  // shopify API prices are stupid
  str = str ? str.toString() : '000'

  const decimalVal = str.substring(str.length - 2)
  const beforeDecimal = str.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace('.', '')

  return decimalVal !== '00' ? `$${beforeDecimal}.${decimalVal}` : `$${beforeDecimal}`
  // return `$${beforeDecimal}.${decimalVal}`
}
