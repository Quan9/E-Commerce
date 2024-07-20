/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { _ } from "lodash";
import { useSelector } from "react-redux";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridCol,
  Group,
  Indicator,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
  Tooltip,
  TooltipGroup,
} from "@mantine/core";
import { IconArrowBack, IconArrowBadgeLeft } from "@tabler/icons-react";
import parse, { attributesToProps } from "html-react-parser";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import {
  agentMessage,
  sendMessage,
  updateChatRead,
} from "../../../services/message";
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
  const [newMessage, setNewMessage] = useState("");
  const [doubleKey, setDoubleKey] = useState(false);
  const ref = useRef();
  const quillRef = useRef();
  const refScroll = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [typing, setTyping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [oldestMessage, setOldestMessage] = useState(0);
  const [top, setTop] = useState(false);

  useEffect(() => {
    const fecthChat = () => {
      getAllChats().then(async (res) => {
        const data = res.data;
        if (searchParams.get("room") !== null) {
          const index = data.findIndex(
            (chat) => chat._id === searchParams.get("room")
          );
          const currentChat = data[index];
          if (
            currentChat.latestMessage.readBy.find(
              (userInGroup) => userInGroup._id === user._id
            )
          ) {
            setChats(data);
            setSelectedChat(currentChat);
          } else {
            await chatRead(currentChat, false, false);
          }
        } else {
          setChats(data);
        }
      });
    };
    fecthChat();
  }, []);

  useEffect(() => {
    const fetchChatAgain = async () => {
      await getChat(fetchAgain)
        .then((res) => {
          const temp = [...chats];
          const index = temp.findIndex((chat) => chat._id === res.data._id);
          if (index < 0) {
            setChats([res.data, ...chats]);
          } else {
            temp[index] = res.data;
            temp.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setChats(temp);
            if (searchParams.get("room") === fetchAgain) {
              setSelectedChat(res.data);
            }
          }
          setFetchAgain();
        })
        .catch((err) => console.log(err, "error"));
    };
    fetchAgain && fetchChatAgain();
  }, [fetchAgain]);

  useEffect(() => {
    const messageReceived = async (data) => {
      if (selectedChat === undefined || selectedChat._id !== data.chat._id) {
        setFetchAgain(data.chat._id);
      } else {
        await chatRead(selectedChat, false, true);
        socket.emit("userRead", {
          room: selectedChat._id,
          user: user.username,
        });
      }
    };
    const updateMessage = async () => {
      await updateChatRead(selectedChat._id, {
        totalMessage: messages.length,
        user: user.username,
      }).then((response) => {
        const updateMessages = response.data.reverse();
        setMessages(updateMessages);
        setTimeout(() => {
          ref.current.scrollIntoView();
        }, 100);
      });
    };
    searchParams.get("room") === selectedChat?._id &&
      messages.length === 0 &&
      fetchMessages();
    socket.on("message recieved", messageReceived);
    socket.on("updateMessages", updateMessage);

    return () => {
      socket.off("message recieved", messageReceived);
      socket.off("updateMessages", updateMessage);
    };
  }, [selectedChat, messages, socket]);

  useEffect(() => {
    const handle = () => {
      setTyping(false);
      handleSubmit();
    };
    doubleKey && handle();
  }, [doubleKey]);

  useEffect(() => {
    const check = () => {
      if (messages.length === 0) return;
      if (oldestMessage === messages.length) {
        return ref.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
      fetchMessages();
    };
    check();
  }, [oldestMessage]);

  const chatRead = async (currentChat, chatRoom, updateMessage) => {
    if (chats === null && currentChat._id === searchParams.get("room")) {
      return;
    }
    await chatReadBy(currentChat._id, user)
      .then(async (res) => {
        const data = res.data;
        const updateChats = chats;
        const index = updateChats.findIndex((chat) => chat._id === data._id);
        updateChats[index] = data;
        updateChats.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setChats(updateChats);
        setSelectedChat(data);
        if (chatRoom) {
          params(currentChat._id);
        }
        if (updateMessage) {
          await updateChatRead(currentChat._id, {
            totalMessage: messages.length + 1,
            user: user.username,
          }).then((response) => {
            const updateMessages = response.data.reverse();
            setMessages(updateMessages);
            setOldestMessage(oldestMessage + 1);
          });
        }
      })
      .catch((err) => console.log(err));
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
    if (
      latestMessage?.readBy.find(
        (userInGroup) => userInGroup.username === user.username
      )
    ) {
      return true;
    }
    return false;
  };

  const fetchMessages = async () => {
    const room = searchParams.get("room");
    setLoading(true);
    try {
      await agentMessage(room, oldestMessage).then((res) => {
        const data = res.data.messages.reverse();
        setTop(res.data.top);
        socket.emit("join", room);
        if (data.length !== 0 && data[0].sender !== undefined) {
          if (messages.length === 0) {
            setMessages(data);
            return setOldestMessage(data.length);
          }
          setMessages([...data, ...messages]);
          setTimeout(() => {
            refScroll.current.childNodes[data.length].scrollIntoView();
          }, 100);
        } else {
          setMessages([]);
        }
      });
    } catch (error) {
      toast.error("error", { position: "top-right", data: error });
    }
    setLoading(false);
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
        setOldestMessage(oldestMessage + 1);
        setNewMessage();
        const quill = document.getElementsByClassName("ql-editor");
        quill[0].innerHTML = "";
        setFetchAgain(selectedChat._id);
      } catch (error) {
        toast.error("error", { position: "top-right", data: error });
      }
    } else {
      toast.info("Empty input", { position: "top-center", closeOnClick: true });
    }
    setTyping(true);
    setDoubleKey(false);
  };

  const handleSelectedChat = (currentChat) => {
    if (currentChat._id === searchParams.get("room")) return;
    setMessages([]);
    setOldestMessage(0);
    setSelectedChat(currentChat);
    if (checkUnread(currentChat.latestMessage)) {
      params(currentChat._id);
    } else {
      chatRead(currentChat, true, false);
    }
  };

  const handleScroll = useCallback(async (e) => {
    let element = e.target;
    if (element.scrollTop === 0 && !top) {
      setOldestMessage(oldestMessage + 20);
    }
  });

  return (
    <Grid>
      {chats ? (
        <>
          <GridCol span={2} mah={"90vh"} style={{ overflow: "auto" }}>
            <Title ta={"center"}>Group Chats </Title>
            <Stack gap={"lg"}>
              {chats.map((chat) => (
                <Indicator
                  size={17}
                  disabled={checkUnread(chat.latestMessage)}
                  label="N"
                  color="red"
                  key={chat._id}
                  position="top-left"
                >
                  <Box
                    onClick={() => handleSelectedChat(chat)}
                    bg={
                      searchParams.get("room") === chat._id
                        ? "#38B2AC"
                        : "#E8E8E8"
                    }
                    onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                  >
                    <Text size="xl" ta={"center"}>
                      {chat.chatName.startsWith("user-")
                        ? `Guess-${chat.chatName.substr(-5)}`
                        : `${chat.chatName}`}
                    </Text>
                    <Flex
                      c={checkUnread(chat.latestMessage) ? "gray" : "red"}
                      style={{ wordBreak: "break-all" }}
                      align={"baseline"}
                    >
                      <Text w={100} fw={700}>
                        {chat?.latestMessage?.sender?.username === user.username
                          ? "You"
                          : `${chat?.latestMessage?.sender?.username}`}
                        : &nbsp;
                      </Text>
                      <Text
                        span
                        className="latest"
                        lineClamp={1}
                        style={{ textOverflow: "[...]" }}
                      >
                        {parse(`${chat.latestMessage.content}`, {
                          replace: (domNode, index) => {
                            if (domNode.name === "p" && index === 0) {
                              return (
                                <Text span>{domNode.children[0].data}</Text>
                              );
                            } else if (domNode.name === "p" && index !== 0) {
                              return <></>;
                            }
                            if (domNode.name === "br") {
                              return;
                            }
                            if (domNode.name === "iframe") {
                              const props = attributesToProps(domNode.attribs);
                              return (
                                <Text span c={"blue"}>
                                  {props.title}
                                </Text>
                              );
                            }
                          },

                          trim: true,
                        })}
                      </Text>
                    </Flex>
                  </Box>
                </Indicator>
              ))}
            </Stack>
          </GridCol>
          <GridCol m={{ base: "auto" }} span={10} h={"90vh"}>
            {selectedChat ? (
              <Box h={"90vh"} maw={"100%"}>
                <Flex
                  w="100%"
                  h={"10%"}
                  bg={"gray"}
                  align={"center"}
                  justify={"center"}
                >
                  <Tooltip label="exit chat">
                    <IconArrowBack
                      onClick={() => {
                        setSelectedChat();
                        params();
                        setMessages([]);
                        setOldestMessage(0);
                      }}
                      cursor={"pointer"}
                    />
                  </Tooltip>
                  <Title mx={"auto"} order={2}>
                    {selectedChat.chatName}
                  </Title>
                </Flex>

                <Box
                  bg={"rgba(198, 198, 198, 1)"}
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
                  {messages.length !== 0 ? (
                    messages.map((m, i) => (
                      <>
                        <Flex
                          key={m._id}
                          className={"chat admin"}
                          opacity={loading ? 0.1 : 1}
                          maw={"50%"}
                          mt={!isSameUser(messages, m, i, user._id) && 10}
                          ms={
                            isSameSender(messages, m, i, user._id)
                              ? "auto"
                              : isLastMessage(messages, i, user._id)
                              ? "auto"
                              : isSameSenderMargin(messages, m, i, user._id)
                          }
                          justify={
                            isSameSender(messages, m, i, user._id)
                              ? "end"
                              : isLastMessage(messages, i, user._id)
                              ? "end"
                              : isSameSenderMargin(messages, m, i, user._id) !==
                                  0 && "end"
                          }
                        >
                          <Group gap={"5px"} align="center">
                            {(isSameSender(messages, m, i, user._id) ||
                              isLastMessage(messages, i, user._id)) && (
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
                              ms={isSameSenderMargin(messages, m, i, user._id)}
                              bg={
                                m.sender.username === user.username
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
                          </Group>
                        </Flex>
                        {/* {m.readBy.length !== 0 && (
                          <Group justify="end" key={m._id + i}>
                            <AvatarGroup>
                              {m.readBy.map((user1, index) => (
                                <Tooltip
                                  key={user1 + index}
                                  label={user1.username}
                                >
                                  <Avatar
                                    size="sm"
                                    src={user1.img}
                                    style={{ border: "1px solid green" }}
                                    display={
                                      user1.username === user.username && "none"
                                    }
                                  />
                                </Tooltip>
                              ))}
                            </AvatarGroup>
                          </Group>
                        )} */}
                      </>
                    ))
                  ) : (
                    <Center h={"100%"}>
                      <Loader size={"xl"} />
                    </Center>
                  )}
                  <div ref={ref} />
                </Box>
                <QuillChat
                  ref={quillRef}
                  setNewMessage={setNewMessage}
                  defaultValue={newMessage}
                  setDoubleKey={setDoubleKey}
                  typing={typing}
                  setTyping={setTyping}
                />
              </Box>
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
