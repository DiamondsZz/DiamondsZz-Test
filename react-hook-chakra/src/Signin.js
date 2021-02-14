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
  HStack 
} from "@chakra-ui/react";
import { PhoneIcon, LockIcon } from "@chakra-ui/icons";
import { AiOutlineQq, AiOutlineWeibo, AiOutlineWechat } from "react-icons/ai";
export default function Signin(props) {
  return (
    <Box mt="30px">
      <InputGroup>
        <InputLeftElement children={<PhoneIcon color="gray.300" />} />
        <Input
          variant="filled"
          placeholder="手机号或邮箱"
          borderBottom="none"
          borderBottomRadius="0px"
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
      <Flex justify="space-between" my="18px">
        <Checkbox defaultIsChecked color="#969696" size="sm">
          记住我
        </Checkbox>
        <Text color="#969696" fontSize="14px" _hover={{cursor:'pointer'}}>
          登录遇到问题？
        </Text>
      </Flex>
      <Button
        w="100%"
        borderRadius={24}
        color="#fff"
        bgColor="blue.300"
        _hover={{ bgColor: "blue.500" }}
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
      <HStack  mt="16px" px="20px" spacing="24px" justify="center">
        <AiOutlineWeibo fontSize="28px" color="#e05244" cursor="pointer"/>
        <AiOutlineWechat fontSize="28px" color="#00bb29" cursor="pointer" />
        <AiOutlineQq fontSize="28px" color="#498ad5" cursor="pointer" />
      </HStack >
    </Box>
  );
}