import React, { Component } from 'react';
import io from 'socket.io-client';

class App extends Component {
  constructor(props) {
    super(props)

    this.localVideoref = React.createRef()
    this.remoteVideoref = React.createRef()

    this.socket = null
  }

  componentMount() {

    const pc_config = null;

    this.socket = io(
        '/webrtcPeer',
      {
        path:'/webrtc',
        query:{}
    })
    // const pc_config = {
    //     "iceServers": [
    //       {
    //         urls: 'stun:[STUN-IP]:[PORT]',
    //         'credential': 'your credentials',
    //         'username': 'username'
    //       }
    //     ]
    // };

    this.pc = new RTCPeerConnection(pc_config);

    this.pc.onicecandidate = (e) => {
      if(e.candidate) console.log(JSON.stringify(e.candidate));
    }
    this.pc.onicegatheringstatechange = (e) => {
      console.log(e);
    }

    this.pc.onaddstream = (e) => {
      console.log('remote screen video');
      this.remoteVideoref.current.srcObject = e.stream;
    }

    const constraints = {video:true};

    const success = (stream) => {
      this.localVideoref.current.srcObject = stream;
      this.pc.addStream(stream);
    }
    const failure = (e) => {
      console.log(e);
    }
    navigator.mediaDevices.getUserMedia(constraints).then(success).catch(failure);
  }

  createOffer = () => {
    console.log('offer');
    this.pc.createOffer({offerToReceiveVideo:1})
    .then(sdp => {
      console.log(JSON.stringify(sdp))
      this.pc.setLocalDescription(sdp);
    }, e => {})    
  }

  setRemoteDiscription = () => {
    const desc = JSON.parse(this.textref.value)

    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  }

  createAnswer = () => {
    console.log('Answer');
    this.pc.createAnswer({offerToReceiveVideo:1})
    .then(sdp => {
      console.log(JSON.stringify(sdp));
      this.pc.setLocalDescription(sdp);
    }, e => {})
  }

  addCandidate = () => {
    const candidate = JSON.parse(this.textref.value);
    console.log('Adding component ',candidate)
    this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  }

  render () { 
    this.componentMount();
    return (
    <div>
      <video 
      style= {{
        width: 240, height:240,
        margin:5, background: 'black'
      }}
      ref={this.localVideoref}
       autoPlay></video>
       <video 
       style= {{
         width: 240, height:240,
         margin:5, background: 'black'
       }}
       ref={this.remoteVideoref}
        autoPlay></video> 

        <button onClick={this.createOffer}>Offer</button>
        <button onClick={this.createAnswer}>Answer</button>
        <br/>
        <textarea ref={ref => {this.textref = ref }}></textarea>
        <br/>
        <button onClick={this.setRemoteDiscription}>Set Remote Discription</button>
        <button onClick={this.addCandidate}>Add Candidate</button>
    </div>
  );
  }
}

export default App;
