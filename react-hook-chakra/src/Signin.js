import { useState } from "react";

import {
  Box,
  Button,
  InputGroup,
  Input,
  InputLeftElement,
  Flex,
  Checkbox,
  Text,
  Divider,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { PhoneIcon, LockIcon } from "@chakra-ui/icons";
import { AiOutlineQq, AiOutlineWeibo, AiOutlineWechat } from "react-icons/ai";
import { useFormik } from "formik";
import * as Yup from "yup";

function tip(toast) {
  toast({
    description: "敬请期待！！！",
    status: "warning",
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
      phoneOrEmail: "",
      password: "",
    },
    onSubmit: (values) => {
      const { phoneOrEmail, password } = values;
      if (!phoneOrEmail || !phoneOrEmail.trim()) {
        return toast({
          description: "请输入手机号或邮箱",
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
      fetch("https://conduit.productionready.io/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          user: {
            email: phoneOrEmail,
            password,
          },
        }),
      })
        .then((res) => {
          if (res.status === 200) return res.json();
          else {
            setLoading(false);
            toast({
              description: "登录失败",
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
              description: "登录成功",
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
        <InputLeftElement children={<PhoneIcon color="gray.300" />} />
        <Input
          name="phoneOrEmail"
          variant="filled"
          placeholder="手机号或邮箱"
          borderBottom="none"
          borderBottomRadius="0px"
          borderColor="#c8c8c8"
          borderWidth="1px"
          focusBorderColor="#c8c8c8"
          bgColor="#b5b5b51a"
          {...formik.getFieldProps("phoneOrEmail")}
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
      <Flex justify="space-between" my="18px">
        <Checkbox defaultIsChecked color="#969696" size="sm">
          记住我
        </Checkbox>
        <Text
          color="#969696"
          fontSize="14px"
          _hover={{ cursor: "pointer" }}
          onClick={() => tip(toast)}
        >
          登录遇到问题？
        </Text>
      </Flex>
      <Button
        w="100%"
        borderRadius={24}
        color="#fff"
        bgColor="blue.300"
        _hover={{ bgColor: "blue.500" }}
        onClick={formik.handleSubmit}
        isLoading={loading}
      >
        登录
      </Button>
      <Flex mt="30px" align="center" px="20px">
        <Divider />
        <Text flexShrink={0} mx="20px" fontSize="12px" color="#b5b5b5">
          社交账号登录
        </Text>
        <Divider />
      </Flex>
      <HStack mt="16px" px="20px" spacing="24px" justify="center">
        <AiOutlineWeibo
          fontSize="28px"
          color="#e05244"
          cursor="pointer"
          onClick={() => tip(toast)}
        />
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
