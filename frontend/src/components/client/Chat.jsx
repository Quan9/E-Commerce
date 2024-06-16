/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "@mantine/hooks";
import { useLocation } from "react-router-dom";
import parse from "html-react-parser";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Indicator,
  Loader,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { clientChat } from "../../services/chat";
import { getAnoUser } from "../../services/user";
import { getAllMessages, sendMessage } from "../../services/message";
import { toast } from "react-toastify";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import QuillChat from "../misc/QuillChat";

const Chat = (props) => {
  const { user, loggedIn, socket } = props;
  const [visible, setVisible] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [hovered, setHovered] = useState(false);

  const ref = useClickOutside(() => setVisible(false));
  const scrollRef = useRef();
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];
  const paths = ["login", "register", "user"];
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState();
  const [typing, setTyping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user1, setUser1] = useState(user);
  const quillRef = useRef();
  const [doubleKey, setDoubleKey] = useState(false);
  useEffect(() => {
    if (messages.length) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);
  useEffect(() => {
    const enterChat = async () => {
      setLoading(true);

      await clientChat(user.username, { loggedIn })
        .then((res) => {
          const data = res.data;
          if (user._id === undefined) {
            getAnoUser(user).then((res) => {
              const sesUser = JSON.parse(sessionStorage.getItem("userSes"));
              sesUser._id = res.data;
              sessionStorage.setItem("userSes", JSON.stringify(sesUser));
              setUser1(sesUser);
            });
          }
          getAllMessages(data).then((res) => {
            setMessages(res.data);
            setRoom(data);
            socket.emit("join", data);
            setLoading(false);
          });
        })
        .catch((err) => toast.error(err, { position: "top-right" }));
    };
    enterChat();
  }, []);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      setMessages([...messages, newMessageRecieved]);
      toggleAlarm();
    });
  });
  const toggleAlarm = () => {
    if (visible !== true) {
      setAlarm(true);
    } else {
      setAlarm(false);
    }
  };
  const handleSubmit = async () => {
    let newMessage1 = newMessage.replaceAll("<p><br></p>", "");

    if (newMessage1) {
      try {
        const { data } = await sendMessage({
          chatId: room,
          content: newMessage1,
          user: user.username,
        });

        socket.emit("userMessage", data);
        setMessages([...messages, data]);
        setNewMessage("");
        const quill = document.getElementsByClassName("ql-editor");
        quill[0].innerHTML = "";
      } catch (error) {
        toast.error("error", { position: "top-right", data: error });
      }
    } else {
      toast.info("Empty input", { position: "top-center" });
    }
    setTyping(true);
    setDoubleKey(false);
  };
  useEffect(() => {
    const handle = () => {
      setTyping(false);
      handleSubmit();
    };
    doubleKey && handle();
  }, [doubleKey]);
  return (
    <>
      {paths.includes(pathname) ? (
        <></>
      ) : (
        <div ref={ref}>
          <Box className="transition-1" display={!visible && "none"}>
            <Title bg={"blue"} order={4} ta={"center"}>
              Customer Support
            </Title>
            <Box
              justify="flex-end"
              bg={"rgba(198, 198, 198, 1)"}
              style={{
                overflow: "auto",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
              h={"80%"}
              pb={"sm"}
              w={"100%"}
            >
              {loading ? (
                <Loader color="blue" />
              ) : (
                <Flex
                  direction="column"
                  justify={"flex-end"}
                  w={"100%"}
                  style={{ overflowWrap: "break-word" }}
                >
                  {messages?.map((m, i) => {
                    return (
                      <Flex key={m._id} className="chat-client">
                        {(isSameSender(messages, m, i, user1._id) ||
                          isLastMessage(messages, i, user1._id)) && (
                          <Tooltip
                            label={m.sender.username}
                            position="top-center"
                            withArrow
                          >
                            <Avatar
                              mt="7px"
                              mr={1}
                              size="sm"
                              cursor="pointer"
                              name={m.sender.username}
                              src={m.sender.img}
                            />
                          </Tooltip>
                        )}
                        <Text
                          span
                          key={m._id}
                          style={{
                            backgroundColor: `${
                              m.sender.username === user1.username
                                ? "#BEE3F8"
                                : "#B9F5D0"
                            }`,
                            marginLeft: isSameSenderMargin(
                              messages,
                              m,
                              i,
                              user1._id
                            ),
                            marginTop: isSameUser(messages, m, i, user1._id)
                              ? 3
                              : 10,
                            borderRadius: "10px",
                            padding: "5px 0px",
                            maxWidth: "70%",
                          }}
                        >
                          {parse(`${m.content}`) || m.content}
                        </Text>
                      </Flex>
                    );
                  })}
                  <div ref={scrollRef} />
                </Flex>
              )}
            </Box>
            <QuillChat
              ref={quillRef}
              setNewMessage={setNewMessage}
              defaultValue={newMessage}
              setDoubleKey={setDoubleKey}
              typing={typing}
            />
          </Box>
          <Indicator
            style={{ position: "fixed", bottom: "24px", right: "24px" }}
            position="top-center"
            processing
            disabled={alarm ? false : true}
            label="New Message"
          >
            <Tooltip label={"Chat with us!"} visibleFrom="md" withArrow>
              <Avatar
                className="transition-3"
                onClick={() => {
                  setVisible(!visible);
                  setAlarm(false);
                }}
                style={{
                  border: hovered ? "4px solid #7a39e0" : " 1px solid #f9f0ff",
                  boxShadow: "0px 0px 16px 6px rgba(0, 0, 0, 0.33)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.cursor = "pointer";
                  setHovered(true);
                }}
                onMouseLeave={() => setHovered(false)}
                color="blue"
                size={60}
                // display={visible && "none"}
              >
                <Text size="sm" c={"green"}>
                  Support
                </Text>
              </Avatar>
            </Tooltip>
          </Indicator>
        </div>
      )}
    </>
  );
};

export default Chat;
