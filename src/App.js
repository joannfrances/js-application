import './App.css';
import React, { useEffect, useState } from "react";
import Repository from './Models/Repository';

function App() {
    
    var [stateValue, setStateValue] = useState("");
    var [stateRepositories, setStateRepositories] = useState([]);
    var [stateLoading, setStateLoading] = useState(false);
    var [stateSearched, setStateSearched] = useState(false);
    
    function onChange(e) {
        setStateValue(e.target.value);
    }
    
    function submit(e) {

        e.stopPropagation();

        if(!stateValue)
            return;

        setStateLoading(true);
        setStateSearched(false);
        
        fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(stateValue)}`)
            .then(response => response.json())
            .then(data => {
                const repositories = data.items.map(rep => new Repository(rep.name, rep['html_url'], rep['stargazers_count'], rep['forks_count']))
                setStateRepositories(repositories);
                setStateSearched(true);
            })
            .finally(() => setStateLoading(false));
    }

    function renderRepositories() {
        if(stateLoading)
            return <div>Loading</div>

        if(stateRepositories.length > 0) {
            return (
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Stars</td>
                        <td>Forks</td>
                    </tr>
                </thead>
                <tbody>
                    {stateRepositories.map((repository, key) => {
                        return (
                            <tr key={key}> 
                                <td>{repository.name}</td>
                                <td>{repository.stars}</td>
                                <td>{repository.forks}</td>
                                <tr><a href={repository.url}>Go to repository</a></tr>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            )
        }

        if(stateSearched)
            return <div>No results found</div>
    }
    
    return (
    <div className="App">
        <input type="text" value={stateValue} onChange={onChange} />
        <input type="button" value="Submit" disabled={!stateValue || stateLoading} onClick={submit} />
        {renderRepositories()}
    </div>
    );
}

export default App;
