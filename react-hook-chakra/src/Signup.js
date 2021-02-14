import { useState } from "react";

import {
  Box,
  Button,
  InputGroup,
  Input,
  InputLeftElement,
  Divider,
  HStack,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import { PhoneIcon, LockIcon, AtSignIcon } from "@chakra-ui/icons";
import { AiOutlineQq, AiOutlineWechat } from "react-icons/ai";
import { useFormik } from "formik";

function tip(toast) {
  toast({
    description: "敬请期待！！！",
    duration: 1000,
    isClosable: true,
    position: "top",
  });
}

export default function Signin(props) {
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const formik = useFormik({
    initialValues: {
      username: "",
      phone: "",
      password: "",
    },
    onSubmit: (values) => {
      const { username, phone, password } = values;
      if (!username || !username.trim()) {
        return toast({
          description: "请输入你的昵称",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
      if (!phone || !phone.trim()) {
        return toast({
          description: "请输入手机号",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
      if (!password || !password.trim()) {
        return toast({
          description: "请输入密码",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
      setLoading(true);
      fetch(" https://conduit.productionready.io/api/users", {
        method: "POST",
        body: JSON.stringify({
          user: {
            username,
            email: phone,
            password,
          },
        }),
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          else {
            setLoading(false);
            toast({
              description: "注册失败",
              status: "error",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          }
        })
        .then((res) => {
          if (res) {
            setLoading(false);
            toast({
              description: "注册成功",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
          }
        });
    },
  });

  return (
    <Box mt="30px">
      <InputGroup>
        <InputLeftElement children={<AtSignIcon color="gray.300" />} />
        <Input
          name="username"
          variant="filled"
          placeholder="你的昵称"
          borderBottom="none"
          borderBottomRadius="0px"
          borderColor="#c8c8c8"
          borderWidth="1px"
          focusBorderColor="#c8c8c8"
          bgColor="#b5b5b51a"
          {...formik.getFieldProps("username")}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftElement children={<PhoneIcon color="gray.300" />} />
        <Input
          name="phone"
          variant="filled"
          placeholder="手机号"
          borderBottom="none"
          borderBottomRadius="0px"
          borderTopRadius="0px"
          borderColor="#c8c8c8"
          borderWidth="1px"
          focusBorderColor="#c8c8c8"
          bgColor="#b5b5b51a"
          {...formik.getFieldProps("phone")}
        />
      </InputGroup>
      <InputGroup>
        <InputLeftElement children={<LockIcon color="gray.300" />} />
        <Input
          name="password"
          variant="filled"
          placeholder="密码"
          borderTopRadius="0px"
          borderColor="#c8c8c8"
          borderWidth="1px"
          focusBorderColor="#c8c8c8"
          bgColor="#b5b5b51a"
          {...formik.getFieldProps("password")}
        />
      </InputGroup>

      <Button
        w="100%"
        borderRadius={24}
        color="#fff"
        bgColor="#42c02e"
        my="18px"
        _hover={{ bgColor: "green" }}
        onClick={formik.handleSubmit}
        isLoading={loading}
      >
        注册
      </Button>
      <Flex mt="12px" align="center" px="20px">
        <Divider />
        <Text flexShrink={0} mx="20px" fontSize="12px" color="#b5b5b5">
          社交账号登录
        </Text>
        <Divider />
      </Flex>
      <HStack mt="16px" px="20px" spacing="24px" justify="center">
        <AiOutlineWechat
          fontSize="28px"
          color="#00bb29"
          cursor="pointer"
          onClick={() => tip(toast)}
        />
        <AiOutlineQq
          fontSize="28px"
          color="#498ad5"
          cursor="pointer"
          onClick={() => tip(toast)}
        />
      </HStack>
    </Box>
  );
}
