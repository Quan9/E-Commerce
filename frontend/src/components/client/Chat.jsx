/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { useClickOutside } from "@mantine/hooks";
import { useLocation } from "react-router-dom";
import parse from "html-react-parser";
import {
  Avatar,
  AvatarGroup,
  Box,
  Center,
  Flex,
  Group,
  Indicator,
  Loader,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { clientChat } from "../../services/chat";
import { getAnoUser } from "../../services/user";
import {
  getAllMessages,
  sendMessage,
  updateChatRead,
} from "../../services/message";
import { toast } from "react-toastify";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import QuillChat from "../misc/QuillChat";

const Chat = (props) => {
  const { user, socket } = props;
  const [visible, setVisible] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState();
  const [typing, setTyping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState(user);
  const quillRef = useRef();
  const [doubleKey, setDoubleKey] = useState(false);
  const refScroll = useRef();
  const [oldestMessage, setOldestMessage] = useState(0);
  const [loadingOldMess, setLoadingOldMess] = useState(false);
  const [top, setTop] = useState(false);

  const ref = useClickOutside(() => setVisible(false));
  const scrollRef = useRef();
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];
  const paths = ["login", "register", "user", "verifyEmail"];

  useEffect(() => {
    const enterChat = async () => {
      if (!paths.includes(pathname)) {
        setLoading(true);
        await clientChat(user.username)
          .then(async (res) => {
            const data = res.data;
            if (user._id === undefined) {
              getAnoUser(user).then((res) => {
                const sesUser = JSON.parse(sessionStorage.getItem("userSes"));
                sesUser._id = res.data;
                sessionStorage.setItem("userSes", JSON.stringify(sesUser));
                setGuess(sesUser);
              });
            }
            setRoom(data);
            socket.emit("join", data);
            setLoading(false);
          })
          .catch((err) => toast.error(err, { position: "top-right" }));
      }
    };
    enterChat();
  }, []);

  useEffect(() => {
    room && fetchMessages();
  }, [room]);

  useEffect(() => {
    const messageReceived = async () => {
      await updateChatRead(room, {
        totalMessage: messages.length + 1,
        user: guess.username,
      }).then((response) => {
        const updateMessages = response.data.reverse();
        setMessages(updateMessages);
        setOldestMessage(oldestMessage + 1);
        toggleAlarm();
        setTimeout(() => {
          ref.current.scrollIntoView();
        }, 100);
      });
      socket.emit("userRead", {
        room: room,
        user: guess.username,
      });
    };
    const updateMessage = async () => {
      await updateChatRead(room, {
        totalMessage: messages.length,
        user: guess.username,
      }).then((response) => {
        const updateMessages = response.data.reverse();
        setMessages(updateMessages);
        setTimeout(() => {
          ref.current.scrollIntoView();
        }, 100);
      });
    };
    socket.on("message recieved", messageReceived);
    socket.on("updateMessages", updateMessage);
    return () => {
      socket.off("message recieved", messageReceived);
      socket.off("updateMessages", updateMessage);
    };
  }, [socket, messages, room]);

  useEffect(() => {
    const handle = () => {
      setTyping(false);
      handleSubmit();
    };
    doubleKey && handle();
  }, [doubleKey]);

  useEffect(() => {
    const check = async () => {
      if (messages.length === 0) {
        return;
      }
      if (oldestMessage === messages.length) {
        return scrollRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
      setLoadingOldMess(true);
      await fetchMessages();
      setLoadingOldMess(false);
    };
    check();
  }, [oldestMessage]);

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
        setOldestMessage(oldestMessage + 1);
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

  const fetchMessages = () => {
    getAllMessages(room, {
      total: oldestMessage,
      user: guess.username,
    })
      .then((res) => {
        const response = res.data.messages.reverse();
        setTop(res.data.top);
        if (messages.length === 0) {
          setMessages(response);
          return setOldestMessage(response.length);
        } else {
          setMessages([...response, ...messages]);
          setTimeout(() => {
            scrollRef.current.childNodes[data.length].scrollIntoView();
          }, 100);
        }
      })
      .catch((err) => setMessages([]));
  };

  const handleScroll = useCallback(async (e) => {
    let element = e.target;
    if (element.scrollTop === 0 && !top) {
      setOldestMessage(oldestMessage + 20);
    }
  });

  return (
    <>
      {paths.includes(pathname) ? (
        <></>
      ) : (
        <div ref={ref}>
          <Box className="transition-1" display={!visible && "none"}>
            <Title bg={"blue"} order={4} ta={"center"} h={"10%"}>
              Customer Support
            </Title>
            <Box
              bg={"white"}
              style={{
                overflow: "auto",
                wordBreak: "break-all",
                alignContent: "end",
              }}
              h={"80%"}
              maw={"100%"}
              onScroll={handleScroll}
              ref={refScroll}
            >
              {loading ? (
                <Center h={"100%"}>
                  <Loader size={"xl"} />
                </Center>
              ) : (
                <>
                  {messages.length === 0 ? (
                    <Center h={"100%"}>
                      <Title order={3}>Chat with us!</Title>
                    </Center>
                  ) : (
                    <>
                      {messages?.map((m, i) => {
                        return (
                          <>
                            <Flex
                              key={m._id}
                              className={"chat client"}
                              opacity={loadingOldMess ? 0.5 : 1}
                              maw={"50%"}
                              mt={!isSameUser(messages, m, i, guess._id) && 10}
                              ms={
                                isSameSender(messages, m, i, guess._id)
                                  ? "auto"
                                  : isLastMessage(messages, i, guess._id)
                                  ? "auto"
                                  : isSameSenderMargin(
                                      messages,
                                      m,
                                      i,
                                      guess._id
                                    )
                              }
                              justify={
                                isSameSender(messages, m, i, user._id)
                                  ? "end"
                                  : isLastMessage(messages, i, user._id)
                                  ? "end"
                                  : isSameSenderMargin(
                                      messages,
                                      m,
                                      i,
                                      user._id
                                    ) !== 0 && "end"
                              }
                            >
                              <Group gap={"5px"} align="center"></Group>
                              {(isSameSender(messages, m, i, guess._id) ||
                                isLastMessage(messages, i, guess._id)) && (
                                <Tooltip
                                  label={m.sender.username}
                                  position="top-center"
                                  withArrow
                                  events={{
                                    hover: true,
                                    focus: true,
                                    touch: true,
                                  }}
                                >
                                  <Avatar src={m.sender.img} />
                                </Tooltip>
                              )}
                              <Text
                                span
                                ms={isSameSenderMargin(
                                  messages,
                                  m,
                                  i,
                                  guess._id
                                )}
                                bg={
                                  m.sender.username === guess.username
                                    ? "#BEE3F8"
                                    : "#B9F5D0"
                                }
                                style={{
                                  borderRadius:
                                    m.sender._id === user._id
                                      ? "0 20px 20px 0"
                                      : "20px 0 0 20px",
                                }}
                              >
                                {parse(`${m.content}`, {
                                  replace: (domNode) => {
                                    if (
                                      domNode.name === "p" &&
                                      domNode.children[0].name === "br"
                                    ) {
                                      return <></>;
                                    }
                                  },
                                  transform(reactNode) {
                                    return <>{reactNode}</>;
                                  },
                                })}
                              </Text>
                            </Flex>
                            {m.readBy.length !== 0 && (
                              <Group justify="end">
                                <AvatarGroup>
                                  {m.readBy.map((user1, index) => (
                                    <Tooltip
                                      key={user1 + index}
                                      label={user1.username}
                                    >
                                      <Avatar
                                        size={"sm"}
                                        src={user1.img}
                                        display={
                                          user1.username === user.username &&
                                          "none"
                                        }
                                      />
                                    </Tooltip>
                                  ))}
                                </AvatarGroup>
                              </Group>
                            )}
                          </>
                        );
                      })}
                      <div ref={scrollRef} style={{ marginTop: "5px" }} />
                    </>
                  )}
                </>
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
