import { A } from "@solidjs/router";

export default function Nav() {
  return (
    <header class="header" $ServerOnly>
      <nav class="inner">
        <A href="/">
          <strong $ServerOnly>HN</strong>
        </A>
        <A href="/new">
          <strong $ServerOnly>New</strong>
        </A>
        <A href="/show">
          <strong $ServerOnly>Show</strong>
        </A>
        <A href="/ask">
          <strong $ServerOnly>Ask</strong>
        </A>
        <A href="/job">
          <strong $ServerOnly>Jobs</strong>
        </A>
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
