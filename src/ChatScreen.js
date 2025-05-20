import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { ref, push, onValue, remove } from "firebase/database";

function ChatScreen() {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState(".");
  const isMobile = useMediaQuery("(max-width:600px)");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const messagesRef = ref(db, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.values(data);
        setMessages(loadedMessages);
      }
    });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (isTyping) {
      const interval = setInterval(() => {
        setTypingDots((prev) => (prev.length < 3 ? prev + "." : "."));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const getTimestamp = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const token = localStorage.getItem("authToken");

    const newUserMessage = {
      sender: "User",
      text: userMessage,
      time: getTimestamp(),
    };
    push(ref(db, "messages"), newUserMessage);
    setUserMessage("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/chat",
        { message: userMessage },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      const replyText = response.data.userFriendlyResponse;
      const isSuccess = replyText.includes("✅ Payment successful!");

      const newAgentMessage = {
        sender: "Agent",
        text: replyText,
        success: isSuccess,
        time: getTimestamp(),
      };
      push(ref(db, "messages"), newAgentMessage);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        sender: "Agent",
        text: "⚠️ Failed to get response from server.",
        time: getTimestamp(),
      };
      push(ref(db, "messages"), errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearMessages = () => {
    remove(ref(db, "messages"));
    setMessages([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <Box
      sx={{
        maxWidth: 700,
        margin: "50px auto",
        padding: 3,
        borderRadius: 4,
        boxShadow: 4,
        bgcolor: "#E8DCF0",
        border: "1px solid #5A0F86",
      }}
    >
      <Box sx={{ position: "relative", mb: 2 }}>
        <Typography variant="h4" align="center">
          AI Agent Chat
        </Typography>
        <Box sx={{ position: "absolute", right: 0, top: 0 }}>
          <Tooltip title="Clear all chat history" arrow>
            <Button variant="text" color="error" onClick={handleClearMessages}>
              <DeleteIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Log out" arrow>
            <Button variant="text" color="secondary" onClick={handleLogout}>
              <LogoutIcon />
            </Button>
          </Tooltip>
        </Box>
      </Box>

      <Stack
        spacing={2}
        sx={{
          height: 500,
          overflowY: "auto",
          mb: 2,
          p: 2,
          borderRadius: 3,
          bgcolor: "#fff",
          border: "1px solid #ccc",
          boxShadow: 1,
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {messages.length === 0 && (
          <Typography
            variant="body2"
            color="textSecondary"
            align="center"
            sx={{ fontStyle: "italic", opacity: 0.6 }}
          >
            No messages yet. Start the conversation!
          </Typography>
        )}

        {messages.map((msg, index) => (
          <Box
            key={index}
            display="flex"
            justifyContent={msg.sender === "User" ? "flex-end" : "flex-start"}
          >
            <Card
              sx={{
                maxWidth: "85%",
                minWidth: "20%",
                bgcolor: msg.sender === "User" ? "#e3f2fd" : "#f1f8e9",
                border: msg.success ? "2px solid #4caf50" : "1px solid #ddd",
                boxShadow: msg.success ? 4 : 1,
                borderRadius: 3,
              }}
            >
              <CardContent
                sx={{ position: "relative", paddingBottom: "28px !important" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontWeight: 500,
                    color: "text.secondary",
                    opacity: 0.7,
                  }}
                >
                  {msg.sender === "User" ? "You" : "Agent"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    fontFamily: "monospace",
                    fontSize: 14,
                  }}
                >
                  {msg.text}
                </Typography>
                {msg.time && (
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      right: 8,
                      fontSize: "0.7rem",
                      color: "text.secondary",
                      opacity: 0.6,
                    }}
                  >
                    {msg.time}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}

        {isTyping && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ fontStyle: "italic", opacity: 0.6, ml: 1 }}
          >
            Agent is typing{typingDots}
          </Typography>
        )}

        <div ref={messagesEndRef} />
      </Stack>

      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={1}
        alignItems="center"
        width="100%"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            borderRadius: "12px",
            bgcolor: "#fff",
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              height: "50px",
              paddingRight: "8px",
              boxShadow: 2,
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Send your message" arrow>
                  <Button
                    onClick={handleSendMessage}
                    sx={{
                      minWidth: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      bgcolor: "transparent",
                      color: "primary.main",
                      "&:hover": { bgcolor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <SendIcon />
                  </Button>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
}

export default ChatScreen;
