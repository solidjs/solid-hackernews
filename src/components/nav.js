import { Link } from "solid-app-router";

export default function Nav() {
  return (
    <header class="header">
      <nav class="inner">
        <Link href="">
          <b>HN</b>
        </Link>
        <Link href="new">
          <b>New</b>
        </Link>
        <Link href="show">
          <b>Show</b>
        </Link>
        <Link href="ask">
          <b>Ask</b>
        </Link>
        <Link href="job">
          <b>Jobs</b>
        </Link>
        <a class="github" href="http://github.com/ryansolid/solid" target="_blank" rel="noreferrer">
          Built with Solid
        </a>
      </nav>
    </header>
  );
}
