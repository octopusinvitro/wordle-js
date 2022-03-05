describe('State', () => {
  describe('.fromName', () => {
    it('gets the enum from its name', () => {
      expect(State.fromName('correct')).toEqual(State.CORRECT);
    });
  });

  describe('#constructor', () => {
    it('behaves like an enum', () => {
      expect(State.CORRECT.name).toEqual('correct');
      expect(State.PRESENT.name).toEqual('present');
      expect(State.ABSENT.name).toEqual('absent');
    });

    it('can compare with a value', () => {
      expect(State.CORRECT === State.CORRECT).toEqual(true);
    });

    it('gets all allowed values', () => {
      expect(Object.keys(State)).toEqual(['CORRECT', 'PRESENT', 'ABSENT']);
    });
  });

  describe('#tile', () => {
    it('returns the right tile for a state', () => {
      expect(State.CORRECT.tile).toEqual('🟩');
      expect(State.PRESENT.tile).toEqual('🟨');
      expect(State.ABSENT.tile).toEqual('⬛');
    });
  });
});
