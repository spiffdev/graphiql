import GraphiQL from 'graphiql';
import 'graphiql/graphiql.min.css';
import {ChangeEventHandler, useCallback, useState} from 'react';

function App() {
  const exampleUrl = "http://localhost:1234/graphql"
  const [headers, setHeaders] = useState("{}");
  const [headersField, setHeadersField] = useState("");
  const [url, setUrl] = useState(exampleUrl);
  const [urlField, setUrlField] = useState(exampleUrl);

  const fetcher = useCallback(async (graphQLParams) => {
    if (!url) {
      return "";
    }
    let extraHeaders = {};
    try {
      extraHeaders = JSON.parse(headers);
    } catch (e) {
      console.error('Failed to parse headers.');
    }
    const data = await fetch(
      url,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...extraHeaders,
        },
        body: JSON.stringify(graphQLParams),
        credentials: 'same-origin',
      },
    );
    return data.json().catch(() => data.text());
  }, [headers, url]);

  const handleUrlInput: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setUrlField(e.target.value);
  }, []);

  const handleSetButton = useCallback(() => {
    setHeaders(headersField);
    setUrl(urlField);
  }, [headersField, urlField]);

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <div>
        <label>GraphQL endpoint</label>
        <button onClick={handleSetButton}>Set URL and headers</button>
        <input value={urlField} onChange={handleUrlInput} style={{width: '50%'}} />
      </div>
      <GraphiQL
        fetcher={fetcher}
        headers={headersField}
        onEditHeaders={setHeadersField}
      />
    </div>
  );
}

export default App;
