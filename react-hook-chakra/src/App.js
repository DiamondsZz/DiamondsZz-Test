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
    <Box bgColor="gray.200" h="100vh" py="100px">
      <Box w={500} mx="auto" bgColor="white" borderRadius="md">
        <Tabs isFitted>
          <TabList px={150}>
            <Tab _focus={{ boxShadow: "none" }}>登录</Tab>
            <Text display="flex" alignItems="center" mx="20px">
              ·
            </Text>
            <Tab _focus={{ boxShadow: "none" }}>注册</Tab>
          </TabList>
          <TabPanels>
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
