export default function Nav({ html, cls = 'nav' }) {
  return <header className={cls} id="nav" dangerouslySetInnerHTML={{ __html: html }} />;
}
