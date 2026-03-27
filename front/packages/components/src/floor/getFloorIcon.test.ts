import {Floor} from './Floor'

describe('getFloorIcon', () => {
  it('should return a number if it is contained on the text', () => {
    expect(new Floor({name: ''}).acronym).toEqual('?')
    expect(new Floor({name: 'Floor 1'}).acronym).toEqual('1')
    expect(new Floor({name: 'Andar 2'}).acronym).toEqual('2')
    expect(new Floor({name: '3 Andar'}).acronym).toEqual('3')
    expect(new Floor({name: '4th Floor'}).acronym).toEqual('4')
    expect(new Floor({name: '5th Floor'}).acronym).toEqual('5')
    expect(new Floor({name: 'sixth floor'}).acronym).toEqual('6')
    expect(new Floor({name: 'seven floor'}).acronym).toEqual('7')
    expect(new Floor({name: '8th floor'}).acronym).toEqual('8')
    expect(new Floor({name: '9th floor'}).acronym).toEqual('9')
    expect(new Floor({name: '10th floor'}).acronym).toEqual('10')
    expect(new Floor({name: '11'}).acronym).toEqual('11')
    expect(new Floor({name: '1000'}).acronym).toEqual('1000')
    expect(new Floor({name: 'hundred'}).acronym).toEqual('100')
    expect(new Floor({name: 'Floor -1'}).acronym).toEqual('-1')
    expect(new Floor({name: 'Décimo Terceiro andar'}).acronym).toEqual('13')
  })

  it('should return a letter if it is as whole word on the text', () => {
    expect(new Floor({name: 'a'}).acronym).toEqual('A')
    expect(new Floor({name: 'Floor B'}).acronym).toEqual('B')
    expect(new Floor({name: 'aaa BBB C'}).acronym).toEqual('C')
  })

  it('should return the first letter', () => {
    expect(new Floor({name: 'Garagem'}).acronym).toEqual('G')
    expect(new Floor({name: 'Térreo'}).acronym).toEqual('T')
    expect(new Floor({name: '***Subsolo***'}).acronym).toEqual('S')
    expect(new Floor({name: 'Names with space'}).acronym).toEqual('N')
  })
})
