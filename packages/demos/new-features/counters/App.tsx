import {h, useState, Fragment} from 'preact'
import "./App.css";
import "./main.css"
import Counter from "./Counter";
import CounterReducer from "./CounterReducer";
import CounterTitle from "./CounterTitle";
import GitHubLogo from "./GitHubLogo";
import Title from "./Title";

// import Footer from './Footer'
// import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'

// An object of all possible example components that can be rendered
const EXAMPLES = {
  Counter,
  CounterTitle,
  CounterReducer
};

type Examples = keyof typeof EXAMPLES;
const EXAMPLE_NAMES = Object.keys(EXAMPLES) as Examples[];


// Use state to keep track of the current displayed example component
// The currently selected example component that should be rendered
// A list of buttons for all examples to render

//let theme: any = createMuiTheme()

const App = () => {

  const [example, setExample] = useState<Examples>("Counter");

  const ExampleComponent = EXAMPLES[example];

  // A list of buttons for all examples to render
  const exampleButtons = EXAMPLE_NAMES.map(name => (
    <button
      key={name}
      onClick={() => setExample(name)}
      className={name === example ? "active" : ""}
    >
      &lt;
      {name} /&gt;
    </button>
  ));

  return (
    <Fragment>
      <Title />
      <GitHubLogo />
      <div className="container">
        <div className="app">
          {exampleButtons}
          <div className="separator" />
          <ExampleComponent />
        </div>
      </div>
    </Fragment>
  );
};

export default App;








// // import Footer from './Footer'
// // import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'

// // An object of all possible example components that can be rendered
// const EXAMPLES = {
//   Counter,
//   CounterTitle,
//   CounterReducer
// };

// type Examples = keyof typeof EXAMPLES;
// const EXAMPLE_NAMES = Object.keys(EXAMPLES) as Examples[];


// // Use state to keep track of the current displayed example component
// // The currently selected example component that should be rendered
// // A list of buttons for all examples to render

// //let theme: any = createMuiTheme()

// const App = () => {

//   const [example, setExample] = useState<Examples>("Counter");

//   const ExampleComponent = EXAMPLES[example];

//   // A list of buttons for all examples to render
//   const exampleButtons = EXAMPLE_NAMES.map(name => (
//     <button
//       key={name}
//       onClick={() => setExample(name)}
//       className={name === example ? "active" : ""}
//     >
//       &lt;
//       {name} /&gt;
//     </button>
//   ));

//   return (
//     <Fragment>
//     <MuiThemeProvider theme={theme}>
//       <Title />
//       <GitHubLogo />
//       <div className="container">
//         <div className="app">
//           {exampleButtons}
//           <div className="separator" />
//           <ExampleComponent />
//         </div>
//       </div>
//       <Footer/>
//       </MuiThemeProvider>
//     </Fragment>
//   );
// };