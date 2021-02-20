import { Link } from "solid-app-router";

function Nav() {
  return (
    <header class="header">
      <nav class="inner">
        <Link href="/">
          <strong>HN</strong>
        </Link>
        <Link href="/new">
          <strong>New</strong>
        </Link>
        <Link href="/show">
          <strong>Show</strong>
        </Link>
        <Link href="/ask">
          <strong>Ask</strong>
        </Link>
        <Link href="/job">
          <strong>Jobs</strong>
        </Link>
        <a class="github" href="http://github.com/ryansolid/solid" target="_blank" rel="noreferrer">
          Built with Solid
        </a>
      </nav>
    </header>
  );
}

export default Nav;
