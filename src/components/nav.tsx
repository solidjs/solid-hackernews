export default function Nav() {
  return (
    <header class="header" $ServerOnly>
      <nav class="inner">
        <a href="/">
          <strong $ServerOnly>HN</strong>
        </a>
        <a href="/new">
          <strong $ServerOnly>New</strong>
        </a>
        <a href="/show">
          <strong $ServerOnly>Show</strong>
        </a>
        <a href="/ask">
          <strong $ServerOnly>ask</strong>
        </a>
        <a href="/job">
          <strong $ServerOnly>Jobs</strong>
        </a>
        <a
          class="github"
          href="http://github.com/solidjs/solid"
          target="_blank"
          rel="noreferrer"
        >
          Built with Solid
        </a>
      </nav>
    </header>
  );
}
