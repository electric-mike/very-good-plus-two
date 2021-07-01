function removeProtocol(path) {
  return path.replace(/http(s)?:/, '')
}

export default function getSizedImageUrl(src, size) {
  if (size === null) {
    return src
  }

  if (size === 'master') {
    return removeProtocol(src)
  }

  const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i)

  if (match) {
    const prefix = src.split(match[0])
    const suffix = match[0]

    return removeProtocol(`${prefix[0]}_${size}${suffix}`)
  }

  return null
}
