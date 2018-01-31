'use strict';

import {expect} from 'chai';

import getSafeReg from '../src/index.js';

describe('test get safe reg', ()=>{
    let n;
    it('test get safe reg', ()=>{
        n = getSafeReg('/[|\\{}()[\]^$+*?.]/g'); 
        expect(n).to.equal('/\\[\\|\\\\\\{\\}\\(\\)\\[\\]\\^\\$\\+\\*\\?\\.\\]/g');
    });
    it('test reg is valid', ()=>{
        const patt = new RegExp(n);
        const res = patt.test('/[|\\{}()[\]^$+*?.]/g');
        expect(res).to.be.true;
    });
});
