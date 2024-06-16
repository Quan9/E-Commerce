/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { _ } from "lodash";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridCol,
  Indicator,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconArrowBack, IconMessageForward } from "@tabler/icons-react";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { agentMessage, sendMessage } from "../../../services/message";
import {
  QuillChat,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../components";
import { chatReadBy, getAllChats, getChat } from "../../../services/chat";
const ChatAgent = ({ socket }) => {
  const [fetchAgain, setFetchAgain] = useState();
  const [chats, setChats] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [doubleKey, setDoubleKey] = useState(false);
  const ref = useRef();
  const quillRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [typing, setTyping] = useState(true);
  useEffect(() => {
    const fecthChat = async () => {
      const { data } = await getAllChats();
      if (searchParams.get("room") !== null) {
        const index = data.findIndex(
          (chat) => chat._id === searchParams.get("room")
        );
        const a = data[index];
        if (
          a.latestMessage.readBy.find((userInGroup) => userInGroup === user._id)
        ) {
          setSelectedChat(a);
          setChats(data);
        } else {
          await chatRead(a, data);
        }
      } else {
        setChats(data);
      }
    };
    fecthChat();
  }, []);
  useEffect(() => {
    const fetchChatAgain = () => {
      getChat(fetchAgain).then((res) => {
        const temp = [...chats];
        const index = temp.findIndex((chat) => chat._id === res.data._id);
        if (index < 0) {
          setChats([res.data, ...chats]);
        } else {
          if (selectedChat._id === fetchAgain) {
            const selectedChatIndex = temp.find(
              (chat) => chat._id === selectedChat._id
            );
            chatRead(selectedChatIndex, temp);
          } else {
            temp[index] = res.data;
            temp.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setChats(temp);
          }
        }
        setFetchAgain();
      });
    };
    fetchAgain && fetchChatAgain();
  }, [fetchAgain]);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      messageReceived(newMessageRecieved);
    });
    return () => {
      socket.off();
    };
  }, [chats, messages]);
  useEffect(() => {
    if (messages.length !== 0) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);
  useEffect(() => {
    searchParams.get("room") === selectedChat?._id &&
      messages.length === 0 &&
      fetchMessages();
  }, [selectedChat, searchParams]);
  useEffect(() => {
    const handle = () => {
      setTyping(false);
      handleSubmit();
    };
    doubleKey && handle();
  }, [doubleKey]);

  const chatRead = async (chat, data1, param) => {
    if (data1 === null && chat._id == searchParams.get("room")) return;
    const { data } = await chatReadBy(chat._id, user);
    const updateChats = data1;
    const index = updateChats.findIndex((chat) => chat._id === data._id);
    updateChats[index] = data;
    updateChats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    setChats(updateChats);
    setSelectedChat(data);
    if (param) {
      params(chat._id);
    }
  };

  const params = async (data) => {
    if (data === undefined) {
      setSearchParams((params) => {
        params.delete("room");
        return params;
      });
    } else {
      setSearchParams({ ["room"]: data });
    }
  };

  const checkUnread = (latestMessage) => {
    if (latestMessage?.readBy.find((userInGroup) => userInGroup === user._id)) {
      return true;
    }
    return false;
  };

  const fetchMessages = async () => {
    const room = searchParams.get("room");
    setLoading(true);
    try {
      await agentMessage(room).then((res) => {
        const data = res.data;
        if (data.length !== 0 && data[0].sender !== undefined) {
          setMessages(data);
        } else {
          setMessages([]);
        }

        socket.emit("join", room);
      });
      setLoading(false);
    } catch (error) {
      toast.error("error", { position: "top-right", data: error });
    }
  };

  const handleSubmit = async () => {
    let newMessage1 = newMessage.replaceAll("<p><br></p>", "");
    if (newMessage1) {
      try {
        const { data } = await sendMessage({
          chatId: selectedChat._id,
          content: newMessage1,
          user: user.username,
        });
        socket.emit("userMessage", data);
        setMessages([...messages, data]);
        setNewMessage();
        const quill = document.getElementsByClassName("ql-editor");
        quill[0].innerHTML = "";
        setFetchAgain(data.chat._id);
      } catch (error) {
        toast.error("error", { position: "top-right", data: error });
      }
    } else {
      toast.info("Empty input", { position: "top-center" });
    }
    setTyping(true);
    setDoubleKey(false);
  };

  const messageReceived = async (data) => {
    if (selectedChat === undefined || selectedChat._id !== data.chat._id) {
      setFetchAgain(data.chat._id);
    } else {
      setMessages([...messages, data]);
      await chatRead(selectedChat, chats);
    }
  };

  return (
    <Grid>
      {chats ? (
        <>
          <GridCol span={{lg:"content",base:3}} h={"90vh"} style={{ overflowY: "scroll" }}>
            <Title ta={"center"}>Group Chats </Title>
            <Stack gap={"lg"}>
              {chats.map((chat) => (
                <Indicator
                  size={17}
                  disabled={checkUnread(chat.latestMessage)}
                  label="New"
                  key={chat._id}
                  position="top-left"
                >
                  <Paper
                    onClick={async () => {
                      setSelectedChat(chat);
                      setMessages([]);
                      await chatRead(chat, chats, true);
                    }}
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                  >
                    <Text size="xl" ta={"center"} aria-readonly={true}>
                      {chat.chatName.startsWith("user-")
                        ? `Guess-${chat.chatName.substr(-5)}`
                        : `${chat.chatName}`}
                    </Text>
                    <Flex
                      size="md"
                      c={checkUnread(chat.latestMessage) ? "gray" : "red"}
                      aria-readonly={true}
                      style={{ wordBreak: "break-all" }}
                      align={"baseline"}
                    >
                      {chat?.latestMessage?.sender?.username ===
                        chat.chatName && chat.isUser === false ? (
                        <b>{`Guess-${chat.chatName.substr(-5)}`} :</b>
                      ) : (
                        <Text>
                          <b>
                            {chat?.latestMessage?.sender?.username ===
                            user.username
                              ? "You :"
                              : `${chat?.latestMessage?.sender?.username} :`}
                          </b>
                        </Text>
                      )}
                      <Text>
                        {parse(`${chat.latestMessage.content}`, {
                          replace: (domNode) => {
                            if (domNode.name === "br") {
                              return;
                            }
                          },
                          trim: true,
                        })}
                      </Text>
                    </Flex>
                  </Paper>
                </Indicator>
              ))}
            </Stack>
          </GridCol>
          <GridCol span={"auto"} h={"90vh"}>
            {selectedChat ? (
              <>
                <Flex w="100%" h={"5%"} bg={"gray"} align={"center"}>
                  <Tooltip label="exit chat">
                    <IconArrowBack
                      d={{ base: "flex", md: "none" }}
                      onClick={() => {
                        setSelectedChat();
                        params();
                        setMessages([]);
                      }}
                      // onMouseEnter={}
                      cursor={"pointer"}
                      size={30}
                    />
                  </Tooltip>
                  {messages && (
                    <Text mx={"auto"}>
                      {selectedChat.chatName.toUpperCase()}
                    </Text>
                  )}
                </Flex>

                <Box
                  bg={"rgba(198, 198, 198, 1)"}
                  justify="flex-end"
                  style={{ overflowY: "scroll" }}
                  h={"80%"}
                  pb={"sm"}
                >
                  {loading ? (
                    <Center h={"100%"}>
                      <Loader size={"xl"} />
                    </Center>
                  ) : (
                    <Flex
                      direction={"column"}
                      justify={"flex-end"}
                      w={"100%"}
                      style={{ wordBreak: "break-all" }}
                    >
                      {messages.length !== 0 ? (
                        messages.map((m, i) => (
                          <Flex key={m._id}>
                            {(isSameSender(messages, m, i, user._id) ||
                              isLastMessage(messages, i, user._id)) && (
                              <Tooltip
                                label={m.sender.username}
                                position="top-center"
                                withArrow
                              >
                                <Avatar
                                  mt="7px"
                                  mr={1}
                                  size="30"
                                  cursor="pointer"
                                  name={m.sender.username}
                                  src={m.sender.img}
                                />
                              </Tooltip>
                            )}
                            <Paper
                              style={{
                                backgroundColor: `${
                                  m.sender._id === user._id
                                    ? "#BEE3F8"
                                    : "#B9F5D0"
                                }`,
                                marginLeft: isSameSenderMargin(
                                  messages,
                                  m,
                                  i,
                                  user._id
                                ),
                                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                                borderRadius: "10px",
                                padding: "5px 0px",
                                maxWidth: "70%",
                              }}
                            >
                              {parse(`${m.content}`, {
                                replace: (domNode, index) => {
                                  if (
                                    domNode.name === "p" &&
                                    domNode.children[0].name === "br"
                                  ) {
                                    return <></>;
                                  }
                                },
                              })}
                            </Paper>
                          </Flex>
                        ))
                      ) : (
                        <Center h={"100%"}>
                          <Loader size={"xl"} />
                        </Center>
                      )}
                      <div ref={ref} />
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
              </>
            ) : (
              <Center h="100%" w={"100%"}>
                <Text size="xl">Click on a user to start chatting</Text>
              </Center>
            )}
          </GridCol>
        </>
      ) : (
        <Center h={"90vh"} w={"100%"}>
          <Loader size={100} />
        </Center>
      )}
    </Grid>
  );
};

export default ChatAgent;
