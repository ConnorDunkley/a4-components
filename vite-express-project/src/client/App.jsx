import React from 'react';

// we could place this Todo component in a separate file, but it's
// small enough to alternatively just include it in our App.js file.

class Todo extends React.Component {
  // our .render() method creates a block of HTML using the .jsx format
  render() { //update this with the correct fields
    return <li class="listli">{this.props.name} : 
      <input
        type="checkbox"
        defaultChecked={this.props.completed}
        onChange={ e => this.change(e) }
      />
    </li>
  }
  // call this method when the checkbox for this component is clicked
  change(e) {
    this.props.onclick( this.props.name, e.target.checked )
  }
}

// main component
class App extends React.Component {
  constructor( props ) {
    super( props )
    // initialize our state
    this.state = { todos:[] }
  }

  componentDidMount() {
    this.load()
  }

  // load in our data from the server
  load() {
    fetch( '/read', { method:'get', 'no-cors':true })
      .then( response => response.json() )
      .then( json => {
         this.setState({ todos:json }) 
      })
  }
  
 // when an Todo is toggled, send data to server
  toggle( name, completed ) {
    fetch( '/change', {
      method:'POST',
      body: JSON.stringify({ name, completed }),
      headers: { 'Content-Type': 'application/json' }
    })
  }
 
  // add a new todo list item
  add( evt ) {
    const value = document.querySelector('input').value

    fetch( '/add', { 
      method:'POST',
      body: JSON.stringify({ name:value, completed:false }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then( response => response.json() )
    .then( json => {
       // changing state triggers reactive behaviors
       this.setState({ todos:json }) 
    })
  }
  //delete route here
  delete( evt){
    //get the values with query selector
    const value = document.querySelector('input').value
    fetch('/delete', {
      method:'POST',
      body: JSON.stringify({ name:value, completed:false }), //update this with correct fields
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // render component HTML using JSX 
  render() {
    return (
      <div className="App">
      <h1 id="title" class="titles">
      Shopping List
      </h1>
      <form class="form1" method="POST">
        <input class="listinput" type='text' id='item' placeholder='Item?'/>
        <br></br>
        <input class="listinput" id='cost' placeholder='Cost? $' type="number" min="0"/>
        <br></br>
        <input class="listinput" id='count' placeholder='How many?' type="number" name="quantity" min="0" step="1"/>
        <br></br>
        <button class="submitbutton" onClick={ e => this.add( e )}>Submit</button>
      </form>
        <ul class="mainlist">
          {/* ensure that this todo has the correct fields */}
          { this.state.todos.map( (todo,i) => 
            <Todo
              key={i}
              name={todo.name}
              completed={todo.completed}
              onclick={ this.toggle }
            /> ) }
       </ul> 
      <h2 hidden id="tdisp" class="titles"></h2>
      </div>
    )
  }
}

export default App