import {
  Box,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import Signin from "./Signin";
function App() {
  return (
    <Box bgColor="#f1f1f1" h="100vh" py="100px">
      <Box w={400} mx="auto"  py={10}  bgColor="white" borderRadius="md" boxShadow="md">
        <Tabs isFitted colorScheme="red" size="lg">
          <TabList px='100px' borderBottom	={'none'}>
            <Tab _focus={{ boxShadow: "none"}} _active={{ backgroundColor: "transparent"}}  color="#969696" >登录</Tab>
            <Text display="flex" alignItems="center" mx="20px">
              ·
            </Text>
            <Tab _focus={{ boxShadow: "none"}} _active={{ backgroundColor: "transparent"}}   color="#969696">注册</Tab>
          </TabList>
          <TabPanels px="30px">
            <TabPanel>
              <Signin />
            </TabPanel>
            <TabPanel>2</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
}

export default App;
