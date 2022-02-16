import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

export default function Search() {
  const router = useRouter();
  const query = router.query.q;
  const [ inputQuery, setInputQuery ] = useState(query || "");
  const [ repos, setRepos ] = useState([]);

  useEffect(() => {
    if (query) {
      async function fetchSearchResults() {
        console.log("== Fetching search results for query:", query);
        setRepos(null);
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${query}&sort=stars`
        );
        const responseBody = await response.json();
        setRepos(responseBody.items || []);
      }

      fetchSearchResults();
    }
  }, [ query ]);

  return (
    <div>
      <form onSubmit={(e) => {
        e.preventDefault();
        router.push(`${router.pathname}?q=${inputQuery}`);
      }}>
        <input
          value={inputQuery}
          onChange={e => setInputQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {!repos && <p>Loading...</p> }
      {repos && (
        <ul>
          {repos.map(repo => (
            <li key={repo.id}>
              <a href={repo.html_url}>{repo.full_name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
