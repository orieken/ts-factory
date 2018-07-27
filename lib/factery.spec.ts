import { Factery } from './factery';
import { expect } from 'chai';

describe('Factery', () => {

  // interface Foo {
  //   someBoolean: boolean;
  //   someObject: { test: { c: boolean } };
  //   string: string;
  // }

  // const foo: Foo = {
  //   someBoolean: false,
  //   someObject: {test: {c: true}},
  //   string: '',
  // };

  // const schema = `
  //       {
  //         "string": String,
  //         "someBoolean: Boolean,
  //         "someObject": {
  //           "test": {
  //             "c": Boolean
  //           }
  //         }
  //       }
  //     `;

  describe('schemaOf', () => {
    it('String value schema', () => {
      class UghString { someString: string; }
      const factery = Factery.schemaOf<UghString>({ someString: 'a' });

      expect(factery).to.equal(`{ "someString": String }`);
    });

    it('Boolean value schema', () => {
      class UghBoolean { someBoolean: boolean; }
      const factery = Factery.schemaOf<UghBoolean>({ someBoolean: true });

      expect(factery).to.equal(`{ "someBoolean": Boolean }`);
    });

    it('Number value schema', () => {
      class UghNumber { someNumber: number; }
      const factery = Factery.schemaOf<UghNumber>({ someNumber: 123 });

      expect(factery).to.equal(`{ "someNumber": Number }`);
    });

    it('Object value schema', () => {
      class UghObject { someObject: { someBoolean: boolean }; }
      const factery = Factery.schemaOf<UghObject>({ someObject: { someBoolean: true } });

      expect(factery).to.equal(`{ "someObject": { "someBoolean": Boolean } }`);
    });

    describe('Array', () => {
      it('containing numbers', () => {
        class UghArray { someArray: number[]; }
        const factery = Factery.schemaOf<UghArray>({ someArray: [123] });

        expect(factery).to.equal(`{ "someArray": [ Number ] }`);
      });

      it('containing strings', () => {
        class UghArray { someArray: string[]; }
        const factery = Factery.schemaOf<UghArray>({ someArray: ['abc'] });

        expect(factery).to.equal(`{ "someArray": [ String ] }`);
      });

      it('containing booleans', () => {
        class UghArray { someArray: boolean[]; }
        const factery = Factery.schemaOf<UghArray>({ someArray: [false] });

        expect(factery).to.equal(`{ "someArray": [ Boolean ] }`);
      });

      it('containing objects', () => {
        class UghArray { someArray: Array<{ something: boolean }>; }
        const factery = Factery.schemaOf<UghArray>({ someArray: [{ something: false }] });

        expect(factery).to.equal(`{ "someArray": [ { "something": Boolean } ] }`);
      });
    });
  });
});