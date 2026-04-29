import {Theme} from '../src/theme';

describe('Project sanity', () => {
  it('has morphic spring config', () => {
    expect(Theme.spring.damping).toBe(18);
    expect(Theme.spring.stiffness).toBe(120);
  });
});
