import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      todos: []
    };
  }

  onChange(e) {
    this.setState({ name: e.target.value });
  }

  addTodo(e) {
    e.preventDefault();
    const { todos } = this.state;
    todos && todos.push(this.state.name);
    this.setState({ todos: [...todos], name: "" });
  }

  deleteTodo(todo) {
    this.setState({
      todos: this.state.todos && this.state.todos.filter(item => item !== todo)
    });
  }

  render() {
    return (
      <div className="App">
        <form onSubmit={e => this.addTodo(e)}>
          <input
            type="text"
            value={this.state.name}
            name="name"
            onChange={e => this.onChange(e)}
          />
          <button className="submit">submit</button>
        </form>
        {this.state.todos &&
          this.state.todos.map((todo, index) => (
            <div key={index}>
              <li>{todo} </li>
              <button className="remove" onClick={() => this.deleteTodo(todo)}>
                Delete
              </button>
            </div>
          ))}
      </div>
    );
  }
}

export default App;
