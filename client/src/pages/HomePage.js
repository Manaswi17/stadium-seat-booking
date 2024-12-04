import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage({ onLogout }) {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [nameSearch, setNameSearch] = useState("");
  const limit = 9;
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Top Suggestions Array for Sliding Banner
  const topSuggestions = [
    { id: 1, imgSrc: "/banners/banner1.jpg", alt: "Event 1" },
    { id: 2, imgSrc: "/banners/banner2.jpg", alt: "Event 2" },
    { id: 3, imgSrc: "/banners/banner3.jpg", alt: "Event 3" },
    { id: 4, imgSrc: "/banners/banner4.jpg", alt: "Event 4" },
  ];

  // Automatic sliding effect for the banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % topSuggestions.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, [topSuggestions.length]);

  // Fetch events with optional search term
  const fetchEvents = async (searchName = "") => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/events", {
        params: { page, limit, search: searchName },
      });
      const sortedEvents = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
      setUpcomingEvents(sortedEvents);
      setLoading(false);
    } catch (err) {
      setError("Error fetching events");
      setLoading(false);
    }
  };

  // Initial fetch of events on page load and page change
  useEffect(() => {
    fetchEvents();
  }, [page]);

  // Handle search
  const handleSearch = () => {
    setPage(1);
    fetchEvents(nameSearch);
  };

  // Clear search and reset events
  const handleClearSearch = () => {
    setNameSearch("");
    setPage(1);
    fetchEvents();
  };

  // Pagination controls
  const handleNextPage = () => setPage((prevPage) => prevPage + 1);
  const handlePrevPage = () => setPage((prevPage) => Math.max(prevPage - 1, 1));

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading events...</p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-serif">Arena Vibes!</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/my-bookings")}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-all"
          >
            My Bookings
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Sliding Banner */}
      {/* Sliding Banner */}
      <div className="relative w-full h-[400px] bg-black flex items-center justify-center overflow-hidden rounded-lg shadow-md mb-8">
        <div
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${100 * topSuggestions.length}%`,
          }}
        >
          {topSuggestions.map((slide) => (
            <div
              key={slide.id}
              className="w-full h-full flex-shrink-0 flex items-center justify-center"
              style={{ width: "100%" }}
            >
              <img
                src={slide.imgSrc}
                alt={slide.alt}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {topSuggestions.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full ${
                currentSlide === index ? "bg-white" : "bg-gray-500"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by event name"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
        {nameSearch && (
          <button
            onClick={handleClearSearch}
            className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400"
          >
            Clear
          </button>
        )}
      </div>

      {/* Upcoming Events */}
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="p-4 border rounded-lg shadow hover:shadow-lg transition-all"
          >
            <h3 className="text-lg font-bold">{event.name}</h3>
            <p className="text-sm text-gray-600">
              {event.location || "Madison Square Garden"}
            </p>
            <p className="text-sm">
              {new Date(event.date).toLocaleDateString()} -{" "}
              {new Date(event.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              onClick={() => navigate(`/events/${event.id}`)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-lg font-semibold py-2 text-gray-700">
          Page <span className="text-blue-500">{page}</span>
        </span>
        <button
          onClick={handleNextPage}
          disabled={upcomingEvents.length < limit} // Disable if fetched events are less than limit
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;
