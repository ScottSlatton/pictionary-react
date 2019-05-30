import React, {Component} from 'react';
import Cable from 'actioncable';

class Chatbox extends Component {
  constructor() {
    super()
    this.state = {
      currentChatMessage: '',
      chatLogs: []
    }
  }

  componentWillMount() {
    this.createSocket()
  }

  updateCurrentChatMessage(ev) {
    this.setState({
      currentChatMessage: ev.target.value
    })
  }

  createSocket() {
    let cable = Cable.createConsumer('ws://localhost:3000/cable');
    this.chats = cable.subscriptions.create({
      channel: 'ChatChannel'
    }, {
      connected: () => {},
      received: (data) => {
        let chatLogs = this.state.chatLogs;
        chatLogs.push(data);
        this.setState({ chatLogs: chatLogs });
      },
      create: function(chatContent, id, username) {

        this.perform('create', {
          content: chatContent,
          user_id: id,
          user_name: username
        });
      }
    });
  }

  handleSendEvent(ev) {
    ev.preventDefault();
    this.chats.create(
      this.state.currentChatMessage,
      this.props.userId,
      this.props.username
      );
    this.setState({
      currentChatMessage: ''
    });
  }

  renderChatLog() {
    return this.state.chatLogs.map((el) => {
      return (
        <div className="ui message" key={`chat_${el.id}`}>
          <div class="header">
            { el.user_name }: { el.content }
          </div>
        </div>
      );
    });
  }


  render() {
    return (
      <div >
        <h3>Messages</h3>
        <div className="height-600">
          {this.renderChatLog()}
        </div>
        <br />
        <form onSubmit={(ev) => this.handleSendEvent(ev)}>
        <div className="ui input">
          <input
            value={this.state.currentChatMessage}
            onChange={(ev) => this.updateCurrentChatMessage(ev)}
            type='text'
            placeholder='Enter your guess'
          />
        </div> &nbsp;
        <button class="ui icon button">
          <i class="arrow alternate circle right icon"></i>
        </button>
        </form>
      </div>
    )
  }


}

export default Chatbox;

// <div class="ui message">
// <div class="header">
//   Changes in Service
// </div>
// <p></p>
// </div>
