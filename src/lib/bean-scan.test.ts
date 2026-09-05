import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { normalizeImagePayload, parseBeanProfileJson } from './bean-scan'

describe('parseBeanProfileJson', () => {
  it('parses a complete profile object', () => {
    const profile = parseBeanProfileJson({
      beansName: 'Yirgacheffe',
      origin: 'Ethiopia',
      variety: 'Heirloom',
      process: 'Washed',
      elevation: '1900m',
      roast: 'Light',
      taste: 'bergamot',
    })

    assert.equal(profile.origin, 'Ethiopia')
    assert.equal(profile.variety, 'Heirloom')
    assert.equal(profile.process, 'Washed')
  })

  it('reads JSON from a fenced model response and fills missing fields', () => {
    const profile = parseBeanProfileJson(`
Here you go:
\`\`\`json
{"beansName":"Guji","origin":"Ethiopia","process":"Natural"}
\`\`\`
`)

    assert.equal(profile.beansName, 'Guji')
    assert.equal(profile.origin, 'Ethiopia')
    assert.equal(profile.process, 'Natural')
    assert.equal(profile.variety, '')
    assert.equal(profile.elevation, '')
    assert.equal(profile.roast, '')
    assert.equal(profile.taste, '')
  })

  it('rejects text that is not JSON', () => {
    assert.throws(() => parseBeanProfileJson('no coffee here'), /JSON/)
  })
})

describe('normalizeImagePayload', () => {
  it('accepts jpeg payloads and strips a data URL prefix', () => {
    const result = normalizeImagePayload(
      'data:image/jpeg;base64,abc123',
      'image/jpeg',
    )
    assert.equal(result.mime, 'image/jpeg')
    assert.equal(result.data, 'abc123')
  })

  it('rejects unsupported mime types', () => {
    assert.throws(
      () => normalizeImagePayload('abc', 'application/pdf'),
      /JPEG/,
    )
  })
})
