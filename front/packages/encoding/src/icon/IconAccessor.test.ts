import { IconAccessor } from './IconAccessor'
import { IconEncoding } from './IconEncoding'


test('fixed value icon', () => {
  const encoding = new IconEncoding({value: 'refrigerator'})

  const icon = IconAccessor.getIcon(encoding, null)
  expect(icon.url).toEqual('refrigerator')
})

test('if field is defined get icon based on field value', () => {
  const encoding = new IconEncoding({field: 'type'})

  const icon = IconAccessor.getIcon(encoding, {type: 'refrigerator'})
  expect(icon.url).toEqual('refrigerator')
})

test('if value is null and has fallback asks for fallback', () => {
  const encoding = new IconEncoding({field: 'type', value: 'fallback'})

  const icon = IconAccessor.getIcon(encoding, {})
  expect(icon.url).toEqual('fallback')
})

test('if has map definition should translate the icon using it', () => {
  const map = {
    refrigerator: 'other-refrigerator',
  }
  const encoding = new IconEncoding({field: 'type', map})

  const icon = IconAccessor.getIcon(encoding, {type: 'refrigerator'})
  expect(icon.url).toEqual('other-refrigerator')
})

test('if has map definition but no entry should use the original value', () => {
  const map = {
    'refrigerator': 'other-refrigerator',
  }
  const encoding = new IconEncoding({field: 'type', map})

  const icon = IconAccessor.getIcon(encoding, {type: 'other-refrigerator'})
  expect(icon.url).toEqual('other-refrigerator')
})

test('is case insensitive', () => {
  const encoding = new IconEncoding({field: 'type'})

  const icon = IconAccessor.getIcon(encoding, {Type: 'refrigerator'})
  expect(icon.url).toEqual('refrigerator')
})

