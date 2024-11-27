import React, { useState, useEffect } from "react";
import SearchTextList from "./components/SearchTextList";
import PriceHistoryTable from "./components/PriceHistoryTable";
import axios from "axios";
import TrackedProductList from "./components/TrackedProductList";

const URL = "http://localhost:5000";

/**
 * The main App component. This component renders the main page for the application,
 * which includes a form to search for a new item, a list of previously searched items,
 * a list of currently tracked items, and a table to show the price history of a selected item.
 *
 * The component uses the `useState` hook to keep track of the following state variables:
 * - `showPriceHistory`: A boolean indicating whether the price history table should be shown.
 * - `priceHistory`: An array of objects, each representing a price history item.
 * - `searchTexts`: An array of strings, each representing a unique search text.
 * - `newSearchText`: A string representing the user's new search text.
 *
 * The component uses the `useEffect` hook to fetch the list of unique search texts from the
 * server when the component is mounted.
 *
 * The component defines the following functions:
 * - `fetchUniqueSearchTexts`: A function to fetch the list of unique search texts from the
 * server.
 * - `handleSearchTextClick`: A function to handle the event when a search text is clicked.
 * - `handlePriceHistoryClose`: A function to handle the event when the price history table is
 * closed.
 * - `handleNewSearchTextChange`: A function to handle the event when the user types something
 * in the new search text field.
 * - `handleNewSearchTextSubmit`: A function to handle the event when the user submits the new
 * search text form.
 */

function App() {
  const [showPriceHistory, setShowPriceHistory] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [searchTexts, setSearchTexts] = useState([]);
  const [newSearchText, setNewSearchText] = useState("");

  useEffect(() => {
    fetchUniqueSearchTexts();
  }, []);

  /**
   * Fetches the list of unique search texts from the server and updates the component's
   * state with the fetched list.
   *
   * This function is called in the component's `useEffect` hook when the component is mounted.
   */
  const fetchUniqueSearchTexts = async () => {
    try {
      const response = await axios.get(`${URL}/unique_search_texts`);
      const data = response.data;
      setSearchTexts(data);
    } catch (error) {
      console.error("Error fetching unique search texts:", error);
    }
  };

  const handleSearchTextClick = async (searchText) => {
    try {
      const response = await axios.get(
        `${URL}/results?search_text=${searchText}`
      );

      const data = response.data;
      setPriceHistory(data);
      setShowPriceHistory(true);
    } catch (error) {
      console.error("Error fetching price history:", error);
    }
  };

  const handlePriceHistoryClose = () => {
    setShowPriceHistory(false);
    setPriceHistory([]);
  };

  const handleNewSearchTextChange = (event) => {
    setNewSearchText(event.target.value);
  };

  const handleNewSearchTextSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${URL}/start-scraper`, {
        search_text: newSearchText,
        url: "https://amazon.ca",
      });

      alert("Scraper started successfully");
      setSearchTexts([...searchTexts, newSearchText]);
      setNewSearchText("");
    } catch (error) {
      alert("Error starting scraper:", error);
    }
  };

  return (
    <div className="main">
      <h1>Product Search Tool</h1>
      <form onSubmit={handleNewSearchTextSubmit}>
        <label>Search for a new item:</label>
        <input
          type="text"
          value={newSearchText}
          onChange={handleNewSearchTextChange}
        />
        <button type="submit">Start Scraper</button>
      </form>
      <SearchTextList
        searchTexts={searchTexts}
        onSearchTextClick={handleSearchTextClick}
      />
      <TrackedProductList />
      {showPriceHistory && (
        <PriceHistoryTable
          priceHistory={priceHistory}
          onClose={handlePriceHistoryClose}
        />
      )}
    </div>
  );
}

export default App;
