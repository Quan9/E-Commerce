/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  GridCol,
  Indicator,
  Loader,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconArrowBack, IconMessageForward } from "@tabler/icons-react";

import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { agentMessage, sendMessage } from "../../../services/message";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../../components/config/ChatLogics";
import { chatReadBy, getAllChats } from "../../../services/chat";
import Chats from "../../../components/agent/Chats";
import ChatWindow from "../../../components/agent/ChatWindow";
const ChatAgent = ({ socket }) => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [chats, setChats] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [typing, setTyping] = useState(true);
  const ref = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [newReceived, setNewReceived] = useState();
  useEffect(() => {
    const fecthChats = async () => {
      const { data } = await getAllChats();
      // if (searchParams.get("room")) {
      //   const index = data.findIndex(
      //     (chat) => chat._id === searchParams.get("room")
      //   );
      //   await chatRead(data[index], data);
      // } else {
      setChats(data);
      // setNewMessage("");
      // }
    };
    fecthChats();
  }, []);

  // useEffect(() => {
  //   const check = async () => {
  //     if (selectedChat && searchParams.get("room") === selectedChat._id) {
  //       await fetchMessages();
  //     }
  //   };
  //   searchParams && check();
  // }, [searchParams, selectedChat]);
  // useEffect(() => {
  //   socket.on("message recieved", (newMessageRecieved) => {
  //     messageReceived(newMessageRecieved);
  //   });
  // }, [socket]);

  // useEffect(() => {
  //   if (messages.length !== 0) {
  //     ref.current?.scrollIntoView({
  //       behavior: "smooth",
  //       block: "end",
  //     });
  //   }
  // }, [messages]);
  // const chatRead = async (chat, data1) => {
  //   // if (selectedChat === chat) {
  //   //   return;
  //   // } else {
  //   const { data } = await chatReadBy(chat._id, user);
  //   if (data1) {
  //     const index = data1.findIndex((chat) => chat._id === data._id);
  //     data1[index] = data;
  //     setChats(data1);
  //     setSelectedChat(data);
  //   } else {
  //     const index = chats.findIndex((chat) => chat._id === data._id);
  //     setChats((prev) => ({
  //       ...prev,
  //       [index]: data,
  //     }));
  //     setSelectedChat(data);
  //   }
  //   // let updateChats = data1 || chats;
  //   // let index = updateChats.findIndex((chat) => chat._id === data._id);
  //   // updateChats[index] = data;
  //   // setChats(updateChats);
  //   // const a = updateChats[index];
  //   // setSelectedChat(a);
  //   // }
  // };
  // const params = async (data) => {
  //   if (data === undefined) {
  //     setSearchParams((params) => {
  //       params.delete("room");
  //       return params;
  //     });
  //   } else if (searchParams.get("room") === data) {
  //     await fetchMessages();
  //   } else {
  //     setSearchParams({ ["room"]: data });
  //   }
  // };
  // const checkUnread = (latestMessage) => {
  //   if (latestMessage?.readBy.find((userInGroup) => userInGroup === user._id)) {
  //     return true;
  //   }
  //   return false;
  // };
  // const fetchMessages = async () => {
  //   const room = searchParams.get("room");
  //   setLoading(true);
  //   try {
  //     agentMessage(room).then((res) => {
  //       const data = res.data;
  //       if (data.length !== 0 && data[0].sender !== undefined) {
  //         setMessages(data);
  //       } else {
  //         setMessages([]);
  //       }

  //       socket.emit("join", room);
  //     });
  //     setNewReceived();
  //     setLoading(false);
  //   } catch (error) {
  //     toast.error("error", { position: "top-right", data: error });
  //   }
  // };
  // const handleSubmit = async () => {
  //   setTyping(false);
  //   if (newMessage) {
  //     try {
  //       const { data } = await sendMessage({
  //         chatId: selectedChat._id,
  //         content: newMessage,
  //         user: user.username,
  //       });
  //       socket.emit("userMessage", data);
  //       setMessages([...messages, data]);
  //       setNewMessage("");
  //       setTyping(true);
  //     } catch (error) {
  //       toast.error("error", { position: "top-right", data: error });
  //     }
  //   } else {
  //     setTyping(true);
  //     toast.info("cannot have empty input!", { position: "top-center" });
  //   }
  // };
  // console.log(selectedChat, chats);
  // const messageReceived = (data) => {
  //   if (!selectedChat || selectedChat._id !== data.chat._id) {
  //     setNewReceived(data);
  //     setFetchAgain((fetch) => {
  //       return !fetch;
  //     });
  //   } else {
  //     setMessages([...messages, data]);
  //     setNewReceived();
  //   }
  // };
  return (
    <Flex direction="row" rowGap={'sm'}>
      <Chats setChats={setChats} chats={chats} selectedChat={selectedChat}setSelectedChat={setSelectedChat}/>
      <ChatWindow/>
      {/* {chats ? (
        <>
          <GridCol span={3} h={"90vh"} style={{ overflowY: "scroll" }}>
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
                      await chatRead(chat);
                      params(chat._id);
                    }}
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    onMouseEnter={(e) => (e.target.style.cursor = "pointer")}
                  >
                    <Text size="xl" ta={"center"}>
                      {chat.chatName.startsWith(`user-/[a-zA-Z0-9]\/`)
                        ? `AnoUser-${chat.chatName.substr(-5)}`
                        : `${chat.chatName}`}
                    </Text>
                    <Text
                      span
                      size="md"
                      c={checkUnread(chat.latestMessage) ? "gray" : "red"}
                    >
                      {chat?.latestMessage?.sender?.username ===
                        chat.chatName && chat.isUser === false ? (
                        <b>{`AnoUser-${chat.chatName.substr(-5)}`}</b>
                      ) : (
                        <b>{chat?.latestMessage?.sender?.username}</b>
                      )}
                      <b> : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 35) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  </Paper>
                </Indicator>
              ))}
            </Stack>
          </GridCol>
          <GridCol span={"auto"} h={"90vh"}>
            {selectedChat ? (
              <>
                <Flex w="100%" h={"40px"} bg={"gray"} align={"center"}>
                  <Tooltip label="exit chat">
                    <IconArrowBack
                      d={{ base: "flex", md: "none" }}
                      onClick={() => {
                        setSelectedChat();
                        params();
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
                  bg={"rgba(0, 0, 0, 0.12)"}
                  justify="flex-end"
                  style={{ overflowY: "scroll" }}
                  h={"85%"}
                  pb={"sm"}
                >
                  {loading ? (
                    <Center h={"100%"}>
                      <Loader size={"xl"} />
                    </Center>
                  ) : (
                    <Flex
                      direction={"column"}
                      h={messages.length < 5 && "100%"}
                      justify={"flex-end"}
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
                            <Text
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
                                marginTop: isSameUser(messages, m, i, user._id)
                                  ? 3
                                  : 10,
                                borderRadius: "10px",
                                padding: "5px 0px",
                                maxWidth: "100%",
                              }}
                            >
                              {m.content}
                            </Text>
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
                <TextInput
                  h={"10%"}
                  disabled={typing == false}
                  placeholder="enter message..."
                  // mt={"sm"}
                  pt={"xs"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  rightSection={<IconMessageForward onClick={handleSubmit} />}
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
      )} */}
    </Flex>
  );
};

export default ChatAgent;
