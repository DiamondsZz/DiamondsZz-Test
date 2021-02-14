import {
  Box,
  Button,
  InputGroup,
  Input,
  InputLeftElement,
  Divider,
  HStack,
  Flex,
  Text
} from "@chakra-ui/react";
import { PhoneIcon, LockIcon, AtSignIcon } from "@chakra-ui/icons";
import { AiOutlineQq, AiOutlineWechat } from "react-icons/ai";
export default function Signin(props) {
  return (
    <Box mt="30px">
      <InputGroup>
        <InputLeftElement children={<AtSignIcon color="gray.300" />} />
        <Input
          variant="filled"
          placeholder="你的昵称"
          borderBottom="none"
          borderBottomRadius="0px"
          borderColor="#c8c8c8"
          borderWidth="1px"
          focusBorderColor="#c8c8c8"
          bgColor="#b5b5b51a"
        />
      </InputGroup>
      <InputGroup>
        <InputLeftElement children={<PhoneIcon color="gray.300" />} />
        <Input
          variant="filled"
          placeholder="手机号"
          borderBottom="none"
          borderBottomRadius="0px"
          borderTopRadius="0px"
          borderColor="#c8c8c8"
          borderWidth="1px"
          focusBorderColor="#c8c8c8"
          bgColor="#b5b5b51a"
        />
      </InputGroup>
      <InputGroup>
        <InputLeftElement children={<LockIcon color="gray.300" />} />
        <Input
          variant="filled"
          placeholder="密码"
          borderTopRadius="0px"
          borderColor="#c8c8c8"
          borderWidth="1px"
          focusBorderColor="#c8c8c8"
          bgColor="#b5b5b51a"
        />
      </InputGroup>

      <Button
        w="100%"
        borderRadius={24}
        color="#fff"
        bgColor="#42c02e"
        my="18px"
        _hover={{ bgColor: "green" }}
        isLoading
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
        <AiOutlineWechat fontSize="28px" color="#00bb29" cursor="pointer"/>
        <AiOutlineQq fontSize="28px" color="#498ad5" cursor="pointer"/>
      </HStack>
    </Box>
  );
}
