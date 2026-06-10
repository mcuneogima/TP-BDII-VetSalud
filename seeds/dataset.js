const EXTENDED = process.argv.includes('--extended')

export function csvPath(name) {
  return `./data/${name}${EXTENDED ? '_ext' : ''}.csv`
}

export function isExtended() {
  return EXTENDED
}