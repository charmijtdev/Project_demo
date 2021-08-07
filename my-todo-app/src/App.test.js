import React from "react";
import App from "./App";
import { shallow } from "enzyme";
import getErrorMessage from "./errorMessage";

const Enzyme = require("enzyme");
// this is where we reference the adapter package we installed
// earlier
const EnzymeAdapter = require("enzyme-adapter-react-16");
// This sets up the adapter to be used by Enzyme
Enzyme.configure({ adapter: new EnzymeAdapter() });

function cleanUpTodos(app) {
  app.setState({ todos: [] });
}

var spy = jest.fn();

// Call the spy, so we can test it.
spy();

describe("App component", () => {
  it("shallow renders without crashing", () => {
    const wrapper = shallow(<App />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe("check for components", () => {
  let app;
  app = shallow(<App />);

  //beforeEach is called before each tests are executed
  //beforeAll is called only once before all the tests are executed
  beforeAll(function() {
    app.setState({ todos: ["taskB"] });
    expect(app.state().todos).toContain("taskB");
  });

  it("to check the properties of state", () => {
    expect(app.state()).toHaveProperty("name");
    expect(app.state()).toHaveProperty("todos");
  });

  it("calls when submit button is clicked", () => {
    app.find("button.submit").simulate("click");
    // app.setState({ name: "Project" });
    // expect(app.state().name).toBe("Project");
    expect(typeof app.state().name).not.toBe(null); //when submit button is clicked, the name should not be empty
  });

  it("Should have one input", () => {
    expect(app.find("input").length).toEqual(1);
  });

  it("Should have two buttons", () => {
    // app.setState({ todos: ["taskB"] }); //no need to setstate if it is already set in beforeAll function
    expect(app.find("button").length).toEqual(2);
  });

  it("should render first button", () => {
    const button = app.find("button").first();
    expect(button).toBeTruthy();
  });

  it("should render second button", () => {
    const button = app.find("button").at(1);
    expect(button).toBeTruthy();
  });

  it("simulate first Button click", () => {
    const button = app.find("button").first();
    button.simulate("click");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("simulate second Button click", () => {
    app.setState({ todos: ["taskB"] }); //no need to setstate if it is already set in beforeAll function
    app
      .find("button")
      .at(1)
      .simulate("click");
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("simulate input change", () => {
    const input = app.find("input").first();
    spy("TaskA");
    input.simulate("change", { target: { value: "TaskA" } });
    expect(app.state("name")).toBe("TaskA");
    // expect(app.state().name).toBe("TaskA");
    expect(spy).toHaveBeenCalledWith("TaskA"); //true
    expect(spy).toHaveBeenCalledTimes(2); //spy called 2 times
  });

  afterAll(() => {
    cleanUpTodos(app);
  });
});

const todos = ["aa", "bb", "cc"];

const fetchData = () => {
  return fetch("http://localhost:8001/api/todos")
    .then(res => res.json())
    .then(result => {
      console.log("result", result.todos);
      return result.todos;
    });
};

async function fetchAsyncData() {
  const response = await fetch("http://localhost:8001/api/todos");
  const json = await response.json();
  return json.todos;
}

/* assertions() is useful when testing asynchronous code,
 * in order to make sure that assertions
 * in a callback actually got called.
 * The expect.assertions(2) call ensures that both callbacks actually get called.
 */

/* Should you omit done() from the code,
 * the test will not work as it should because
 * the callback function won’t be called at all.
 */
//not working
describe("Callbacks", () => {
  it("test async code via callbacks", done => {
    // expect.assertions(1);
    function callback(value) {
      expect(value).toBe(todos);
      done();
    }
    fetchData(callback);
  });

  //example of callback
  const uppercase = (str, callback) => {
    console.log("uppercase", callback);
    callback(str.toUpperCase());
  };

  test(`uppercase 'test' to equal 'TEST'`, done => {
    uppercase("test", str => {
      expect(str).toBe("TEST");
      done();
    });
  });

  test("doAsync calls both callbacks", () => {
    // expect.assertions(2);
    function callback1(data) {
      expect(data).toBeTruthy();
    }
    function callback2(data) {
      expect(data).toBeTruthy();
    }
    fetchAsyncData(callback1, callback2);
  });
});

describe("Promises", () => {
  it("test async code via promises", () => {
    // return fetch("http://localhost:8001/api/todos")
    //   .then(res => res.json())
    //   .then(data => {
    //     expect(data.todos).toEqual(todos);
    //   });
    return fetchData().then(data => {
      expect(data).toEqual(todos);
    });
  });
});

describe("async/await", () => {
  it("fetch data using async await", async () => {
    let data = await fetchAsyncData();
    expect(data).toEqual(todos);
  });
});

//demo for understanding snapshot testing
describe("getErrorMessage", () => {
  it("returns an error for a valid code", () => {
    expect(getErrorMessage(1)).toMatchSnapshot();
    expect(getErrorMessage(2)).toMatchSnapshot();
    expect(getErrorMessage(3)).toMatchSnapshot();
  });

  it("throws an error otherwise", () => {
    expect(() => getErrorMessage(4)).toThrowErrorMatchingSnapshot();
  });
});
