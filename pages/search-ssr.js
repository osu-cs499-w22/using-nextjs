import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

export default function Search(props) {
  const router = useRouter();
  const query = router.query.q;
  const [ inputQuery, setInputQuery ] = useState(query || "");
  // const [ repos, setRepos ] = useState([]);

  // useEffect(() => {
  //   if (query) {
  //     async function fetchSearchResults() {
  //       console.log("== Fetching search results for query:", query);
  //       setRepos(null);
  //       const response = await fetch(
  //         `https://api.github.com/search/repositories?q=${query}&sort=stars`
  //       );
  //       const responseBody = await response.json();
  //       setRepos(responseBody.items || []);
  //     }
  //
  //     fetchSearchResults();
  //   }
  // }, [ query ]);

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
      {!props.repos && <p>Loading...</p> }
      {props.repos && (
        <ul>
          {props.repos.map(repo => (
            <li key={repo.id}>
              <a href={repo.html_url}>{repo.full_name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const query = context.query.q;
  let repos = [];
  if (query) {
    console.log("== Fetching search results for query:", query);
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=stars`
    );
    const responseBody = await response.json();
    repos = responseBody.items || [];
  }
  return {
    props: {
      repos: repos
    }
  };
}
