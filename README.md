# JokeBox

A clean, minimal React application that fetches and displays random jokes from the [FreeAPI](https://freeapi.app/) public joke endpoint. Browse paginated joke cards, like your favorites, and copy jokes to your clipboard with a single click.

## Features

- **Random Jokes** — Fetches jokes from `https://api.freeapi.app/api/v1/public/randomjokes`
- **Pagination** — Navigate through pages with Previous / Next buttons and a numbered page window
- **Adjustable Page Size** — Choose between 6, 9, or 12 jokes per page
- **Like Jokes** — Toggle a heart icon to mark jokes you enjoy (stored in component state)
- **Copy to Clipboard** — One-click copy with a visual "Copied!" confirmation
- **Loading Skeletons** — Animated placeholder cards while data is being fetched
- **Error Handling** — Friendly error message with a retry button when the API call fails
- **Responsive Grid** — 1 column on mobile, 2 on tablets, 3 on desktop

## Tech Stack

| Layer      | Choice                      |
|------------|-----------------------------|
| Framework  | React (with Hooks)          |
| Styling    | Tailwind CSS utility classes|
| API        | FreeAPI — Random Jokes      |
| Bundler    | Vite                        |

## Project Structure

src/
├── App.jsx # Main application component
├── App.css # Additional styles (Tailwind directives, etc.)
└── main.jsx # Entry point

text
text

## Getting Started

### Prerequisites

- **Node.js** v16 or later
- **npm** or **yarn**

### Installation


# Clone the repository
git clone https://github.com/your-username/jokebox.git
cd jokebox

# Install dependencies
npm install

Development

bash
bash
npm run dev

The app will be available at http://localhost:5173 (default Vite port).


Production Build

bash
bash
npm run build
npm run preview

API Reference

All jokes are fetched from:

GET https://api.freeapi.app/api/v1/public/randomjokes?page={page}&limit={limit}

Query Parameters

Parameter	Type	Default	Description
page	number	1	Page number to retrieve
limit	number	9	Number of jokes per page

Response Shape

json
json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": 1,
        "content": "Why did the chicken...",
        "categories": ["funny"]
      }
    ],
    "totalPages": 10
  }
}

.


## Customization

**Changing the Default Page Size**

In **App.jsx**, update the initial state:

```js
const [limit, setLimit] = useState(12); // change from 9 to your preferred default
```

**Adjusting the Pagination Window**

The pagination buttons show a sliding window of up to 5 pages. To change this, modify the Math.min(5, totalPages) value in the pagination section.


**Known Limitations**

- **Stateless likes** — Liked jokes are stored in React state and reset on page refresh. Persisting them would require localStorage or a backend.
- **No search or filtering** — The API does not expose search/filter parameters, so all browsing is pagination-based.
- **No offline support** — The app requires an active network connection to fetch jokes.

## License

This project is open source and available under the 
MIT License
.

