import React, { useState } from 'react';
import './App.css';
import News from './components/News';
import Headers from './components/Headers';
import About from './components/About';
import Footers from './components/Footers';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  // Log the API key to the console for debugging
  console.log("API Key:", process.env.REACT_APP_NEWS_API);

  // Method to handle search term updates
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm); // Update the search term in state
  };

  return (
    <div>
      <Router>
        <Headers Title="NewsNayab" Search={handleSearch} />
        <Switch>
          <Route exact path="/about">
            <About />
          </Route>

          {/* Home Route */}
          <Route exact path="/">
            <News
              pageSize={6}
              apikey={process.env.REACT_APP_NEWS_API}  // Use the API key directly from env
              country="us"
              category="general"
              searchTerm={searchTerm}
            />
          </Route>

          {/* Business Route */}
          <Route exact path="/business">
            <News
              key="business"
              pageSize={6}
              apikey={process.env.REACT_APP_NEWS_API}
              country="us"
              category="business"
              searchTerm={searchTerm}
            />
          </Route>
          <Route exact path="/entertainment">
            <News
              key="entertainment"
              pageSize={6}
              apikey={process.env.REACT_APP_NEWS_API}
              country="us"
              category="entertainment"
              searchTerm={searchTerm}
            />
          </Route>
          <Route exact path="/sports">
            <News
              key="sports"
              pageSize={6}
              apikey={process.env.REACT_APP_NEWS_API}
              country="us"
              category="sports"
              searchTerm={searchTerm}
            />
          </Route>
          <Route exact path="/health">
            <News
              key="health"
              pageSize={6}
              apikey={process.env.REACT_APP_NEWS_API}
              country="us"
              category="health"
              searchTerm={searchTerm}
            />
          </Route>
          <Route exact path="/science">
            <News
              key="science"
              pageSize={6}
              apikey={process.env.REACT_APP_NEWS_API}
              country="us"
              category="science"
              searchTerm={searchTerm}
            />
          </Route>
          <Route exact path="/technology">
            <News
              key="technology"
              pageSize={6}
              apikey={process.env.REACT_APP_NEWS_API}
              country="us"
              category="technology"
              searchTerm={searchTerm}
            />
          </Route>

          {/* Add additional routes as necessary */}
        </Switch>
        <Footers />
      </Router>
    </div>
  );
}
