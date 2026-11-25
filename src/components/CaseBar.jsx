export default function CaseBar({ html, visible }) {
  return <section className="cb" id="cb" aria-label="Case" hidden={!visible} dangerouslySetInnerHTML={{ __html: html }} />;
}
