// The engine toggles the "show" class and text of #toast directly.
export default function Toast() {
  return <div className="toast" id="toast" role="status" aria-live="polite" />;
}
