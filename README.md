# Memory Card Game - React useEffect

A memory card game built with React as a learning project that demonstrates side effects, data fetching, and the complete `useEffect` API including the callback, dependency array, and cleanup function.

## Learning Objectives

This project was specifically designed to demonstrate and practice:

- **Side Effects** - Understanding what side effects are in React
- **What Effects Are** - When and why to use the `useEffect` hook
- **The `useEffect` Hook** - Complete usage including callback, dependency array, and cleanup
- **Data Fetching** - Performing async operations inside effects
- **Preventing Double Fetching** - Using `useRef` to avoid strict mode issues
- **When to Use Effects** - Identifying scenarios that require effects

## Live Demo

[View Live Demo](https://vocal-tanuki-75f07c.netlify.app/)

## What Are Side Effects?

**Side effects** are operations that interact with the "outside world" or modify state outside the current function scope.

### Examples of Side Effects

```javascript
// Network requests (fetching data)
fetch("https://api.example.com/data");

// Direct DOM manipulation
document.title = "New Title";

// Timers
setTimeout(() => {}, 1000);

// Console logging
console.log("Hello");

// Local storage
localStorage.setItem("key", "value");
```

### Why React Needs Help with Side Effects

React components are **pure functions** - they should:

- Return the same output for the same props/state
- Not modify external variables
- Not perform async operations directly

```jsx
// ❌ This breaks React's purity rules
function App() {
  fetchData(); // Side effect during render!
  return <div>{data}</div>;
}
```

## The `useEffect` Hook

### Basic Syntax

```javascript
useEffect(() => {
  // Effect callback - runs after render
  console.log("This runs after component renders");

  // Optional cleanup function
  return () => {
    console.log("This runs before component unmounts or before next effect");
  };
}, [dependency, array]); // Optional dependency array
```

### Three Parts of `useEffect`

| Part                 | Purpose                              | Runs When                                                                |
| -------------------- | ------------------------------------ | ------------------------------------------------------------------------ |
| **Callback**         | The effect itself                    | After render, when dependencies change                                   |
| **Dependency Array** | Controls when effect re-runs         | Every render if omitted, only once on mount if empty, when values change |
| **Cleanup Function** | Clean up subscriptions, timers, etc. | Before component unmounts or before next effect                          |

## Different `useEffect` Patterns

### 1. Run Once on Mount (Empty Dependency Array)

```jsx
// App.jsx - Fetch data only when component first loads
useEffect(() => {
  async function fetchData() {
    const response = await fetch("https://dog.ceo/api/breeds/image/random/10");
    const data = await response.json();
    setItemsInfo(data.message);
  }

  fetchData();
}, []); // Empty array = runs once after initial render
```

**Use case:** Initial data fetching, subscriptions, event listeners

### 2. Run on Every Render (No Dependency Array)

```jsx
useEffect(() => {
  console.log("Component re-rendered");
  document.title = `Count: ${count}`;
}); // No array = runs after every render
```

**Use case:** Debugging, syncing with external systems

### 3. Run When Dependencies Change

```jsx
useEffect(() => {
  console.log(`Count changed to ${count}`);
  localStorage.setItem("count", count);
}, [count]); // Runs only when 'count' changes
```

**Use case:** Saving data to localStorage, fetching related data

## Data Fetching with `useEffect`

### The Complete Pattern

```jsx
import { useEffect, useState, useRef } from "react";

function App() {
  const ignoreFetch = useRef(false);
  const [itemsInfo, setItemsInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`https://api.example.com/data`);
        const data = await response.json();
        setItemsInfo(data);
      } catch (error) {
        console.error("Failed to fetch:", error);
      } finally {
        setLoading(false);
      }
    }

    // Prevent double fetch in Strict Mode
    if (!ignoreFetch.current) {
      ignoreFetch.current = true;
      fetchData();
    }
  }, []); // Empty array = fetch once on mount

  return <div>{loading ? "Loading..." : <Game items={itemsInfo} />}</div>;
}
```

### Preventing Double Fetching in Strict Mode

React 18+ Strict Mode intentionally double-invokes effects to help find bugs:

```jsx
// Without prevention - effect runs twice!
useEffect(() => {
  fetchData(); // Runs twice in Strict Mode
}, []);

// With useRef prevention - runs once
const ignoreFetch = useRef(false);
useEffect(() => {
  if (!ignoreFetch.current) {
    ignoreFetch.current = true;
    fetchData(); // Runs only once
  }
}, []);
```

### API Integration Example

```jsx
// App.jsx - Fetching dog images from Dog CEO API
useEffect(() => {
  async function fetchData() {
    const dataApi = `https://dog.ceo/api/breeds/image/random/${pageSize}`;

    let resultList = await fetch(dataApi)
      .then((res) => res.json())
      .then((json) => json.message);

    // Process API response into game items
    setItemsInfo(
      resultList.map((item) => {
        // Extract breed from URL (e.g., "breeds/hound/")
        const breed = item.match(/(?<=breeds\/).*?(?=\/)/)[0];
        // Format breed name (e.g., "hound" → "Hound")
        const name = breed
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return { name, imageUrl: item, id: item.name };
      }),
    );
  }

  if (!ignoreFetch.current) {
    ignoreFetch.current = true;
    fetchData();
  }
}, []); // Runs only once
```

## Cleanup Function

The **cleanup function** runs before the component unmounts OR before the next effect execution.

### Cleanup Use Cases

```javascript
// 1. Cleaning up timers
useEffect(() => {
  const timer = setTimeout(() => {
    console.log("Timeout finished");
  }, 1000);

  return () => clearTimeout(timer); // Cleanup on unmount
}, []);

// 2. Removing event listeners
useEffect(() => {
  const handleResize = () => console.log(window.innerWidth);
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

// 3. Cancelling fetch requests (with AbortController)
useEffect(() => {
  const abortController = new AbortController();

  fetch(url, { signal: abortController.signal })
    .then((res) => res.json())
    .then((data) => setData(data));

  return () => abortController.abort(); // Cancel on unmount
}, [url]);

// 4. Disabling infinite scroll detection
useEffect(() => {
  const observer = new IntersectionObserver(callback);
  observer.observe(element);

  return () => observer.disconnect();
}, []);
```

### Cleanup Function Flow

```
Component mounts
      ↓
Effect callback runs
      ↓
[Component re-renders due to state change]
      ↓
Cleanup runs (before next effect)
      ↓
Effect callback runs again (with new dependencies)
      ↓
[Component unmounts]
      ↓
Cleanup runs (final cleanup)
```

## When to Use Effects

### ✅ Good Use Cases for `useEffect`

1. **Data Fetching** - Loading data from APIs
2. **Synchronizing with external systems** - Browser APIs, localStorage
3. **Setting up subscriptions** - WebSockets, event listeners
4. **Timers and intervals** - `setTimeout`, `setInterval`
5. **Manual DOM manipulations** - Focus management, animations

### ❌ Bad Use Cases (Avoid Effects)

```jsx
// ❌ Don't use effect for derived state (use regular calculation)
const [firstName, setFirstName] = useState("John");
const [lastName, setLastName] = useState("Doe");
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]); // Use computed value instead!

// ✅ Do this instead
const fullName = `${firstName} ${lastName}`;

// ❌ Don't use effect to respond to user events
useEffect(() => {
  if (submitted) {
    submitForm();
  }
}, [submitted]); // Handle in event handler instead!

// ✅ Do this instead
function handleSubmit() {
  setSubmitted(true);
  submitForm(); // Call directly
}
```

## This Project's Effect Usage

### Effect 1: Initial Data Loading

```jsx
// App.jsx - Load dog images when app starts
useEffect(() => {
  async function fetchData() {
    const dataApi = `https://dog.ceo/api/breeds/image/random/${pageSize}`;
    let resultList = await fetch(dataApi)
      .then((res) => res.json())
      .then((json) => json.message);

    setItemsInfo(
      resultList.map((item) => {
        const breed = item.match(/(?<=breeds\/).*?(?=\/)/)[0];
        const name = breed
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return { name, imageUrl: item, id: item.name };
      }),
    );
  }

  if (!ignoreFetch.current) {
    ignoreFetch.current = true;
    fetchData();
  }
}, []); // Empty array = runs once on mount
```

**Why this needs an effect:**

- API calls are side effects
- Should not run during rendering
- Should run only once when component loads

### Effect Flow Diagram

```
App Component Renders
        ↓
useEffect Called (after render)
        ↓
fetchData() Executes
        ↓
setItemsInfo() Updates State
        ↓
Component Re-renders with Data
        ↓
Game Component Renders
```

## The `useRef` Pattern for Double-fetch Prevention

```jsx
import { useRef } from "react";

function App() {
  const ignoreFetch = useRef(false);

  useEffect(() => {
    if (!ignoreFetch.current) {
      // First time: false
      ignoreFetch.current = true; // Set to true
      fetchData(); // Execute once
    }
    // Second effect call in Strict Mode: ignoreFetch.current === true
    // So fetchData() is NOT called again
  }, []);
}
```

## Effect Dependencies Explained

| Dependency Array                        | Effect Runs               | Use Case                                         |
| --------------------------------------- | ------------------------- | ------------------------------------------------ |
| `useEffect(() => {...})`                | After every render        | Debugging, syncing                               |
| `useEffect(() => {...}, [])`            | Once after initial render | Initial data fetch, event listeners              |
| `useEffect(() => {...}, [count])`       | When `count` changes      | Saving to localStorage, API calls based on state |
| `useEffect(() => {...}, [count, name])` | When either changes       | Complex sync logic                               |

## Component Interaction Without Effects

This project demonstrates proper state management **without unnecessary effects**:

```jsx
// Game.jsx - Shuffling without effects
function Game({ initialItemsInfo, incrementScore, reset }) {
  const [itemsInfo, setItemsInfo] = useState(initialItemsInfo);

  function handleSuccess() {
    incrementScore(); // Updates parent state
    shuffleElements(); // Shuffles local state
    // ⚠️ No useEffect needed! This is an event handler, not a side effect
  }

  function shuffleElements() {
    const newOrder = [...itemsInfo];
    // Fisher-Yates shuffle algorithm
    for (let i = 0; i < newOrder.length; i++) {
      const j = Math.floor(Math.random() * newOrder.length);
      [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
    }
    setItemsInfo(newOrder); // Direct state update
  }

  return (
    <div>
      {itemsInfo.map((card) => (
        <Card key={card.id} />
      ))}
    </div>
  );
}
```

## Effect Timeline Visualization

```
Time →

[App Mounts]
     ↓
[Render Phase] - App renders JSX (loading state)
     ↓
[Commit Phase] - DOM updates visible
     ↓
[Effect Phase] - useEffect runs
     ↓
[Data Fetching] - API request sent
     ↓
[State Update] - setItemsInfo called
     ↓
[Re-render] - App renders with data
     ↓
[Effect Phase] - useEffect runs? No (empty deps array ✓)
     ↓
[User Plays Game] - Cards clicked, scores updated
     ↓
[No Effects Run] - All updates handled in event handlers
```

## What I learned

### What Are Side Effects?

- **Definition** - Operations that interact with the outside world
- **Examples** - API calls, timers, DOM manipulation, localStorage
- **React Rule** - Effects don't belong in component body

### The `useEffect` Hook

- **Callback** - The effect code that runs after render
- **Dependency Array** - Controls when effect re-runs
- **Cleanup Function** - Optional return to clean subscriptions, timers, etc.

### When to Use Effects

- ✅ Data fetching from APIs
- ✅ Subscribing to external events
- ✅ Setting timers and intervals
- ✅ Manual DOM manipulation
- ❌ Derived state (use normal computation)
- ❌ Event handlers (call directly)

### Best Practices

- **Empty array** for one-time setup
- **Specific dependencies** for targeted updates
- **Cleanup functions** to prevent memory leaks
- **`useRef`** to prevent double fetching in Strict Mode

### Anti-Patterns to Avoid (Missing Dependencies)

```jsx
// ❌ Missing dependencies - effect won't update
const [count, setCount] = useState(0);
useEffect(() => {
  console.log(count); // Uses stale count if count changes
}, []); // Missing 'count' dependency

// ✅ Include all reactive values
useEffect(() => {
  console.log(count);
}, [count]); // Now updates when count changes

// ❌ Including non-reactive values
const someConstant = "hello";
useEffect(() => {
  console.log(someConstant);
}, [someConstant]); // 'someConstant' never changes, no need in deps

// ✅ Don't include setState functions (React guarantees stability)
useEffect(() => {
  fetchData().then(setData);
}, [setData]); // setData is stable, not needed in deps
```

