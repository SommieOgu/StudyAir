// src/StudyRoom.jsx
import React, { useRef, useState, useEffect } from "react";
import { firestore } from "../firebaseClient";
import "./StudyRoom.css";

const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
      ],
    },
  ],
  iceCandidatePoolSize: 10,
};

function StudyRoom() {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [isWebcamStarted, setIsWebcamStarted] = useState(false);
  const [isCallCreated, setIsCallCreated] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [callId, setCallId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Peer connection stored in a ref so it survives renders
  const pcRef = useRef(null);

  // attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // helper to ensure pc exists and has ontrack handler
  const ensurePeerConnection = () => {
    if (!pcRef.current) {
      console.log("🔧 Creating RTCPeerConnection");
      const pc = new RTCPeerConnection(servers);

      pc.ontrack = (event) => {
        console.log("📥 Received remote track event:", event.streams);
        const inboundStream = new MediaStream();
        event.streams[0].getTracks().forEach((track) => {
          console.log("Adding remote track:", track.kind);
          inboundStream.addTrack(track);
        });
        setRemoteStream(inboundStream);
      };

      pcRef.current = pc;
    }
    return pcRef.current;
  };

  const handleStartWebcam = async () => {
    try {
      console.log("🎥 Starting webcam...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setIsWebcamStarted(true);

      const pc = ensurePeerConnection();

      console.log("Adding local tracks to pc...");
      stream.getTracks().forEach((track) => {
        console.log("Adding local track:", track.kind);
        pc.addTrack(track, stream);
      });
    } catch (err) {
      console.error("Error starting webcam:", err);
      alert("Could not start webcam. Please allow camera/mic permissions.");
    }
  };

  const handleCreateCall = async () => {
    const pc = ensurePeerConnection();

    try {
      console.log("📞 Creating call (offer)...");
      const callDoc = firestore.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      console.log("New call document ID:", callDoc.id);
      setCallId(callDoc.id);

      // ICE candidates from caller
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Caller ICE candidate:", event.candidate);
          offerCandidates
            .add(event.candidate.toJSON())
            .then(() =>
              console.log("Saved caller ICE candidate to Firestore")
            )
            .catch((err) =>
              console.error("Error saving caller ICE candidate:", err)
            );
        } else {
          console.log("Caller ICE gathering complete.");
        }
      };

      // Create offer
      console.log("Creating SDP offer...");
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);
      console.log("Local description set with offer.");

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      await callDoc.set({ offer });
      console.log("Offer saved to Firestore.");

      // Listen for remote answer
      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        console.log("📡 callDoc snapshot:", data);

        if (!pc.currentRemoteDescription && data?.answer) {
          console.log("Received answer from Firestore:", data.answer);
          const answerDescription = new RTCSessionDescription(data.answer);
          pc
            .setRemoteDescription(answerDescription)
            .then(() =>
              console.log("Remote description set with answer.")
            )
            .catch((err) =>
              console.error("Error setting remote description:", err)
            );
        }
      });

      // When answered, add ICE candidates from callee
      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(
            "Answer candidates change:",
            change.type,
            change.doc.id
          );
          if (change.type === "added") {
            const data = change.doc.data();
            console.log("New answer ICE candidate:", data);
            const candidate = new RTCIceCandidate(data);
            pc
              .addIceCandidate(candidate)
              .then(() => console.log("Added answer ICE candidate to pc"))
              .catch((err) =>
                console.error("Error adding answer ICE candidate:", err)
              );
          }
        });
      });

      setIsCallCreated(true);
    } catch (err) {
      console.error("Error creating call:", err);
    }
  };

  const handleAnswer = async () => {
    const pc = ensurePeerConnection();

    try {
      console.log("📞 Answering call with ID:", callId);
      const callDoc = firestore.collection("calls").doc(callId);
      const answerCandidates = callDoc.collection("answerCandidates");
      const offerCandidates = callDoc.collection("offerCandidates");

      // ICE candidates from callee
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Answerer ICE candidate:", event.candidate);
          answerCandidates
            .add(event.candidate.toJSON())
            .then(() =>
              console.log("Saved answerer ICE candidate to Firestore")
            )
            .catch((err) =>
              console.error("Error saving answerer ICE candidate:", err)
            );
        } else {
          console.log("Answerer ICE candidate gathering complete.");
        }
      };

      const callSnapshot = await callDoc.get();
      const callData = callSnapshot.data();
      console.log("Fetched call data:", callData);

      const offerDescription = callData.offer;
      console.log("Setting remote description with offer:", offerDescription);
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      console.log("Creating answer...");
      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);
      console.log("Local description set with answer.");

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });
      console.log("Answer saved to Firestore.");

      // Listen for caller ICE candidates
      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(
            "Offer candidates change:",
            change.type,
            change.doc.id
          );
          if (change.type === "added") {
            const data = change.doc.data();
            console.log("New caller ICE candidate:", data);
            pc
              .addIceCandidate(new RTCIceCandidate(data))
              .then(() => console.log("Added caller ICE candidate to pc"))
              .catch((err) =>
                console.error("Error adding caller ICE candidate:", err)
              );
          }
        });
      });

      setIsJoined(true);
    } catch (err) {
      console.error("Error answering call:", err);
    }
  };

  const handleHangup = () => {
    console.log("📵 Hanging up...");

    if (pcRef.current) {
      pcRef.current.getSenders().forEach((sender) => {
        try {
          sender.track && sender.track.stop();
        } catch {}
      });
      pcRef.current.close();
      pcRef.current = null;
    }

    localStream?.getTracks().forEach((t) => t.stop());
    remoteStream?.getTracks().forEach((t) => t.stop());

    setLocalStream(null);
    setRemoteStream(null);
    setIsWebcamStarted(false);
    setIsCallCreated(false);
    setIsJoined(false);
    // Keep callId if you want to reuse, or clear it:
    // setCallId("");

    console.log("Hangup complete.");
  };


 return (
  <div className="study-room-container">
    {/* Sidebar overlay */}
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <button
        style={{
          alignSelf: "flex-end",
          border: "none",
          background: "transparent",
          color: "white",
          fontSize: "20px",
          cursor: "pointer",
          marginBottom: "10px",
        }}
        onClick={() => setSidebarOpen(false)}
      >
        ✕
      </button>

      <h2>Menu</h2>


      <h2>Create a new Call</h2>
      <button className="createCall"
        onClick={handleCreateCall}
        disabled={!isWebcamStarted || isCallCreated}
      >
        Begin Call (offer)
      </button>

      <h2>Join a Call</h2>
      <p>Waiting for answer</p>

      <input className="callID"
        value={callId}
        onChange={(e) => setCallId(e.target.value)}
        placeholder="Enter Call ID"
      />
      <button className="createCall"
        onClick={handleAnswer}
        disabled={!isWebcamStarted || !callId || isJoined}
      >
        Answer
      </button>
    </div>

    {/* Header */}
    <div className="study-room-header">
      {!sidebarOpen && (
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>
      )}

      <h2>Welcome to the Study Room</h2>
    </div>

    {/* Main content */}
    <div>
      <div className="videos" style={{ display: "flex", gap: 100 }}>
        <span>
          <h3>Host</h3>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: 550, height: 500, background: "#000" }}
          />
        </span>
        <span>
          <h3>Study Partner</h3>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{ width: 550, height: 500, background: "#000" }}
          />
        </span>
      </div>

     <div style={{ display: "flex", alignItems: "center", gap: "40px", marginTop: "16px",marginLeft: 480  }}>
  <button className= "webcam" onClick={handleStartWebcam} disabled={isWebcamStarted}>
    {isWebcamStarted ? "Webcam started" : "Start Webcam"}
  </button>

  <button className="hangup-btn-round" onClick={handleHangup}>
    📞
  </button>
</div>
      
    </div>
  </div>
);
}

export default StudyRoom;
