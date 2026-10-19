# React Interview Guide

ReactJS Interview Notes (Verified & Organized)
Oct 8, 2026 · @Darshan
1. What I verified and fixed
Your notes cover the right topics, but several code examples are broken and some explanations are wrong or outdated. This doc keeps your structure (definition, why, when, how), fixes every issue below, and adds the missing topics.
Topic	Problem with the original notes	Correct version
Controlled and uncontrolled forms	Both examples use <button type="button">, which never submits the form, so onSubmit never runs	Use type="submit" (section 5)
shouldComponentUpdate	Code returns ===, so the UI never updates when state changes; the text says the opposite	Return !== (section 6)
componentDidUpdate	The example is a copy of the shouldComponentUpdate code; the text talks about a count that does not exist	New working example (section 6)
"Why does it render 2 times?"	Blames only StrictMode; in that code the main reason is setState inside componentDidMount	Both reasons (section 6)
super(props)	Says React 16.3 made it optional; without it this.props is still undefined inside the constructor	Corrected (section 6)
componentWillUpdate	Described as a place for API calls; it is deprecated (UNSAFE_)	Use componentDidUpdate or getSnapshotBeforeUpdate
Unmounting example	Incomplete import Child, showChild is undefined, initial state is false so Child never shows	Fixed example (section 6)
Higher-Order Component	Explanation names (withDataFetching) do not match the code; key missing in map; "When to use" is empty; promised logging example is missing	Rewritten (section 6)
Context example	React.FC<React.ReactElement> is the wrong type for children; ?? {} hides a missing Provider	Custom hook with a clear error (section 4)
useMemo example	count * 2 is not an expensive calculation	Kept as a demo, with a note on when memoizing is worth it
Fetch example	No response.ok check, the local data shadows the state, no error state, no cleanup	Fixed (section 5)
Virtual DOM	"Even a small change requires a whole refresh" is misleading; diffing vs reconciliation are mixed up	Corrected (section 2)
SSR vs CSR table	Says SSR interactions need page reloads; outdated because of hydration	Corrected (section 10)
Redux	createStore, connect and ReactDOM.render are legacy; ReactDOM.render is removed in React 19	Redux Toolkit (section 7)
.env and security	Implies .env keeps API keys safe; in Vite, VITE_ variables are bundled into the browser code	Corrected (section 11)
"Why React is SPA?"	React is a library; SPA is an architecture that React can be used for	Corrected (section 10)
Question list	Answers sit under the wrong questions (Virtual DOM answered with "State, props"); several questions have no answer	Answered in section 13
Spelling and names	useParam should be useParams; Fibre should be Fiber; Synetic should be Synthetic; package.lock.json should be package-lock.json; memorize should be memoize; babel-core should be @babel/core	Fixed everywhere
The notes also contradicted themselves once: "Better performance in most cases" for functional components, then later "performance is essentially the same". The second statement is the correct one.
2. Core concepts
React is a JavaScript library for building user interfaces from small reusable components, and it re-renders the right parts of the screen when data changes.
2.1 Library vs framework
Definition: A library is a tool you call from your code; a framework calls your code and decides the project structure.
Why React counts as a library: it only handles the view layer. Routing, data fetching, forms and global state come from other packages (React Router, TanStack Query, Redux Toolkit). Angular is a framework because it ships all of these. Frameworks built on React, such as Next.js and Remix, add the missing pieces.
Interview answer: React is a component-based library with a virtual DOM, declarative UI and one-way data flow.
2.2 Declarative UI
Definition: You describe what the UI should look like for the current state, and React works out how to update the DOM.
Example:
// Declarative: the UI is a function of state, UI = f(state)
function Greeting({ user }) {
  return user ? <h1>Welcome, {user.name}</h1> : <LoginForm />;
}
Imperative code would instead say: find the element, clear it, create a heading, append it.
2.3 Virtual DOM, diffing and reconciliation
Definition: The Virtual DOM is a lightweight JavaScript object tree that describes the UI. It is not a second browser DOM, just plain objects.
How an update works:
1.	State or props change, so React calls your component again (the render phase) and builds a new tree of objects.
2.	React compares the new tree with the previous one. This comparison is called diffing.
3.	React works out the smallest set of changes. The whole process (diff plus update) is called reconciliation.
4.	In the commit phase React applies only those changes to the real DOM.
Diffing rules (the heuristics that make it fast):
•	Elements of different types (div to span) are replaced, and the old subtree is destroyed.
•	Elements of the same type keep the DOM node and update only changed attributes.
•	Lists use the key prop to match old and new children.
Example:
// Before
<h1 style={{ color: 'blue' }}>Hello, World!</h1>
// After
<h1 style={{ color: 'red' }}>Hello, World!</h1>
// React updates only the color style on the existing h1 node.
Correction to your notes: Without React you can also update just one DOM node by hand. The Virtual DOM does not make React faster than perfect hand-written DOM code. Its value is that you write simple declarative code and React still updates efficiently.
2.4 React Fiber
Definition: Fiber is the reconciliation engine introduced in React 16. Each component becomes a fiber, a unit of work with a pointer to its parent, child and sibling.
Why it exists: the old stack reconciler had to finish the whole tree in one go and could freeze the page. Fiber can split rendering into small chunks, pause, resume, and prioritise urgent work (typing) over less urgent work (a big list). This is what enables Concurrent React in React 18: useTransition, useDeferredValue and Suspense.
2.5 JSX
Definition: JSX is HTML-like syntax inside JavaScript. A compiler (Babel, esbuild, SWC) turns it into function calls.
const el = <h1 className="title">Hi</h1>;
// compiles to (modern runtime): jsx('h1', { className: 'title', children: 'Hi' })
Rules:
1.	Return one parent element, or use a fragment <>...</>.
2.	Use className and htmlFor; attributes are camelCase (onClick, tabIndex).
3.	Close every tag (<img />, <br />).
4.	Put JavaScript expressions in { }; statements such as if do not work there, so use a ternary or &&.
5.	style takes an object: style={{ color: 'red' }}.
6.	Component names start with a capital letter, otherwise React treats them as HTML tags.
2.6 Components
Definition: A component is a JavaScript function that takes props and returns UI (JSX, null, a string, or an array). It can own private data called state.
Why functional components are preferred today: simpler syntax, hooks, no this, easier testing, and reuse through custom hooks. Performance is about the same as class components, so do not give "performance" as the reason in an interview.
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
3. Props, state and data flow
Props are read-only inputs a parent gives a child; state is private data a component owns and can change. Data flows one way, from parent to child.
3.1 Props vs state
	Props	State
Owner	Parent component	The component itself
Can the component change it?	No, read-only	Yes, through the setter
Purpose	Configure the component	Hold data that changes over time
Change causes	Re-render when the parent re-renders with new values	Re-render of that component and its children
Props example:
type UserProps = { name: string; age: number };

function User({ name, age }: UserProps) {
  return <h1>{name} {age}</h1>;
}

export default function App() {
  return (
    <>
      <User name="Darshan" age={25} />
      <User name="Anita" age={24} />
    </>
  );
}
Pass numbers and booleans in braces (age={25}), not quotes. Quotes make them strings.
The special prop children holds whatever you put between the opening and closing tags:
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}
// <Card><p>Any content here</p></Card>
3.2 State rules (common interview traps)
1.	Never mutate state. Create a new object or array.
2.	Updates are batched and applied on the next render, so the variable does not change on the next line.
3.	Use the updater form when the new value depends on the old one.
3.3 One-way data flow and lifting state up
Definition: Data moves down the tree through props; children talk back to parents by calling functions passed down as props.
Lifting state up: when two sibling components need the same data, move the state to their closest common parent and pass it down.
function Parent() {
  const [query, setQuery] = useState('');
  return (
    <>
      <SearchBox value={query} onChange={setQuery} />
      <Results query={query} />
    </>
  );
}

function SearchBox({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input value={value} onChange={e => onChange(e.target.value)} />;
}
3.4 Prop drilling
Definition: Passing props through many layers of components that do not use them, only to reach a deeply nested child.
Options to solve it, and why you would pick each:
•	Component composition (children): no extra library, and often the simplest fix. Use it first.
•	Context API: built into React, good for low-frequency global values such as theme, language and the logged-in user. Weakness: every consumer re-renders when the value changes.
•	Redux Toolkit or Zustand: use when many parts of the app share frequently changing state and you want devtools and a predictable update pattern. Costs extra code and a library.
3.5 Where should state live?
Kind of state	Example	Best place
UI state used by one component	Is a dropdown open?	Local useState
Shared by a few nearby components	Selected filter	Lift to the common parent
Shared across the app, rarely changes	Theme, current user	Context
Shared across the app, changes often	Cart, complex workflows	Redux Toolkit or Zustand
Server data	Product list from an API	TanStack Query (or RTK Query), not hand-written useEffect everywhere
Shareable state	Page number, filters	URL (query string)
4. Hooks
Hooks are functions that let function components use state, side effects and other React features. They arrived in React 16.8 (February 2019).
Why hooks were introduced: class components needed this, method binding and lifecycle methods that split related logic across several places (for example, subscribe in componentDidMount and unsubscribe in componentWillUnmount). Logic reuse also needed HOCs or render props, which created deeply nested trees. Hooks keep related code together and make logic reusable through custom hooks.
4.1 Rules of Hooks
1.	Call hooks only at the top level of a component or custom hook, never inside loops, conditions or nested functions.
2.	Call hooks only from function components or custom hooks.
Why: React identifies each hook by its call order on every render. A conditional hook changes the order and breaks the matching.
4.2 useState
Definition: Adds a state variable to a function component. It returns [currentValue, setter].
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Add</button>
    </>
  );
}
Lazy initial state runs an expensive initializer only once: useState(() => readFromStorage()).
4.3 useEffect
Definition: `useEffect` is a hook in React that allows you to perform side effects in function components. 
What is the Side Effect?
In the context of React, side effects are typically actions you want to perform after the component renders or when certain state or props change. 
A side effect is any operation like: 
- Fetching data from an API.
- Logging values to the console.
- Manually changing the DOM.
- Setting up subscriptions
- Timers

Dependency array	When the effect runs	Class equivalent
Not provided	After every render	componentDidMount and componentDidUpdate
[]	Once after the first render	componentDidMount
[a, b]	After first render and whenever a or b changes	componentDidUpdate with a check
Cleanup function returned	Before the next run and on unmount	componentWillUnmount

 useEffect(() => {
  const id = setInterval(() => setSeconds(s => s + 1), 1000);
  return () => clearInterval(id); // cleanup
}, []);


Pitfalls to mention in an interview:
•	Stale closure: an effect with [] that reads state sees the value from the first render. Use the updater form (setSeconds(s => s + 1)) or list the dependency.
•	Missing dependencies: the react-hooks/exhaustive-deps lint rule warns about them. Do not silence it without understanding why.
•	Infinite loops: setting state inside an effect that depends on that state.
•	StrictMode in development mounts, unmounts and mounts again to expose missing cleanup. This is why effects seem to run twice in development only.
•	You often do not need an effect. Derive values during render and handle user actions in event handlers.
4.4 useContext
Definition:  The useContext Hook in React allows you to share values between the multiple levels of the components without passing though props from each levels. 
It simplifies state and prop management in deeply nested components.
What is Context?
React Context provides a way to pass data (such as, global state) through the component tree without having to manually pass props at every level. 
Context is often used for managing global state such as themes, user authentication, or language settings.

Steps: create the context, provide a value, consume it. Wrap consumption in a custom hook so a missing Provider gives a clear error:
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type ThemeContextValue = { theme: Theme; toggleTheme: () => void };

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const value = useMemo(
    () => ({ theme, toggleTheme: () => setTheme(t => (t === 'light' ? 'dark' : 'light')) }),
    [theme]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}

// Consumer
function ThemeToggler() {
  const { theme, toggleTheme } = useTheme();
  return <button onClick={toggleTheme}>Current: {theme}</button>;
}

The value is wrapped in useMemo because a new object on every render would re-render every consumer. Context is best for values that change rarely.
4.5 useReducer
Definition: `useReducer` is a hook that is used for state management in React. 
It is an alternative to `useState` and is usually preferred when you have complex state logic that involves multiple sub-values or when the next state depends on the previous state.
•	It works by defining a reducer function that updates the state based on the action type and current state.


type State = { count: number };
type Action = { type: 'INCREMENT' | 'DECREMENT' | 'RESET' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    case 'DECREMENT': return { count: state.count - 1 };
    case 'RESET':     return { count: 0 };
    default:          return state;
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0 });
  return (
    <>
      <h1>{state.count}</h1>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </>
  );
}
useState or useReducer? Pick useState for simple independent values. Pick useReducer when the next state depends on complex logic, when many handlers update the same object, or when you want all transitions in one testable function. Combine useReducer with Context for a small Redux-like store.

4.6 useRef
Definition: Returns a mutable object { current } that stays the same across renders. Changing  .current does not trigger a re-render.
Uses: 
(1) access a DOM element, 
(2) keep a value between renders without re-rendering (timer id, previous value).

function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
    </>
  );
}

// Keeping a value without re-rendering
const renderCount = useRef(0);
renderCount.current += 1;


4.7 useMemo and useCallback
useMemo remembers the result of an expensive calculation until its dependencies change.
 useCallback remembers a function until its dependencies change. 
useCallback(fn, deps) is the same as useMemo(() => fn, deps).

// useMemo: skip an expensive filter when only unrelated state changes

const visible = useMemo(
  () => products.filter(p => p.name.includes(query)),
  [products, query]
);

// useCallback: keep the same function so a memoized child can skip re-rendering
const Row = React.memo(function Row({ onSelect }: { onSelect: (id: number) => void }) {
  return <button onClick={() => onSelect(1)}>Select</button>;
});

function List() {
  const handleSelect = useCallback((id: number) => console.log(id), []);
  return <Row onSelect={handleSelect} />;
}
When not to use them: useCallback is useless unless the child is wrapped in React.memo (or the function is a dependency of another hook). useMemo on cheap work (such as count * 2 in your notes) costs more than it saves. Measure first with React DevTools Profiler. Both are performance hints, so your code must still be correct without them. React Compiler can add this memoization automatically in projects that use it.
4.8 Custom hooks
Definition: A function whose name starts with use and that calls other hooks, so you can reuse stateful logic across components. Each call gets its own separate state.
Why: it replaces HOCs and render props for sharing logic, and keeps components short.
When: the same state plus effect pattern appears in two or more components (fetching, form handling, debounce, local storage, window size).

// useLocalStorage: state that survives a refresh

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}

// useDebounce: wait until the user stops typing
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');
const debouncedQuery = useDebounce(query, 400); // call the API with this value







4.9 Other hooks to know
Hook	Use
useLayoutEffect	Like useEffect but runs before the browser paints; for measuring layout
useId	Generates stable unique ids for accessibility attributes (htmlFor, aria-*)
useTransition	Marks a state update as non-urgent so typing stays responsive
useDeferredValue	Defers re-rendering a slow part using an older value
useParams, useNavigate, useLocation	React Router hooks 
useRouteError	React Router hook that reads the error inside an errorElement
use (React 19)	Reads a Promise or Context during render, works inside conditions
useActionState, useOptimistic (React 19)	Form actions with pending state, and instant optimistic UI
5. Data fetching, lists, conditional UI and forms
These four topics appear in almost every React interview and every real project.
5.1 Fetching data and showing it
Typical question: "How do you fetch data in React and display it?"
Answer in four steps: keep data, loading and error in state; fetch inside useEffect; handle all three states in the UI; clean up so a late response never updates an unmounted or outdated component.
import { lazy, useEffect, useState } from "react";

type Post = { id : number, title: string };

export default function FetchData1() {
    const [ posts, setPost ] = useState<Post[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [error, setError ] = useState<string | null>(null);

    async function load() {
        try {
            const res = await fetch('https://jsonplaceholder.typicode.com/posts');
            if(!res.ok) throw new Error(`Request failed ${res.status}`);
    
            setPost(await res.json());
          
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading((false));
        }
    };

    useEffect( () => {
        load()
    } , []);

    if(loading) return <h1>Loading...</h1>
    if (error) return <p>Error</p>
    
    return (
        <div>
            <ul>
                { posts.map(p => <li key={p.id}> { p.title } </li>  )}
            </ul>
        </div>
    )
}


Notes:
•	await res.json() needs await because reading and parsing the body is asynchronous.
•	The dependency array decides when to refetch. [] fetches once; [id] fetches again when id changes (for example, a product detail page).
•	fetch only rejects on network failure, so check res.ok. axios rejects on 4xx and 5xx automatically and parses JSON for you.
fetch or axios?
•	fetch: built into the browser, no extra dependency. Needs manual res.ok check and res.json().
•	axios: shorter code, interceptors (attach a token to every request), automatic JSON, request cancellation, and better error handling. Adds a dependency.
Reusable version as a custom hook:
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<T>;
      })
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') setError(err.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// const { data, loading, error } = useFetch<Post[]>('/api/posts');

In real projects: use TanStack Query (React Query) or RTK Query. They add caching, retries, background refresh and request de-duplication, which hand-written effects do not give you.

const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: () => fetch('/api/posts').then(r => r.json()),
});
5.2 Rendering lists and the key prop
Definition: Use map() to turn an array into elements. The key prop gives each item a stable identity so React can match old and new items during diffing.
{todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}

Why keys matter: with a stable key, React moves, adds or removes only the changed items and keeps each item's state. With the array index as key, inserting or deleting an item shifts the indexes, so React can mix up component state (for example, text typed into the wrong input).
Rules: keys must be unique among siblings, stable between renders, and not random (Math.random() creates a new key every render and remounts everything). Use the database id. Use the index only for static lists that never reorder.
5.3 Conditional rendering
// Ternary: two outcomes
{isLoggedIn ? <Dashboard /> : <Login />}

// &&: show or nothing
{hasError && <ErrorBanner />}

// Early return: guard clauses
if (loading) return <Spinner />;

// Trap: with numbers, 0 is rendered as the text "0"
{items.length && <List items={items} />}      // prints 0 when empty
{items.length > 0 && <List items={items} />}  // correct


5.4 Controlled vs uncontrolled components
Controlled: React state is the single source of truth. The input's value comes from state, and onChange updates it.
Uncontrolled: the DOM keeps the value; you read it with a ref (or FormData) when needed.
// Controlled
function ControlledForm() {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(name);           // send to an API here
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input id="name" value={name} onChange={e => setName(e.target.value)} />
      <button type="submit">Submit</button> {/* must be type="submit" */}
    </form>
  );
}

// Uncontrolled
function UncontrolledForm() {
  const nameRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(nameRef.current?.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="" />
      <button type="submit">Submit</button>
    </form>
  );
}
Which to choose, and why:
•	Controlled when you need live validation, to disable the submit button until the form is valid, to format input as the user types, or when several fields depend on each other. Cost: a re-render on every keystroke.
•	Uncontrolled for simple forms, file inputs (<input type="file"> is always uncontrolled), or very large forms where re-rendering on every key would be slow.
•	React Hook Form keeps inputs uncontrolled for speed and still gives validation (often with Zod or Yup). It is a common choice in production.
5.5 Submitting a form and calling an API
const [form, setForm] = useState({ email: '', password: '' });
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState('');

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSubmitting(true);
  setError('');
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error('Invalid credentials');
  } catch (err) {
    setError((err as Error).message);
  } finally {
    setSubmitting(false);
  }
};
One handleChange using the input's name attribute handles every field, so you do not need a handler per field.

