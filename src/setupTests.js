// jest-dom adds custom matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';

// jsdom does not implement HTMLDialogElement.prototype.showModal/close (as of
// jsdom 30 / this project's version), so <dialog> elements throw
// "showModal is not a function" in tests. This is a minimal stub that only
// toggles the `open` attribute, enough for the game's dialogs (DifficultyDialog,
// ResultDialog) to open/close in jsdom without pulling in native modal
// semantics (focus trapping, top-layer rendering, ::backdrop) that jsdom
// doesn't support anyway.
if (typeof window !== 'undefined' && window.HTMLDialogElement
  && !window.HTMLDialogElement.prototype.showModal) {
  window.HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute('open', '');
  };
  window.HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute('open');
    this.dispatchEvent(new window.Event('close'));
  };
}
