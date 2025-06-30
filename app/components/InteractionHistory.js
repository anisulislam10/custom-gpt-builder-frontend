'use client';
import { useState, useEffect, useMemo } from 'react';
import { FiSearch, FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const InteractionHistory = ({ flowId, userId }) => {
  const [interactionsByDate, setInteractionsByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Fetch interactions
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/interactions/${flowId}/${userId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch interactions: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Sort by date descending (newest first)
        const sortedData = data
          .map(group => ({
            ...group,
            interactions: group.interactions.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            )
          }))
          .sort((a, b) => new Date(b.date) - new Date(a.date));
          
        setInteractionsByDate(sortedData);
        // Collapse all sections by default
        setOpenSections(sortedData.reduce((acc, { date }) => ({ ...acc, [date]: false }), {}));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (flowId && userId) {
      fetchInteractions();
    }
  }, [flowId, userId]);

  // Filter and search interactions
  const filteredInteractions = useMemo(() => {
    return interactionsByDate
      .map(({ date, interactions }) => {
        let filtered = interactions.filter((interaction) => {
          // Search filter
          const searchLower = searchQuery.toLowerCase();
          const matchesSearch =
            searchQuery === '' ||
            (interaction.userInput &&
              (typeof interaction.userInput === 'string'
                ? interaction.userInput.toLowerCase().includes(searchLower)
                : JSON.stringify(interaction.userInput).toLowerCase().includes(searchLower))) ||
            (interaction.botResponse &&
              typeof interaction.botResponse === 'string' &&
              interaction.botResponse.toLowerCase().includes(searchLower));

          // Type filter
          const matchesType =
            filterType === 'all' ||
            (filterType === 'user' && interaction.userInput) ||
            (filterType === 'bot' && !interaction.userInput);

          // Date range filter
          const interactionDate = new Date(interaction.timestamp);
          const startDate = dateRange.start ? new Date(dateRange.start) : null;
          const endDate = dateRange.end ? new Date(dateRange.end) : null;
          const matchesDate =
            (!startDate || interactionDate >= startDate) &&
            (!endDate || interactionDate <= new Date(endDate.setHours(23, 59, 59, 999)));

          return matchesSearch && matchesType && matchesDate;
        });

        return { date, interactions: filtered };
      })
      .filter(({ interactions }) => interactions.length > 0);
  }, [interactionsByDate, searchQuery, filterType, dateRange]);

  const toggleSection = (date) => {
    setOpenSections((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setDateRange({ start: '', end: '' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto p-4 sm:p-6 md:p-8 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
    <div className="flex justify-center mb-6">
  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
    Interaction History
  </h2>
</div>

      {/* Search and Filter Controls */}
      <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interactions..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>
          {/* Filter Dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
          >
            <option value="all">All Interactions</option>
            <option value="user">User Input</option>
            <option value="bot">Bot Only</option>
          </select>
          {/* Date Range Inputs */}
          <div className="flex gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
            />
          </div>
          {/* Clear Filters */}
          {(searchQuery || filterType !== 'all' || dateRange.start || dateRange.end) && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Interaction List */}
      {filteredInteractions.length === 0 ? (
        <div className="text-gray-600 text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          No interactions found matching your criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInteractions.map(({ date, interactions }) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
<div className="relative w-full">
  <button
    type="button"
    onClick={() => toggleSection(date)}
    aria-expanded={openSections[date]}
    aria-controls={`section-${date}`}
    className="absolute top-4 right-4 z-10"
  >
    {openSections[date] ? (
      <FiChevronUp className="w-5 h-5 text-gray-600" />
    ) : (
      <FiChevronDown className="w-5 h-5 text-gray-600" />
    )}
  </button>

  <div className="p-4 pl-5 pr-10 bg-gray-100 rounded">
    <span className="block font-semibold text-lg sm:text-xl text-gray-800">
      {new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  </div>
</div>




              <AnimatePresence>
                {openSections[date] && (
                  <motion.div
                    id={`section-${date}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 sm:p-5 space-y-4"
                  >
                    {interactions.map((interaction) => (
                      <motion.div
                        key={interaction._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(interaction.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {interaction.userInput && (
                          <div className="mb-3">
                            <span className="font-semibold text-indigo-600">You:</span>
                            <p className="text-gray-800 mt-1">
                              {typeof interaction.userInput === 'object'
                                ? <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(interaction.userInput, null, 2)}</pre>
                                : highlightMatch(interaction.userInput, searchQuery)}
                            </p>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold text-indigo-600">Bot:</span>
                          <p className="text-gray-800 mt-1">{highlightMatch(interaction.botResponse, searchQuery)}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to highlight search matches
const highlightMatch = (text, query) => {
  if (!text || !query) return text || '[No Content]';
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-yellow-200 font-medium">{part}</span>
    ) : (
      part
    
    )
    
  )}
export default InteractionHistory;