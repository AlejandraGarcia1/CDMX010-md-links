const {print}= require( './helper.js')

describe('Suit de test unitario',()=>{
    test('recibir mensaje',()=>{
        expect(print('holi')).toBe('Estoy recibiendo holi')
    })
})

