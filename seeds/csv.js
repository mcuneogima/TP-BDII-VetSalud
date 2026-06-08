import fs from 'fs'
import { parse } from 'csv-parse/sync'

export function readCsv(path) {
  const content = fs.readFileSync(path, 'utf8')

  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  })
}