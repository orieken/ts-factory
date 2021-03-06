import { generateJsonPatternFor } from './chai-json-pattern-generator';
import { expect } from 'chai';

describe('generateJsonPatternFor', () => {
  it('String value schema', () => {
    class UghString {
      someString: string;
    }

    const generated = generateJsonPatternFor<UghString>({someString: 'a'});

    expect(generated).to.equal(`{ "someString": String, ... }`);
  });

  it('Boolean value schema', () => {
    class UghBoolean {
      someBoolean: boolean;
    }

    const generated = generateJsonPatternFor<UghBoolean>({someBoolean: true});

    expect(generated).to.equal(`{ "someBoolean": Boolean, ... }`);
  });

  it('Number value schema', () => {
    class UghNumber {
      someNumber: number;
    }

    const generated = generateJsonPatternFor<UghNumber>({someNumber: 123});

    expect(generated).to.equal(`{ "someNumber": Number, ... }`);
  });

  it('Object value schema', () => {
    class UghObject {
      someObject: { someBoolean: boolean };
    }

    const generated = generateJsonPatternFor<UghObject>({someObject: {someBoolean: true}});

    expect(generated).to.equal(`{ "someObject": { "someBoolean": Boolean, ... }, ... }`);
  });

  it('undefined value schema', () => {
    class UghUndefined {
      someUndefined?: '';
    }

    expect(() => { generateJsonPatternFor<UghUndefined>({someUndefined: undefined}); }).to.throw();
  });

  it('gives a helpful error message when property is undefined', () => {
    class UghUndefined {
      someUndefined?: '';
    }

    try {
      generateJsonPatternFor<UghUndefined>({someUndefined: undefined});
    } catch (e) {
      expect(e.message).to.equal('someUndefined was undefined'); // tslint:disable-line:no-unsafe-any
    }
  });

  it('Works with multiple properties', () => {
    class Ugh {
      someBoolean: boolean;
      someNumber: number;
      someString: string;
    }

    const generated = generateJsonPatternFor<Ugh>({
                                                    someBoolean: false,
                                                    someNumber: 123,
                                                    someString: 'abc'
                                                  });

    expect(generated).to.equal(`{ "someBoolean": Boolean,\n"someNumber": Number,\n"someString": String, ... }`);
  });

  describe('Array', () => {
    it('containing numbers', () => {
      class UghArray {
        someArray?: number[];
      }

      const generated = generateJsonPatternFor<UghArray>({someArray: [123]});

      expect(generated).to.equal(`{ "someArray": [ Number, ... ] OR [], ... }`);
    });

    it('containing strings', () => {
      class UghArray {
        someArray: string[];
      }

      const generated = generateJsonPatternFor<UghArray>({someArray: ['abc']});

      expect(generated).to.equal(`{ "someArray": [ String, ... ] OR [], ... }`);
    });

    it('containing booleans', () => {
      class UghArray {
        someArray: boolean[];
      }

      const generated = generateJsonPatternFor<UghArray>({someArray: [false]});

      expect(generated).to.equal(`{ "someArray": [ Boolean, ... ] OR [], ... }`);
    });

    it('containing objects', () => {
      class UghArray {
        someArray: Array<{ something: boolean }>;
      }

      const generated = generateJsonPatternFor<UghArray>({someArray: [{something: false}]});

      expect(generated).to.equal(`{ "someArray": [ { "something": Boolean, ... }, ... ] OR [], ... }`);
    });
  });

  describe('integration', () => {
    class Ugh {
      someArray: Array<{ something?: boolean }>;
      someBoolean: boolean;
      someEmptyArray: Array<{ somethingElse: string }>;
      someNumber: number;
      someObject: { someBoolean: boolean };
      someString: string;
      someThingWeDoNotCareAbout?: string;
    }

    type MockArrayItem = { notValid: boolean } | { something: boolean };

    const generatedValidPattern = generateJsonPatternFor<Ugh>({
                                                                someArray: [{something: true}],
                                                                someBoolean: false,
                                                                someEmptyArray: [{somethingElse: ''}],
                                                                someNumber: 458,
                                                                someObject: {someBoolean: true},
                                                                someString: 'a'
                                                              });

    const mockThing = (someArrayItem: MockArrayItem) => {
      const mockObject = {
        someArray: [{}],
        someBoolean: true,
        someEmptyArray: [],
        someNumber: 100000,
        someObject: {someBoolean: false},
        someString: 'bah',
        someThingWeDoNotCareAbout: 'still do not care'
      };

      mockObject.someArray.unshift(someArrayItem);
      return mockObject;
    };

    const mockThingToValidate = mockThing({notValid: false});
    const mockThingWithSomeValidToValidate: Ugh = mockThing({something: false});

    it('is valid', () => {
      // tslint:disable-next-line:no-unsafe-any
      (<any> expect(mockThingWithSomeValidToValidate)).to.matchPattern(generatedValidPattern);
    });

    it('is not valid due to array nestedObject being wrong', () => {
      // tslint:disable-next-line:no-unsafe-any
      (<any> expect(mockThingToValidate)).not.to.matchPattern(generatedValidPattern);
    });
  });
});
