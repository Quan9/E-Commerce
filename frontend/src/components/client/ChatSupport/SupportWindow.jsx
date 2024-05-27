/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Center,
  Flex,
  Loader,
  Paper,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { clientChat } from "../../../services/chat";
import { getAllMessages, sendMessage } from "../../../services/message";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { IconMessageForward } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { getAnoUser } from "../../../services/user";

const SupportWindow = ({ loggedIn, socket, user, visible, setAlarm }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState();
  const [typing, setTyping] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user1, setUser1] = useState(user);
  const ref = useRef();
  useEffect(() => {
    if (messages.length) {
      ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length]);
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
  const handleSubmit = async () => {
    setTyping(false);
    if (newMessage) {
      try {
        const { data } = await sendMessage({
          chatId: room,
          content: newMessage,
          user: user.username,
        });

        socket.emit("userMessage", data);
        setMessages([...messages, data]);
        setTyping(true);
        setNewMessage("");
      } catch (error) {
        toast.error("error", { position: "top-right", data: error });
      }
    } else {
      setTyping(true);
      alert("empty input");
    }
  };
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
  return (
    <Paper
      className="transition-5"
      pos={"fixed"}
      bottom={125}
      right={0}
      w={275}
      h={325}
      maw={"calc(100% - 48px)"}
      mah={"calc(100%-48px"}
      radius={12}
      withBorder
      shadow="md"
      display={!visible && "none"}
    >
      <Center bg={"blue"} w={"100%"} h={"10%"}>
        <Text size="md">Customer Support</Text>
      </Center>
      <Box
        bg={"rgba(0, 0, 0, 0.12)"}
        justify="flex-end"
        style={{ overflowY: "scroll" }}
        h={"85%"}
        pb={"sm"}
        w={"100%"}
      >
        {loading ? (
          <Center pos={"absolute"} h={"90%"} w={"100%"}>
            <Loader color="blue" />
          </Center>
        ) : (
          <Flex
            direction="column"
            h={messages.length < 5 && "100%"}
            justify={"flex-end"}
            w={"100%"}
            style={{ overflowWrap: "break-word" }}
          >
            {messages?.map((m, i) => {
              return (
                <Flex key={m._id}>
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
                    key={m._id}
                    style={{
                      backgroundColor: `${
                        m.sender.username === user1.username
                          ? "#BEE3F8"
                          : "#B9F5D0"
                      }`,
                      marginLeft: isSameSenderMargin(messages, m, i, user1._id),
                      marginTop: isSameUser(messages, m, i, user1._id) ? 3 : 10,
                      borderRadius: "10px",
                      padding: "5px 0px",
                      maxWidth: "100%",
                    }}
                  >
                    {m.content}
                  </Text>
                </Flex>
              );
            })}
            <div ref={ref} />
          </Flex>
        )}
      </Box>
      <TextInput
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
        disabled={typing === false}
        rightSection={<IconMessageForward onClick={handleSubmit} />}
      />
    </Paper>
  );
};

export default SupportWindow;
