import { render } from '@testing-library/react';

import ReactDagEditor from './react-dag-editor';

describe('ReactDagEditor', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReactDagEditor />);
    expect(baseElement).toBeTruthy();
  });
});
