import {
  getBorderColor,
  getBorderWidth,
  getCursor,
  getUserSelect,

} from './RowPlaceCardBorder'
import {RowPlaceStatus} from './RowPlaceCard'

const fakeTheme = {
  palette: {
    primary: {
      main: 'primary',
    },
    text: {
      primary: 'text',
    },
    spec: {
      shadowCanvasButton: 'shadow',
      borderColor: 'borderColor',
    },
  },
} as any

describe('RowPlaceCardBorder', () => {
  describe('getCursor', () => {
    it('should return default when is PLACED or SAVING', () => {
      expect(getCursor(RowPlaceStatus.PLACED, true)).toEqual('inherit')
      expect(getCursor(RowPlaceStatus.PLACED, false)).toEqual('inherit')
      expect(getCursor(RowPlaceStatus.SAVING, true)).toEqual('inherit')
      expect(getCursor(RowPlaceStatus.SAVING, false)).toEqual('inherit')
    })
    it('should return not-allowed when is disabled', () => {
      expect(getCursor(RowPlaceStatus.NOT_PLACED, false)).toEqual('not-allowed')
      expect(getCursor(RowPlaceStatus.PLACING, false)).toEqual('not-allowed')
    })
    it('should return not-allowed when status is PLACING', () => {
      expect(getCursor(RowPlaceStatus.PLACING, true)).toEqual('not-allowed')
    })
    it('should return move when status is NOT_PLACED', () => {
      expect(getCursor(RowPlaceStatus.NOT_PLACED, true)).toEqual('move')
    })
  })

  describe('getUserSelect', () => {
    it('should return none when is disabled', () => {
      expect(getUserSelect(RowPlaceStatus.NOT_PLACED, false)).toEqual('none')
      expect(getUserSelect(RowPlaceStatus.PLACING, false)).toEqual('none')
      expect(getUserSelect(RowPlaceStatus.SAVING, false)).toEqual('none')
      expect(getUserSelect(RowPlaceStatus.PLACED, false)).toEqual('none')
    })
    it('should return none when status is PLACING or PLACED', () => {
      expect(getUserSelect(RowPlaceStatus.PLACING, true)).toEqual('none')
      expect(getUserSelect(RowPlaceStatus.PLACED, true)).toEqual('none')
      expect(getUserSelect(RowPlaceStatus.SAVING, true)).toEqual('none')
    })
    it('should return inherit when status is NOT_PLACED', () => {
      expect(getUserSelect(RowPlaceStatus.NOT_PLACED, true)).toEqual('inherit')
    })
  })

  describe('getBorderWidth', () => {
    it('should return 0 when status is PLACED', () => {
      expect(getBorderWidth(RowPlaceStatus.PLACED)).toEqual(0)
    })
    it('should return 2 when is not placed', () => {
      expect(getBorderWidth(RowPlaceStatus.PLACING)).toEqual(2)
      expect(getBorderWidth(RowPlaceStatus.SAVING)).toEqual(2)
      expect(getBorderWidth(RowPlaceStatus.NOT_PLACED)).toEqual(2)
    })
  })
  describe('getBorderColor', () => {
    it('should return transparent when status is PLACED', () => {
      expect(getBorderColor(RowPlaceStatus.PLACED, true, fakeTheme)).toEqual('transparent')
    })
    it('should return borderColor when is PLACING or SAVING', () => {
      expect(getBorderColor(RowPlaceStatus.PLACING, true, fakeTheme)).toEqual('borderColor')
      expect(getBorderColor(RowPlaceStatus.SAVING, true, fakeTheme)).toEqual('borderColor')
    })
    it('should return borderColor when is not enabled', () => {
      expect(getBorderColor(RowPlaceStatus.NOT_PLACED, false, fakeTheme)).toEqual('borderColor')
      expect(getBorderColor(RowPlaceStatus.PLACING, false, fakeTheme)).toEqual('borderColor')
      expect(getBorderColor(RowPlaceStatus.SAVING, false, fakeTheme)).toEqual('borderColor')
    })
    it('should return primary when is NOT_PLACED', () => {
      expect(getBorderColor(RowPlaceStatus.NOT_PLACED, true, fakeTheme)).toEqual('primary')
    })
  })
})
