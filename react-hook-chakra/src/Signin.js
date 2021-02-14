import {
  Stack,
  Box,
  Button,
  InputGroup,
  Input,
  InputLeftElement,
} from "@chakra-ui/react";
import { PhoneIcon, LockIcon } from "@chakra-ui/icons";
export default function Signin(props) {
  return (
    <Box>
      <InputGroup>
        <InputLeftElement children={<PhoneIcon color="gray.300" />} />
        <Input placeholder="手机号或邮箱" />
      </InputGroup>
      <InputGroup>
        <InputLeftElement children={<LockIcon color="gray.300" />} />
        <Input placeholder="密码" />
      </InputGroup>
      <Button w="100%">登录</Button>
    </Box>
  );
}
