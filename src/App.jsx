import "./App.css";
import { useState, useEffect } from 'react';

const API_URL = 'https://api.freeapi.app/api/v1/public/randomjokes';

function App() {
  const [jokes, setJokes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedJokes, setLikedJokes] = useState(new Set());
  const [copiedId, setCopiedId] = useState(null);

  const fetchJokes = async (currentPage, currentLimit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}?page=${currentPage}&limit=${currentLimit}`);
      const json = await res.json();
      if (json.success) {
        setJokes(json.data.data);
        setTotalPages(json.data.totalPages);
      } else {
        setError('Failed to fetch jokes');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJokes(page, limit);
  }, [page, limit]);

  const toggleLike = (id) => {
    setLikedJokes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyToClipboard = async (content, id) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">JokeBox</h1>
            <p className="text-sm text-gray-500 mt-0.5">Random jokes from the internet</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={limit}
              onChange={handleLimitChange}
              className="bg-gray-100 border-none rounded-lg px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-gray-300 outline-none"
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse h-48">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg font-medium">{error}</p>
            <button
              onClick={() => fetchJokes(page, limit)}
              className="mt-4 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Jokes Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jokes.map((joke) => {
                const isLiked = likedJokes.has(joke.id);
                const isCopied = copiedId === joke.id;

                return (
                  <div
                    key={joke.id}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          #{joke.id}
                        </span>
                        {joke.categories?.length > 0 && (
                          <span className="text-[10px] font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {joke.categories[0]}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-800 leading-relaxed text-[15px]">
                        {joke.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50">
                      <button
                        onClick={() => toggleLike(joke.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={isLiked ? 'currentColor' : 'none'}
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-5 h-5 transition-transform active:scale-125"
                        >
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {isLiked ? 'Liked' : 'Like'}
                      </button>

                      <button
                        onClick={() => copyToClipboard(joke.content, joke.id)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          isCopied ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="w-5 h-5"
                        >
                          {isCopied ? (
                            <path d="M20 6L9 17l-5-5" />
                          ) : (
                            <>
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </>
                          )}
                        </svg>
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Show window around current page
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                        page === pageNum
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
              Page {page} of {totalPages}
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default App;