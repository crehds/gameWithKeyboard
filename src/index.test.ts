// index.tsx mounts the app as a side effect of being imported, so the test
// imports it dynamically into a document that has no #root element.
describe('index entry', () => {
  it('fails with a clear error when the #root element is missing', async () => {
    document.body.innerHTML = '';

    await expect(import('./index')).rejects.toThrow(
      'Failed to find the root element (#root) to mount the app.',
    );
  });
});
