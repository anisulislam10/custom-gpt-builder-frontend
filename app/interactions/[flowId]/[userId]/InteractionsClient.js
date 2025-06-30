// app/interactions/[flowId]/[userId]/InteractionsClient.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractionsClient({ interactions: initialInteractions }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [interactions, setInteractions] = useState(initialInteractions);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interactions, filter, search]);

  const filteredInteractions = interactions.filter((interaction) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'user' && interaction.userInput) ||
      (filter === 'bot' && !interaction.userInput) ||
      (filter === 'both' && interaction.userInput && interaction.botResponse);
    const matchesSearch =
      search === '' ||
      (interaction.userInput &&
        (typeof interaction.userInput === 'string'
          ? interaction.userInput.toLowerCase().includes(search.toLowerCase())
          : JSON.stringify(interaction.userInput).toLowerCase().includes(search.toLowerCase()))) ||
      (interaction.botResponse &&
        interaction.botResponse.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mt-6 bg-background/80 backdrop-blur-md rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
   <div className="flex flex-col sm:flex-row gap-4 mb-6">
  <div className="flex gap-2">
    {['all', 'user', 'bot', 'both'].map((type) => (
      <button
        key={type}
        className={`px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm transition-all duration-200 hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary/50 ${
          filter === type ? 'bg-primary text-white' : 'bg-white'
        }`}
        onClick={() => setFilter(type)}
      >
        {type === 'all' ? 'All' : type === 'user' ? 'User Only' : type === 'bot' ? 'Bot Only' : 'Both'}
      </button>
    ))}
  </div>
  <input
    type="text"
    placeholder="Search interactions..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white shadow-sm"
  />
</div>
      <div className="max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary scrollbar-track-background">
        <AnimatePresence>
          {filteredInteractions.length > 0 ? (
            filteredInteractions.map((interaction) => (
              <motion.div
                key={interaction._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mb-4 space-y-2"
              >
                {interaction.userInput && (
                  <div className="p-4 rounded-lg shadow-sm backdrop-blur-sm max-w-[75%] ml-auto bg-primary text-white rounded-br-none">
                    <p className="text-sm font-medium">
                      <strong>User:</strong>{' '}
                      {typeof interaction.userInput === 'object' ? (
                        <pre className="text-xs mt-1 whitespace-pre-wrap">
                          {JSON.stringify(interaction.userInput, null, 2)}
                        </pre>
                      ) : (
                        interaction.userInput
                      )}
                    </p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(interaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                )}
               <div className={`p-4 rounded-lg shadow-sm max-w-[75%] ${interaction.userInput ? 'ml-auto bg-primary text-white rounded-br-none' : 'mr-auto bg-gray-100 text-gray-900 rounded-bl-none'}`}>
  <p className="text-sm font-medium">
    <strong>{interaction.userInput ? 'User' : 'Bot'}:</strong>{' '}
    {interaction.userInput ? (
      typeof interaction.userInput === 'object' ? (
        <pre className="text-xs mt-1 whitespace-pre-wrap">{JSON.stringify(interaction.userInput, null, 2)}</pre>
      ) : (
        interaction.userInput
      )
    ) : (
      interaction.botResponse
    )}
  </p>
  <p className="text-xs opacity-60 mt-1">{new Date(interaction.timestamp).toLocaleString()}</p>
</div>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-text text-sm text-center"
            >
              No interactions found.
            </motion.p>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}