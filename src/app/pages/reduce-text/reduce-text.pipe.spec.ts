import { ReduceTextPipe } from './reduce-text.pipe';

describe('Reduce Text Pipe', () => {
  let pipe: ReduceTextPipe;

  beforeEach(() => {
    pipe = new ReduceTextPipe();
  });

  it('Should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('Should use transform correctly', () => {
    const text = 'Hello this is a test to check the pipe';
    const newText = pipe.transform(text, 5);
    expect(newText.length).toBe(5);
  });
});
