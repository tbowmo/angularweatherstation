import { TruncateHeadPipe } from './truncate-head.pipe';

describe('TruncateHeadPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateHeadPipe();
    expect(pipe).toBeTruthy();
  });
});
