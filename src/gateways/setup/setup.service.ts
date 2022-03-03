import { retry } from 'rxjs';
import { customAlphabet } from 'nanoid';
/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';

@Injectable()
export class SetupService {
  public createEnterCode() {
    const char = customAlphabet('ABCDEFG', 2)();
    const num = Math.random().toString().slice(2, 4);
    const codeArr = char.split('').concat(num.split(''));
    const code = codeArr.sort(() => Math.random() - 0.5).join('');

    return code;
  }
  public agentSortation(agent: string) {
    if (agent.indexOf('VR') !== -1) return 'VR';
    if (agent.indexOf('OculusBrowser') !== -1) return 'VR';
    return 'PC';
  }
}
